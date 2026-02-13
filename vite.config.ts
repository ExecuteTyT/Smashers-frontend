import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const OG_IMAGE_PATH = '/Gemini_Generated_Image_l5hojql5hojql5ho.png';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');
    const ogImageUrl = siteUrl ? `${siteUrl}${OG_IMAGE_PATH}` : OG_IMAGE_PATH;

    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Прокси для обхода CORS в development (только для локальной разработки!)
        proxy: {
          '/api': {
            target: 'https://apismash.braidx.tech',
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/api/, '/api')
          }
        }
      },
      plugins: [
        react(),
        {
          name: 'html-og-url',
          transformIndexHtml(html) {
            return html.replace(/__OG_IMAGE_URL__/g, ogImageUrl);
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://apismash.braidx.tech/api')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        emptyOutDir: !process.env.VITE_SSR_BUILD,
        rollupOptions: {
          input: process.env.VITE_SSR_BUILD
            ? path.resolve(__dirname, 'entry-server.tsx')
            : { main: path.resolve(__dirname, 'index.html') }
        }
      }
    };
});
