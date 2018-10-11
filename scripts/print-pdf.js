const puppeteer = require('puppeteer');

module.exports = async function printToPDF(data, options) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('data:text/html;charset=UTF-8,' + data,  { waitUntil: 'networkidle0' });
    await page.emulateMedia('print');
    await page.pdf(options);
    await browser.close();
}
