const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const markdownParser = require('../markdown/parser');
const loadFiles = require('../util/load-files');

function loadMarkdowns({ articles }) {
    return loadFiles(articles.files.map(file => path.resolve(articles.path, file)), '\n\n');
}

function loadStyles({ styles }) {
    return loadFiles(styles);
}

function renderTemplate(template, data) {
    return mustache.render(template, data);
}

module.exports = ({ book }) => {
    const parser = markdownParser(book);

    const markdown = loadMarkdowns(book);

    const body = parser.render(markdown);
    const css = loadStyles(book);

    const templatePath = path.resolve(book.templates.path, book.templates.body);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });

    return renderTemplate(template, { body, css });
}
