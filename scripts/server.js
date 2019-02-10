const fs = require('fs');
const http = require('http');
const mime = require('mime-types')
const fs = require('fs');
const path = require('path');

module.exports = function createServer({ image_path }) {
    return http.createServer((req, res) => {
        mimetype = mime.lookup(path.extname(req.url));
        image = fs.readFileSync(`${image_path}/${path.basename(req.url)}`);
        res.writeHead(200, {'Content-Type': mimetype});
        res.end(image);
    });
}
