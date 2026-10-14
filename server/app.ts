import { Hono } from 'hono';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export function createApp() {
  const todos = new Map<number, Todo>();
  let nextId = 1;

  const api = new Hono();

  api.get('/todos', (c) => c.json([...todos.values()]));

  api.post('/todos', async (c) => {
    const { title } = await c.req.json<{ title?: unknown }>().catch(() => ({}) as { title?: unknown });
    if (typeof title !== 'string' || !title.trim()) {
      return c.json({ error: 'title is required' }, 400);
    }
    const todo: Todo = { id: nextId++, title: title.trim(), done: false };
    todos.set(todo.id, todo);
    return c.json(todo, 201);
  });

  api.patch('/todos/:id', async (c) => {
    const todo = todos.get(Number(c.req.param('id')));
    if (!todo) return c.json({ error: 'not found' }, 404);
    const body = await c.req.json<Partial<Record<keyof Todo, unknown>>>().catch(() => ({}) as Partial<Record<keyof Todo, unknown>>);
    if (typeof body.title === 'string' && body.title.trim()) todo.title = body.title.trim();
    if (typeof body.done === 'boolean') todo.done = body.done;
    return c.json(todo);
  });

  api.delete('/todos/:id', (c) => {
    const deleted = todos.delete(Number(c.req.param('id')));
    return deleted ? c.body(null, 204) : c.json({ error: 'not found' }, 404);
  });

  return new Hono().route('/api', api);
}
