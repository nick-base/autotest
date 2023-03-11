import puppeteer, { Browser, Page, Frame, KnownDevices } from 'puppeteer';

import { Simulator, Operation } from '../../shared/interface';

const TIMEOUT = 3 * 1000;
const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
};

export const execute = async (
  ctx,
  { browser, openServerPage }: { browser: Browser; openServerPage: () => Promise<Page> }
) => {
  const result = {
    error: null,
    steps: [],
  };

  const data = ctx.request.body as Simulator;
  const { steps = [], testMode } = data;
  let main: Page | Frame;
  let page: Page;

  if (testMode) {
    page = await openServerPage();

    main = await page.frames().find((frame) => frame.name() === 'iframe-1');
  } else {
    page = main = await browser.newPage();
    await main.emulate(KnownDevices['iPhone 6']);
  }

  for await (const item of steps) {
    try {
      const startTime = Date.now();
      const data: any = { ...item };

      const { type } = item;
      if (type === Operation.GOTO) {
        const { url } = item;
        await main.goto(url, { waitUntil: 'domcontentloaded' });
        continue;
      }

      if (type === Operation.Focus) {
        const { selector } = item;
        // @ts-ignore
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await main.$eval(selector, (elem) => (elem as any).focus());
        continue;
      }

      if (type === Operation.Click) {
        const { selector } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await main.$eval(selector, (elem) => (elem as any).click());
        continue;
      }

      if (type === Operation.Type) {
        const { selector, typeData } = item;
        await main.waitForSelector(selector, { timeout: TIMEOUT });
        await main.type(selector, typeData, { delay: 100 });
        continue;
      }

      if (type === Operation.WaitForResponse) {
        const { requestUrl } = item;
        const response = await page.waitForResponse(requestUrl);
        data.response = response && response.json();
        continue;
      }

      const endTime = Date.now();
      result.steps.push({
        ...data,
        startTime,
        endTime,
      });
    } catch (error) {
      result.error = error?.message;
      break;
    }
  }

  ctx.body = {
    code: '0',
    result,
  };
};
