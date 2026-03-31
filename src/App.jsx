import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CustomerAreaPage from './pages/CustomerAreaPage.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">CN02 P1</div>
        <nav className="nav">
          <NavLink to="/" end>
            Produtos
          </NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
          <NavLink to="/area">Área do Cliente</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/area" element={<CustomerAreaPage />} />
        </Routes>
      </main>
    </div>
  );
}
