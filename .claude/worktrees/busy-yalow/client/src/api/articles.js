const BASE = '/api/articles';

export async function fetchBoard() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch board');
  return res.json();
}

export async function fetchArchive() {
  const res = await fetch(`${BASE}/archive`);
  if (!res.ok) throw new Error('Failed to fetch archive');
  return res.json();
}

export async function createArticle(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function updateArticle(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update article');
  return res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete article');
}

export async function restoreArticle(id) {
  const res = await fetch(`${BASE}/${id}/restore`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to restore article');
  return res.json();
}
