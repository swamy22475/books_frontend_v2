import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IconCertificate, IconPrinter, IconDownload, IconSearch,
    IconUser, IconX, IconPlus, IconCheck, IconFilter, IconRefresh,
    IconSchool, IconTransfer, IconTrophy, IconStar, IconEye,
    IconChevronLeft, IconChevronRight
} from '@tabler/icons-react';
import './Certificates.css';

const CERT_TYPES = [
    { id: 'Study Certificate', label: 'Study', icon: '📚', color: '#3d5ee1', bg: '#eef1fd' },
    { id: 'Transfer Certificate', label: 'Transfer', icon: '🔄', color: '#ff9f43', bg: '#fff5e6' },
    { id: 'Promotion Certificate', label: 'Promotion', icon: '🎓', color: '#28c76f', bg: '#e8faf1' },
    { id: 'Sports Certificate', label: 'Sports', icon: '🏅', color: '#7367f0', bg: '#f0edff' },
];

const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta', 'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das'];

const studentData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    roll: `RL-${1000 + i}`,
    name: names[i % names.length],
    class: classes[i % classes.length],
    section: sections[i % sections.length],
    father: `${names[(i + 3) % names.length].split(' ')[0]}'s Father`,
    dob: `201${i % 6}-0${(i % 9) + 1}-1${i % 10}`,
    year: '2025-26',
}));

const GenerateCertificate = () => {
    const [filterClass, setFilterClass] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedCertType, setSelectedCertType] = useState(CERT_TYPES[0].id);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState(null);
    const [batchMode, setBatchMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const [manualData, setManualData] = useState({
        name: '', roll: '', class: '', section: '', father: '', dob: '', year: '2025-26',
        certType: CERT_TYPES[0].id, extraDetails: ''
    });

    // Stats
    const stats = {
        totalStudents: studentData.length,
        totalGenerated: 546,
        pendingTC: 3,
        thisMonth: 47,
    };

    const kpiCards = [
        { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', bg: '#eef1fd', color: '#3d5ee1', sub: 'Enrolled students' },
        { label: 'Certificates Issued', value: stats.totalGenerated, icon: '📜', bg: '#e8faf1', color: '#28c76f', sub: 'All time total' },
        { label: 'Pending TC', value: stats.pendingTC, icon: '🔄', bg: '#fff5e6', color: '#ff9f43', sub: 'Awaiting approval' },
        { label: 'This Month', value: stats.thisMonth, icon: '📅', bg: '#f0edff', color: '#7367f0', sub: 'Jan 2025 issues' },
    ];

    const filteredStudents = useMemo(() => {
        return studentData.filter(s => {
            const classMatch = !filterClass || s.class === filterClass;
            const searchMatch = !searchText || s.name.toLowerCase().includes(searchText.toLowerCase()) || s.roll.toLowerCase().includes(searchText.toLowerCase());
            return classMatch && searchMatch;
        });
    }, [filterClass, searchText]);

    const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
    const pagedStudents = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleStudentSelect = (id) => {
        if (batchMode) {
            setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else {
            setSelectedStudents([id]);
        }
    };

    const selectAll = () => {
        const ids = filteredStudents.map(s => s.id);
        setSelectedStudents(prev => prev.length === ids.length ? [] : ids);
    };

    const generateCertificate = (student) => {
        setCurrentCertificate({ ...student, certType: selectedCertType, certificateId: `CERT-${Date.now()}`, generatedAt: new Date().toISOString() });
        setShowPreviewModal(true);
    };

    const generateBatch = () => {
        if (!selectedStudents.length) return alert('Please select at least one student');
        const first = studentData.find(s => s.id === selectedStudents[0]);
        generateCertificate(first);
    };

    const generateManual = () => {
        if (!manualData.name) return alert('Enter student name');
        const cert = { ...manualData, id: 'manual', certificateId: `CERT-${Date.now()}`, generatedAt: new Date().toISOString() };
        setCurrentCertificate(cert);
        setShowManualModal(false);
        setShowPreviewModal(true);
    };

    const printCertificate = () => {
        window.print();
    };

    const activeCertType = CERT_TYPES.find(t => t.id === selectedCertType);

    /* ── Certificate renderer ── */
    const renderCertificate = (data) => {
        const dateStr = new Date().toLocaleDateString('en-GB');
        const SignatureBlock = ({ role }) => (
            <div className="cert-print-sign-box">
                <div className="cert-print-sign-cursive">{role}</div>
                <div className="cert-print-sign-line" />
                <p>{role}'s Signature</p>
            </div>
        );

        if (data.certType === 'Study Certificate') return (
            <div className="cert-print-cert cert-print-study">
                <div className="cert-print-inner">
                    <div className="cert-print-header">
                        <div className="cert-print-logo">MW</div>
                        <div className="cert-print-school-text">
                            <h1>MINDWHILE INTERNATIONAL SCHOOL</h1>
                            <p>123 Education City, Knowledge Park, New Delhi, 110001</p>
                            <p>Affiliated to CBSE · Affiliation No. 123456</p>
                        </div>
                    </div>
                    <h2 className="cert-print-title">STUDY CERTIFICATE</h2>
                    <div className="cert-print-body-text">
                        <p>This is to certify that <strong>{data.name?.toUpperCase()}</strong>, Son/Daughter of <strong>{data.father || 'Mr. Guardian'}</strong>, is a bonafide student of this institution.</p>
                        <p>He/She is studying in Class <strong>{data.class} '{data.section}'</strong> with Roll No. <strong>{data.roll}</strong> during the academic year <strong>{data.year}</strong>.</p>
                        <p>His/Her Date of Birth, as per school records, is <strong>{data.dob || 'N/A'}</strong>.</p>
                        <p>His/Her conduct and character are found to be <strong>GOOD</strong>.</p>
                    </div>
                    <div className="cert-print-footer">
                        <div>
                            <p>Date: <strong>{dateStr}</strong></p>
                            <p>Place: <strong>New Delhi</strong></p>
                        </div>
                        <SignatureBlock role="Principal" />
                    </div>
                </div>
            </div>
        );

        if (data.certType === 'Transfer Certificate') return (
            <div className="cert-print-cert cert-print-tc">
                <div className="cert-print-tc-header">
                    <h1>MINDWHILE INTERNATIONAL SCHOOL</h1>
                    <h3>TRANSFER CERTIFICATE</h3>
                </div>
                <div className="cert-print-tc-grid">
                    {[
                        ['1. Name of Pupil', data.name],
                        ['2. Father\'s / Guardian\'s Name', data.father || 'Mr. Guardian'],
                        ['3. Nationality', 'Indian'],
                        ['4. Date of Birth', data.dob || '01-01-2012'],
                        ['5. Class last studied', `Class ${data.class}`],
                        ['6. Academic Year', data.year],
                        ['7. Conduct & Character', 'Excellent'],
                        ['8. Reason for leaving', data.extraDetails || 'Parents Relocation'],
                    ].map(([key, val]) => (
                        <div key={key} className="cert-print-tc-row">
                            <span>{key}:</span>
                            <strong>{val}</strong>
                        </div>
                    ))}
                </div>
                <div className="cert-print-remarks">Certified that the above information is in accordance with the school register.</div>
                <div className="cert-print-footer" style={{ padding: '20px 32px', margin: 0, borderTop: '1px dashed #f0e8d8' }}>
                    <div><p>Date of Issue: <strong>{dateStr}</strong></p></div>
                    <SignatureBlock role="Principal" />
                </div>
            </div>
        );

        if (data.certType === 'Promotion Certificate') return (
            <div className="cert-print-cert cert-print-promotion">
                <div className="cert-print-promo-border">
                    <h2>MINDWHILE INTERNATIONAL SCHOOL</h2>
                    <h1>PROMOTION CERTIFICATE</h1>
                    <div className="cert-print-promo-content">
                        <p>Congratulations!</p>
                        <h3>{data.name?.toUpperCase()}</h3>
                        <p>Roll No: <strong>{data.roll}</strong></p>
                        <p>Has successfully completed requirements for Class <strong>{data.class}</strong> in year <strong>{data.year}</strong></p>
                        <div className="cert-print-promo-highlight">✦ Promoted to Next Class ✦</div>
                        <p>We wish them all the best in their future endeavors!</p>
                    </div>
                    <div className="cert-print-footer" style={{ marginTop: 40, borderTop: '1px dashed #d4f0e2' }}>
                        <SignatureBlock role="Class Teacher" />
                        <SignatureBlock role="Principal" />
                    </div>
                </div>
            </div>
        );

        if (data.certType === 'Sports Certificate') return (
            <div className="cert-print-cert cert-print-sports">
                <div className="cert-print-sports-bg" />
                <div className="cert-print-sports-content">
                    <h1>CERTIFICATE</h1>
                    <h2>OF ACHIEVEMENT IN SPORTS</h2>
                    <div className="cert-print-sports-medal">🏅</div>
                    <p>This is proudly presented to</p>
                    <h3>{data.name?.toUpperCase()}</h3>
                    <p>Class <strong>{data.class} '{data.section}'</strong> · Roll No: <strong>{data.roll}</strong></p>
                    <p>For outstanding performance in</p>
                    <div className="cert-print-sports-highlight">{data.extraDetails || 'Annual Sports Meet'}</div>
                    <div className="cert-print-footer" style={{ marginTop: 32, justifyContent: 'center', gap: 60, borderTop: '1px dashed #d8d3f8' }}>
                        <SignatureBlock role="Coach" />
                        <SignatureBlock role="Principal" />
                    </div>
                </div>
            </div>
        );

        return null;
    };

    return (
        <div className="cert-page">
            {/* ── Header ── */}
            <div className="cert-page-header">
                <div>
                    <h4 className="cert-page-title">📜 Generate Certificate</h4>
                    <nav className="cert-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        {' / '}
                        <span className="cert-breadcrumb-current">Generate Certificate</span>
                    </nav>
                </div>
                <div className="cert-table-actions">
                    <button
                        className={batchMode ? 'cert-btn-primary' : 'cert-btn-secondary'}
                        onClick={() => { setBatchMode(b => !b); setSelectedStudents([]); }}
                    >
                        {batchMode ? <><IconCheck size={15} /> Batch ON</> : <><IconFilter size={15} /> Batch Mode</>}
                    </button>
                    <button className="cert-btn-success" onClick={() => setShowManualModal(true)}>
                        <IconPlus size={15} /> Manual Entry
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="cert-kpi-grid">
                {kpiCards.map((k, i) => (
                    <div key={i} className="cert-kpi-card">
                        <div className="cert-kpi-icon" style={{ background: k.bg, color: k.color, fontSize: 24 }}>
                            {k.icon}
                        </div>
                        <div className="cert-kpi-info">
                            <p className="cert-kpi-label">{k.label}</p>
                            <h3 className="cert-kpi-value">{k.value}</h3>
                            <span className="cert-kpi-sub">{k.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Certificate Type Selector ── */}
            <div className="cert-filter-card">
                <div className="cert-filter-header">
                    <h6 className="cert-filter-title">🎖️ Certificate Type</h6>
                </div>
                <div className="cert-type-tabs">
                    {CERT_TYPES.map(t => (
                        <button
                            key={t.id}
                            className={`cert-type-tab ${selectedCertType === t.id ? 'active' : ''}`}
                            onClick={() => setSelectedCertType(t.id)}
                            style={selectedCertType === t.id ? {} : {}}
                        >
                            <span className="cert-type-tab-icon">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
                {activeCertType && (
                    <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: '#9b9b9b' }}>
                        Selected: <strong style={{ color: activeCertType.color }}>{activeCertType.id}</strong>
                    </p>
                )}
            </div>

            {/* ── Filter / Search ── */}
            <div className="cert-filter-card">
                <div className="cert-filter-header">
                    <h6 className="cert-filter-title"><IconFilter size={15} /> Search Students</h6>
                    <button className="cert-btn-outline" onClick={() => { setSearchText(''); setFilterClass(''); setCurrentPage(1); }}>
                        <IconRefresh size={14} /> Reset
                    </button>
                </div>
                <div className="cert-filter-grid">
                    <div className="cert-filter-group">
                        <label>Search</label>
                        <div className="cert-search-wrapper">
                            <IconSearch size={15} className="cert-search-icon" />
                            <input
                                type="text"
                                className="cert-search-input"
                                placeholder="Name, Roll No..."
                                value={searchText}
                                onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                    <div className="cert-filter-group">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setCurrentPage(1); }}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Batch Banner ── */}
            {batchMode && (
                <div className="cert-batch-banner">
                    <div className="cert-batch-info">
                        <IconCertificate size={18} />
                        {selectedStudents.length > 0
                            ? <>{selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected</>
                            : 'Select students to generate batch certificates'}
                    </div>
                    <div className="cert-table-actions">
                        <button className="cert-btn-outline" onClick={selectAll}>
                            {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedStudents.length > 0 && (
                            <button className="cert-btn-primary" onClick={generateBatch}>
                                <IconCertificate size={15} /> Generate {selectedStudents.length} Certificate{selectedStudents.length > 1 ? 's' : ''}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Students Table ── */}
            <div className="cert-table-card">
                <div className="cert-table-header">
                    <h5 className="cert-table-title">
                        Students
                        <span style={{ fontSize: 13, color: '#9b9b9b', fontWeight: 400 }}>({filteredStudents.length} found)</span>
                        {batchMode && selectedStudents.length > 0 && (
                            <span className="cert-selected-count">{selectedStudents.length} selected</span>
                        )}
                    </h5>
                </div>

                <div className="cert-table-container">
                    <table className="cert-table">
                        <thead>
                            <tr>
                                {batchMode && (
                                    <th style={{ width: 48 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                            onChange={selectAll}
                                        />
                                    </th>
                                )}
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Father's Name</th>
                                <th>Date of Birth</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={batchMode ? 8 : 7}>
                                        <div className="cert-empty-state">
                                            <IconUser size={40} color="#d1d5db" />
                                            <h6>No students found</h6>
                                            <p>Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : pagedStudents.map(student => (
                                <tr key={student.id} className={selectedStudents.includes(student.id) ? 'selected' : ''}>
                                    {batchMode && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => handleStudentSelect(student.id)}
                                            />
                                        </td>
                                    )}
                                    <td><span className="cert-roll-no">{student.roll}</span></td>
                                    <td>
                                        <div className="cert-student-cell">
                                            <div className="cert-student-avatar-small">
                                                <IconUser size={16} />
                                            </div>
                                            <span className="cert-student-name">{student.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#333448' }}>{student.class}</td>
                                    <td style={{ color: '#555' }}>{student.section}</td>
                                    <td style={{ color: '#555', fontSize: 13 }}>{student.father}</td>
                                    <td style={{ color: '#6e6b7b', fontSize: 13 }}>{student.dob}</td>
                                    <td>
                                        <div className="cert-table-actions">
                                            <button
                                                className="cert-btn-icon cert-btn-generate"
                                                title="Generate Certificate"
                                                onClick={() => generateCertificate(student)}
                                            >
                                                <IconCertificate size={15} />
                                            </button>
                                            <button
                                                className="cert-btn-icon"
                                                title="Preview"
                                                onClick={() => { setCurrentCertificate({ ...student, certType: selectedCertType, certificateId: `CERT-${Date.now()}` }); setShowPreviewModal(true); }}
                                            >
                                                <IconEye size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="cert-table-footer">
                    <span>Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredStudents.length)}–{Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length}</span>
                    <div className="cert-pagination">
                        <button className="cert-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                            <IconChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`cert-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >{i + 1}</button>
                        ))}
                        <button className="cert-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                            <IconChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Manual Entry Modal ── */}
            {showManualModal && (
                <div className="cert-modal-overlay" onClick={() => setShowManualModal(false)}>
                    <div className="cert-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="cert-modal-header">
                            <h4>✍️ Manual Certificate Entry</h4>
                            <button className="cert-modal-close" onClick={() => setShowManualModal(false)}>
                                <IconX size={18} />
                            </button>
                        </div>
                        <div className="cert-modal-body">
                            <div className="cert-form-grid">
                                {[
                                    { key: 'name', label: 'Student Name *', placeholder: 'Enter full name', type: 'text' },
                                    { key: 'roll', label: 'Roll Number', placeholder: 'e.g. RL-1001', type: 'text' },
                                    { key: 'father', label: "Father's Name", placeholder: "Father's/Guardian's name", type: 'text' },
                                    { key: 'dob', label: 'Date of Birth', placeholder: '', type: 'date' },
                                    { key: 'year', label: 'Academic Year', placeholder: 'e.g. 2025-26', type: 'text' },
                                ].map(field => (
                                    <div key={field.key} className="cert-form-group">
                                        <label>{field.label}</label>
                                        <input
                                            type={field.type}
                                            value={manualData[field.key]}
                                            onChange={e => setManualData({ ...manualData, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                                <div className="cert-form-group">
                                    <label>Class</label>
                                    <select value={manualData.class} onChange={e => setManualData({ ...manualData, class: e.target.value })}>
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                                    </select>
                                </div>
                                <div className="cert-form-group">
                                    <label>Section</label>
                                    <input type="text" value={manualData.section} onChange={e => setManualData({ ...manualData, section: e.target.value })} placeholder="e.g. A" />
                                </div>
                                <div className="cert-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Certificate Type</label>
                                    <div className="cert-type-tabs" style={{ marginTop: 4 }}>
                                        {CERT_TYPES.map(t => (
                                            <button
                                                key={t.id}
                                                className={`cert-type-tab ${manualData.certType === t.id ? 'active' : ''}`}
                                                onClick={() => setManualData({ ...manualData, certType: t.id })}
                                            >
                                                <span className="cert-type-tab-icon">{t.icon}</span>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {(manualData.certType === 'Sports Certificate' || manualData.certType === 'Transfer Certificate') && (
                                    <div className="cert-form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Additional Details</label>
                                        <input
                                            type="text"
                                            value={manualData.extraDetails}
                                            onChange={e => setManualData({ ...manualData, extraDetails: e.target.value })}
                                            placeholder={manualData.certType === 'Sports Certificate' ? 'Sport name / event...' : 'Reason for leaving...'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="cert-modal-footer">
                            <button className="cert-btn-secondary" onClick={() => setShowManualModal(false)}>Cancel</button>
                            <button className="cert-btn-primary" onClick={generateManual} disabled={!manualData.name}>
                                <IconCertificate size={15} /> Generate Certificate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Certificate Preview Modal ── */}
            {showPreviewModal && currentCertificate && (
                <div className="cert-modal-overlay" onClick={() => setShowPreviewModal(false)}>
                    <div className="cert-modal-content cert-modal-large" onClick={e => e.stopPropagation()}>
                        <div className="cert-modal-header">
                            <h4>📋 Preview — {currentCertificate.certType}</h4>
                            <div className="cert-table-actions">
                                <button className="cert-btn-primary" onClick={printCertificate}>
                                    <IconPrinter size={15} /> Print
                                </button>
                                <button className="cert-btn-secondary">
                                    <IconDownload size={15} /> Download
                                </button>
                                <button className="cert-modal-close" onClick={() => setShowPreviewModal(false)}>
                                    <IconX size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="cert-modal-body" id="certificate-print-area">
                            {/* Preview Meta */}
                            <div className="cert-preview-meta" style={{ marginBottom: 20 }}>
                                {[
                                    { label: 'Certificate ID', value: currentCertificate.certificateId },
                                    { label: 'Student', value: currentCertificate.name },
                                    { label: 'Class', value: `${currentCertificate.class} - ${currentCertificate.section}` },
                                    { label: 'Type', value: currentCertificate.certType },
                                ].map(item => (
                                    <div key={item.label} className="cert-preview-meta-item">
                                        <div className="cert-preview-meta-label">{item.label}</div>
                                        <div className="cert-preview-meta-value">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            {renderCertificate(currentCertificate)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateCertificate;
