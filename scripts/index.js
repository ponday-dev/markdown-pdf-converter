const fs = require('fs');
const markdownIt = require('markdown-it');
const hljs = require('highlight.js');
const puppeteer = require('puppeteer');
const mustache = require('mustache');

const markdown = new markdownIt({
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return `<pre class="hljs"><code><div>${hljs.highlight(lang, str, true).value}</div></code></pre>`;
        }
        return '';
    }
});

function readStyles(cssList) {
    return cssList
        .map(css => fs.readFileSync(`${css}`, { encoding: 'utf-8' }))
        .join('\n');
}

async function printToPDF(data, options) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('data:text/html;charset=UTF-8,' + data,  { waitUntil: 'networkidle0' });
    await page.emulateMedia('print');
    await page.pdf(options);
    await browser.close();
}

(async () => {
    const config = JSON.parse(fs.readFileSync(process.argv[2], { encoding: 'utf-8' }));
    const data = fs.readFileSync(config.article, { encoding: 'utf-8' });

    const body = markdown.render(data);
    const styles = readStyles(config.styles);

    const template = fs.readFileSync(config.template, { encoding: 'utf-8' });
    const html = mustache.render(template, { body, styles });

    await printToPDF(html, {
        path: config.dist,
        format: 'A4',
        printBackground: true,
        landscape: false,
        margin: {
            top: '5mm',
            right: '5mm',
            bottom: '5mm',
            left: '5mm'
        }
    });
})();
