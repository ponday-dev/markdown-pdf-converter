const argParser = require('./arg-parser');
const md2book = require('./md2book');

(async () => {
    const arguments = argParser.parseArgs(process.argv.slice(2));
    await md2book(arguments.config, arguments.profile, arguments.book);
})();
