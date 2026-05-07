import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExportToolbar from './ExportToolbar';
import './Reports.css';
import { IconPrinter, IconX } from '@tabler/icons-react';

/* ── Dummy Data & Helpers ───────────────────────────────────── */
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das'];
const rooms = ['101', '102', '105', '201', '210', '305'];
const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel A', 'Girls Hostel B'];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cls = (i) => classes[i % classes.length];
const name = (i) => names[i % names.length];
const room = (i) => rooms[i % rooms.length];
const hostel = (i) => hostels[i % hostels.length];

const hostelData = Array.from({ length: 30 }, (_, i) => ({
    sno: i + 1,
    admNo: `ADM-${2000 + i}`,
    name: name(i),
    class: cls(i),
    hostelName: hostel(i),
    roomNo: room(i),
    feeStatus: i % 4 === 0 ? 'Pending' : 'Paid',
    feeAmount: rnd(15000, 25000),
    joinDate: `2025-0${rnd(1, 9)}-1${rnd(0, 9)}`,
    hostelId: `HID-${5000 + i}`,
}));

/* ── Main Component ─────────────────────────────────────────── */
const HostelReport = () => {
    const title = 'Hostel Report';
    const icon = '🛏️';
    const columns = ['#', 'Admission No', 'Student Name', 'Class', 'Hostel Name', 'Room No', 'Fee Status', 'Fee Amount', 'Action'];

    /* ── Filter State ── */
    const [filterHostel, setFilterHostel] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    const [selectedStudent, setSelectedStudent] = useState(null);

    /* ── Filtered Rows ── */
    const filtered = useMemo(() => hostelData.filter(r => {
        const hMatch = !filterHostel || r.hostelName === filterHostel;
        const srchMatch = !searchText || Object.values(r).some(v =>
            String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        return hMatch && srchMatch;
    }), [filterHostel, searchText]);

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
                <ExportToolbar columns={columns.slice(0, -1)} rows={filtered} rowKeys={['sno', 'admNo', 'name', 'class', 'hostelName', 'roomNo', 'feeStatus', 'feeAmount']} title={title} />
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Criteria</h6>
                <div className="rpt-filter-grid" style={{ gridTemplateColumns: '1fr 1.5fr auto' }}>
                    <div className="rpt-filter-group">
                        <label>Hostel Name</label>
                        <select value={filterHostel} onChange={e => { setFilterHostel(e.target.value); setPage(1); }}>
                            <option value="">All Hostels</option>
                            {hostels.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Search Student</label>
                        <input
                            type="text"
                            placeholder="Name, Admission No..."
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
                        Hostel Students List <span style={{ fontSize: 13, color: '#6e6b7b', fontWeight: 400 }}>({filtered.length} students)</span>
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
                                    <td>{row.hostelName}</td>
                                    <td>{row.roomNo}</td>
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
                                            Generate ID
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

            {/* Hostel ID Modal */}
            {selectedStudent && (
                <div className="ht-modal-overlay">
                    <div className="ht-modal-content" style={{ maxWidth: 450 }}>
                        <div className="ht-modal-header">
                            <h4 style={{ margin: 0, color: '#333448', fontSize: 18, fontWeight: 600 }}>Hostel ID Card</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="rpt-export-btn" onClick={handlePrint} style={{ padding: '6px 12px', fontSize: 13 }}>
                                    <IconPrinter size={16} /> Print
                                </button>
                                <button className="ht-close-btn" onClick={closeCard}><IconX size={20} /></button>
                            </div>
                        </div>

                        {/* Printable Area */}
                        <div className="ht-printable-area" ref={printRef} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="ht-ticket-card" style={{ width: '320px', borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', background: '#fff' }}>
                                {/* Front Card Background */}
                                <div style={{ background: 'linear-gradient(135deg, #3d5ee1, #627eea)', padding: '24px 20px', color: '#fff', textAlign: 'center', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, right: 10, opacity: 0.2, fontSize: 40, transform: 'rotate(15deg)' }}>🛏️</div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, letterSpacing: 0.5 }}>MINDWHILE HOSTELS</h3>
                                    <p style={{ margin: 0, fontSize: 11, opacity: 0.9 }}>RESIDENT IDENTIFICATION</p>

                                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ padding: 4, background: '#fff', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=fce8e8&color=ea5455&size=100`} alt="student" style={{ width: 85, height: 85, borderRadius: '50%', display: 'block' }} />
                                        </div>
                                    </div>

                                    <h2 style={{ margin: '16px 0 4px', fontSize: 20, fontWeight: 700 }}>{selectedStudent.name.toUpperCase()}</h2>
                                    <p style={{ margin: 0, fontSize: 13, background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '2px 10px', borderRadius: 12 }}>
                                        {selectedStudent.hostelId}
                                    </p>
                                </div>

                                {/* Info section */}
                                <div style={{ padding: '20px', background: '#fff' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px', marginBottom: 16 }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Hostel</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>{selectedStudent.hostelName}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Room No</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>{selectedStudent.roomNo}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Class</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>Class {selectedStudent.class}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Adm No</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>{selectedStudent.admNo}</p>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Joined Date</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>{selectedStudent.joinDate}</p>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontFamily: '"Brush Script MT", "Indie Flower", cursive', fontSize: 24, color: '#333', opacity: 0.8, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sarah Jane</div>
                                            <p style={{ margin: 0, fontSize: 9, color: '#888', fontWeight: 600 }}>WARDEN SIGN</p>
                                        </div>
                                        {/* Barcode placeholder */}
                                        <div style={{ background: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px)', width: 80, height: 30 }}></div>
                                    </div>
                                </div>
                                <div style={{ background: '#333', padding: '10px', textAlign: 'center', color: '#fff', fontSize: 9, opacity: 0.9 }}>
                                    IF FOUND, PLEASE RETURN TO MINDWHILE INTERNATIONAL SCHOOL
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelReport;
