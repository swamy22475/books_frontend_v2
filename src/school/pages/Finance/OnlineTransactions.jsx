import React, { useState } from 'react';
import {
    IconGlobe, IconCreditCard, IconSearch,
    IconFilter, IconDownload, IconPrinter, IconCircleCheck,
    IconCalendar, IconUser, IconExternalLink, IconAlertTriangle
} from '@tabler/icons-react';

const OnlineTransactions = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const transactions = [
        { id: 'PAY-W01', student: 'Rahul Sharma', amount: 45000, date: '2024-11-15', gateway: 'Razorpay', status: 'Success', refId: 'rzp_live_8g7fs3g' },
        { id: 'PAY-W02', student: 'Priya Patel', amount: 30000, date: '2024-11-14', gateway: 'Stripe', status: 'Success', refId: 'pi_3P5g8fB7' },
        { id: 'PAY-W03', student: 'Vikram Singh', amount: 20000, date: '2024-11-12', gateway: 'Razorpay', status: 'Pending', refId: 'rzp_live_9h2kd1m' },
        { id: 'PAY-W04', student: 'Neha Gupta', amount: 40000, date: '2024-11-11', gateway: 'Paytm', status: 'Failed', refId: 'ptm_2281903' },
    ];

    return (
        <div className="ft-page">
            <header className="ft-header">
                <div>
                    <h1 className="ft-title">Digital Payment Gateway Audit</h1>
                    <nav style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                        Finance / <span style={{ color: '#3d5ee1' }}>Online Transactions</span>
                    </nav>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-premium btn-premium-outline"><IconPrinter size={20} /> Gateway Reconciliation</button>
                    <button className="btn-premium btn-premium-primary"><IconGlobe size={20} /> Live Monitoring</button>
                </div>
            </header>

            <div className="ft-stats-grid">
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#ebfaf2', color: '#28c76f' }}><IconGlobe size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹42.8L</div>
                        <div className="ft-stat-label">Total Online Volume</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#eff2ff', color: '#3d5ee1' }}><IconCreditCard size={28} /></div>
                    <div>
                        <div className="ft-stat-val">91.2%</div>
                        <div className="ft-stat-label">Success Rate</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fff5e6', color: '#ff9f43' }}><IconAlertTriangle size={28} /></div>
                    <div>
                        <div className="ft-stat-val">12</div>
                        <div className="ft-stat-label">Disputed Invoices</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ea5455' }}><IconDownload size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹5.4K</div>
                        <div className="ft-stat-label">In-Transit Fees</div>
                    </div>
                </div>
            </div>

            <div className="ft-command-bar">
                <div className="ft-search-wrap">
                    <IconSearch size={22} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="ft-search-input"
                        placeholder="Search Gateway ID, Bank Ref, or Student ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select className="fee-select-modern">
                        <option>All Gateways</option>
                        <option>Razorpay</option>
                        <option>Stripe</option>
                        <option>Paytm</option>
                    </select>
                </div>
            </div>

            <main className="ft-table-card">
                <table className="ft-table">
                    <thead>
                        <tr>
                            <th>Gateway Payload</th>
                            <th>Beneficiary Identity</th>
                            <th>Processing Platform</th>
                            <th>Settlement Amnt</th>
                            <th>Reference ID</th>
                            <th>Status Matrix</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id}>
                                <td><span className="ft-code-badge" style={{ fontSize: 13 }}>{txn.id}</span></td>
                                <td className="ft-name-cell">{txn.student}</td>
                                <td>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{txn.gateway}</div>
                                </td>
                                <td><span style={{ fontSize: 16, fontWeight: 900 }}>₹{txn.amount.toLocaleString()}</span></td>
                                <td><span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{txn.refId}</span></td>
                                <td>
                                    <span className={`status-badge ${txn.status === 'Success' ? 'status-paid' : txn.status === 'Failed' ? 'status-overdue' : 'status-partial'}`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-circle"><IconExternalLink size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default OnlineTransactions;
