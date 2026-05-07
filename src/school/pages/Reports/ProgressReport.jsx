import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Reports.css';

// ── Dummy Data ───────────────────────────────────────────────────────────────
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das'];

const subjects = [
    { name: 'Mathematics', max: 100 },
    { name: 'Science', max: 100 },
    { name: 'English', max: 100 },
    { name: 'Social Studies', max: 100 },
    { name: 'Computer Science', max: 100 },
    { name: 'Hindi', max: 100 }
];

const studentsData = Array.from({ length: 40 }, (_, i) => {
    const studentMarks = subjects.map(sub => {
        const marks = Math.floor(Math.random() * 40) + 60; // 60-100
        return { subject: sub.name, marks, max: sub.max };
    });

    const totalMarks = studentMarks.reduce((acc, curr) => acc + curr.marks, 0);
    const maxMarks = subjects.reduce((acc, curr) => acc + curr.max, 0);
    const percentage = Math.round((totalMarks / maxMarks) * 100);

    return {
        id: i + 1,
        admNo: `2024/${String(1001 + i).padStart(4, '0')}`,
        name: names[i % names.length],
        class: classes[i % 12],
        section: sections[i % 3],
        total: totalMarks,
        max: maxMarks,
        percentage,
        marks: studentMarks,
        attendance: Math.floor(Math.random() * 15) + 85, // 85-100%
        result: percentage >= 40 ? 'Pass' : 'Fail',
        grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D',
        remarks: 'Excellent performance throughout the session.'
    };
});

// ── Components ───────────────────────────────────────────────────────────────

const ProgressReport = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [searchText, setSearchText] = useState('');

    const filtered = useMemo(() => studentsData.filter(s => {
        const clsMatch = !filterClass || s.class === filterClass;
        const secMatch = !filterSection || s.section === filterSection;
        const srchMatch = !searchText || s.name.toLowerCase().includes(searchText.toLowerCase()) || s.admNo.includes(searchText);
        return clsMatch && secMatch && srchMatch;
    }), [filterClass, filterSection, searchText]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filtered.map(r => r.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="rpt-report-page">
            {/* Header */}
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">📈 Student Progress Report</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports &amp; Analytics</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">Progress Report</span>
                    </nav>
                </div>
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Student</h6>
                <div className="rpt-filter-grid">
                    <div className="rpt-filter-group">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group">
                        <label>Section</label>
                        <select value={filterSection} onChange={e => setFilterSection(e.target.value)}>
                            <option value="">All Sections</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="rpt-filter-group" style={{ flex: 2 }}>
                        <label>Search Name/Adm No</label>
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <button className="rpt-search-btn">🔍 Search</button>
                </div>
            </div>

            {/* Table */}
            <div className="rpt-table-card">
                <div className="rpt-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 className="rpt-table-title">Student Cumulative Records</h5>
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
                                        checked={filtered.length > 0 && selectedRows.length === filtered.length}
                                        onChange={handleSelectAll}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </th>
                                <th>Adm No</th>
                                <th>Student Name</th>
                                <th>Class-Sec</th>
                                <th>Total</th>
                                <th>Percentage</th>
                                <th>Grade</th>
                                <th>Attendance</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className={selectedRows.includes(s.id) ? 'rpt-row-selected' : ''}>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(s.id)}
                                            onChange={() => handleSelectRow(s.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td><strong>{s.admNo}</strong></td>
                                    <td>{s.name}</td>
                                    <td>{s.class}-{s.section}</td>
                                    <td>{s.total}/{s.max}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="rpt-bar-wrap" style={{ width: '60px', height: '6px' }}>
                                                <div className="rpt-bar-fill" style={{ width: `${s.percentage}%`, background: s.percentage >= 80 ? '#28c76f' : '#ff9f43' }} />
                                            </div>
                                            <span>{s.percentage}%</span>
                                        </div>
                                    </td>
                                    <td><span className={`rpt-badge rpt-badge-${s.grade === 'A+' || s.grade === 'A' ? 'purple' : 'blue'}`}>{s.grade}</span></td>
                                    <td>{s.attendance}%</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="rpt-search-btn"
                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => setSelectedStudent(s)}
                                        >
                                            ✨ Generate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Progress Card Modal */}
            {selectedStudent && (
                <div className="ht-modal-overlay">
                    <div className="ht-modal-content" style={{ maxWidth: '900px' }}>
                        <div className="ht-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700 }}>Preview Progress Report</h5>
                            <button className="ht-close-btn" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>

                        <div className="ht-printable-area">
                            <div className="rpt-progress-card">
                                {/* School Header */}
                                <div className="rpt-pc-header">
                                    <div className="rpt-pc-logo">MW</div>
                                    <div className="rpt-pc-school-info">
                                        <h2>MINDWHILE INTERNATIONAL SCHOOL</h2>
                                        <p>Affiliated to CBSE, New Delhi | Affiliation No: 1234567</p>
                                        <p>Main Road, City Center, PIN - 500001</p>
                                        <div className="rpt-pc-tag">ANNUAL PROGRESS REPORT (2024-25)</div>
                                    </div>
                                    <div className="rpt-pc-student-photo">
                                        <div className="photo-placeholder">PHOTO</div>
                                    </div>
                                </div>

                                {/* Student Details */}
                                <div className="rpt-pc-details">
                                    <div className="pc-detail-item"><span>Student Name:</span> <strong>{selectedStudent.name}</strong></div>
                                    <div className="pc-detail-item"><span>Admission No:</span> <strong>{selectedStudent.admNo}</strong></div>
                                    <div className="pc-detail-item"><span>Class & Section:</span> <strong>{selectedStudent.class} - {selectedStudent.section}</strong></div>
                                    <div className="pc-detail-item"><span>Roll Number:</span> <strong>{selectedStudent.id + 10}</strong></div>
                                    <div className="pc-detail-item"><span>Father's Name:</span> <strong>Mr. Rajesh Sharma</strong></div>
                                    <div className="pc-detail-item"><span>Attendance:</span> <strong>{selectedStudent.attendance}%</strong></div>
                                </div>

                                {/* Academic Performance Table */}
                                <div className="rpt-pc-academic">
                                    <h4 className="pc-section-title">Academic Performance</h4>
                                    <table className="pc-table">
                                        <thead>
                                            <tr>
                                                <th>Subject Name</th>
                                                <th>Max Marks</th>
                                                <th>Marks Obtained</th>
                                                <th>Grade</th>
                                                <th>Performance Range</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedStudent.marks.map((m, idx) => (
                                                <tr key={idx}>
                                                    <td>{m.subject}</td>
                                                    <td>{m.max}</td>
                                                    <td><strong>{m.marks}</strong></td>
                                                    <td>{m.marks >= 90 ? 'A+' : m.marks >= 80 ? 'A' : m.marks >= 70 ? 'B' : 'C'}</td>
                                                    <td style={{ width: '150px' }}>
                                                        <div className="pc-range-bar">
                                                            <div className="pc-range-fill" style={{
                                                                width: `${m.marks}%`,
                                                                background: m.marks >= 90 ? '#28c76f' : m.marks >= 75 ? '#3d5ee1' : '#ff9f43'
                                                            }} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="pc-footer-row">
                                                <td><strong>GRAND TOTAL</strong></td>
                                                <td><strong>{selectedStudent.max}</strong></td>
                                                <td><strong>{selectedStudent.total}</strong></td>
                                                <td colSpan="2"><strong>PERCENTAGE: {selectedStudent.percentage}%</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Overall Summary */}
                                <div className="rpt-pc-summary">
                                    <div className="pc-summary-box">
                                        <h5>Final Result</h5>
                                        <div className={`pc-result-badge ${selectedStudent.result.toLowerCase()}`}>
                                            {selectedStudent.result.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="pc-summary-box" style={{ flex: 2 }}>
                                        <h5>Overall Evaluation & Remarks</h5>
                                        <p>{selectedStudent.remarks}</p>
                                    </div>
                                    <div className="pc-summary-box">
                                        <h5>Final Grade</h5>
                                        <div className="pc-grade-circle">{selectedStudent.grade}</div>
                                    </div>
                                </div>

                                {/* Signatures */}
                                <div className="rpt-pc-signs">
                                    <div className="pc-sign-item">
                                        <div className="sign-line"></div>
                                        <span>Class Teacher</span>
                                    </div>
                                    <div className="pc-sign-item">
                                        <div className="sign-line"></div>
                                        <span>Exam Coordinator</span>
                                    </div>
                                    <div className="pc-sign-item">
                                        <div className="sign-line"></div>
                                        <span>Principal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ht-modal-footer" style={{ borderTop: '1px solid #eef0f4', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="rpt-btn-outline" onClick={() => setSelectedStudent(null)}>Close</button>
                            <button className="rpt-search-btn" onClick={handlePrint}>🖨️ Print Report Card</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressReport;
