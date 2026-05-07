import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import ExportToolbar from './ExportToolbar';
import './Reports.css';

const SAL_COLUMNS = ['#', 'Emp ID', 'Name', 'Designation', 'Basic', 'HRA', 'Allowances', 'Deductions', 'Net Pay', 'Status'];
const SAL_KEYS = ['sno', 'empId', 'name', 'designation', 'basic', 'hra', 'allowances', 'deductions', 'net', 'status'];

const salaryData = Array.from({ length: 30 }, (_, i) => ({
    sno: i + 1,
    empId: `EMP${String(100 + i).padStart(4, '0')}`,
    name: ['Rajesh Kumar', 'Seetha Lakshmi', 'Anil Verma', 'Priya Nair', 'Suresh Babu', 'Meena Kumari', 'Venkat Rao'][i % 7],
    designation: ['Teacher', 'HOD', 'Principal', 'Accountant', 'Librarian', 'Lab Asst', 'Admin'][i % 7],
    department: ['Science', 'Maths', 'Management', 'Finance', 'Library', 'IT', 'Admin'][i % 7],
    basic: 25000 + (i % 5) * 5000,
    hra: 8000 + (i % 3) * 2000,
    allowances: 3000 + (i % 4) * 1000,
    deductions: 2500 + (i % 3) * 500,
    net: 33000 + (i % 5) * 6000,
    month: 'February 2025',
    status: i % 6 === 0 ? 'Pending' : 'Paid',
}));

const deptWiseData = [
    { dept: 'Science', total: 185000, count: 5 },
    { dept: 'Maths', total: 172000, count: 4 },
    { dept: 'English', total: 145000, count: 4 },
    { dept: 'Social', total: 128000, count: 3 },
    { dept: 'Computer', total: 160000, count: 4 },
    { dept: 'Admin', total: 210000, count: 6 },
];

const payrollPie = [
    { name: 'Paid', value: 25, color: '#28c76f' },
    { name: 'Pending', value: 5, color: '#ea5455' },
];

const SalaryReport = () => {
    const [page, setPage] = useState(1);
    const [filterDept, setFilterDept] = useState('');
    const perPage = 8;
    const filtered = salaryData.filter(s => !filterDept || s.department === filterDept);
    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    const totalNet = filtered.reduce((a, s) => a + s.net, 0);

    return (
        <div className="rpt-report-page">
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">Salary Report</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">Salary Report</span>
                    </nav>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {[
                    { label: 'Total Payroll', val: `₹${totalNet.toLocaleString()}`, color: '#3d5ee1', bg: '#eef1fd', icon: '💰' },
                    { label: 'Total Staff', val: filtered.length, color: '#28c76f', bg: '#e8faf1', icon: '👩‍💼' },
                    { label: 'Paid This Month', val: `₹${(totalNet * 0.85).toFixed(0) / 1}`, color: '#28c76f', bg: '#e8faf1', icon: '✅' },
                    { label: 'Pending', val: '5 Staff', color: '#ea5455', bg: '#fce8e8', icon: '⚠️' },
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

            {/* Charts row */}
            <div className="rpt-row rpt-row-2">
                <div className="rpt-card">
                    <div className="rpt-card-header"><h5 className="rpt-card-title">Dept-wise Salary Expense</h5></div>
                    <div className="rpt-chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={deptWiseData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6e6b7b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6e6b7b' }} tickFormatter={v => `₹${v / 1000}k`} />
                                <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, '']} />
                                <Bar dataKey="total" name="Salary" radius={[4, 4, 0, 0]}>
                                    {deptWiseData.map((_, idx) => (
                                        <Cell key={idx} fill={['#3d5ee1', '#28c76f', '#ff9f43', '#ea5455', '#7367f0', '#00cfe8'][idx % 6]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="rpt-card">
                    <div className="rpt-card-header"><h5 className="rpt-card-title">Payroll Status</h5></div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={payrollPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                                    {payrollPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [v + ' staff', '']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend" style={{ marginTop: 8 }}>
                            {payrollPie.map((p, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: p.color }}></span>
                                    <span>{p.name}</span>
                                    <strong>{p.value} staff</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="rpt-filter-card">
                <div className="rpt-filter-grid">
                    <div className="rpt-filter-group">
                        <label>Department</label>
                        <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }}>
                            <option value="">All</option>
                            {['Science', 'Maths', 'Management', 'Finance', 'Library', 'IT', 'Admin'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Month</label>
                        <input type="month" defaultValue="2025-02" />
                    </div>
                    <div className="rpt-filter-group" style={{ alignSelf: 'flex-end' }}>
                        <button className="rpt-search-btn">🔍 Search</button>
                    </div>
                </div>
            </div>

            <div className="rpt-table-card">
                <div className="rpt-table-header">
                    <h5 className="rpt-table-title">Salary Details ({filtered.length})</h5>
                    <ExportToolbar columns={SAL_COLUMNS} rows={filtered} rowKeys={SAL_KEYS} title="Salary-Report" />
                </div>
                <div className="rpt-table-wrap">
                    <table className="rpt-table">
                        <thead>
                            <tr>
                                <th>#</th><th>Emp ID</th><th>Name</th><th>Designation</th>
                                <th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th>
                                <th>Net Pay</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map(s => (
                                <tr key={s.sno}>
                                    <td>{s.sno}</td>
                                    <td><strong>{s.empId}</strong></td>
                                    <td>{s.name}</td>
                                    <td>{s.designation}</td>
                                    <td>₹{s.basic.toLocaleString()}</td>
                                    <td>₹{s.hra.toLocaleString()}</td>
                                    <td>₹{s.allowances.toLocaleString()}</td>
                                    <td style={{ color: '#ea5455' }}>-₹{s.deductions.toLocaleString()}</td>
                                    <td style={{ color: '#28c76f', fontWeight: 700 }}>₹{s.net.toLocaleString()}</td>
                                    <td><span className={`rpt-badge ${s.status === 'Paid' ? 'rpt-badge-green' : 'rpt-badge-red'}`}>{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="rpt-table-footer">
                    <span>Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
                    <div className="rpt-pagination">
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={n} className={`rpt-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                        ))}
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryReport;
