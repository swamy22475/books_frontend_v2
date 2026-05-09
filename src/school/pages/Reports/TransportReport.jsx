import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExportToolbar from './ExportToolbar';
import './Reports.css';
import { IconPrinter, IconX } from '@tabler/icons-react';

/* ── Dummy Data & Helpers ───────────────────────────────────── */
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const names = ['Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das', 'Vikram Joshi', 'Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta'];
const routes = ['Route A - City Center', 'Route B - West End', 'Route C - North Park', 'Route D - South Hills'];
const stops = ['Main Gate', 'Library Square', 'Oak Street', 'Pine Avenue', 'Maple Drive', 'First Avenue'];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cls = (i) => classes[i % classes.length];
const name = (i) => names[i % names.length];
const route = (i) => routes[i % routes.length];
const stop = (i) => stops[i % stops.length];

const transportData = Array.from({ length: 40 }, (_, i) => ({
    sno: i + 1,
    admNo: `ADM-${3000 + i}`,
    name: name(i),
    class: cls(i),
    route: route(i),
    stop: stop(i),
    busNo: `BUS-${rnd(10, 25)}`,
    feeStatus: i % 5 === 0 ? 'Pending' : 'Paid',
    feeAmount: rnd(5000, 12000),
    validUntil: `2026-03-${rnd(10, 31)}`,
    passId: `TRN-${8000 + i}`
}));

/* ── Main Component ─────────────────────────────────────────── */
const TransportReport = () => {
    const title = 'Transport Report';
    const icon = '🚌';
    const columns = ['#', 'Admission No', 'Student Name', 'Class', 'Route', 'Bus No', 'Fee Status', 'Fee Amount', 'Action'];

    /* ── Filter State ── */
    const [filterRoute, setFilterRoute] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    const [selectedStudent, setSelectedStudent] = useState(null);

    /* ── Filtered Rows ── */
    const filtered = useMemo(() => transportData.filter(r => {
        const rtMatch = !filterRoute || r.route === filterRoute;
        const srchMatch = !searchText || Object.values(r).some(v =>
            String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        return rtMatch && srchMatch;
    }), [filterRoute, searchText]);

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = () => setPage(1);

    const openCard = (student) => {
        setSelectedStudent(student);
    };

    const closeCard = () => {
        setSelectedStudent(null);
    };

    const printRef = useRef(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className="rpt-report-page">
            {/* Header */}
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">{icon} {title}</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports &amp; Analytics</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">{title}</span>
                    </nav>
                </div>
                <ExportToolbar columns={columns.slice(0, -1)} rows={filtered} rowKeys={['sno', 'admNo', 'name', 'class', 'route', 'busNo', 'feeStatus', 'feeAmount']} title={title} />
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Criteria</h6>
                <div className="rpt-filter-grid" style={{ gridTemplateColumns: '1fr 1.5fr auto' }}>
                    <div className="rpt-filter-group">
                        <label>Transport Route</label>
                        <select value={filterRoute} onChange={e => { setFilterRoute(e.target.value); setPage(1); }}>
                            <option value="">All Routes</option>
                            {routes.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Search Student</label>
                        <input
                            type="text"
                            placeholder="Name, Admission No, Bus No..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="rpt-filter-group" style={{ alignSelf: 'flex-end' }}>
                        <button className="rpt-search-btn" onClick={handleSearch}>🔍 Search</button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="rpt-table-card">
                <div className="rpt-table-header">
                    <h5 className="rpt-table-title">
                        Transport Students List <span style={{ fontSize: 13, color: '#6e6b7b', fontWeight: 400 }}>({filtered.length} students)</span>
                    </h5>
                </div>
                <div className="rpt-table-wrap">
                    <table className="rpt-table">
                        <thead>
                            <tr>
                                {columns.map(col => <th key={col}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        No students found.
                                    </td>
                                </tr>
                            ) : paginated.map((row, i) => (
                                <tr key={row.admNo}>
                                    <td style={{ color: '#999' }}>{row.sno}</td>
                                    <td><strong style={{ color: '#3d5ee1' }}>{row.admNo}</strong></td>
                                    <td style={{ fontWeight: 500 }}>{row.name}</td>
                                    <td>Class {row.class}</td>
                                    <td>{row.route}</td>
                                    <td><span className="rpt-badge rpt-badge-purple">{row.busNo}</span></td>
                                    <td>
                                        <span className={`rpt-badge ${row.feeStatus === 'Paid' ? 'rpt-badge-green' : 'rpt-badge-red'}`}>
                                            {row.feeStatus}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₹{row.feeAmount.toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="rpt-btn-outline"
                                            style={{ color: '#3d5ee1', borderColor: '#3d5ee1', background: '#f0f3ff', padding: '5px 12px', fontSize: 12 }}
                                            onClick={() => openCard(row)}
                                        >
                                            Generate Bus Pass
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length > PER_PAGE && (
                    <div className="rpt-table-footer" style={{ justifyContent: 'center' }}>
                        <div className="rpt-pagination">
                            <button className="rpt-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>«</button>
                            <button className="rpt-page-btn active">{page}</button>
                            <button className="rpt-page-btn" disabled={page * PER_PAGE >= filtered.length} onClick={() => setPage(p => p + 1)}>»</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bus Pass Modal */}
            {selectedStudent && (
                <div className="ht-modal-overlay">
                    <div className="ht-modal-content" style={{ maxWidth: 450 }}>
                        <div className="ht-modal-header">
                            <h4 style={{ margin: 0, color: '#333448', fontSize: 18, fontWeight: 600 }}>Student Bus Pass</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="rpt-export-btn" onClick={handlePrint} style={{ padding: '6px 12px', fontSize: 13, background: '#ff9f43', boxShadow: 'none' }}>
                                    <IconPrinter size={16} /> Print
                                </button>
                                <button className="ht-close-btn" onClick={closeCard}><IconX size={20} /></button>
                            </div>
                        </div>

                        {/* Printable Area */}
                        <div className="ht-printable-area" ref={printRef} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="ht-ticket-card" style={{ width: '340px', borderRadius: 12, border: '2px solid #ff9f43', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', background: '#fff' }}>
                                {/* Horizontal Pass layout */}
                                <div style={{ background: '#ff9f43', padding: '16px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9f43', fontSize: 20 }}>🚌</div>
                                        <div>
                                            <h3 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 800 }}>MINDWHILE ERPS</h3>
                                            <p style={{ margin: 0, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>STUDENT BUS PASS</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 9, opacity: 0.9 }}>ACADEMIC YEAR</div>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>2025-26</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', padding: 20, gap: 16 }}>
                                    <div style={{ flexShrink: 0 }}>
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=fce8e8&color=ea5455&size=100`} alt="student" style={{ width: 80, height: 80, borderRadius: 8, display: 'block', border: '2px solid #eef0f4' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#333' }}>{selectedStudent.name.toUpperCase()}</h2>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
                                            <div>
                                                <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>Adm No</div>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#222' }}>{selectedStudent.admNo}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>Class</div>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#222' }}>Class {selectedStudent.class}</div>
                                            </div>
                                        </div>

                                        <div style={{ background: '#fff5e6', padding: '8px 10px', borderRadius: 6, marginTop: 10, border: '1px solid #ffd8a8' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span style={{ fontSize: 9, color: '#d97706', fontWeight: 700 }}>BUS NO: {selectedStudent.busNo}</span>
                                                <span style={{ fontSize: 9, color: '#d97706', fontWeight: 700 }}>PASS: {selectedStudent.passId}</span>
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', lineHeight: 1.3 }}>{selectedStudent.route}</div>
                                            <div style={{ fontSize: 10, color: '#d97706', marginTop: 2 }}>📍 {selectedStudent.stop}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px 20px' }}>
                                    <div>
                                        <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>Valid Until</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#28c76f' }}>{selectedStudent.validUntil}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: '"Brush Script MT", "Indie Flower", cursive', fontSize: 24, color: '#333', opacity: 0.8, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>John Doe</div>
                                        <p style={{ margin: 0, fontSize: 9, color: '#888', fontWeight: 600, borderTop: '1px solid #ccc', paddingTop: 2 }}>TRANSPORT DEPT.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportReport;
