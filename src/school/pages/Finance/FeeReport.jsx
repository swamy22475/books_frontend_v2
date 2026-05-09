import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconCash, IconCheck, IconClock, IconAlertTriangle,
    IconEye, IconPencil, IconCreditCard, IconSearch,
    IconFilter, IconDownload, IconPrinter, IconChevronRight,
    IconRefresh, IconArrowRight, IconTrendingUp, IconUsers,
    IconFileText, IconTable
} from '@tabler/icons-react';
import './FeeReport.css';

const FeeReport = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const stats = [
        {
            label: 'Total Revenue',
            value: '₹7.67L',
            sub: '↑ 12% vs last year',
            icon: <IconTrendingUp size={28} />,
            color: '#3d5ee1',
            bg: '#eff2ff'
        },
        {
            label: 'Collected Today',
            value: '₹52.4K',
            sub: '79% total progress',
            icon: <IconCheck size={28} />,
            color: '#28c76f',
            bg: '#ebfaf2'
        },
        {
            label: 'Pending Invoices',
            value: '₹1.43L',
            sub: '45 active accounts',
            icon: <IconUsers size={28} />,
            color: '#ff9f43',
            bg: '#fff5e6'
        },
        {
            label: 'Overdue Dues',
            value: '₹1.20L',
            sub: '12 critical students',
            icon: <IconAlertTriangle size={28} />,
            color: '#ea5455',
            bg: '#fef2f2'
        },
    ];

    const students = [
        { id: 'STU-2023-001', name: 'Rahul Sharma', class: '10-A', total: 45000, paid: 45000, balance: 0, progress: 100, dueDate: '15 Nov 2024', status: 'Paid', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
        { id: 'STU-2023-002', name: 'Priya Patel', class: '9-B', total: 42000, paid: 30000, balance: 12000, progress: 71, dueDate: '20 Nov 2024', status: 'Partial', image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop' },
        { id: 'STU-2023-003', name: 'Amit Kumar', class: '11-A', total: 48000, paid: 0, balance: 48000, progress: 0, dueDate: '10 Nov 2024', status: 'Overdue', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
        { id: 'STU-2023-004', name: 'Neha Gupta', class: '8-C', total: 40000, paid: 40000, balance: 0, progress: 100, dueDate: '25 Nov 2024', status: 'Paid', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { id: 'STU-2023-005', name: 'Vikram Singh', class: '10-B', total: 45000, paid: 20000, balance: 25000, progress: 44, dueDate: '18 Nov 2024', status: 'Partial', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    ];

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, filterStatus]);

    const getStatusClass = (status) => {
        if (status === 'Paid') return 'status-paid';
        if (status === 'Partial') return 'status-partial';
        return 'status-overdue';
    };

    const getProgressColor = (progress) => {
        if (progress === 100) return '#28c76f';
        if (progress > 50) return '#ff9f43';
        return '#ea5455';
    };

    return (
        <div className="fee-page">
            <header className="fee-page-header">
                <div>
                    <h1 className="fee-page-title">Collect Fee</h1>
                    <nav className="fee-breadcrumb">
                        Dashboard / <span className="fee-breadcrumb-current">Collect Fee</span>
                    </nav>
                </div>
                <div className="fee-header-actions">
                    <button className="btn-premium btn-premium-outline">
                        <IconDownload size={20} /> Export Excel
                    </button>
                    <button className="btn-premium btn-premium-primary" onClick={() => navigate('/school/finance/collect-fees/bulk')}>
                        <IconArrowRight size={20} /> Direct Collection
                    </button>
                </div>
            </header>

            <section className="fee-stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="fee-stat-card">
                        <div className="fee-stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="fee-stat-content">
                            <p className="fee-stat-label">{stat.label}</p>
                            <h3 className="fee-stat-value">{stat.value}</h3>
                            <div className="fee-stat-sub">
                                {stat.sub}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <div className="fee-filter-bar">
                <div className="fee-search-group">
                    <IconSearch size={22} className="fee-search-icon" />
                    <input
                        type="text"
                        placeholder="Scan Student ID or Search by Name..."
                        className="fee-search-input"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="fee-filter-actions">
                    <select
                        className="fee-select-modern"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid Only</option>
                        <option value="Partial">Partial Dues</option>
                        <option value="Overdue">Overdue Alerts</option>
                    </select>
                    <button className="action-circle" onClick={() => { setSearchQuery(''); setFilterStatus('All'); }}>
                        <IconRefresh size={18} />
                    </button>
                </div>
            </div>

            <main className="fee-table-card">
                <div className="fee-table-header">
                    <h5 className="fee-table-title">Recent Fee Invoices</h5>
                    <div className="ft-export-buttons">
                        <button className="ft-export-btn"><IconFileText /> Copy</button>
                        <button className="ft-export-btn"><IconDownload /> CSV</button>
                        <button className="ft-export-btn"><IconTable /> Excel</button>
                        <button className="ft-export-btn"><IconFileText color="#ea5455" /> PDF</button>
                        <button className="ft-export-btn"><IconPrinter /> Print</button>
                    </div>
                </div>
                <div className="fee-table-container">
                    <table className="fee-table">
                        <thead>
                            <tr>
                                <th>Student Detail</th>
                                <th>Class</th>
                                <th>Total Fee</th>
                                <th>Collected</th>
                                <th>Balance</th>
                                <th>Progress</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="student-profile">
                                            <img src={student.image} alt="" className="student-img" />
                                            <div>
                                                <div className="student-info-name">{student.name}</div>
                                                <div className="student-info-id">{student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>{student.class}</span></td>
                                    <td><span style={{ fontWeight: 700 }}>₹{student.total.toLocaleString()}</span></td>
                                    <td><span style={{ color: 'var(--f-success)', fontWeight: 700 }}>₹{student.paid.toLocaleString()}</span></td>
                                    <td><span style={{ color: 'var(--f-danger)', fontWeight: 700 }}>₹{student.balance.toLocaleString()}</span></td>
                                    <td>
                                        <div style={{ width: 100 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span style={{ fontSize: 10, fontWeight: 900 }}>{student.progress}%</span>
                                            </div>
                                            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${student.progress}%`,
                                                    height: '100%',
                                                    background: getProgressColor(student.progress),
                                                    borderRadius: 4
                                                }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{student.dueDate}</span></td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                className="action-circle"
                                                style={{ background: 'var(--f-primary-light)', color: 'var(--f-primary)' }}
                                                onClick={() => navigate(`/school/finance/collect-fees/${student.id}`)}
                                            >
                                                <IconCreditCard size={16} />
                                            </button>
                                            <button className="action-circle" onClick={() => navigate(`/school/student-profile/${student.id}`)}><IconEye size={16} /></button>
                                            <button className="action-circle" onClick={() => navigate(`/school/finance/assign-fees/edit/${student.id}`)}><IconPencil size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default FeeReport;
