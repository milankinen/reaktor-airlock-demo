import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createApp } from './app.ts';

const app = createApp();

if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist' }));
}

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
