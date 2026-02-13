/**
 * Prerender routes for crawlers (no-JS). Run after `vite build`.
 * Serves dist, visits each route in Puppeteer, saves full HTML to dist/ or dist/<path>/index.html.
 * On Vercel uses puppeteer-core + @sparticuz/chromium; locally uses full Puppeteer.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const isVercel = Boolean(process.env.VERCEL);

const puppeteer = await import(isVercel ? 'puppeteer-core' : 'puppeteer').then((m) => m.default);
const chromium = isVercel ? (await import('@sparticuz/chromium')).default : null;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4173;
const ROUTES = ['/', '/training', '/schedule', '/contacts', '/faq', '/privacy-policy'];
const WAIT_MS = 8000;

function serveStatic(dir) {
  return http.createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.join(dir, path.normalize(urlPath).replace(/^\//, ''));
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      stat = null;
    }
    if (!stat || !stat.isFile()) {
      fs.readFile(path.join(dir, 'index.html'), (e, data) => {
        if (e) {
          res.writeHead(500);
          res.end('index.html not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run vite build first.');
    process.exit(1);
  }

  const server = serveStatic(DIST);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log('[prerender] Server at', baseUrl);

  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (isVercel && chromium) {
    launchOptions.executablePath = await chromium.executablePath();
    launchOptions.args = [...(chromium.args || []), '--no-sandbox', '--disable-setuid-sandbox'];
    launchOptions.ignoreHTTPSErrors = true;
  }
  const browser = await puppeteer.launch(launchOptions);

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      try {
        await page.goto(baseUrl + route, { waitUntil: 'networkidle0', timeout: 20000 });
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root');
            return root && root.children.length > 0 && root.innerText.length > 50;
          },
          { timeout: WAIT_MS }
        ).catch(() => {});
        const html = await page.content();
        const outPath = route === '/'
          ? path.join(DIST, 'index.html')
          : path.join(DIST, route.slice(1), 'index.html');
        ensureDir(path.dirname(outPath));
        fs.writeFileSync(outPath, html, 'utf8');
        console.log('[prerender]', route, '->', outPath.replace(ROOT, ''));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('[prerender] Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
