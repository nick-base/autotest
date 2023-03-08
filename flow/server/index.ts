import puppeteer from 'puppeteer';
import next from 'next';
import { loadEnvConfig } from '@next/env';
import Koa from 'koa';
const detect = require('detect-port');

loadEnvConfig(process.cwd());

const dev = process.env.NODE_ENV !== 'production';
const pure = process.env.PURE_MODE === '1';
const app = next({ dev });
const handle = app.getRequestHandler();

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
};

const urls = {
  server: 'http://localhost:3001/',
  insureDemo: 'https://i-test.zhongan.com/2D8Cnr',
};

app.prepare().then(() => {
  (async () => {
    const server = new Koa();
    const router = require('./modules/routers').default;

    let browser;
    let page;

    const boot = async ({ init }) => {
      if (pure) return;
      if (browser) return;
      browser = await puppeteer.launch({
        headless: false,
      });
      const pages = await browser.pages();
      page = pages.length ? pages[0] : await browser.newPage();
      await page.setUserAgent(UA.iphone);
      await page.setViewport({
        width: 1200,
        height: 1000,
        deviceScaleFactor: 2,
      });

      page.on('close', () => {
        console.info('page::close');
        browser && browser.close();
        page = null;
        browser = null;
      });

      browser.on('disconnected', () => {
        console.info('browser::disconnected');
        browser && browser.close();
        page = null;
        browser = null;
      });
      !init && (await page.goto(urls.server));
    };
    await boot({ init: true });

    if (!pure) {
      router.get('/api/test', async () => {
        await boot({ init: false });
        const frame = page.frames().find((frame) => frame.name() === 'iframe-1');
        await frame.goto(urls.insureDemo);
      });
    }

    router.all('(.*)', async (ctx: Koa.Context) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(router.routes());

    server.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
      ctx.res.statusCode = 200;
      await next();
    });

    const port = parseInt(process.env.PORT || '3000', 10);
    detect(port).then((port: number) => {
      // console.clear();
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
      !pure && page.goto(urls.server);
    });
  })();
});
