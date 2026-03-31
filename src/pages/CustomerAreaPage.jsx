import React, { useEffect, useState } from 'react';
import { apiGet, apiPutJson } from '../api.js';

export default function CustomerAreaPage() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  async function loadCustomers() {
    setError('');
    try {
      const data = await apiGet('/api/customers');
      setCustomers(data.items || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadCustomerAndOrders(id) {
    setError('');
    setSuccess('');
    setCustomer(null);
    setOrders([]);
    if (!id) return;
    try {
      const [c, o] = await Promise.all([apiGet(`/api/customers/${id}`), apiGet(`/api/customers/${id}/orders`)]);
      setCustomer(c);
      setOrders(o.items || []);
      setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', address: c.address || '' });
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    loadCustomerAndOrders(customerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function save() {
    setError('');
    setSuccess('');
    if (!customerId) return;
    try {
      await apiPutJson(`/api/customers/${customerId}`, form);
      setSuccess('Dados atualizados.');
      await loadCustomerAndOrders(customerId);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>Área do Cliente</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="row">
          <div className="field">
            <label>Cliente</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Selecione...</option>
              {customers.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ height: 12 }} />
        {!customerId && <div className="muted">Selecione um cliente para ver seus pedidos e editar dados.</div>}

        {customer && (
          <>
            <h3>Meus dados</h3>
            <div className="row">
              <div className="field">
                <label>Nome</label>
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
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
              <button type="button" onClick={save}>
                Salvar dados
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h2>Meus pedidos</h2>
        {!customerId && <div className="muted">Selecione um cliente.</div>}
        {customerId && orders.length === 0 && <div className="muted">Nenhum pedido encontrado.</div>}
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
                <div className="muted">Itens: {Array.isArray(o.items) ? o.items.length : 0}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
