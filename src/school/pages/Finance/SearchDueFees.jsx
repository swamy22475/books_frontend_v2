import React, { useState, useMemo } from 'react';
import {
    IconAlertCircle, IconClock, IconCash, IconPlus,
    IconSearch, IconFilter, IconDownload, IconPrinter,
    IconCurrencyRupee, IconUser, IconMail, IconDeviceMobile
} from '@tabler/icons-react';
import './SearchDueFees.css';

const SearchDueFees = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');

    const dueRecords = [
        { id: 'DUE-901', name: 'Ayush Goel', class: '10-A', amount: 15400, phone: '9876543210', status: 'High', dueSince: '15 Days' },
        { id: 'DUE-902', name: 'Sneha Jain', class: '9-B', amount: 8200, phone: '9876543211', status: 'Medium', dueSince: '10 Days' },
        { id: 'DUE-903', name: 'Manish Verma', class: '11-A', amount: 24500, phone: '9876543212', status: 'Critical', dueSince: '30 Days' },
        { id: 'DUE-904', name: 'Riya Gupta', class: '8-C', amount: 3100, phone: '9876543213', status: 'Low', dueSince: '5 Days' },
    ];

    const stats = [
        { label: 'Total Receivables', val: '₹12.45L', icon: <IconCurrencyRupee size={28} />, color: '#3d5ee1', bg: '#eff2ff' },
        { label: 'Active Defaulters', val: '42 Students', icon: <IconAlertCircle size={28} />, color: '#ea5455', bg: '#fef2f2' },
        { label: 'Estimated Collection', val: '₹8.12L', icon: <IconCash size={28} />, color: '#28c76f', bg: '#ebfaf2' }
    ];

    const filtered = useMemo(() => {
        return dueRecords.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="due-page">
            <header className="due-header">
                <h1 className="due-title">Outstanding Receivables Inquiry</h1>
                <nav style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                    Finance / <span style={{ color: '#3d5ee1' }}>Search Due Fee</span>
                </nav>
            </header>

            <div className="due-grid">
                {stats.map((s, i) => (
                    <div key={i} className="due-card">
                        <div className="due-stat-icon" style={{ backgroundColor: s.bg, color: s.color }}>
                            {s.icon}
                        </div>
                        <div className="due-stat-val">{s.val}</div>
                        <div className="due-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="ft-command-bar" style={{ marginBottom: '1.5rem' }}>
                <div className="ft-search-wrap">
                    <IconSearch size={22} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="ft-search-input"
                        placeholder="Search student identity or admission number..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select className="fee-select-modern">
                        <option>Current Session</option>
                        <option>2023-24</option>
                        <option>2022-23</option>
                    </select>
                    <button className="action-circle"><IconPrinter size={18} /></button>
                </div>
            </div>

            <main className="ft-table-card">
                <table className="ft-table">
                    <thead>
                        <tr>
                            <th>Student Detail</th>
                            <th>Class (Div)</th>
                            <th>Due Since</th>
                            <th>Receivable Amount</th>
                            <th>Risk Level</th>
                            <th>Reminders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div className="student-profile">
                                        <div style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                            <IconUser size={20} color="#94a3b8" />
                                        </div>
                                        <div>
                                            <div className="student-info-name">{r.name}</div>
                                            <div className="student-info-id">{r.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><strong>{r.class}</strong></td>
                                <td><span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{r.dueSince}</span></td>
                                <td><span style={{ fontSize: 16, fontWeight: 900, color: '#ea5455' }}>₹{r.amount.toLocaleString()}</span></td>
                                <td>
                                    <span className={`status-badge ${r.status === 'Critical' ? 'status-overdue' : r.status === 'Medium' ? 'status-partial' : 'status-paid'}`}>
                                        {r.status} Priority
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="action-circle" title="Send SMS reminder"><IconDeviceMobile size={16} /></button>
                                        <button className="action-circle" title="Send Email reminder"><IconMail size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default SearchDueFees;
