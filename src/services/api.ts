// src/services/api.ts
export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken') || '';
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`http://localhost:3000${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string,string>),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).message || 'Erro na requisição');
  }

  return res.json();
}
