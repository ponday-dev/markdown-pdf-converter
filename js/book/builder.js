const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { JSDOM } = require('jsdom');

const markdownParser = require('../markdown/parser');
const loadFiles = require('../util/load-files');
const generateToc = require('./toc');

function loadMarkdowns({ articles }) {
    return loadFiles(articles.files.map(file => path.resolve(articles.path, file)), '\n\n');
}

function loadStyles({ styles }) {
    return loadFiles(styles);
}

function renderTemplate(template, data) {
    return mustache.render(template, data);
}

function adjustBreakPage({ document }) {
    for (const elem of document.querySelectorAll('h1 + h2')) {
        elem.classList.add('first-header');
    }
}

function addPageStyle(html, book) {
    const style = `<style>${fs.readFileSync(book.page_style)}</style>`;
    return html.replace(/<\/head>/, `${style}</head>`)
}

module.exports = ({ book }) => {
    const parser = markdownParser(book);

    const markdown = loadMarkdowns(book);

    const body = parser.render(markdown);
    const css = loadStyles(book);

    const templatePath = path.resolve(book.templates.path, book.templates.body);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });

    const html = renderTemplate(template, { body, css });
    const { window } = new JSDOM(html);

    adjustBreakPage(window);
    generateToc(window);

    return addPageStyle(window.document.documentElement.outerHTML, book);
}
