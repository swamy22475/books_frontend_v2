import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ExportToolbar from './ExportToolbar';
import './Reports.css';

const FEE_COLUMNS = ['#', 'Adm No', 'Name', 'Class', 'Fee Type', 'Total Fee', 'Paid', 'Balance', 'Pay Date', 'Status'];
const FEE_KEYS = ['sno', 'admNo', 'name', 'class', 'feeType', 'totalFee', 'paid', 'balance', 'payDate', 'status'];

const feeData = Array.from({ length: 40 }, (_, i) => ({
    sno: i + 1,
    admNo: `2024/${String(1001 + i).padStart(4, '0')}`,
    name: ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer'][i % 8],
    class: ['V', 'VI', 'VII', 'VIII', 'IX', 'X'][i % 6],
    section: ['A', 'B', 'C'][i % 3],
    feeType: ['Tuition Fee', 'Transport', 'Hostel', 'Sports', 'Library'][i % 5],
    totalFee: (8000 + (i % 5) * 2000),
    paid: (8000 + (i % 5) * 2000) - (i % 3 === 0 ? (2000 + i * 100) : 0),
    balance: i % 3 === 0 ? (2000 + i * 100) : 0,
    payDate: i % 3 === 0 ? '—' : `${(i % 28) + 1}/02/2025`,
    status: i % 3 === 0 ? 'Pending' : 'Paid',
}));

const chartData = [
    { month: 'Apr', collected: 320000, due: 90000 },
    { month: 'May', collected: 380000, due: 70000 },
    { month: 'Jun', collected: 290000, due: 105000 },
    { month: 'Jul', collected: 420000, due: 30000 },
    { month: 'Aug', collected: 460000, due: 20000 },
    { month: 'Sep', collected: 390000, due: 40000 },
    { month: 'Oct', collected: 480000, due: 30000 },
    { month: 'Nov', collected: 350000, due: 50000 },
    { month: 'Dec', collected: 310000, due: 65000 },
    { month: 'Jan', collected: 440000, due: 30000 },
    { month: 'Feb', collected: 482300, due: 22700 },
];

const COLORS = ['#3d5ee1', '#28c76f', '#ff9f43', '#ea5455', '#7367f0'];

const FeesReport = () => {
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');
    const perPage = 10;
    const filtered = feeData.filter(f => {
        const matchStatus = !filterStatus || f.status === filterStatus;
        const matchPeriod = !filterPeriod || (filterPeriod === 'Today' && f.sno % 7 === 1) || (filterPeriod === 'This Week' && f.sno % 3 !== 0) || (filterPeriod === 'This Month' && f.sno % 2 !== 0) || filterPeriod === 'This Year';
        return matchStatus && matchPeriod;
    });
    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    const totalCollected = filtered.reduce((a, f) => a + f.paid, 0);
    const totalDue = filtered.reduce((a, f) => a + f.balance, 0);

    return (
        <div className="rpt-report-page">
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">Fees Report</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">Fees Report</span>
                    </nav>
                </div>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                    { label: 'Total Fee Collected', val: `₹${totalCollected.toLocaleString()}`, color: '#28c76f', bg: '#e8faf1', icon: '💰' },
                    { label: 'Total Fee Due', val: `₹${totalDue.toLocaleString()}`, color: '#ea5455', bg: '#fce8e8', icon: '⚠️' },
                    { label: 'Total Students', val: filtered.length, color: '#3d5ee1', bg: '#eef1fd', icon: '👨‍🎓' },
                ].map((k, i) => (
                    <div key={i} className="rpt-kpi-card">
                        <div className="rpt-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
                        <div className="rpt-kpi-info">
                            <p className="rpt-kpi-label">{k.label}</p>
                            <h3 className="rpt-kpi-value">{k.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="rpt-card">
                <div className="rpt-card-header">
                    <h5 className="rpt-card-title">Monthly Fee Collection Trend</h5>
                </div>
                <div className="rpt-chart-body">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6e6b7b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6e6b7b' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }} />
                            <Bar dataKey="collected" name="Collected" fill="#3d5ee1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="due" name="Due" fill="#ea5455" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filter + Table */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Criteria</h6>
                <div className="rpt-filter-grid" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                    <div className="rpt-filter-group">
                        <label>Collection Period</label>
                        <select value={filterPeriod} onChange={e => { setFilterPeriod(e.target.value); setPage(1); }}>
                            <option value="">All Time</option>
                            <option value="Today">Today (Daily)</option>
                            <option value="This Week">This Week (Weekly)</option>
                            <option value="This Month">This Month (Monthly)</option>
                            <option value="This Year">This Year (Yearly)</option>
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Status</label>
                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                            <option value="">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="rpt-filter-group" style={{ alignSelf: 'flex-end' }}>
                        <button className="rpt-search-btn">🔍 Search</button>
                    </div>
                </div>
            </div>

            <div className="rpt-table-card">
                <div className="rpt-table-header">
                    <h5 className="rpt-table-title">Fee Details ({filtered.length})</h5>
                    <ExportToolbar columns={FEE_COLUMNS} rows={filtered} rowKeys={FEE_KEYS} title="Fees-Report" />
                </div>
                <div className="rpt-table-wrap">
                    <table className="rpt-table">
                        <thead>
                            <tr>
                                <th>#</th><th>Adm No</th><th>Name</th><th>Class</th>
                                <th>Fee Type</th><th>Total Fee</th><th>Paid</th><th>Balance</th>
                                <th>Pay Date</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map(f => (
                                <tr key={f.sno}>
                                    <td>{f.sno}</td>
                                    <td><strong>{f.admNo}</strong></td>
                                    <td>{f.name}</td>
                                    <td>{f.class}-{f.section}</td>
                                    <td>{f.feeType}</td>
                                    <td>₹{f.totalFee.toLocaleString()}</td>
                                    <td style={{ color: '#28c76f', fontWeight: 600 }}>₹{f.paid.toLocaleString()}</td>
                                    <td style={{ color: f.balance > 0 ? '#ea5455' : '#28c76f', fontWeight: 600 }}>
                                        ₹{f.balance.toLocaleString()}
                                    </td>
                                    <td>{f.payDate}</td>
                                    <td><span className={`rpt-badge ${f.status === 'Paid' ? 'rpt-badge-green' : 'rpt-badge-red'}`}>{f.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="rpt-table-footer">
                    <span>Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
                    <div className="rpt-pagination">
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => Math.abs(n - page) <= 2).map(n => (
                            <button key={n} className={`rpt-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                        ))}
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeesReport;
