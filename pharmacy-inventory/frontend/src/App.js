import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import MedicineList from './components/MedicineList';
import MedicineForm from './components/MedicineForm';
import StockManager from './components/StockManager';
import Analytics from './components/Analytics';
import Transactions from './components/Transactions';
import './App.css';

const API = 'http://localhost:5001/api';

function App() {
  const [page, setPage] = useState('dashboard');
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [stockTarget, setStockTarget] = useState(null);

  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [algorithm, setAlgorithm] = useState('quick');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAlgo, setSearchAlgo] = useState('linear');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sortBy, order, algorithm, searchAlgo, category: categoryFilter };
      if (searchQuery) params.search = searchQuery;
      const res = await axios.get(`${API}/medicines`, { params });
      setMedicines(res.data.data);
    } catch (err) {
      notify('Failed to fetch medicines', 'error');
    }
    setLoading(false);
  }, [sortBy, order, algorithm, searchQuery, searchAlgo, categoryFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/medicines/analytics/stats`);
      setStats(res.data.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/medicines/${id}`);
      notify(`"${name}" deleted successfully`);
      fetchMedicines();
      fetchStats();
    } catch (err) {
      notify('Failed to delete medicine', 'error');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingMedicine) {
        await axios.put(`${API}/medicines/${editingMedicine.id}`, data);
        notify('Medicine updated successfully!');
      } else {
        await axios.post(`${API}/medicines`, data);
        notify('Medicine added successfully!');
      }
      setEditingMedicine(null);
      setPage('inventory');
      fetchMedicines();
      fetchStats();
    } catch (err) {
      notify(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleStockUpdate = async (id, type, quantity, note) => {
    try {
      await axios.post(`${API}/medicines/${id}/stock`, { type, quantity, note });
      notify('Stock updated successfully!');
      setStockTarget(null);
      fetchMedicines();
      fetchStats();
    } catch (err) {
      notify(err.response?.data?.message || 'Stock update failed', 'error');
    }
  };

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',    icon: '⬡' },
    { id: 'inventory',    label: 'Inventory',    icon: '⊟' },
    { id: 'analytics',   label: 'Analytics',    icon: '◈' },
    { id: 'transactions', label: 'Transactions', icon: '⟳' },
    { id: 'add',          label: 'Add Medicine', icon: '+' },
  ];

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.msg}
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">Rx</div>
          <div className="brand-text">
            <span className="brand-name">PharmaDSA</span>
            <span className="brand-sub">Inventory System</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id || (item.id === 'add' && page === 'edit') ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'add') setEditingMedicine(null);
                setPage(item.id === 'add' ? 'add' : item.id);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {stats && (
            <>
              <div className="footer-stat">
                <span className="stat-dot green"></span>
                <span>{stats.totalItems} Medicines</span>
              </div>
              {stats.lowStockCount > 0 && (
                <div className="footer-stat">
                  <span className="stat-dot orange"></span>
                  <span>{stats.lowStockCount} Low Stock</span>
                </div>
              )}
              {stats.expiringSoonCount > 0 && (
                <div className="footer-stat">
                  <span className="stat-dot red"></span>
                  <span>{stats.expiringSoonCount} Expiring Soon</span>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && (
          <Dashboard stats={stats} medicines={medicines} onNavigate={setPage} />
        )}
        {page === 'inventory' && (
          <MedicineList
            medicines={medicines}
            loading={loading}
            sortBy={sortBy} setSortBy={setSortBy}
            order={order} setOrder={setOrder}
            algorithm={algorithm} setAlgorithm={setAlgorithm}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchAlgo={searchAlgo} setSearchAlgo={setSearchAlgo}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            onEdit={(m) => { setEditingMedicine(m); setPage('edit'); }}
            onDelete={handleDelete}
            onStock={(m) => setStockTarget(m)}
          />
        )}
        {(page === 'add' || page === 'edit') && (
          <MedicineForm
            medicine={editingMedicine}
            onSubmit={handleFormSubmit}
            onCancel={() => { setEditingMedicine(null); setPage('inventory'); }}
          />
        )}
        {page === 'analytics' && <Analytics stats={stats} medicines={medicines} />}
        {page === 'transactions' && <Transactions API={API} />}
      </main>

      {stockTarget && (
        <StockManager
          medicine={stockTarget}
          onSubmit={handleStockUpdate}
          onClose={() => setStockTarget(null)}
        />
      )}
    </div>
  );
}

export default App;
