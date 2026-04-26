import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Antibiotics','Analgesics','Antihypertensives','Vitamins & Supplements','Antihistamines','Antidiabetics','Antacids','Cardiovascular','Respiratory','Dermatologicals'];
const UNITS = ['tablet','capsule','syrup','inhaler','cream','injection','drops','patch','sachet','vial'];

function MedicineForm({ medicine, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', generic_name: '', category: 'Antibiotics', brand: '', dosage: '',
    unit: 'tablet', quantity: '', reorder_level: 10, price: '', expiry_date: '', supplier: '', description: ''
  });

  useEffect(() => {
    if (medicine) {
      setForm({
        ...medicine,
        expiry_date: medicine.expiry_date ? medicine.expiry_date.slice(0,10) : '',
        quantity: medicine.quantity || 0,
        price: medicine.price || 0,
      });
    }
  }, [medicine]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{medicine ? 'Edit Medicine' : 'Add Medicine'}</div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Medicine Name *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Amoxicillin 500mg" />
          </div>
          <div className="form-group">
            <label className="form-label">Generic Name</label>
            <input className="form-input" value={form.generic_name} onChange={e => set('generic_name', e.target.value)} placeholder="e.g. Amoxicillin" />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Brand</label>
            <input className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Amoxil" />
          </div>
          <div className="form-group">
            <label className="form-label">Dosage</label>
            <input className="form-input" value={form.dosage} onChange={e => set('dosage', e.target.value)} placeholder="e.g. 500mg" />
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Reorder Level</label>
            <input className="form-input" type="number" min="0" value={form.reorder_level} onChange={e => set('reorder_level', e.target.value)} placeholder="10" />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₱) *</label>
            <input className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input className="form-input" type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Supplier</label>
            <input className="form-input" value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="e.g. PharmaCorp" />
          </div>
          <div className="form-group full">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional notes..." />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{medicine ? 'Update Medicine' : 'Add Medicine'}</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default MedicineForm;
