const fs = require('fs');
const markdownIt = require('markdown-it');
const hljs = require('highlight.js');
const puppeteer = require('puppeteer');
const mustache = require('mustache');
const http = require('http');
const mime = require('mime-types');
const path = require('path');
const { JSDOM } = require('jsdom');

const markdown = new markdownIt({
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return `<pre class="hljs"><code><div>${hljs.highlight(lang, str, true).value}</div></code></pre>`;
        }
        return '';
    }
});

function createServer(imageDir) {
    return http.createServer((req, res) => {
        mimetype = mime.lookup(path.extname(req.url));
        image = fs.readFileSync(`${imageDir}/${path.basename(req.url)}`);
        res.writeHead(200, {'Content-Type': mimetype});
        res.end(image);
    });
}

function readStyles(cssList) {
    return cssList
        .map(css => fs.readFileSync(`${css}`, { encoding: 'utf-8' }))
        .join('\n');
}

// TODO: 実装が汚いから直したい
function convertExtendLiteral(html) {
    const doc = new JSDOM(html).window.document;
    for (const p of doc.getElementsByTagName('p')) {
        switch(p.innerHTML) {
            case ';;;':
                p.innerHTML = '';
                p.style.cssText = 'page-break-after: always;';
                break;
        }
    }
    return doc.documentElement.outerHTML;
}

function convertImageSrc(html, port) {
    const doc = new JSDOM(html).window.document;
    for (const img of doc.getElementsByTagName('img')) {
        img.parentElement.classList.add('img-container')
        img.src = `http://localhost:${port}/${img.src}`;

        if (img.title) {
            img.parentElement.dataset.title = img.title;
        }

        if (img.alt.includes(' $')) {
            [alt, ...tokens] = img.alt.split(' $');
            const attrs = tokens.reduce((acc, token) => {
                [key, value] = token.split('=');
                return Object.assign(acc, {[key]: value});
            }, {});
            img.alt = alt;

            if (attrs.size) {
                if (attrs.size.includes('x')) {
                    [img.width, img.height] = attrs.size.split('x');
                } else if(attrs.size.includes(':')) {
                    [prop, value] = attrs.size.split(':');
                    img[prop] = value;
                } else {
                    img.width = attrs.size;
                }
            }
        }
    }
    return doc.documentElement.outerHTML;
}

async function printToPDF(data, options) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('data:text/html;charset=UTF-8,' + data,  { waitUntil: 'networkidle0' });
    await page.emulateMedia('print');
    await page.pdf(options);
    await browser.close();
}

function createTableContents(md) {
    const contents = md.match(/([#]{1,3}\s.+|[`]{3}.*)/g)

    const concatToken = (prefix, acc, token, breaks=1) => {
        const br = '\n'.repeat(breaks);
        return `${acc}${br}${prefix} ${token.slice(token.indexOf(' ') + 1)}`;
    }

    let codeBlock = false;
    const tableContents = contents.reduce((acc, token) => {
        if (token.startsWith("```")) {
            codeBlock = !codeBlock;
            return acc;
        }
        if (codeBlock) {
            return acc;
        }
        switch(token.indexOf(' ')) {
            case 1:
                return concatToken('####', acc, token, 2);
            case 2:
                return concatToken('-', acc, token);
            case 3:
                return concatToken('\t-', acc, token)
        }
    }, '## 目次');

    return `${tableContents}\n\n;;;`;
}

(async () => {
    const config = JSON.parse(fs.readFileSync(process.argv[2], { encoding: 'utf-8' }));
    const port = config.port || 3000;
    
    const data = fs.readFileSync(config.article, { encoding: 'utf-8' });

    const md = `${createTableContents(data) }\n${data}`;

    const body = markdown.render(md);
    const styles = readStyles(config.styles);

    const template = fs.readFileSync(config.template, { encoding: 'utf-8' });
    const html = convertExtendLiteral(convertImageSrc(mustache.render(template, { body, styles }), port));

    const imageServer = createServer(config.image_dir);
    imageServer.listen(port);

    await printToPDF(html, {
        path: config.dist,
        format: 'A4',
        printBackground: true,
        landscape: false,
        margin: {
            top: '10mm',
            right: '5mm',
            bottom: '10mm',
            left: '5mm'
        }
    });

    imageServer.close();
})();
