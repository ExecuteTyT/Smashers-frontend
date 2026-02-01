# Инструкция по деплою на Vercel

## Подготовка к деплою

Проект готов к деплою на Vercel. Все необходимые файлы на месте.

## Шаги для деплоя:

### 1. Проверка Git репозитория

```bash
# Проверьте статус
git status

# Если репозиторий не инициализирован
git init

# Добавьте все файлы
git add .

# Сделайте коммит
git commit -m "Ready for Vercel deployment - updated images, prices and content"
```

### 2. Настройка удаленного репозитория (если нужно)

```bash
# Добавьте удаленный репозиторий
git remote add origin <URL_ВАШЕГО_РЕПОЗИТОРИЯ>

# Или проверьте существующий
git remote -v
```

### 3. Push в Git

```bash
# Push в основную ветку
git push -u origin main

# Или если ветка называется master
git push -u origin master
```

### 4. Деплой на Vercel

#### Вариант A: Через Vercel Dashboard
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш Git репозиторий
4. Vercel автоматически определит настройки из `vercel.json`
5. Нажмите "Deploy"

#### Вариант B: Через Vercel CLI
```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Деплой
vercel

# Для production деплоя
vercel --prod
```

## Конфигурация проекта

- **Framework**: Vite (React)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: рекомендуется 18.x или выше

## Переменные окружения

Если нужны переменные окружения (например, `VITE_API_URL`), добавьте их в настройках проекта на Vercel:
1. Settings → Environment Variables
2. Добавьте необходимые переменные

## Проверка после деплоя

После деплоя проверьте:
- ✅ Все изображения загружаются корректно
- ✅ API запросы работают
- ✅ Роутинг работает (SPA routing)
- ✅ Все страницы доступны

## Структура проекта

- `/public` - статические файлы (изображения)
- `/pages` - страницы приложения
- `/components` - React компоненты
- `/config` - конфигурация API
- `vercel.json` - конфигурация Vercel

## Примечания

- Все изображения находятся в папке `public` и будут доступны по пути `/имя_файла`
- Vercel автоматически настроит SPA routing благодаря конфигурации в `vercel.json`
- Build выполняется автоматически при каждом push в Git
