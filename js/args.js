const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
    version: '3.0.0',
    addHelp: true
});

parser.addArgument(['-c', '--config'], { help: 'configration file path' });
parser.addArgument(['-p', '--profile'], { help: 'specify configration profile' });

module.exports = parser;
