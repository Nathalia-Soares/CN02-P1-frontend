import React, { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPostJson, apiPutJson } from '../api.js';

export default function CustomersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', address: '' });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/api/customers');
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders(customerId) {
    setError('');
    setOrders([]);
    if (!customerId) return;
    try {
      const data = await apiGet(`/api/customers/${customerId}/orders`);
      setOrders(data.items || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadOrders(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function resetForm() {
    setForm({ id: '', name: '', email: '', phone: '', address: '' });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      if (form.id) {
        await apiPutJson(`/api/customers/${form.id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address
        });
      } else {
        await apiPostJson('/api/customers', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address
        });
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
      await apiDelete(`/api/customers/${id}`);
      if (selectedId === id) setSelectedId('');
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>Clientes</h2>
        {loading && <div className="muted">Carregando...</div>}
        {error && <div className="error">{error}</div>}

        <div className="list">
          {items.map((c) => (
            <div className="item" key={c.id}>
              <div className="meta">
                <div>
                  <strong>{c.name}</strong>
                </div>
                <div className="muted">{c.email}</div>
                {(c.phone || c.address) && (
                  <div className="muted">
                    {c.phone ? `Tel: ${c.phone}` : ''} {c.address ? `• ${c.address}` : ''}
                  </div>
                )}
              </div>
              <div className="row">
                <button className="secondary" type="button" onClick={() => setSelectedId(c.id)}>
                  Histórico
                </button>
                <button
                  className="secondary"
                  type="button"
                  onClick={() => setForm({ id: c.id, name: c.name, email: c.email, phone: c.phone || '', address: c.address || '' })}
                >
                  Editar
                </button>
                <button className="danger" type="button" onClick={() => remove(c.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <div className="muted">Nenhum cliente cadastrado.</div>}
        </div>
      </section>

      <section className="card">
        <h2>{form.id ? 'Editar cliente' : 'Cadastrar cliente'}</h2>
        <form onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>Nome</label>
              <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
            </div>
          </div>
          <div style={{ height: 10 }} />
          <div className="row">
            <div className="field">
              <label>Telefone</label>
              <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Endereço</label>
              <input value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />
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

        <div style={{ height: 16 }} />
        <h3>Histórico de pedidos</h3>
        <div className="row">
          <div className="field">
            <label>Cliente</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Selecione...</option>
              {items.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ height: 10 }} />
        {selectedId && orders.length === 0 && <div className="muted">Nenhum pedido para este cliente.</div>}
        <div className="list">
          {orders.map((o) => (
            <div className="item" key={o.id}>
              <div className="meta">
                <div>
                  <strong>Pedido {o.id}</strong>
                </div>
                <div className="muted">Total: R$ {Number(o.total).toFixed(2)}</div>
                <div className="muted">
                  Pagamento: {o.paymentMethod} • Entrega: {o.deliveryMethod} • Status: {o.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
