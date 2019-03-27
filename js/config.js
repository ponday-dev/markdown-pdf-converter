/**
 * 設定ファイル (config.yml)の読み込み
 */

const fs = require('fs');
const yaml = require('js-yaml');

module.exports = (pathOrObject, profile = 'default') => {
    const config = loadConfig(pathOrObject, profile);

    const book = loadConfig(config.book_config.path, profile);
    delete config.book_config;
    return { ...config, book };
}

function loadConfig (pathOrObject, profile) {
    const config = loadFile(pathOrObject);

    const pf = config[profile];
    if (!pf) {
        throw new Error(`Profile not found: ${pf}`);
    }

    // 設定の継承
    if (!pf.extends) {
        return pf;
    } else if (pf.extends === true) {
        return Object.assign({}, loadConfig(config, 'default'), pf);
    } else {
        return Object.assign({}, loadConfig(config, pf.extends), pf);
    }
}

function loadFile(pathOrObject) {
    if (typeof pathOrObject === 'string') {
        return yaml.safeLoad(fs.readFileSync(pathOrObject, { encoding: 'utf-8' }));
    }
    return pathOrObject;
}
