import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions({ API }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/transactions?limit=100`);
        setTransactions(res.data.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, [API]);

  const typeConfig = {
    stock_in:   { label: 'Stock In',  cls: 'badge-green', symbol: '+' },
    stock_out:  { label: 'Stock Out', cls: 'badge-red',   symbol: '-' },
    adjustment: { label: 'Adjusted',  cls: 'badge-blue',  symbol: '=' },
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Transactions</div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Transaction Log</span>
          <span className="count-badge">{transactions.length} records</span>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div> Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⟳</div>
            <div className="empty-text">No transactions recorded</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Medicine</th>
                <th>Category</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Note</th>
                <th>By</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                const cfg = typeConfig[t.type] || { label: t.type, cls: 'badge-gray', symbol: '?' };
                return (
                  <tr key={t.id}>
                    <td className="td-mono" style={{color:'var(--text-3)'}}>{t.id}</td>
                    <td className="td-name">{t.medicine_name}</td>
                    <td><span className="badge badge-blue" style={{fontSize:'10px'}}>{t.category}</span></td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                    <td className="td-mono" style={{color: t.type === 'stock_in' ? 'var(--accent)' : 'var(--danger)', fontWeight:'700'}}>
                      {cfg.symbol}{t.quantity}
                    </td>
                    <td style={{fontSize:'12px', color:'var(--text-3)'}}>{t.note || '—'}</td>
                    <td style={{fontSize:'12px'}}>{t.performed_by}</td>
                    <td className="td-mono" style={{fontSize:'11px', color:'var(--text-3)'}}>
                      {new Date(t.created_at).toLocaleString('en-PH', {
                        year:'numeric',month:'short',day:'numeric',
                        hour:'2-digit',minute:'2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
