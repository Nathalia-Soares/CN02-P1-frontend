import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app">
          <header className="topbar">
            <div className="brand">CN02 P1</div>
          </header>

          <main className="container">
            <section className="card">
              <h2>Erro ao renderizar</h2>
              <div className="error">{String(this.state.error?.message || this.state.error)}</div>
              <div className="muted" style={{ marginTop: 8 }}>
                Abra o DevTools (F12) &gt; Console para ver detalhes.
              </div>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
