const fs = require('fs');
const path = require('path');

const argParser = require('./args');
const build = require('./book/builder');
const loadConfig = require('./config');

const args = argParser.parseArgs(process.argv.slice(2));

const config = loadConfig(args.config, args.profile || 'default');
const htmlDoc = build(config);
fs.writeFileSync(path.resolve(config.output_path, 'index.html'), htmlDoc);

fs.readdirSync(config.image_path)
    .map(file => path.resolve(config.image_path, file))
    .forEach(file => {
        if (fs.statSync(file).isFile() && !path.basename(file).startsWith('.')) {
            fs.copyFileSync(file, path.resolve(config.output_path, path.basename(file)));
        }
    });
