import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Download, Users, Briefcase, Filter, Clock, CheckCircle2, XCircle } from 'lucide-react';
import './Reports.css';

const AttendanceReport = () => {
    const [persona, setPersona] = useState('Students'); // Students, Teachers, Staff
    const [activeTab, setActiveTab] = useState('Attendance Report');
    const [viewMode, setViewMode] = useState('Month'); // Day, Week, Month
    const [filterClass, setFilterClass] = useState('Class 7');
    const [searchTerm, setSearchTerm] = useState('');

    // Generate 30 days of dummy data
    const generateDaily = () => {
        const statuses = ['P', 'P', 'P', 'P', 'P', 'P', 'A', 'L', 'H', 'F'];
        return Array.from({ length: 30 }).map(() => statuses[Math.floor(Math.random() * statuses.length)]);
    };

    // Dummy data for the table - loosely based on Image 2
    const students = [
        { id: 1, name: 'Gifford', pct: 45, p: 16, l: 2, a: 1, h: 6, f: 1, daily: generateDaily() },
        { id: 2, name: 'Janet', pct: 100, p: 24, l: 0, a: 0, h: 6, f: 0, daily: generateDaily() },
        { id: 3, name: 'Joann', pct: 94, p: 23, l: 1, a: 3, h: 6, f: 1, daily: generateDaily() },
        { id: 4, name: 'Julie', pct: 99, p: 22, l: 0, a: 4, h: 6, f: 2, daily: generateDaily() },
        { id: 5, name: 'Michael', pct: 88, p: 20, l: 3, a: 2, h: 6, f: 1, daily: generateDaily() },
        { id: 6, name: 'Sarah', pct: 92, p: 21, l: 1, a: 1, h: 6, f: 1, daily: generateDaily() },
        { id: 7, name: 'Robert', pct: 75, p: 15, l: 5, a: 5, h: 6, f: 0, daily: generateDaily() },
        { id: 8, name: 'Emily', pct: 96, p: 22, l: 1, a: 0, h: 6, f: 1, daily: generateDaily() },
    ];

    const getDotColor = (status) => {
        switch (status) {
            case 'P': return '#28c76f'; // Present - Green
            case 'A': return '#ea5455'; // Absent - Red
            case 'L': return '#00cfe8'; // Late - Light Blue
            case 'H': return '#3d5ee1'; // Halfday/Holiday - Blue
            case 'F': return '#333448'; // Holiday - Dark
            default: return '#eee';
        }
    };

    const daysCount = viewMode === 'Day' ? 1 : viewMode === 'Week' ? 7 : 30;

    return (
        <div className="rpt-report-page">
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">Attendance Report</h4>
                    <nav className="rpt-breadcrumb" style={{ display: 'flex', gap: '5px' }}>
                        <Link to="/school/dashboard">Dashboard</Link> <span>/</span>
                        <Link to="/school/reports">Report</Link> <span>/</span>
                        <span className="rpt-breadcrumb-current">{activeTab}</span>
                    </nav>
                </div>
                <div className="rpt-header-actions">
                    <div className="rpt-tabs" style={{ background: '#f0f2f7', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px', marginRight: '10px' }}>
                        {['Day', 'Week', 'Month'].map(m => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: viewMode === m ? '#fff' : 'transparent',
                                    color: viewMode === m ? '#3d5ee1' : '#666',
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    boxShadow: viewMode === m ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <button className="rpt-period-btn"><Calendar size={14} /> Academic Year : 2024 / 2025</button>
                    <button className="rpt-export-btn"><Download size={14} /> Export</button>
                </div>
            </div>

            {/* Persona Tabs - Matches Image 2 style */}
            <div className="rpt-tabs-container" style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                <div className="rpt-tabs" style={{ display: 'flex', gap: '30px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {['Attendance Report', 'Students Attendance Type', 'Daily Attendance', 'Student Day Wise', 'Teacher Day Wise', 'Teacher Report', 'Staff Day Wise', 'Staff Report'].map(t => (
                        <div key={t}
                            onClick={() => setActiveTab(t)}
                            className={`rpt-tab-item ${t === activeTab ? 'active' : ''}`}
                            style={{
                                padding: '10px 0',
                                fontSize: '14px',
                                color: t === activeTab ? '#3d5ee1' : '#666',
                                fontWeight: t === activeTab ? '600' : '400',
                                borderBottom: t === activeTab ? '2px solid #3d5ee1' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                            {t}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend - Matches Image 2 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Present', color: '#28c76f', icon: <CheckCircle2 size={12} /> },
                    { label: 'Absent', color: '#ea5455', icon: <XCircle size={12} /> },
                    { label: 'Late', color: '#00cfe8', icon: <Clock size={12} /> },
                    { label: 'Halfday', color: '#3d5ee1', icon: <Calendar size={12} /> },
                    { label: 'Holiday', color: '#333448', icon: <Calendar size={12} /> },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #eee', fontSize: '12px', color: '#555' }}>
                        <span style={{ color: l.color }}>{l.icon}</span> {l.label}
                    </div>
                ))}
            </div>

            {/* Summary Row - Matches Image 1 */}
            <div className="rpt-attendance-summary-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {/* Student Attendance */}
                <div className="rpt-summary-card" style={{ background: '#fff', border: '1px solid #eef0f4', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3d5ee1', fontWeight: '600' }}>
                            <Users size={18} /> Student Attendance - Today
                        </div>
                        <span style={{ background: '#3d5ee110', color: '#3d5ee1', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>Tue, 13 Jan</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Total', val: '900', bg: '#f8f9fc' },
                            { label: 'Present', val: '834', color: '#28c76f', bg: '#e8faf1' },
                            { label: 'Absent', val: '48', color: '#ea5455', bg: '#fff5f5' },
                            { label: 'Leave', val: '18', color: '#ff9f43', bg: '#fffaf0' },
                        ].map(s => (
                            <div key={s.label} style={{ background: s.bg, padding: '12px 5px', borderRadius: '12px', textAlign: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: s.color || '#333' }}>{s.val}</h3>
                                <p style={{ margin: 0, fontSize: '11px', color: '#999', marginTop: '4px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#999' }}>Attendance Progress</span>
                            <span style={{ fontWeight: '700', color: '#28c76f' }}>93%</span>
                        </div>
                        <div style={{ height: '6px', background: '#f0f2f7', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '93%', height: '100%', background: '#28c76f' }}></div>
                        </div>
                    </div>
                </div>

                {/* Teacher Attendance */}
                <div className="rpt-summary-card" style={{ background: '#fff', border: '1px solid #eef0f4', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff9f43', fontWeight: '600' }}>
                            <Users size={18} /> Teacher Attendance - Today
                        </div>
                        <span style={{ background: '#ff9f4310', color: '#ff9f43', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>Tue, 13 Jan</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Total', val: '85', bg: '#f8f9fc' },
                            { label: 'Present', val: '78', color: '#28c76f', bg: '#e8faf1' },
                            { label: 'Absent', val: '4', color: '#ea5455', bg: '#fff5f5' },
                            { label: 'Leave', val: '3', color: '#ff9f43', bg: '#fffaf0' },
                        ].map(s => (
                            <div key={s.label} style={{ background: s.bg, padding: '12px 5px', borderRadius: '12px', textAlign: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: s.color || '#333' }}>{s.val}</h3>
                                <p style={{ margin: 0, fontSize: '11px', color: '#999', marginTop: '4px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#999' }}>Attendance Progress</span>
                            <span style={{ fontWeight: '700', color: '#ff9f43' }}>91%</span>
                        </div>
                        <div style={{ height: '6px', background: '#f0f2f7', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '91%', height: '100%', background: '#ff9f43' }}></div>
                        </div>
                    </div>
                </div>

                {/* Staff Attendance */}
                <div className="rpt-summary-card" style={{ background: '#fff', border: '1px solid #eef0f4', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7367f0', fontWeight: '600' }}>
                            <Briefcase size={18} /> Staff Attendance - Today
                        </div>
                        <span style={{ background: '#7367f010', color: '#7367f0', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>Tue, 13 Jan</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Total', val: '55', bg: '#f8f9fc' },
                            { label: 'Present', val: '51', color: '#28c76f', bg: '#e8faf1' },
                            { label: 'Absent', val: '2', color: '#ea5455', bg: '#fff5f5' },
                            { label: 'Leave', val: '2', color: '#ff9f43', bg: '#fffaf0' },
                        ].map(s => (
                            <div key={s.label} style={{ background: s.bg, padding: '12px 5px', borderRadius: '12px', textAlign: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: s.color || '#333' }}>{s.val}</h3>
                                <p style={{ margin: 0, fontSize: '11px', color: '#999', marginTop: '4px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#999' }}>Attendance Progress</span>
                            <span style={{ fontWeight: '700', color: '#7367f0' }}>93%</span>
                        </div>
                        <div style={{ height: '6px', background: '#f0f2f7', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '93%', height: '100%', background: '#7367f0' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Report Table Card */}
            <div className="rpt-card" style={{ marginTop: '20px' }}>
                <div className="rpt-card-header" style={{ borderBottom: 'none', paddingBottom: '10px' }}>
                    <h5 className="rpt-card-title">{activeTab} Details</h5>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="rpt-btn-outline"><Calendar size={14} /> 02/21/2026 - 02/27/2026</button>
                        <button className="rpt-btn-outline"><Filter size={14} /> Filter</button>
                        <button className="rpt-btn-outline">Sort by A-Z</button>
                    </div>
                </div>

                {/* Person Selection Checkboxes as requested */}
                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
                            <input
                                type="checkbox"
                                checked={persona === 'Students'}
                                onChange={() => setPersona('Students')}
                                style={{ accentColor: '#3d5ee1', width: '16px', height: '16px' }}
                            /> Student
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
                            <input
                                type="checkbox"
                                checked={persona === 'Teachers'}
                                onChange={() => setPersona('Teachers')}
                                style={{ accentColor: '#3d5ee1', width: '16px', height: '16px' }}
                            /> Teacher
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
                            <input
                                type="checkbox"
                                checked={persona === 'Staff'}
                                onChange={() => setPersona('Staff')}
                                style={{ accentColor: '#3d5ee1', width: '16px', height: '16px' }}
                            /> Staff
                        </label>
                    </div>

                    {persona === 'Students' && (
                        <div style={{ minWidth: '150px' }}>
                            <select className="rpt-select" style={{ width: '100%', padding: '8px', borderRadius: '8px' }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                                <option value="Class 7">Class 7</option>
                                <option value="Class 8">Class 8</option>
                                <option value="Class 9">Class 9</option>
                            </select>
                        </div>
                    )}

                    <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="rpt-select"
                            style={{ width: '100%', paddingLeft: '32px', borderRadius: '8px', border: '1px solid #eef0f4' }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rpt-table-wrap" style={{ padding: 0, overflowX: 'auto' }}>
                    {activeTab === 'Attendance Report' ? (
                        <table className="rpt-table" style={{ minWidth: daysCount > 7 ? '1200px' : '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '20px', position: 'sticky', left: 0, background: '#fdfdfe', zIndex: 10 }}>Student / Date</th>
                                    <th>%</th>
                                    <th>P</th>
                                    <th>L</th>
                                    <th>A</th>
                                    <th>H</th>
                                    <th>F</th>
                                    {Array.from({ length: daysCount }).map((_, i) => (
                                        <th key={i} style={{ textAlign: 'center', padding: '10px 5px', minWidth: '35px' }}>
                                            <div style={{ fontSize: '10px', color: '#9b9b9b' }}>{String(i + 1).padStart(2, '0')}</div>
                                            <div style={{ fontSize: '10px', fontWeight: '500', color: '#333' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i % 7]}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ paddingLeft: '20px', position: 'sticky', left: 0, background: '#fff', zIndex: 5, boxShadow: '2px 0 5px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0f2f7', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={`https://i.pravatar.cc/150?u=${s.id}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <span style={{ fontWeight: '600', color: '#333', fontSize: '13.5px' }}>{s.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                background: s.pct >= 90 ? '#e8faf1' : s.pct >= 75 ? '#fff5e6' : '#fce8e8',
                                                color: s.pct >= 90 ? '#28c76f' : s.pct >= 75 ? '#ff9f43' : '#ea5455',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: '800'
                                            }}>{s.pct}</span>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{s.p}</td>
                                        <td style={{ color: '#00cfe8', fontWeight: '600' }}>{s.l}</td>
                                        <td style={{ color: '#ea5455', fontWeight: '600' }}>{s.a}</td>
                                        <td style={{ color: '#3d5ee1', fontWeight: '600' }}>{s.h}</td>
                                        <td style={{ color: '#333', fontWeight: '600' }}>{s.f}</td>
                                        {s.daily.slice(0, daysCount).map((status, i) => (
                                            <td key={i} style={{ textAlign: 'center', padding: '12px 5px' }}>
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: getDotColor(status),
                                                    margin: '0 auto',
                                                    boxShadow: `0 0 0 2px ${getDotColor(status)}20`
                                                }}></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="rpt-table">
                            <thead>
                                {activeTab.includes('Teacher') ? (
                                    <tr>
                                        <th style={{ paddingLeft: '20px' }}>S.No</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Subject</th>
                                        <th>Attendance</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th style={{ paddingLeft: '20px' }}>S.No</th>
                                        <th>Admission No</th>
                                        <th>Roll No</th>
                                        <th>Name</th>
                                        <th>Attendance</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {[
                                    { sno: 1, id: 'T849127', name: 'Teresa', sub: 'Physics', adm: 'AD9892434', roll: '35013', status: 'Present', color: '#28c76f' },
                                    { sno: 2, id: 'T849126', name: 'Daniel', sub: 'Computer', adm: 'AD9892433', roll: '35012', status: 'Present', color: '#28c76f' },
                                    { sno: 3, id: 'T849125', name: 'Hellana', sub: 'English', adm: 'AD9892432', roll: '35011', status: 'Absent', color: '#ea5455' },
                                    { sno: 4, id: 'T849124', name: 'Erickson', sub: 'Spanish', adm: 'AD9892431', roll: '35010', status: 'Present', color: '#28c76f' },
                                    { sno: 5, id: 'T849123', name: 'Morgan', sub: 'Env Science', adm: 'AD9892430', roll: '35009', status: 'Half Day', color: '#3d5ee1' },
                                ].map(row => (
                                    <tr key={row.sno}>
                                        <td style={{ paddingLeft: '20px' }}>{row.sno}</td>
                                        <td>{activeTab.includes('Teacher') ? (
                                            <span style={{ color: '#3d5ee1', fontWeight: '500' }}>{row.id}</span>
                                        ) : (
                                            <span style={{ color: '#3d5ee1', fontWeight: '500' }}>{row.adm}</span>
                                        )}</td>
                                        {activeTab.includes('Teacher') ? null : <td>{row.roll}</td>}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                                    <img src={`https://i.pravatar.cc/100?u=${row.sno + (activeTab.includes('Teacher') ? 50 : 0)}`} alt="" style={{ width: '100%', height: '100%' }} />
                                                </div>
                                                <span>{row.name}</span>
                                            </div>
                                        </td>
                                        {activeTab.includes('Teacher') && <td>{row.sub}</td>}
                                        <td>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: `${row.color}15`,
                                                color: row.color
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.color }}></div>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
