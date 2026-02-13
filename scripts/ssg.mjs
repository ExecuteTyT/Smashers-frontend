/**
 * SSG (Static Site Generation): рендер текущих текстов и разметки в HTML для каждого маршрута.
 * Без Puppeteer — использует Vite SSR (entry-server), работает на любом хостинге.
 * После запуска по /training, /schedule и т.д. отдаётся свой HTML с контентом страницы.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ROUTES = ['/', '/training', '/schedule', '/contacts', '/faq', '/privacy-policy'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[ssg] dist/ не найден. Сначала выполните: vite build');
    process.exit(1);
  }

  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('[ssg] dist/index.html не найден.');
    process.exit(1);
  }

  let entryServerPath = path.join(DIST, 'entry-server.js');
  if (!fs.existsSync(entryServerPath)) entryServerPath = path.join(DIST, 'entry-server.mjs');
  if (!fs.existsSync(entryServerPath)) {
    console.error('[ssg] Сборка SSR не найдена (dist/entry-server.js). Выполните: vite build --ssr entry-server.tsx');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const { pathToFileURL } = await import('url');
  const { render } = await import(pathToFileURL(entryServerPath).href);

  const rootDivRegex = /<div id="root"><\/div>/;

  for (const route of ROUTES) {
    const appHtml = render(route);
    const html = template.replace(rootDivRegex, `<div id="root">${appHtml}</div>`);
    const outPath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('[ssg]', route || '/', '->', path.relative(ROOT, outPath));
  }

  console.log('[ssg] Готово. Тексты страниц теперь в HTML, без JS контент виден.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
