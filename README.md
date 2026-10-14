# airlock demo app

React + Vite + TypeScript frontend. Hono backend on Node.js.

Requires Node.js 24+ (runs server TypeScript natively).

```sh
npm install
npm run dev        # API on :3000, Vite on :5173 (proxies /api)
npm run typecheck
npm run build      # typecheck + build frontend to dist/
npm start          # production: API + dist/ on :3000
```
