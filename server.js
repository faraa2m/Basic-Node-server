const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg":  "image/jpg",
    "png": "image/png",
    "js": "text/js",
    "css": "text/css"
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    console.log("Loading" + uri + "Filename" + fileName);
    let stats;

    try {
        stats = fs.lstatSync(fileName);
    }
    catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
        return;
    }

    if (stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.statusCode = 200;
        res.setHeader('Content-Type', mimeType);

        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }
    else if (stats.isDirectory()) {
        res.statusCode= 302;
        res.setHeader('Location', 'index.html');
        res.end();
    }
    else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500 Internal Error\n');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});