import puppeteer, { Browser, Page, Frame, KnownDevices, HTTPResponse } from 'puppeteer';

import { Simulator, Operation } from '../../shared/interface';
import { genMembers } from '../../shared/fake';

const TIMEOUT = 10 * 1000;
const sleep = (time?: number) => new Promise((resolve) => setTimeout(resolve, time * 1000 || TIMEOUT));

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
};
const cashier = new RegExp('cashier.itest.zhongan.com');

const interceptionResponse = async (page) => {
  const list = {
    document: [],
    api: [],
  };
  page.on('response', async (response: HTTPResponse) => {
    const request = response.request();
    if (request.resourceType() === 'document') {
      list.document.push({
        url: request.url(),
      });
    }
    if (['xhr', 'fetch'].includes(request.resourceType())) {
      const data = await response.text();
      list.api.push({
        url: request.url(),
        status: response.status(),
        data,
      });
    }
  });
  return list;
};

export const execute = async (
  ctx,
  { browser, openServerPage, newBrower }: { browser: Browser; newBrower: boolean; openServerPage: () => Promise<Page> }
) => {
  const result = {
    searchData: null,
    cookies: null,
    error: null,
    steps: [],
    list: null,
  };

  const _members = genMembers();
  const members = {};
  Object.keys(genMembers()).forEach((group) => {
    members[group] = _members[group].map((item) => ({ ...item, nameUsed: false, certNoUsed: false }));
  });

  const data = ctx.request.body as Simulator;
  const { steps = [], testMode, search } = data;
  let main: Page | Frame;
  let page: Page;
  let searchData = [];
  let searchNode = '[data-ilog]';

  if (search) {
    page = main = await browser.newPage();
    await main.emulate(KnownDevices['iPhone 6']);
  } else if (testMode) {
    page = await openServerPage();

    main = await page.frames().find((frame) => frame.name() === 'iframe-1');
  } else {
    const pages = await browser.pages();
    page = main = newBrower && pages.length ? pages[0] : await browser.newPage();
    await main.emulate(KnownDevices['iPhone 6']);
  }
  let list = interceptionResponse(page);

  let stepList = steps;
  if (!search) {
    const startIndex = steps.findIndex((step) => step.type === Operation.Start);
    const endIndex = steps.findIndex((step) => step.type === Operation.End);
    stepList = steps.slice(startIndex === -1 ? 0 : startIndex, endIndex === -1 ? steps.length : endIndex + 1);
  }

  for await (const [itemIndex, item] of stepList.entries()) {
    try {
      const startTime = Date.now();
      const itemData: any = { ...item };

      const { type } = item;
      if (type === Operation.GOTO) {
        const { url } = item;
        await main.goto(url, { waitUntil: 'domcontentloaded' });
      }

      if (type === Operation.Focus) {
        const { selector } = item;
        // @ts-ignore
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await main.$eval(selector, (elem) => (elem as any).focus());
      }

      if (type === Operation.Click) {
        const { selector } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await sleep(1);
        await main.$eval(selector, (elem) => (elem as any).click());
      }

      if (type === Operation.Type) {
        const { selector, typeData } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await sleep(1);
        await main.type(selector, typeData, { delay: 100 });
      }

      if (type === Operation.WaitForResponse) {
        const { requestUrlRegExp } = item;
        if (testMode) {
          // iframe不支持waitForResponse
          await sleep();
        } else {
          await page.waitForResponse((response) => new RegExp(requestUrlRegExp).test(response.url()));
        }
      }

      if (type === Operation.TypeName) {
        const { selector, relation } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });

        await sleep(1);
        const member = members[relation].find((item) => !item.nameUsed);
        if (member) {
          member.nameUsed = true;
          await main.type(selector, member.name, { delay: 100 });
        }
      }

      if (type === Operation.TypeCertNo) {
        const { selector, relation } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });

        await sleep(1);
        const member = members[relation].find((item) => !item.certNoUsed);
        if (member) {
          member.certNoUsed = true;
          await main.type(selector, member.certNo, { delay: 100 });
        }
      }

      if (search && itemIndex === stepList.length - 1) {
        await sleep();
        const nodes = await page.$$eval(searchNode, (ilogNodes) => {
          return ilogNodes.map((ilogNode) => {
            const inputNode = ilogNode.querySelector('input');
            return {
              nodeName: ilogNode.nodeName,
              ilog: ilogNode.getAttribute('data-ilog'),
              hasInputNode: !!inputNode,
              cls: `.${[...ilogNode.classList].join('.')}`,
            };
          });
        });

        nodes.forEach(({ nodeName, ilog, hasInputNode, cls }) => {
          const nodeSelector = `${nodeName.toLowerCase()}${cls}[data-ilog=${ilog}]`;
          const nodeInputSelector = `${nodeSelector} input`;
          if (!searchData.includes(nodeSelector)) {
            searchData.push(nodeSelector);
          }
          if (hasInputNode && !searchData.includes(nodeInputSelector)) {
            searchData.push(nodeInputSelector);
          }
        });
      }

      const endTime = Date.now();
      result.steps.push({
        ...itemData,
        startTime,
        endTime,
      });
    } catch (error) {
      console.error(error);
      result.error = error?.message;
      break;
    }
  }

  // result.cookies = await page.cookies();
  result.searchData = searchData;
  // result.list = (await list).document;

  if (search) {
    browser && browser.close();
    browser = null;
  }

  // if (testMode) {
  //   const cashierUrl = (await list).document.find((item) => cashier.test(item.url));
  //   console.info((await list).document);
  //   if (cashierUrl) {
  //     const cashierPage = await browser.newPage();
  //     cashierPage.emulate(KnownDevices['iPhone 6']);
  //     await cashierPage.goto(cashierUrl);
  //   }
  // }

  ctx.body = {
    code: '0',
    result,
  };
};
