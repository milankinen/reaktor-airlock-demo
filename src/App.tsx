import { type FormEvent, useEffect, useState } from 'react';
import { createTodo, deleteTodo, listTodos, type Todo, updateTodo } from './api.ts';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) => fn().catch((err: Error) => setError(err.message));

  useEffect(() => {
    run(async () => setTodos(await listTodos()));
  }, []);

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    run(async () => {
      const todo = await createTodo(title);
      setTodos((prev) => [...prev, todo]);
      setTitle('');
    });
  };

  const toggle = (todo: Todo) =>
    run(async () => {
      const updated = await updateTodo(todo.id, { done: !todo.done });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    });

  const remove = (id: number) =>
    run(async () => {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    });

  return (
    <main>
      <h1>Todos</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={add}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoFocus
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={todo.done} onChange={() => toggle(todo)} />
              <span>{todo.title}</span>
            </label>
            <button onClick={() => remove(todo.id)} aria-label={`Delete ${todo.title}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="count">{todos.filter((t) => !t.done).length} items left</p>
    </main>
  );
}
