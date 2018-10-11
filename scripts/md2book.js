const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { JSDOM } = require('jsdom');

const loadConfig = require('./load-config');
const createServer = require('./server');
const createMarkdownParser = require('./markdown-parser');
const loadMarkdown = require('./article');
const printToPDF = require('./print-pdf');

function readStyles(cssList) {
    return cssList
        .map(css => fs.readFileSync(`${css}`, { encoding: 'utf-8' }))
        .join('\n');
}

function convertImageSrc(html, port) {
    const doc = new JSDOM(html).window.document;
    for (const img of doc.getElementsByTagName('img')) {
        img.parentElement.classList.add('img-container');
        img.src = `http://localhost:${port}/${img.src}`;

        if (img.title) {
            img.parentElement.dataset.title = img.title;
        }
    }
    return doc.documentElement.outerHTML;
}

module.exports = async function md2book(configFilePath, configProfile, bookProfile) {
    const config = loadConfig(configFilePath, configProfile);
    
    const bookConfig = loadConfig(config.book_config.path, bookProfile || config.book_config.profile)
    const markdownIt = createMarkdownParser(bookConfig);

    const markdown = loadMarkdown(bookConfig);

    const body = markdownIt.render(markdown);
    const styles = readStyles(bookConfig.styles);

    const bodyTemplatePath = path.resolve(bookConfig.templates.path, bookConfig.templates.body);
    const template = fs.readFileSync(bodyTemplatePath, { encoding: 'utf-8' });

    const html = convertImageSrc(mustache.render(template, { body, styles }), config.port);

    const imageServer = createServer(config);
    imageServer.listen(config.port);

    await printToPDF(html, bookConfig.print_options);

    imageServer.close();
}
