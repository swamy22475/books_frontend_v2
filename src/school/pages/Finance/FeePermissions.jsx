import React, { useState } from 'react';
import {
    IconShieldLock, IconLock, IconShieldCheck, IconSearch,
    IconFilter, IconDownload, IconPrinter, IconUserShield,
    IconCalendar, IconUser, IconKey, IconAccessible
} from '@tabler/icons-react';

const FeePermissions = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const staffRoles = [
        { id: 'STF-501', name: 'Alok Gupta', role: 'Head Accountant', access: 'Admin', collections: 'Enabled', types: 'Enabled', settings: 'Enabled' },
        { id: 'STF-502', name: 'Sarita Devi', role: 'Cashier (A)', access: 'Standard', collections: 'Enabled', types: 'Disabled', settings: 'Disabled' },
        { id: 'STF-503', name: 'Rahul Varma', role: 'Clerk (Junior)', access: 'View Only', collections: 'Disabled', types: 'Disabled', settings: 'Disabled' },
        { id: 'STF-504', name: 'Pooja Singh', role: 'Billing Manager', access: 'Standard', collections: 'Enabled', types: 'Enabled', settings: 'Disabled' },
    ];

    return (
        <div className="ft-page">
            <header className="ft-header">
                <div>
                    <h1 className="ft-title">Finance Module RBAC Core</h1>
                    <nav style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                        Finance / <span style={{ color: '#3d5ee1' }}>Fee Permissions</span>
                    </nav>
                </div>
                <button className="btn-premium btn-premium-primary"><IconShieldLock size={20} /> Deploy Access Policy</button>
            </header>

            <div className="ft-stats-grid">
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#eff2ff', color: '#3d5ee1' }}><IconUserShield size={28} /></div>
                    <div>
                        <div className="ft-stat-val">12</div>
                        <div className="ft-stat-label">Authorized Staff</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#ebfaf2', color: '#28c76f' }}><IconKey size={28} /></div>
                    <div>
                        <div className="ft-stat-val">3</div>
                        <div className="ft-stat-label">Active Modules</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fff5e6', color: '#ff9f43' }}><IconLock size={28} /></div>
                    <div>
                        <div className="ft-stat-val">Enabled</div>
                        <div className="ft-stat-label">Security Protocol</div>
                    </div>
                </div>
                <div className="ft-stat-card">
                    <div className="ft-stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ea5455' }}><IconAccessible size={28} /></div>
                    <div>
                        <div className="ft-stat-val">Critical</div>
                        <div className="ft-stat-label">Access Sensitivity</div>
                    </div>
                </div>
            </div>

            <div className="ft-command-bar">
                <div className="ft-search-wrap">
                    <IconSearch size={22} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="ft-search-input"
                        placeholder="Search by staff identity or designated role..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select className="fee-select-modern">
                        <option>Administration</option>
                        <option>AccountingDept</option>
                        <option>Receptionist</option>
                    </select>
                </div>
            </div>

            <main className="ft-table-card">
                <table className="ft-table">
                    <thead>
                        <tr>
                            <th>Staff Identity</th>
                            <th>Designated Role</th>
                            <th>Global Access Level</th>
                            <th>Collection Rights</th>
                            <th>Billing Config Rights</th>
                            <th>System Settings</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffRoles.map(s => (
                            <tr key={s.id}>
                                <td>
                                    <div className="student-profile">
                                        <div style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                            <IconUser size={20} color="#94a3b8" />
                                        </div>
                                        <div>
                                            <div className="student-info-name">{s.name}</div>
                                            <div className="student-info-id">{s.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="ft-code-badge" style={{ background: '#f8fafc', color: '#64748b' }}>{s.role}</span></td>
                                <td><span className="ft-name-cell">{s.access}</span></td>
                                <td>
                                    <span className={`status-badge ${s.collections === 'Enabled' ? 'status-paid' : 'status-overdue'}`}>
                                        {s.collections}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${s.types === 'Enabled' ? 'status-paid' : 'status-overdue'}`}>
                                        {s.types}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${s.settings === 'Enabled' ? 'status-paid' : 'status-overdue'}`}>
                                        {s.settings}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-circle"><IconLock size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default FeePermissions;
