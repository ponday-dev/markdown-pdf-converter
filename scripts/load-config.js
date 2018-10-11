const fs = require('fs');
const yaml = require('js-yaml');

module.exports = function loadConfig(src, profile) {
    let config = null;
    
    if (typeof src === 'object') {
        config = src;
    } else {
        config = yaml.safeLoad(fs.readFileSync(src, { encoding: 'utf-8' }));
    }

    const pf = config[profile || 'default'];
    if (!pf) {
        throw new Error(`Profile not found: ${pf}`);
    }
    if (!pf.extends) {
        return pf;
    } else if (pf.extends === true) {
        return Object.assign({}, loadConfig(config, 'default'), pf);
    } else {
        return Object.assign({}, loadConfig(config, pf.extends), pf);
    }
}
