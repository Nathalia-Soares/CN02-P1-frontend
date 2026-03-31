import React, { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPostJson } from '../api.js';

export default function CheckoutPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [cart, setCart] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setError('');
    setSuccess('');
    try {
      const [p, c] = await Promise.all([apiGet('/api/products'), apiGet('/api/customers')]);
      setProducts(p.items || []);
      setCustomers(c.items || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cartItems = useMemo(() => {
    const items = [];
    for (const p of products) {
      const qty = Number(cart[p.id] || 0);
      if (qty > 0) items.push({ product: p, quantity: qty });
    }
    return items;
  }, [cart, products]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + Number(it.product.price) * Number(it.quantity), 0);
  }, [cartItems]);

  async function submit() {
    setError('');
    setSuccess('');

    if (!customerId) {
      setError('Selecione um cliente.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Selecione ao menos um produto.');
      return;
    }

    try {
      const payload = {
        customerId,
        paymentMethod,
        deliveryMethod,
        items: cartItems.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          expectedUnitPrice: Number(it.product.price)
        }))
      };
      const order = await apiPostJson('/api/checkout', payload);
      setSuccess(`Pedido criado: ${order.id} (Total: R$ ${Number(order.total).toFixed(2)})`);
      setCart({});
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section className="card">
      <h2>Checkout</h2>
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

        <div className="field">
          <label>Método de pagamento</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="pix">PIX</option>
            <option value="credit_card">Cartão de crédito</option>
            <option value="debit_card">Cartão de débito</option>
            <option value="boleto">Boleto</option>
            <option value="cash">Dinheiro</option>
          </select>
        </div>

        <div className="field">
          <label>Entrega</label>
          <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
            <option value="pickup">Retirada</option>
            <option value="delivery">Entrega</option>
          </select>
        </div>
      </div>

      <div style={{ height: 12 }} />
      <h3>Produtos</h3>
      <div className="list">
        {products.map((p) => (
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
            <div className="field">
              <label>Quantidade</label>
              <input
                type="number"
                min={0}
                max={p.quantity}
                value={cart[p.id] || 0}
                onChange={(e) => setCart((s) => ({ ...s, [p.id]: e.target.value }))}
              />
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="muted">Cadastre produtos antes do checkout.</div>}
      </div>

      <div style={{ height: 12 }} />
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Total:</strong> R$ {Number(total).toFixed(2)}
        </div>
        <button type="button" onClick={submit}>
          Concluir pedido
        </button>
      </div>
    </section>
  );
}
