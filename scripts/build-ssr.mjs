/**
 * Запуск Vite SSR-сборки без очистки dist (чтобы не затереть клиентский билд).
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

process.env.VITE_SSR_BUILD = '1';
const r = spawnSync('npx', ['vite', 'build', '--ssr', 'entry-server.tsx'], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: true,
});
process.exit(r.status ?? 1);
