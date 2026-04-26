import React, { useState } from 'react';

function StockManager({ medicine, onSubmit, onClose }) {
  const [type, setType] = useState('stock_in');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return;
    onSubmit(medicine.id, type, parseInt(quantity), note);
  };

  const typeConfig = {
    stock_in:    { label: 'Stock In',    color: 'var(--accent)',  icon: '↑' },
    stock_out:   { label: 'Stock Out',   color: 'var(--danger)',  icon: '↓' },
    adjustment:  { label: 'Adjustment',  color: 'var(--accent2)', icon: '≈' },
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Stock Manager</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{marginBottom:'16px', padding:'12px', background:'var(--bg-deep)', borderRadius:'8px'}}>
          <div style={{fontSize:'14px', fontWeight:'600', color:'var(--text-1)'}}>{medicine.name}</div>
          <div style={{fontSize:'12px', color:'var(--text-3)', fontFamily:'var(--mono)', marginTop:'4px'}}>
            Current Stock: <span style={{color: medicine.quantity <= medicine.reorder_level ? 'var(--warn)' : 'var(--accent)'}}>{medicine.quantity} {medicine.unit}s</span>
            &nbsp;· Reorder Level: {medicine.reorder_level}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{marginBottom:'14px'}}>
            <div className="form-label">Transaction Type</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginTop:'4px'}}>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button
                  key={key} type="button"
                  onClick={() => setType(key)}
                  style={{
                    padding:'8px', borderRadius:'6px', border:'1px solid',
                    borderColor: type === key ? cfg.color : 'var(--border2)',
                    background: type === key ? `${cfg.color}18` : 'var(--bg-deep)',
                    color: type === key ? cfg.color : 'var(--text-2)',
                    cursor:'pointer', fontSize:'12px', fontWeight:'600',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'
                  }}
                >
                  <span style={{fontSize:'18px'}}>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{marginBottom:'14px'}}>
            <div className="form-label">{type === 'adjustment' ? 'New Quantity' : 'Quantity'}</div>
            <input
              className="form-input" type="number" min="1"
              value={quantity} onChange={e => setQuantity(e.target.value)}
              placeholder={type === 'adjustment' ? `e.g. ${medicine.quantity}` : 'Enter quantity'}
              required
            />
          </div>

          <div className="form-group" style={{marginBottom:'20px'}}>
            <div className="form-label">Note (optional)</div>
            <input className="form-input" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Monthly restock, sold to patient..." />
          </div>

          <div style={{display:'flex', gap:'8px'}}>
            <button type="submit" className="btn btn-primary" style={{flex:1}}>
              {typeConfig[type].icon} Confirm {typeConfig[type].label}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockManager;
