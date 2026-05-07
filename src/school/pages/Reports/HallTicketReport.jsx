import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExportToolbar from './ExportToolbar';
import './Reports.css';
import { IconPrinter, IconX } from '@tabler/icons-react';

/* ── Dummy Data & Helpers ───────────────────────────────────── */
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das', 'Vikram Joshi', 'Meera Pillai', 'Saurabh Gupta', 'Nisha Rao', 'Arun Bose'];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cls = (i) => classes[i % classes.length];
const sec = (i) => sections[i % sections.length];
const name = (i) => names[i % names.length];

const hallTicketData = Array.from({ length: 45 }, (_, i) => ({
    sno: i + 1,
    roll: `RL-${1000 + i}`,
    name: name(i),
    class: cls(i),
    section: sec(i),
    exam: i % 2 === 0 ? 'Term 1 Final Examination' : 'Annual Examination',
    dob: `201${rnd(0, 5)}-0${rnd(1, 9)}-1${rnd(0, 9)}`,
    father: `${name(i).split(' ')[0]}'s Father`,
    center: 'MindWhile Main Campus - Block A',
    status: i % 5 === 0 ? 'Pending Dues' : 'Eligible'
}));

/* ── Main Component ─────────────────────────────────────────── */
const HallTicketReport = () => {
    const title = 'Hall Ticket Report';
    const icon = '🎫';
    const columns = ['#', 'Roll No', 'Student Name', 'Class', 'Section', 'Exam', 'Eligibility', 'Action'];

    /* ── Filter State ── */
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    /* ── Filtered Rows ── */
    const filtered = useMemo(() => hallTicketData.filter(r => {
        const clsMatch = !filterClass || r.class === filterClass;
        const secMatch = !filterSection || r.section === filterSection;
        const srchMatch = !searchText || Object.values(r).some(v =>
            String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        return clsMatch && secMatch && srchMatch;
    }), [filterClass, filterSection, searchText]);

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = () => {
        setPage(1);
        setSelectedRows([]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(paginated.map(r => r.roll));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (roll) => {
        setSelectedRows(prev => prev.includes(roll) ? prev.filter(r => r !== roll) : [...prev, roll]);
    };

    const openHallTicket = (student) => {
        setSelectedStudent(student);
    };

    const closeHallTicket = () => {
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
                <ExportToolbar columns={columns.slice(0, -1)} rows={filtered} rowKeys={['sno', 'roll', 'name', 'class', 'section', 'exam', 'status']} title={title} />
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Criteria</h6>
                <div className="rpt-filter-grid" style={{ gridTemplateColumns: '1fr 1fr 1.5fr auto' }}>
                    <div className="rpt-filter-group">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Section</label>
                        <select value={filterSection} onChange={e => { setFilterSection(e.target.value); setPage(1); }}>
                            <option value="">All Sections</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Search Student</label>
                        <input
                            type="text"
                            placeholder="Name, Roll No..."
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
                        Student List <span style={{ fontSize: 13, color: '#6e6b7b', fontWeight: 400 }}>({filtered.length} students)</span>
                    </h5>
                    {selectedRows.length > 0 && (
                        <button className="rpt-btn-primary" style={{ padding: '6px 16px', fontSize: 13 }}>
                            Generate Selected ({selectedRows.length})
                        </button>
                    )}
                </div>
                <div className="rpt-table-wrap">
                    <table className="rpt-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40, textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={paginated.length > 0 && selectedRows.length === paginated.length}
                                        onChange={handleSelectAll}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </th>
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
                                <tr key={row.roll} className={selectedRows.includes(row.roll) ? 'rpt-row-selected' : ''}>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.roll)}
                                            onChange={() => handleSelectRow(row.roll)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ color: '#999' }}>{row.sno}</td>
                                    <td><strong style={{ color: '#3d5ee1' }}>{row.roll}</strong></td>
                                    <td style={{ fontWeight: 500 }}>{row.name}</td>
                                    <td>Class {row.class}</td>
                                    <td>{row.section}</td>
                                    <td>{row.exam}</td>
                                    <td>
                                        <span className={`rpt-badge ${row.status === 'Eligible' ? 'rpt-badge-green' : 'rpt-badge-red'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="rpt-btn-outline"
                                            style={{ color: '#3d5ee1', borderColor: '#3d5ee1', background: '#f0f3ff', padding: '5px 12px', fontSize: 12 }}
                                            onClick={() => openHallTicket(row)}
                                        >
                                            Generate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Optional Pagination Placeholder */}
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

            {/* Hall Ticket Modal */}
            {selectedStudent && (
                <div className="ht-modal-overlay">
                    <div className="ht-modal-content">
                        <div className="ht-modal-header">
                            <h4 style={{ margin: 0, color: '#333448', fontSize: 18, fontWeight: 600 }}>Student Hall Ticket</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="rpt-export-btn" onClick={handlePrint}>
                                    <IconPrinter size={16} /> Print
                                </button>
                                <button className="ht-close-btn" onClick={closeHallTicket}><IconX size={20} /></button>
                            </div>
                        </div>

                        {/* Printable Area */}
                        <div className="ht-printable-area" ref={printRef}>
                            <div className="ht-ticket-card">
                                {/* Ticket Header */}
                                <div className="ht-ticket-head">
                                    <div className="ht-logo">MW</div>
                                    <div className="ht-school-info">
                                        <h2>MINDWHILE INTERNATIONAL SCHOOL</h2>
                                        <p>123 Education City, Knowledge Park, New Delhi, 110001</p>
                                        <p>Affiliated to CBSE, Affiliation No. 123456</p>
                                        <h3>HALL TICKET - {selectedStudent.exam.toUpperCase()} : 2025-26</h3>
                                    </div>
                                    <div className="ht-student-photo">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=3d5ee1&color=fff&size=100`} alt="student" />
                                    </div>
                                </div>

                                {/* Ticket Details */}
                                <div className="ht-ticket-body">
                                    <div className="ht-detail-row">
                                        <div className="ht-detail-group">
                                            <label>Student Name</label>
                                            <strong>{selectedStudent.name.toUpperCase()}</strong>
                                        </div>
                                        <div className="ht-detail-group">
                                            <label>Roll Number</label>
                                            <strong>{selectedStudent.roll}</strong>
                                        </div>
                                    </div>
                                    <div className="ht-detail-row">
                                        <div className="ht-detail-group">
                                            <label>Class & Section</label>
                                            <strong>{selectedStudent.class} - '{selectedStudent.section}'</strong>
                                        </div>
                                        <div className="ht-detail-group">
                                            <label>Date of Birth</label>
                                            <strong>{selectedStudent.dob}</strong>
                                        </div>
                                    </div>
                                    <div className="ht-detail-row">
                                        <div className="ht-detail-group">
                                            <label>Father's Name</label>
                                            <strong>{selectedStudent.father.toUpperCase()}</strong>
                                        </div>
                                        <div className="ht-detail-group">
                                            <label>Examination Center</label>
                                            <strong>{selectedStudent.center}</strong>
                                        </div>
                                    </div>

                                    {/* Subjects Timetable inside Hall Ticket */}
                                    <h4 className="ht-sub-title">Examination Schedule</h4>
                                    <table className="ht-exam-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Day</th>
                                                <th>Time</th>
                                                <th>Subject Code</th>
                                                <th>Subject Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>01 Mar 2026</td><td>Monday</td><td>09:00 AM - 12:00 PM</td><td>MAT-041</td><td>Mathematics</td></tr>
                                            <tr><td>03 Mar 2026</td><td>Wednesday</td><td>09:00 AM - 12:00 PM</td><td>SCI-086</td><td>Science</td></tr>
                                            <tr><td>05 Mar 2026</td><td>Friday</td><td>09:00 AM - 12:00 PM</td><td>ENG-184</td><td>English Language</td></tr>
                                            <tr><td>08 Mar 2026</td><td>Monday</td><td>09:00 AM - 12:00 PM</td><td>SST-087</td><td>Social Studies</td></tr>
                                            <tr><td>10 Mar 2026</td><td>Wednesday</td><td>09:00 AM - 12:00 PM</td><td>HIN-002</td><td>Hindi Course-A</td></tr>
                                        </tbody>
                                    </table>

                                    {/* Instructions */}
                                    <div className="ht-instructions">
                                        <h5>Important Instructions for Candidates</h5>
                                        <ol>
                                            <li>The candidate must carry this original hall ticket to the examination center.</li>
                                            <li>Please reach the examination center at least 30 minutes before the commencement of the exam.</li>
                                            <li>Electronic devices, including mobile phones and smartwatches, are strictly prohibited inside the hall.</li>
                                            <li>Candidates must use only blue/black ballpoint pen for writing the exam.</li>
                                        </ol>
                                    </div>

                                    {/* Signatures */}
                                    <div className="ht-signatures">
                                        <div>
                                            <div className="ht-sign-line"></div>
                                            <span>Student's Signature</span>
                                        </div>
                                        <div>
                                            <div className="ht-sign-line"></div>
                                            <span>Invigilator's Signature</span>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: '"Brush Script MT", "Indie Flower", cursive', fontSize: 24, color: '#333', opacity: 0.8, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80 }}>Principal</div>
                                            <div className="ht-sign-line"></div>
                                            <span>Principal's Signature</span>
                                        </div>
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

export default HallTicketReport;
