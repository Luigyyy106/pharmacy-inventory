import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#00d4aa','#0099ff','#7c5cfc','#ff8c00','#ff4757','#26de81','#fd9644','#45aaf2','#a55eea','#fc5c65'];

const ALGORITHMS = [
  { name: 'Bubble Sort',    time: 'O(n²)',       space: 'O(1)',      best: 'O(n)',       type: 'sort',   notes: 'Simple but slow. Good for teaching.' },
  { name: 'Selection Sort', time: 'O(n²)',       space: 'O(1)',      best: 'O(n²)',      type: 'sort',   notes: 'Minimizes swaps; unstable.' },
  { name: 'Insertion Sort', time: 'O(n²)',       space: 'O(1)',      best: 'O(n)',       type: 'sort',   notes: 'Efficient for small/nearly sorted data.' },
  { name: 'Merge Sort',     time: 'O(n log n)',  space: 'O(n)',      best: 'O(n log n)', type: 'sort',   notes: 'Stable. Good for linked lists.' },
  { name: 'Quick Sort',     time: 'O(n log n)',  space: 'O(log n)',  best: 'O(n log n)', type: 'sort',   notes: 'Fastest in practice for arrays.' },
  { name: 'Heap Sort',      time: 'O(n log n)',  space: 'O(1)',      best: 'O(n log n)', type: 'sort',   notes: 'In-place. Used in priority queues.' },
  { name: 'Linear Search',  time: 'O(n)',        space: 'O(1)',      best: 'O(1)',        type: 'search', notes: 'Works on unsorted data.' },
  { name: 'Binary Search',  time: 'O(log n)',    space: 'O(1)',      best: 'O(1)',        type: 'search', notes: 'Requires sorted array.' },
  { name: 'Min-Heap (PQ)',  time: 'O(log n)',    space: 'O(n)',      best: 'O(1)',        type: 'ds',     notes: 'Used for expiry priority queue.' },
  { name: 'Hash Map',       time: 'O(1)',        space: 'O(n)',      best: 'O(1)',        type: 'ds',     notes: 'O(1) lookup by medicine ID.' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{background:'var(--bg-card2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 14px'}}>
        <div style={{fontWeight:'600', marginBottom:'4px', fontSize:'13px'}}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{fontSize:'12px', color: p.color}}>
            {p.name}: {typeof p.value === 'number' && p.name === 'Value' ? '₱' + p.value.toLocaleString() : p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function Analytics({ stats, medicines }) {
  if (!stats) return <div className="loading"><div className="spinner"></div> Loading analytics...</div>;

  const categoryData = Object.entries(stats.categoryDistribution).map(([name, value]) => ({ name, value }));

  const stockData = [...medicines]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
    .map(m => ({ name: m.name.length > 16 ? m.name.slice(0,16)+'…' : m.name, Quantity: m.quantity }));

  const valueData = [...medicines]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 8)
    .map(m => ({ name: m.name.length > 16 ? m.name.slice(0,16)+'…' : m.name, Value: Math.round(m.price * m.quantity) }));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
      </div>

      <div className="card-grid card-grid-2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="section-title">Top 10 by Stock</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockData} margin={{left:-10}}>
              <XAxis dataKey="name" tick={{fontSize:10, fill:'#5a6478'}} angle={-25} textAnchor="end" height={60}/>
              <YAxis tick={{fontSize:10, fill:'#5a6478'}}/>
              <Tooltip content={<CustomTooltip/>} />
              <Bar dataKey="Quantity" fill="#00d4aa" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">Category Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({value}) => `${value}`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:'11px'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div className="section-title">Top 8 by Inventory Value</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={valueData} margin={{left:10}}>
            <XAxis dataKey="name" tick={{fontSize:10, fill:'#5a6478'}} angle={-20} textAnchor="end" height={55}/>
            <YAxis tick={{fontSize:10, fill:'#5a6478'}}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="Value" fill="#7c5cfc" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Algorithm Complexity Reference</span>
          <span className="count-badge">DSA</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Type</th>
              <th>Best Case</th>
              <th>Average / Worst</th>
              <th>Space</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ALGORITHMS.map(a => (
              <tr key={a.name}>
                <td className="td-name">{a.name}</td>
                <td>
                  <span className={`badge ${a.type === 'sort' ? 'badge-blue' : a.type === 'search' ? 'badge-green' : 'badge-purple'}`}>
                    {a.type}
                  </span>
                </td>
                <td className="td-mono" style={{color:'var(--accent)'}}>{a.best}</td>
                <td className="td-mono">{a.time}</td>
                <td className="td-mono" style={{color:'var(--accent3)'}}>{a.space}</td>
                <td style={{fontSize:'12px', color:'var(--text-3)'}}>{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
