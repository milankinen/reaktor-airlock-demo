export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (res.status === 204 ? null : await res.json()) as T;
}

export const listTodos = () => request<Todo[]>('/todos');
export const createTodo = (title: string) =>
  request<Todo>('/todos', { method: 'POST', body: JSON.stringify({ title }) });
export const updateTodo = (id: number, changes: Partial<Omit<Todo, 'id'>>) =>
  request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
export const deleteTodo = (id: number) => request<null>(`/todos/${id}`, { method: 'DELETE' });
