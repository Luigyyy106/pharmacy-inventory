import React from 'react';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'expiry_date', label: 'Expiry Date' },
  { value: 'category', label: 'Category' },
  { value: 'brand', label: 'Brand' },
];

const SORT_ALGOS = [
  { value: 'quick',     label: 'Quick Sort',     complexity: 'O(n log n)' },
  { value: 'merge',     label: 'Merge Sort',     complexity: 'O(n log n)' },
  { value: 'heap',      label: 'Heap Sort',      complexity: 'O(n log n)' },
  { value: 'bubble',    label: 'Bubble Sort',    complexity: 'O(n²)' },
  { value: 'selection', label: 'Selection Sort', complexity: 'O(n²)' },
  { value: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)' },
];

const SEARCH_ALGOS = [
  { value: 'linear', label: 'Linear Search', complexity: 'O(n)' },
  { value: 'binary', label: 'Binary Search', complexity: 'O(log n)' },
];

const CATEGORIES = ['all','Antibiotics','Analgesics','Antihypertensives','Vitamins & Supplements','Antihistamines','Antidiabetics','Antacids','Cardiovascular','Respiratory','Dermatologicals'];

function getExpiryStatus(expiry_date) {
  if (!expiry_date) return null;
  const today = new Date();
  const exp = new Date(expiry_date);
  const days = Math.floor((exp - today) / (1000*60*60*24));
  if (days < 0) return { label: 'Expired', cls: 'badge-red' };
  if (days <= 30) return { label: `${days}d left`, cls: 'badge-orange' };
  if (days <= 90) return { label: `${days}d left`, cls: 'badge-blue' };
  return null;
}

function MedicineList({
  medicines, loading,
  sortBy, setSortBy, order, setOrder, algorithm, setAlgorithm,
  searchQuery, setSearchQuery, searchAlgo, setSearchAlgo,
  categoryFilter, setCategoryFilter,
  onEdit, onDelete, onStock
}) {
  const currentSortAlgo = SORT_ALGOS.find(a => a.value === algorithm);
  const currentSearchAlgo = SEARCH_ALGOS.find(a => a.value === searchAlgo);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Inventory</div>
      </div>

      <div className="controls-bar">
        <div className="control-group" style={{flex:2}}>
          <div className="control-label">Search</div>
          <input
            className="ctrl-input"
            placeholder="Search medicines, brands, categories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="control-group">
          <div className="control-label">Search Algorithm</div>
          <select className="ctrl-select" value={searchAlgo} onChange={e => setSearchAlgo(e.target.value)}>
            {SEARCH_ALGOS.map(a => (
              <option key={a.value} value={a.value}>{a.label} – {a.complexity}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <div className="control-label">Sort By</div>
          <select className="ctrl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="control-group">
          <div className="control-label">Sort Algorithm</div>
          <select className="ctrl-select" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
            {SORT_ALGOS.map(a => (
              <option key={a.value} value={a.value}>{a.label} – {a.complexity}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <div className="control-label">Order</div>
          <select className="ctrl-select" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="control-group">
          <div className="control-label">Category</div>
          <select className="ctrl-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
        </div>
      </div>

      <div style={{display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap'}}>
        <span className="algo-tag">Sort: {currentSortAlgo?.label} · {currentSortAlgo?.complexity}</span>
        {searchQuery && <span className="algo-tag">Search: {currentSearchAlgo?.label} · {currentSearchAlgo?.complexity}</span>}
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Medicines</span>
          <span className="count-badge">{medicines.length} results</span>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div> Loading...</div>
        ) : medicines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⊟</div>
            <div className="empty-text">No medicines found</div>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Generic</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Dosage</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => {
                  const expiryStatus = getExpiryStatus(m.expiry_date);
                  const isLow = m.quantity <= m.reorder_level;
                  return (
                    <tr key={m.id}>
                      <td className="td-name">{m.name}</td>
                      <td style={{color:'var(--text-3)', fontSize:'12px'}}>{m.generic_name || '—'}</td>
                      <td><span className="badge badge-blue" style={{fontSize:'10px'}}>{m.category}</span></td>
                      <td>{m.brand || '—'}</td>
                      <td className="td-mono">{m.dosage || '—'}</td>
                      <td>
                        <span className={`td-mono ${isLow ? 'badge badge-orange' : ''}`}>
                          {m.quantity}
                        </span>
                      </td>
                      <td className="td-mono" style={{color:'var(--accent)'}}>₱{parseFloat(m.price).toFixed(2)}</td>
                      <td className="td-mono" style={{fontSize:'12px'}}>
                        {m.expiry_date ? new Date(m.expiry_date).toLocaleDateString('en-PH', {year:'numeric',month:'short',day:'numeric'}) : '—'}
                      </td>
                      <td>
                        {expiryStatus && <span className={`badge ${expiryStatus.cls}`}>{expiryStatus.label}</span>}
                        {!expiryStatus && isLow && <span className="badge badge-orange">Low Stock</span>}
                        {!expiryStatus && !isLow && <span className="badge badge-green">OK</span>}
                      </td>
                      <td>
                        <div style={{display:'flex', gap:'4px'}}>
                          <button className="btn btn-sm btn-blue" onClick={() => onStock(m)}>Stock</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(m)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => onDelete(m.id, m.name)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineList;
