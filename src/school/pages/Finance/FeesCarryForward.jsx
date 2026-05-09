import React, { useState } from 'react';
import {
    IconArrowForward, IconCheck, IconSearch,
    IconFilter, IconDatabaseExport, IconClock,
    IconUser, IconChevronRight, IconAlertTriangle,
    IconCalendar, IconHistory, IconArrowRight
} from '@tabler/icons-react';

const FeesCarryForward = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const carryData = [
        { id: 'CF-2023-01', student: 'Rahul Sharma', class: '10-A', prevDue: 15400, carryStatus: 'Initiated' },
        { id: 'CF-2023-02', student: 'Priya Patel', class: '9-B', prevDue: 8200, carryStatus: 'Finalized' },
        { id: 'CF-2023-03', student: 'Amit Kumar', class: '11-A', prevDue: 24500, carryStatus: 'Initiated' },
    ];

    return (
        <div className="ft-page">
            <header className="ft-header">
                <div>
                    <h1 className="ft-title">Academic Due Migration Ledger</h1>
                    <nav style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                        Finance / <span style={{ color: '#3d5ee1' }}>Fees Carry Forward</span>
                    </nav>
                </div>
                <button className="btn-premium btn-premium-primary"><IconArrowForward size={20} /> Initialize Session Migration</button>
            </header>

            <div className="ft-stats-grid">
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#ebfaf2', color: '#28c76f' }}><IconHistory size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹2.45L</div>
                        <div className="ft-stat-label">Last Session Residue</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#eff2ff', color: '#3d5ee1' }}><IconArrowRight size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹1.80L</div>
                        <div className="ft-stat-label">In-Transit Debts</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fff5e6', color: '#ff9f43' }}><IconCheck size={28} /></div>
                    <div>
                        <div className="ft-stat-val">45%</div>
                        <div className="ft-stat-label">Migration Integrity</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ea5455' }}><IconAlertTriangle size={28} /></div>
                    <div>
                        <div className="ft-stat-val">₹65K</div>
                        <div className="ft-stat-label">Stagnant Accounts</div>
                    </div>
                </div>
            </div>

            <div className="ft-command-bar">
                <div className="ft-search-wrap">
                    <IconSearch size={22} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="ft-search-input"
                        placeholder="Search student identity or batch ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select className="fee-select-modern">
                        <option>2023-24 → 2024-25</option>
                        <option>2022-23 → 2023-24</option>
                    </select>
                </div>
            </div>

            <main className="ft-table-card">
                <table className="ft-table">
                    <thead>
                        <tr>
                            <th>Student Identity</th>
                            <th>Class (Origination)</th>
                            <th>Previous Term Due</th>
                            <th>Carry Forward Target</th>
                            <th>Integration Logic</th>
                            <th>Lifecycle Status</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carryData.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div className="student-profile">
                                        <div style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                            <IconUser size={20} color="#94a3b8" />
                                        </div>
                                        <div>
                                            <div className="student-info-name">{r.student}</div>
                                            <div className="student-info-id">{r.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><strong>{r.class}</strong></td>
                                <td><span style={{ fontSize: 16, fontWeight: 900, color: '#3d5ee1' }}>₹{r.prevDue.toLocaleString()}</span></td>
                                <td><span style={{ fontSize: 16, fontWeight: 900 }}>₹{r.prevDue.toLocaleString()}</span></td>
                                <td><span className="ft-code-badge">ADDITIVE_LIABILITY</span></td>
                                <td>
                                    <span className={`status-badge ${r.carryStatus === 'Finalized' ? 'status-paid' : 'status-partial'}`}>
                                        {r.carryStatus}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-circle"><IconDatabaseExport size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default FeesCarryForward;
