import React, { useState, useMemo } from 'react';
import {
    IconReceipt, IconCash, IconCreditCard, IconSearch,
    IconFilter, IconDownload, IconPrinter, IconCircleCheck,
    IconCalendar, IconUser, IconArrowUpRight, IconArrowDownLeft, IconClock
} from '@tabler/icons-react';

const AllTransactions = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const transactions = [
        { id: 'TXN-001', student: 'Rahul Sharma', amount: 45000, date: '2024-11-15', method: 'UPI', status: 'Success' },
        { id: 'TXN-002', student: 'Priya Patel', amount: 30000, date: '2024-11-14', method: 'Cash', status: 'Success' },
        { id: 'TXN-003', student: 'Vikram Singh', amount: 20000, date: '2024-11-12', method: 'Bank Transfer', status: 'Success' },
        { id: 'TXN-004', student: 'Neha Gupta', amount: 40000, date: '2024-11-11', method: 'Cheque', status: 'In-Transit' },
        { id: 'TXN-005', student: 'Amit Kumar', amount: 5000, date: '2024-11-10', method: 'UPI', status: 'Failure' },
    ];

    return (
        <div className="ft-page">
            <header className="ft-header">
                <div>
                    <h1 className="ft-title">Global Transaction Ledger</h1>
                    <nav style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 4 }}>
                        Finance / <span style={{ color: '#3d5ee1' }}>All Transactions</span>
                    </nav>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-premium btn-premium-outline"><IconPrinter size={20} /> Print Daybook</button>
                    <button className="btn-premium btn-premium-primary"><IconDownload size={20} /> Export Audit log</button>
                </div>
            </header>

            <div className="ft-stats-grid">
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#ebfaf2', color: '#28c76f' }}><IconArrowDownLeft size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹9.52L</div>
                        <div className="ft-stat-label">Total Inflow</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#eff2ff', color: '#3d5ee1' }}><IconCircleCheck size={28} /></div>
                    <div>
                        <div className="ft-stat-val">154</div>
                        <div className="ft-stat-label">Cleared TXNs</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fff5e6', color: '#ff9f43' }}><IconClock size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹1.10L</div>
                        <div className="ft-stat-label">Pending Settlements</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ea5455' }}><IconArrowUpRight size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹12.4K</div>
                        <div className="ft-stat-label">Refunding Txns</div>
                    </div>
                </div>
            </div>

            <div className="ft-command-bar">
                <div className="ft-search-wrap">
                    <IconSearch size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="ft-search-input"
                        placeholder="Search by Transaction ID, Reference Number, or Client Identity..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="action-circle"><IconCalendar size={18} /></button>
                    <button className="action-circle"><IconFilter size={18} /></button>
                </div>
            </div>

            <main className="ft-table-card">
                <table className="ft-table">
                    <thead>
                        <tr>
                            <th>TXN Sequence</th>
                            <th>Student Parent Identity</th>
                            <th>Settlement Method</th>
                            <th>Collection Date</th>
                            <th>Amortized Amount</th>
                            <th>Ledger Status</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id}>
                                <td><span className="ft-code-badge" style={{ fontSize: 13, background: '#eff2ff', color: '#3d5ee1' }}>{txn.id}</span></td>
                                <td className="ft-name-cell">{txn.student}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                                        {txn.method === 'UPI' ? <IconCreditCard size={14} /> : <IconCash size={14} />} {txn.method}
                                    </div>
                                </td>
                                <td><span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{txn.date}</span></td>
                                <td><span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>₹{txn.amount.toLocaleString()}</span></td>
                                <td>
                                    <span className={`status-badge ${txn.status === 'Success' ? 'status-paid' : txn.status === 'Failure' ? 'status-overdue' : 'status-partial'}`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="action-circle" title="View Digital Receipt"><IconReceipt size={16} /></button>
                                        <button className="action-circle" title="Print Hardcopy"><IconPrinter size={16} /></button>
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

export default AllTransactions;
