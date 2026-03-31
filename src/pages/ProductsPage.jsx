import React, { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPostForm, apiPutForm } from '../api.js';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ brand: '', model: '', minPrice: '', maxPrice: '' });

  const [form, setForm] = useState({ id: '', brand: '', model: '', price: '', quantity: '' });
  const [imageFile, setImageFile] = useState(null);

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (filters.brand) qs.set('brand', filters.brand);
    if (filters.model) qs.set('model', filters.model);
    if (filters.minPrice) qs.set('minPrice', filters.minPrice);
    if (filters.maxPrice) qs.set('maxPrice', filters.maxPrice);
    const str = qs.toString();
    return str ? `?${str}` : '';
  }, [filters]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet(`/api/products${queryString}`);
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  function resetForm() {
    setForm({ id: '', brand: '', model: '', price: '', quantity: '' });
    setImageFile(null);
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    if (form.brand) fd.set('brand', form.brand);
    if (form.model) fd.set('model', form.model);
    if (form.price !== '') fd.set('price', form.price);
    if (form.quantity !== '') fd.set('quantity', form.quantity);
    if (imageFile) fd.set('image', imageFile);

    try {
      if (form.id) {
        await apiPutForm(`/api/products/${form.id}`, fd);
      } else {
        await apiPostForm('/api/products', fd);
      }
      resetForm();
      await load();
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await apiDelete(`/api/products/${id}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>Produtos</h2>
        <div className="row">
          <div className="field">
            <label>Marca</label>
            <input value={filters.brand} onChange={(e) => setFilters((s) => ({ ...s, brand: e.target.value }))} />
          </div>
          <div className="field">
            <label>Modelo</label>
            <input value={filters.model} onChange={(e) => setFilters((s) => ({ ...s, model: e.target.value }))} />
          </div>
          <div className="field">
            <label>Preço mín.</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((s) => ({ ...s, minPrice: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Preço máx.</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((s) => ({ ...s, maxPrice: e.target.value }))}
            />
          </div>
          <button className="secondary" type="button" onClick={() => setFilters({ brand: '', model: '', minPrice: '', maxPrice: '' })}>
            Limpar
          </button>
        </div>

        <div style={{ height: 12 }} />
        {loading && <div className="muted">Carregando...</div>}
        {error && <div className="error">{error}</div>}

        <div className="list">
          {items.map((p) => (
            <div className="item" key={p.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {p.imageUrl ? <img className="img" src={p.imageUrl} alt="Produto" /> : <div className="img" />}
                <div className="meta">
                  <div>
                    <strong>
                      {p.brand} {p.model}
                    </strong>
                  </div>
                  <div className="muted">R$ {Number(p.price).toFixed(2)} • Estoque: {p.quantity}</div>
                </div>
              </div>
              <div className="row">
                <button
                  className="secondary"
                  type="button"
                  onClick={() => {
                    setForm({ id: p.id, brand: p.brand, model: p.model, price: String(p.price), quantity: String(p.quantity) });
                    setImageFile(null);
                  }}
                >
                  Editar
                </button>
                <button className="danger" type="button" onClick={() => remove(p.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <div className="muted">Nenhum produto encontrado.</div>}
        </div>
      </section>

      <section className="card">
        <h2>{form.id ? 'Editar produto' : 'Cadastrar produto'}</h2>
        <form onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>Marca</label>
              <input value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Modelo</label>
              <input value={form.model} onChange={(e) => setForm((s) => ({ ...s, model: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Valor (R$)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Quantidade</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value }))} required />
            </div>
          </div>

          <div style={{ height: 10 }} />
          <div className="row">
            <div className="field">
              <label>Foto</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <div style={{ height: 10 }} />
          <div className="row">
            <button type="submit">{form.id ? 'Salvar' : 'Cadastrar'}</button>
            <button className="secondary" type="button" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
