<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TqcLzImdrDw-4zjsfUtd4a5OKkFWIqB1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Контент без JavaScript (SSG)

При сборке (`npm run build`) выполняется SSG (Static Site Generation): те же React-страницы рендерятся в HTML без браузера (Vite SSR). В `dist/` попадают готовые файлы с **текущими текстами** каждой страницы:

- `dist/index.html` — главная  
- `dist/training/index.html` — тренировки  
- `dist/schedule/index.html` — расписание  
- и т.д.

Без JS пользователь и роботы видят полный контент страницы. Puppeteer не используется — SSG работает на любом хостинге (в т.ч. Vercel). Хостинг должен отдавать эти файлы по путям (в Vercel за это отвечают `routes` в vercel.json).
