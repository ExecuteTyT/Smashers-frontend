# CORS Ошибки - Объяснение и Решение

## Проблема: CORS ошибки

**CORS (Cross-Origin Resource Sharing)** - это политика безопасности браузера, которая контролируется **сервером (бэкендом)**, а не фронтендом.

## Почему это проблема бэкенда?

1. **Браузер блокирует запросы** к другому домену по умолчанию
2. **Сервер должен разрешить** эти запросы через специальные HTTP заголовки
3. **Фронтенд не может обойти** эту защиту браузера

## Что нужно сделать на бэкенде:

Сервер `apismash.braidx.tech` должен добавить следующие заголовки в ответы:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

Или для конкретного домена (более безопасно):

```
Access-Control-Allow-Origin: https://your-frontend-domain.vercel.app
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Что уже сделано на фронте:

✅ Добавлен `mode: 'cors'` в fetch запросы
✅ Добавлен `credentials: 'omit'` для безопасности
✅ Улучшена обработка ошибок с fallback данными
✅ Все запросы обрабатываются через `.catch()` с graceful degradation

## Временное решение (только для разработки):

Если нужно протестировать локально, можно использовать прокси в `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://apismash.braidx.tech',
      changeOrigin: true,
      secure: true
    }
  }
}
```

Но это **НЕ решение для production** - нужно настроить CORS на бэкенде.

## Текущее состояние:

- ✅ Фронтенд правильно настроен
- ❌ Бэкенд не отправляет CORS заголовки
- ✅ Приложение работает с fallback данными (mock data)

## Что делать:

**Связаться с бэкенд разработчиком** и попросить добавить CORS заголовки на сервере `apismash.braidx.tech`.
