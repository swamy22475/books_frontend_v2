import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExportToolbar from './ExportToolbar';
import './Reports.css';

const STU_COLUMNS = ['#', 'Adm No', 'Name', 'Class', 'Section', 'DOB', 'Gender', 'Category', 'Mobile', 'Status'];
const STU_KEYS = ['sno', 'admNo', 'name', 'class', 'section', 'dob', 'gender', 'category', 'mobile', 'status'];

/* ─── Dummy student data ─────────────────────────────────────── */
const generateStudents = (count = 40) => {
    const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta',
        'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das',
        'Vikram Joshi', 'Meera Pillai', 'Saurabh Gupta', 'Nisha Rao', 'Arun Bose'];
    const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const sections = ['A', 'B', 'C'];
    return Array.from({ length: count }, (_, i) => ({
        sno: i + 1,
        admNo: `2024/${String(1001 + i).padStart(4, '0')}`,
        name: names[i % names.length],
        class: classes[i % classes.length],
        section: sections[i % sections.length],
        dob: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${2010 + (i % 8)}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        category: ['General', 'OBC', 'SC', 'ST'][i % 4],
        mobile: `+91 ${9000000000 + i}`,
        status: i % 7 === 0 ? 'Inactive' : 'Active',
    }));
};

const students = generateStudents(40);

const StudentReport = () => {
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    const filtered = students.filter(s =>
        (!filterClass || s.class === filterClass) &&
        (!filterSection || s.section === filterSection) &&
        (!filterGender || s.gender === filterGender) &&
        (!searchText || s.name.toLowerCase().includes(searchText.toLowerCase()) || s.admNo.includes(searchText))
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="rpt-report-page">
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">Student Report</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports &amp; Analytics</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">Student Report</span>
                    </nav>
                </div>
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Select Criteria</h6>
                <div className="rpt-filter-grid">
                    <div className="rpt-filter-group">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
                            <option value="">All Classes</option>
                            {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c =>
                                <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Section</label>
                        <select value={filterSection} onChange={e => { setFilterSection(e.target.value); setPage(1); }}>
                            <option value="">All Sections</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Gender</label>
                        <select value={filterGender} onChange={e => { setFilterGender(e.target.value); setPage(1); }}>
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Search</label>
                        <input placeholder="Name / Adm No" value={searchText} onChange={e => { setSearchText(e.target.value); setPage(1); }} />
                    </div>
                    <div className="rpt-filter-group">
                        <label>&nbsp;</label>
                        <button className="rpt-search-btn" onClick={() => setPage(1)}>🔍 Search</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rpt-table-card">
                <div className="rpt-table-header">
                    <h5 className="rpt-table-title">Student Report ({filtered.length} records)</h5>
                    <ExportToolbar columns={STU_COLUMNS} rows={filtered} rowKeys={STU_KEYS} title="Student-Report" />
                </div>
                <div className="rpt-table-wrap">
                    <table className="rpt-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Adm No</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Category</th>
                                <th>Mobile</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map(s => (
                                <tr key={s.sno}>
                                    <td>{s.sno}</td>
                                    <td><strong>{s.admNo}</strong></td>
                                    <td>{s.name}</td>
                                    <td>{s.class}</td>
                                    <td>{s.section}</td>
                                    <td>{s.dob}</td>
                                    <td>{s.gender}</td>
                                    <td>{s.category}</td>
                                    <td>{s.mobile}</td>
                                    <td>
                                        <span className={`rpt-badge ${s.status === 'Active' ? 'rpt-badge-green' : 'rpt-badge-red'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="rpt-table-footer">
                    <span>Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
                    <div className="rpt-pagination">
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => Math.abs(n - page) <= 2).map(n => (
                            <button key={n} className={`rpt-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                        ))}
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReport;
