import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('http://localhost:3001/');

    // await browser.close();
})();
