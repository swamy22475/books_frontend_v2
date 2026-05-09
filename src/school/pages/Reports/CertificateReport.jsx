import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExportToolbar from './ExportToolbar';
import './Reports.css';
import { IconPrinter, IconX, IconCertificate, IconPlus } from '@tabler/icons-react';

/* ── Dummy Data & Helpers ───────────────────────────────────── */
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das', 'Vikram Joshi', 'Meera Pillai'];
const certTypes = ['Study Certificate', 'Transfer Certificate', 'Promotion Certificate', 'Sports Certificate'];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cls = (i) => classes[i % classes.length];
const sec = (i) => sections[i % sections.length];
const name = (i) => names[i % names.length];

const studentData = Array.from({ length: 30 }, (_, i) => ({
    sno: i + 1,
    roll: `RL-${1000 + i}`,
    name: name(i),
    class: cls(i),
    section: sec(i),
    father: `${name(i).split(' ')[0]}'s Father`,
    dob: `201${rnd(0, 5)}-0${rnd(1, 9)}-1${rnd(0, 9)}`,
    year: '2025-26'
}));

/* ── Main Component ─────────────────────────────────────────── */
const CertificateReport = () => {
    const title = 'Certificate Report';
    const icon = '📜';
    const columns = ['#', 'Roll No', 'Student Name', 'Class & Sec', 'Certificate Type', 'Extra Details', 'Action'];

    /* ── Filter State ── */
    const [filterClass, setFilterClass] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    /* ── Row Selections ── */
    const [rowSelections, setRowSelections] = useState({});

    /* ── Modals State ── */
    const [selectedCert, setSelectedCert] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);

    // New Manual Certificate State
    const [manualData, setManualData] = useState({
        name: '',
        class: '',
        section: '',
        roll: '',
        year: '2025-26',
        certType: certTypes[0],
        extraDetails: ''
    });

    /* ── Filtered Rows ── */
    const filtered = useMemo(() => studentData.filter(r => {
        const cMatch = !filterClass || r.class === filterClass;
        const srchMatch = !searchText || Object.values(r).some(v =>
            String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        return cMatch && srchMatch;
    }), [filterClass, searchText]);

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = () => setPage(1);

    const handleRowChange = (roll, field, value) => {
        setRowSelections(prev => ({
            ...prev,
            [roll]: {
                ...prev[roll],
                [field]: value
            }
        }));
    };

    const getRowSelection = (roll) => {
        return rowSelections[roll] || { certType: certTypes[0], extraDetails: '' };
    };

    const generateFromRow = (student) => {
        const selection = getRowSelection(student.roll);
        setSelectedCert({
            ...student,
            certType: selection.certType,
            extraDetails: selection.extraDetails
        });
    };

    const generateManual = () => {
        setSelectedCert({ ...manualData });
        setShowNewModal(false);
    };

    const closeCert = () => {
        setSelectedCert(null);
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

    // Rendering different types of certificates
    const renderCertificate = (data) => {
        const dateStr = new Date().toLocaleDateString('en-GB');

        if (data.certType === 'Study Certificate') {
            return (
                <div className="cr-cert cr-cert-study">
                    <div className="cr-cert-inner">
                        <div className="cr-header">
                            <div className="cr-logo">MW</div>
                            <div className="cr-school-text">
                                <h1>MINDWHILE INTERNATIONAL SCHOOL</h1>
                                <p>123 Education City, Knowledge Park, New Delhi, 110001</p>
                                <p>Affiliated to CBSE, Affiliation No. 123456</p>
                            </div>
                        </div>
                        <h2 className="cr-title">STUDY CERTIFICATE</h2>
                        <div className="cr-body-text">
                            <p>This is to certify that <strong>{data.name.toUpperCase()}</strong>, Son/Daughter of <strong>{data.father || "Mr. Guardian"}</strong> is a bonafide student of this institution.</p>
                            <p>He/She is studying in Class <strong>{data.class} '{data.section}'</strong> with Roll No <strong>{data.roll}</strong> during the academic year <strong>{data.year}</strong>.</p>
                            <p>His/Her date of birth according to our school records is <strong>{data.dob || 'N/A'}</strong>.</p>
                            <p>His/Her conduct and character are found to be <strong>GOOD</strong>.</p>
                        </div>
                        <div className="cr-footer">
                            <div>
                                <p>Date: <strong>{dateStr}</strong></p>
                                <p>Place: <strong>New Delhi</strong></p>
                            </div>
                            <div className="cr-sign-box">
                                <div className="cr-sign-cursive">Principal</div>
                                <div className="cr-sign-line"></div>
                                <p>Principal's Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (data.certType === 'Transfer Certificate') {
            return (
                <div className="cr-cert cr-cert-tc">
                    <div className="cr-tc-header">
                        <h1>MINDWHILE INTERNATIONAL SCHOOL</h1>
                        <h3>TRANSFER CERTIFICATE</h3>
                    </div>
                    <div className="cr-tc-grid">
                        <div className="cr-tc-row"><span>1. Name of Pupil:</span> <strong>{data.name}</strong></div>
                        <div className="cr-tc-row"><span>2. Father's / Guardian's Name:</span> <strong>{data.father || "Mr. Guardian"}</strong></div>
                        <div className="cr-tc-row"><span>3. Nationality:</span> <strong>Indian</strong></div>
                        <div className="cr-tc-row"><span>4. Date of Birth:</span> <strong>{data.dob || '01-01-2012'}</strong></div>
                        <div className="cr-tc-row"><span>5. Class in which admitted:</span> <strong>Class {data.class}</strong></div>
                        <div className="cr-tc-row"><span>6. Academic Year:</span> <strong>{data.year}</strong></div>
                        <div className="cr-tc-row"><span>7. Conduct:</span> <strong>Excellent</strong></div>
                        <div className="cr-tc-row"><span>8. Reason for leaving:</span> <strong>{data.extraDetails || "Parents Relocation"}</strong></div>
                    </div>
                    <div className="cr-cert-remarks">Certified that the above information is in accordance with the school register.</div>
                    <div className="cr-footer">
                        <div><p>Date of Issue: <strong>{dateStr}</strong></p></div>
                        <div className="cr-sign-box">
                            <div className="cr-sign-cursive">Principal</div>
                            <div className="cr-sign-line"></div>
                            <p>Principal's Signature</p>
                        </div>
                    </div>
                </div>
            );
        } else if (data.certType === 'Promotion Certificate') {
            return (
                <div className="cr-cert cr-cert-promotion">
                    <div className="cr-promo-border">
                        <h2>MINDWHILE INTERNATIONAL SCHOOL</h2>
                        <h1>PROMOTION CERTIFICATE</h1>
                        <div className="cr-promo-content">
                            <p>Congratulations!</p>
                            <h3>{data.name.toUpperCase()}</h3>
                            <p>Roll No: <strong>{data.roll}</strong></p>
                            <p>Has successfully completed the academic requirements for Class <strong>{data.class}</strong> in the year <strong>{data.year}</strong></p>
                            <div className="cr-promo-highlight">
                                Promoted to Next Class
                            </div>
                            <p>We wish them all the best in their future endeavors!</p>
                        </div>
                        <div className="cr-footer" style={{ marginTop: 40 }}>
                            <div className="cr-sign-box">
                                <div className="cr-sign-cursive">Class Teacher</div>
                                <div className="cr-sign-line"></div>
                                <p>Class Teacher</p>
                            </div>
                            <div className="cr-sign-box">
                                <div className="cr-sign-cursive">Principal</div>
                                <div className="cr-sign-line"></div>
                                <p>Principal</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (data.certType === 'Sports Certificate') {
            return (
                <div className="cr-cert cr-cert-sports">
                    <div className="cr-sports-bg"></div>
                    <div className="cr-sports-content">
                        <h1>CERTIFICATE</h1>
                        <h2>OF ACHIEVEMENT IN SPORTS</h2>
                        <div className="cr-sports-medal">🏅</div>
                        <p>This is proudly presented to</p>
                        <h3>{data.name.toUpperCase()}</h3>
                        <p>Class <strong>{data.class} '{data.section}'</strong> | Roll No: <strong>{data.roll}</strong></p>
                        <p>For outstanding performance and securing a position in</p>
                        <div className="cr-sports-highlight">
                            {data.extraDetails || "Annual Sports Meet"}
                        </div>
                        <div className="cr-footer">
                            <div className="cr-sign-box">
                                <div className="cr-sign-cursive">Coach</div>
                                <div className="cr-sign-line"></div>
                                <p>Sports Instructor</p>
                            </div>
                            <div className="cr-sign-box">
                                <div className="cr-sign-cursive">Principal</div>
                                <div className="cr-sign-line"></div>
                                <p>Principal</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
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
                <div style={{ display: 'flex', gap: '10px' }}>
                    <ExportToolbar columns={['Roll No', 'Student Name', 'Class']} rows={filtered} rowKeys={['roll', 'name', 'class']} title={title} />
                    <button className="rpt-search-btn" style={{ background: '#28c76f' }} onClick={() => setShowNewModal(true)}>
                        <IconPlus size={18} /> New Certificate
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Search Criteria</h6>
                <div className="rpt-filter-grid" style={{ gridTemplateColumns: '1fr 1.5fr auto' }}>
                    <div className="rpt-filter-group">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
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
                        Student Certificate Generation <span style={{ fontSize: 13, color: '#6e6b7b', fontWeight: 400 }}>({filtered.length} students)</span>
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
                            ) : paginated.map((row, i) => {
                                const selection = getRowSelection(row.roll);
                                return (
                                    <tr key={row.roll}>
                                        <td style={{ color: '#999' }}>{row.sno}</td>
                                        <td><strong style={{ color: '#3d5ee1' }}>{row.roll}</strong></td>
                                        <td style={{ fontWeight: 500 }}>{row.name}</td>
                                        <td>{row.class} - '{row.section}'</td>
                                        <td>
                                            <select
                                                className="cr-select"
                                                value={selection.certType}
                                                onChange={(e) => handleRowChange(row.roll, 'certType', e.target.value)}
                                            >
                                                {certTypes.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="cr-input"
                                                placeholder={selection.certType === 'Sports Certificate' ? "Enter Sport Name..." : selection.certType === 'Transfer Certificate' ? "Leaving Reason..." : "Any detail..."}
                                                value={selection.extraDetails}
                                                onChange={(e) => handleRowChange(row.roll, 'extraDetails', e.target.value)}
                                                style={{ opacity: (selection.certType === 'Study Certificate' || selection.certType === 'Promotion Certificate') ? 0.3 : 1 }}
                                                disabled={selection.certType === 'Study Certificate' || selection.certType === 'Promotion Certificate'}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="rpt-btn-outline"
                                                style={{ color: '#3d5ee1', borderColor: '#3d5ee1', background: '#f0f3ff', padding: '5px 12px', fontSize: 12 }}
                                                onClick={() => generateFromRow(row)}
                                            >
                                                <IconCertificate size={14} style={{ marginRight: 4 }} /> Generate
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
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

            {/* New Certificate Manual Modal */}
            {showNewModal && (
                <div className="cr-modal-overlay">
                    <div className="cr-modal-content" style={{ maxWidth: 600 }}>
                        <div className="cr-modal-header">
                            <h4 style={{ margin: 0, fontSize: 18 }}>Create Custom Certificate</h4>
                            <button className="ht-close-btn" onClick={() => setShowNewModal(false)}><IconX size={20} /></button>
                        </div>
                        <div className="cr-modal-body">
                            <div className="cr-form-grid">
                                <div className="cr-form-group">
                                    <label>Student Name</label>
                                    <input type="text" value={manualData.name} onChange={e => setManualData({ ...manualData, name: e.target.value })} placeholder="e.g. John Doe" />
                                </div>
                                <div className="cr-form-group">
                                    <label>Roll No</label>
                                    <input type="text" value={manualData.roll} onChange={e => setManualData({ ...manualData, roll: e.target.value })} placeholder="e.g. RL-500" />
                                </div>
                                <div className="cr-form-group">
                                    <label>Class</label>
                                    <input type="text" value={manualData.class} onChange={e => setManualData({ ...manualData, class: e.target.value })} placeholder="e.g. X" />
                                </div>
                                <div className="cr-form-group">
                                    <label>Section</label>
                                    <input type="text" value={manualData.section} onChange={e => setManualData({ ...manualData, section: e.target.value })} placeholder="e.g. A" />
                                </div>
                                <div className="cr-form-group">
                                    <label>Academic Year</label>
                                    <input type="text" value={manualData.year} onChange={e => setManualData({ ...manualData, year: e.target.value })} />
                                </div>
                                <div className="cr-form-group">
                                    <label>Certificate Type</label>
                                    <select value={manualData.certType} onChange={e => setManualData({ ...manualData, certType: e.target.value })}>
                                        {certTypes.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="cr-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Extra Details (Sport Name / Leaving Reason / etc.)</label>
                                    <input type="text" value={manualData.extraDetails} onChange={e => setManualData({ ...manualData, extraDetails: e.target.value })} placeholder="Enter additional details..." />
                                </div>
                            </div>
                            <div style={{ marginTop: 24, textAlign: 'right' }}>
                                <button className="rpt-search-btn" onClick={generateManual} disabled={!manualData.name}>
                                    Generate Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generated Certificate Modal */}
            {selectedCert && (
                <div className="cr-modal-overlay">
                    <div className="cr-modal-content" style={{ maxWidth: selectedCert.certType === 'Transfer Certificate' ? 800 : 900 }}>
                        <div className="cr-modal-header">
                            <h4 style={{ margin: 0 }}>Certificate View: {selectedCert.certType}</h4>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="rpt-export-btn" onClick={handlePrint} style={{ background: '#3d5ee1', color: '#fff', border: 'none' }}>
                                    <IconPrinter size={16} /> Print Document
                                </button>
                                <button className="ht-close-btn" onClick={closeCert}><IconX size={20} /></button>
                            </div>
                        </div>

                        <div className="cr-printable-area" ref={printRef}>
                            {renderCertificate(selectedCert)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateReport;
