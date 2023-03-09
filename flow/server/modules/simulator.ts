import puppeteer, { Browser, Page, KnownDevices } from 'puppeteer';

import { Simulator, Operation } from '../../shared/interface';

export const execute = async (ctx, { browser, page }: { browser: Browser; page: Page }) => {
  const data = ctx.request.body as Simulator;
  const { steps = [] } = data;
  const main = await page.frames().find((frame) => frame.name() === 'iframe-1');

  // const main = await browser.newPage();
  // await main.emulate(KnownDevices['iPhone 6']);

  for await (const item of steps) {
    const { type } = item;
    if (type === Operation.GOTO) {
      const { url } = item;
      await main.goto(url, { waitUntil: 'domcontentloaded' });
      continue;
    }

    if (type === Operation.Focus) {
      const { selector } = item;
      // @ts-ignore
      await main.waitForSelector(selector);
      await main.$eval(selector, (elem) => (elem as any).focus());
      continue;
    }

    if (type === Operation.Click) {
      const { selector } = item;
      await main.waitForSelector(selector);
      await main.$eval(selector, (elem) => (elem as any).click());
      continue;
    }

    if (type === Operation.Type) {
      const { selector, typeData } = item;
      await main.waitForSelector(selector);
      await main.type(selector, typeData, { delay: 100 });
      continue;
    }
  }

  ctx.body = {
    code: '0',
  };
};
