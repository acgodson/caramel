const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  //@ts-ignore
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Check if the request URL ends with .svf
    if (pathname.endsWith('.svf')) {
      // Redirect to the same path with .svf replaced by .svg
      const newPathname = pathname.replace(/\.svf$/, '.svg');
      app.render(req, res, newPathname, parsedUrl.query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
            