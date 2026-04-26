import React from 'react';

function Dashboard({ stats, medicines, onNavigate }) {
  if (!stats) return <div className="loading"><div className="spinner"></div> Loading dashboard...</div>;

  const topByValue = [...medicines]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 5);

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <div className="page-title">Dashboard</div>
      </div>

      <div className="card-grid card-grid-4">
        <div className="stat-card">
          <div className="stat-label">Total Medicines</div>
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-sub">{stats.totalQuantity.toLocaleString()} units in stock</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Inventory Value</div>
          <div className="stat-value" style={{fontSize:'22px'}}>₱{parseFloat(stats.totalValue).toLocaleString()}</div>
          <div className="stat-sub">Total stock worth</div>
        </div>
        <div className="stat-card warn">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{stats.lowStockCount}</div>
          <div className="stat-sub">Below reorder level</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Expiring Soon</div>
          <div className="stat-value">{stats.expiringSoonCount}</div>
          <div className="stat-sub">Within 30 days</div>
        </div>
      </div>

      <div className="card-grid card-grid-2">
        <div className="card">
          <div className="section-title">Alerts</div>
          {stats.lowStockItems.length === 0 && stats.expiringSoonItems.length === 0 ? (
            <div className="empty-state" style={{padding:'30px'}}>
              <div className="empty-icon">✓</div>
              <div className="empty-text">All stock levels are healthy</div>
            </div>
          ) : (
            <div className="alert-list">
              {stats.lowStockItems.slice(0, 4).map(m => (
                <div key={m.id} className="alert-item low-stock">
                  <span>{m.name}</span>
                  <span className="badge badge-orange">{m.quantity} left</span>
                </div>
              ))}
              {stats.expiringSoonItems.slice(0, 4).map(m => (
                <div key={m.id} className="alert-item expiring">
                  <span>{m.name}</span>
                  <span className="badge badge-red">exp {new Date(m.expiry_date).toLocaleDateString('en-PH', {month:'short',day:'numeric',year:'2-digit'})}</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary" style={{marginTop:'12px', width:'100%'}} onClick={() => onNavigate('inventory')}>
            View All Inventory →
          </button>
        </div>

        <div className="card">
          <div className="section-title">Category Breakdown</div>
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {Object.entries(stats.categoryDistribution)
              .sort((a,b) => b[1]-a[1])
              .map(([cat, count]) => (
              <div key={cat} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px'}}>
                <span style={{color:'var(--text-2)', flex:1}}>{cat}</span>
                <div style={{
                  height:'6px', width:`${(count/stats.totalItems)*100}%`,
                  background:'var(--accent)', borderRadius:'3px', minWidth:'20px',
                  opacity: 0.6 + (count/stats.totalItems)*0.4
                }}></div>
                <span style={{color:'var(--text-3)', fontFamily:'var(--mono)', fontSize:'11px', width:'20px', textAlign:'right'}}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Top Medicines by Inventory Value</div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Medicine</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {topByValue.map((m, i) => (
              <tr key={m.id}>
                <td><span className="td-mono">{i+1}</span></td>
                <td className="td-name">{m.name}</td>
                <td><span className="badge badge-blue">{m.category}</span></td>
                <td className="td-mono">{m.quantity}</td>
                <td className="td-mono">₱{parseFloat(m.price).toFixed(2)}</td>
                <td className="td-mono" style={{color:'var(--accent)'}}>₱{(m.price * m.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
