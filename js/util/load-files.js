const fs = require('fs');

module.exports = (files, delimiter = '\n') => {
    return files.map(file => fs.readFileSync(file, { encoding: 'utf-8' })).join(delimiter);
}
