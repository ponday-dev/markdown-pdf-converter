const fs = require('fs');
const path = require('path');

module.exports = (config) => {
    const data = loadAllArticles(config);
    const tableOfContents = createTableContents(data);

    return `${tableOfContents}\n${data}`;
}

function loadAllArticles({ articles }) {
    return articles.files
        .map(file => path.resolve(articles.path, file), { encoding: 'utf-8' })
        .map(filepath => fs.readFileSync(filepath))
        .reduce((acc, value) => `${acc}${!acc ? '' : '\n\n'}${value}`, '')
}

function createTableContents(md) {
    const contents = md.match(/([#]{1,3}\s.+|[`]{3}.*)/g) || [];

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
