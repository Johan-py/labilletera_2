import { useState } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({ desc: '', amount: '', type: 'income' })
  const [showForm, setShowForm] = useState(false)

  const balance = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  )

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.desc || !form.amount) return
    setTransactions([
      { ...form, amount: parseFloat(form.amount), id: Date.now() },
      ...transactions,
    ])
    setForm({ desc: '', amount: '', type: 'income' })
    setShowForm(false)
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Billetera de Ahorro</h1>
      </header>

      <section className="balance-card">
        <span className="balance-label">Saldo Actual</span>
        <span className={`balance-amount ${balance < 0 ? 'negative' : ''}`}>
          ${balance.toFixed(2)}
        </span>
        <div className="balance-stats">
          <div className="stat">
            <span className="stat-label">Ingresos</span>
            <span className="stat-value income">${totalIncome.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Gastos</span>
            <span className="stat-value expense">${totalExpense.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {!showForm ? (
        <button className="fab" onClick={() => setShowForm(true)}>+</button>
      ) : (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descripción"
            value={form.desc}
            onChange={e => setForm({ ...form, desc: e.target.value })}
            autoFocus
          />
          <input
            type="number"
            placeholder="Monto"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            step="0.01"
            min="0"
          />
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${form.type === 'income' ? 'active-income' : ''}`}
              onClick={() => setForm({ ...form, type: 'income' })}
            >Ingreso</button>
            <button
              type="button"
              className={`toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => setForm({ ...form, type: 'expense' })}
            >Gasto</button>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Agregar</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <section className="history">
        <h2>Historial</h2>
        {transactions.length === 0 ? (
          <p className="empty">No hay movimientos aún</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map(t => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <div className="transaction-info">
                  <span className="transaction-desc">{t.desc}</span>
                  <span className="transaction-date">
                    {new Date(t.id).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <div className="transaction-actions">
                  <span className={`transaction-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTransaction(t.id)}
                  >✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
