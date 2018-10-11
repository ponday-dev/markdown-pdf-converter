const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

module.exports = function createMarkdownParser({ highlight }) {
    const options = highlight ? { highlight: syntaxHighlight } : { };

    return new MarkdownIt(options)
        .use(require('markdown-it-imsize'))
        .use(require('./plugins/break-page'));
}

function syntaxHighlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        return `<pre class="hljs"><code><div>${hljs.highlight(lang, str, true).value}</div></code></pre>`;
    }
    return '';
}
