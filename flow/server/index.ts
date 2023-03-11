import puppeteer, { Browser, Page } from 'puppeteer';
import next from 'next';
import { loadEnvConfig } from '@next/env';
import Koa from 'koa';
import koaBody from 'koa-body';
const detect = require('detect-port');
import { execute } from './modules/simulator';

loadEnvConfig(process.cwd());
const dev = process.env.NODE_ENV !== 'production';
const pure = process.env.PURE_MODE === '1';
const app = next({ dev });
const handle = app.getRequestHandler();

puppeteer.defaultArgs({
  args: [
    '--enable-experimental-cookie-features',
    '--disable-features=SameSiteByDefaultCookies',
    '--disable-web-security',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--no-default-browser-check',
    '--enable-automation',
    '--disable-throttle-non-visible-cross-origin-iframes',
  ],
});

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
};

let serverAddress = 'http://localhost:3001/';

app.prepare().then(() => {
  (async () => {
    const server = new Koa();
    const router = require('./modules/routers').default;

    let browser: Browser;
    let page: Page;

    const boot = async () => {
      if (!browser) {
        browser = await puppeteer.launch({
          ignoreHTTPSErrors: true,
          headless: false,
        });
        browser.on('disconnected', () => {
          console.info('browser::disconnected');
          browser && browser.close();
          page = null;
          browser = null;
        });
      }
    };

    const openServerPage = async (): Promise<Page> => {
      if (!page) {
        const pages = await browser.pages();
        if (pages.length) {
          for await (const p of pages) {
            if (p.url() === serverAddress) {
              page = p;
              break;
            }
          }
          if (!page) page = pages[0];
        }

        if (!page) {
          page = await browser.newPage();
        }
        await page.setUserAgent(UA.iphone);
        await page.setViewport({
          width: 1200,
          height: 1000,
          deviceScaleFactor: 2,
        });

        if (page.url() !== serverAddress) await page.goto(serverAddress);
      }
      return page;
    };

    if (!pure) {
      await boot();
      openServerPage();
    }

    router.post('/api/simulator/execute', koaBody(), async (ctx) => {
      await boot();
      await execute(ctx, { browser, openServerPage });
    });

    router.all('(.*)', async (ctx: Koa.Context) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(router.routes());

    server.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
      ctx.res.statusCode = 200;
      await next();
    });

    process.on('SIGUSR2', function () {
      console.info('restart::auto');
      browser && browser.close();
      page = null;
      browser = null;
      process.exit();
    });

    const port = parseInt(process.env.PORT || '3000', 10);
    detect(port).then((port: number) => {
      // console.clear();
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
      serverAddress = `http://localhost:${port}/`;
    });
  })();
});
