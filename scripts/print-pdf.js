const puppeteer = require('puppeteer');

module.exports = async function printToPDF(data, options) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('data:text/html;charset=UTF-8,' + data,  { waitUntil: 'networkidle0' });
    await page.emulateMedia('print');

    const formatted = setPageSize(options);

    await page.pdf(formatted);
    await browser.close();
}

function setPageSize(options) {
    switch(options.format) {
        case 'B4':
            return Object.assign(options, { format: '', width: '257mm', height: '364mm' });
        case 'B5':
            return Object.assign(options, { format: '', width: '182mm', height: '257mm' });
        default:
            return options;
    }
}
