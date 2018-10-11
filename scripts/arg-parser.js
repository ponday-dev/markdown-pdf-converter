const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
    version: '2.0.0',
    addHelp: true
});

parser.addArgument(['-c', '--config'], { help: 'configration file path' });
parser.addArgument(['-p', '--profile'], { help: 'specify configration profile' });
parser.addArgument(['-b', '--book'], { help: 'specify book profile' });

module.exports = parser;
