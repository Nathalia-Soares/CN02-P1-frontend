const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  return readJson(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${API_URL}${path}`, { method: 'DELETE' });
  if (res.status === 204) return null;
  return readJson(res);
}

export async function apiPostJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return readJson(res);
}

export async function apiPutJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return readJson(res);
}

export async function apiPostForm(path, formData) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: formData
  });
  return readJson(res);
}

export async function apiPutForm(path, formData) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    body: formData
  });
  return readJson(res);
}

async function readJson(res) {
  const text = await res.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Backend pode retornar HTML/texto em falhas (ex.: proxy, 500 sem JSON).
      // Em vez de quebrar o app com SyntaxError, converte em erro amigável.
      const preview = text.length > 300 ? `${text.slice(0, 300)}…` : text;
      const err = new Error(
        res.ok
          ? 'Resposta inválida do servidor (esperado JSON).'
          : `HTTP ${res.status} (resposta não-JSON): ${preview}`
      );
      err.status = res.status;
      throw err;
    }
  }

  if (!res.ok) {
    const message = data?.error || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}
