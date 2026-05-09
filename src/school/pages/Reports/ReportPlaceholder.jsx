import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { REPORT_CONFIG, BADGE_COLORS } from './reportData';
import ExportToolbar from './ExportToolbar';
import './Reports.css';

/* ── small helpers ───────────────────────────────────────── */
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];

const Badge = ({ val }) => {
    if (!val) return <span>—</span>;
    const color = BADGE_COLORS[val] ?? 'grey';
    return <span className={`rpt-badge rpt-badge-${color}`}>{val}</span>;
};

const BarCell = ({ val }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="rpt-bar-wrap" style={{ flex: 1 }}>
            <div className="rpt-bar-fill" style={{
                width: `${val}%`,
                background: val >= 90 ? '#28c76f' : val >= 70 ? '#ff9f43' : '#ea5455'
            }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 12 }}>{val}%</span>
    </div>
);

/* ── main component ──────────────────────────────────────── */
const ReportPlaceholder = () => {
    const { reportType } = useParams();
    const config = REPORT_CONFIG[reportType];

    /* ── unknown route ── */
    if (!config) {
        return (
            <div className="rpt-report-page">
                <div className="rpt-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: 56 }}>📊</div>
                    <h3 style={{ color: '#333448', marginTop: 12 }}>Report Not Found</h3>
                    <p style={{ color: '#6e6b7b' }}>No report configured for <code>{reportType}</code>.</p>
                    <Link to="/school/reports" className="rpt-search-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 16 }}>
                        ← Back to Reports
                    </Link>
                </div>
            </div>
        );
    }

    const { title, icon, columns, rows, rowKeys, badgeKey, filters } = config;

    /* ── state ── */
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    /* ── filtered rows ── */
    const filtered = useMemo(() => rows.filter(r => {
        const clsMatch = !filterClass || String(r.class || '').startsWith(filterClass);
        const secMatch = !filterSection || String(r.section || r.class || '').includes(filterSection);
        const srchMatch = !searchText || Object.values(r).some(v =>
            String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        return clsMatch && secMatch && srchMatch;
    }), [rows, filterClass, filterSection, searchText]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = () => setPage(1);

    /* ── KPI summary ── */
    const isResultReport = reportType.includes('result');
    const kpiTotal = filtered.length;

    // Default KPIs
    const kpiPaid = filtered.filter(r => (r.status || r.payment || '') === 'Paid' || r.status === 'Active' || r.status === 'Success' || r.status === 'Approved' || r.status === 'Issued' || r.status === 'Pass').length;
    const kpiPending = filtered.filter(r => (r.status || '') === 'Pending').length;
    const kpiAlert = filtered.filter(r => ['Overdue', 'Fail', 'Rejected', 'Failed', 'Error'].includes(r.status || '')).length;

    // Result specific KPIs
    const passedCount = filtered.filter(r => (r.status || '') === 'Pass').length;
    const failedCount = filtered.filter(r => (r.status || '') === 'Fail').length;
    const passPercentage = kpiTotal > 0 ? Math.round((passedCount / kpiTotal) * 100) : 0;

    /* ── individual result state ── */
    const [selectedStudent, setSelectedStudent] = useState(null);

    /* ── data table ── */
    return (
        <div className="rpt-report-page">
            {/* ── header ── */}
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">{icon} {title}</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/reports">Reports &amp; Analytics</Link> /&nbsp;
                        <span className="rpt-breadcrumb-current">{title}</span>
                    </nav>
                </div>
                <ExportToolbar columns={columns} rows={filtered} rowKeys={rowKeys} title={title} />
            </div>

            {/* ── KPIs ── */}
            <div className="rpt-kpi-row">
                <div className="rpt-kpi-card">
                    <div className="rpt-kpi-icon" style={{ background: '#eef1fd', color: '#3d5ee1' }}>{isResultReport ? '👨‍🎓' : '📋'}</div>
                    <div className="rpt-kpi-info">
                        <p className="rpt-kpi-label">{isResultReport ? 'Total Students' : 'Total Records'}</p>
                        <h3 className="rpt-kpi-value">{kpiTotal}</h3>
                    </div>
                </div>

                {isResultReport ? (
                    <>
                        <div className="rpt-kpi-card">
                            <div className="rpt-kpi-icon" style={{ background: '#e8faf1', color: '#28c76f' }}>✅</div>
                            <div className="rpt-kpi-info">
                                <p className="rpt-kpi-label">Passed</p>
                                <h3 className="rpt-kpi-value">{passedCount}</h3>
                            </div>
                        </div>
                        <div className="rpt-kpi-card">
                            <div className="rpt-kpi-icon" style={{ background: '#fce8e8', color: '#ea5455' }}>❌</div>
                            <div className="rpt-kpi-info">
                                <p className="rpt-kpi-label">Failed</p>
                                <h3 className="rpt-kpi-value">{failedCount}</h3>
                            </div>
                        </div>
                        <div className="rpt-kpi-card">
                            <div className="rpt-kpi-icon" style={{ background: '#e0f9fc', color: '#00cfe8' }}>📈</div>
                            <div className="rpt-kpi-info">
                                <p className="rpt-kpi-label">Pass Percentage</p>
                                <h3 className="rpt-kpi-value">{passPercentage}%</h3>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {kpiPaid > 0 && (
                            <div className="rpt-kpi-card">
                                <div className="rpt-kpi-icon" style={{ background: '#e8faf1', color: '#28c76f' }}>✅</div>
                                <div className="rpt-kpi-info">
                                    <p className="rpt-kpi-label">Active / Paid</p>
                                    <h3 className="rpt-kpi-value">{kpiPaid}</h3>
                                </div>
                            </div>
                        )}
                        {kpiPending > 0 && (
                            <div className="rpt-kpi-card">
                                <div className="rpt-kpi-icon" style={{ background: '#fff5e6', color: '#ff9f43' }}>⏳</div>
                                <div className="rpt-kpi-info">
                                    <p className="rpt-kpi-label">Pending</p>
                                    <h3 className="rpt-kpi-value">{kpiPending}</h3>
                                </div>
                            </div>
                        )}
                        {kpiAlert > 0 && (
                            <div className="rpt-kpi-card">
                                <div className="rpt-kpi-icon" style={{ background: '#fce8e8', color: '#ea5455' }}>⚠️</div>
                                <div className="rpt-kpi-info">
                                    <p className="rpt-kpi-label">Alerts</p>
                                    <h3 className="rpt-kpi-value">{kpiAlert}</h3>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── filters ── */}
            <div className="rpt-filter-card">
                <h6 className="rpt-filter-title">🔍 Filter &amp; Search</h6>
                <div className="rpt-filter-grid">
                    {filters.includes('period') && (
                        <div className="rpt-filter-group">
                            <label>Period</label>
                            <select value={filterPeriod} onChange={e => { setFilterPeriod(e.target.value); setPage(1); }}>
                                <option value="">All Time</option>
                                <option value="Today">Today</option>
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                            </select>
                        </div>
                    )}
                    {filters.includes('class') && (
                        <div className="rpt-filter-group">
                            <label>Class</label>
                            <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
                                <option value="">All Classes</option>
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}
                    {filters.includes('section') && (
                        <div className="rpt-filter-group">
                            <label>Section</label>
                            <select value={filterSection} onChange={e => { setFilterSection(e.target.value); setPage(1); }}>
                                <option value="">All Sections</option>
                                {sections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="rpt-filter-group">
                        <label>Date From</label>
                        <input type="date" defaultValue="2025-01-01" />
                    </div>
                    <div className="rpt-filter-group">
                        <label>Date To</label>
                        <input type="date" defaultValue="2025-02-28" />
                    </div>
                    <div className="rpt-filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search any field..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13 }}
                        />
                    </div>
                    <div className="rpt-filter-group" style={{ alignSelf: 'flex-end' }}>
                        <button className="rpt-search-btn" onClick={handleSearch}>🔍 Generate Report</button>
                    </div>
                </div>
            </div>

            {/* ── data table ── */}
            <div className="rpt-table-card">
                <div className="rpt-table-header">
                    <h5 className="rpt-table-title">
                        {title} &nbsp;
                        <span style={{ fontSize: 13, fontWeight: 400, color: '#6e6b7b' }}>({filtered.length} records)</span>
                    </h5>
                    <ExportToolbar columns={columns} rows={filtered} rowKeys={rowKeys} title={title} />
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
                                        No records found for the selected filters.
                                    </td>
                                </tr>
                            ) : paginated.map((row, ri) => (
                                <tr key={ri}>
                                    {rowKeys.map(key => {
                                        const val = row[key];
                                        // Special renders
                                        if (key === badgeKey) {
                                            return <td key={key}><Badge val={String(val)} /></td>;
                                        }
                                        if ((key === 'pct' || key === 'percentage' || key === 'passPct' || key === 'avgPct') && typeof val === 'number') {
                                            return <td key={key}><BarCell val={val} /></td>;
                                        }
                                        if (key === 'name' && reportType === 'result-report') {
                                            return (
                                                <td key={key}>
                                                    <button
                                                        onClick={() => setSelectedStudent(row)}
                                                        className="rpt-name-link"
                                                    >
                                                        {val}
                                                    </button>
                                                </td>
                                            );
                                        }
                                        if (key === 'action' && reportType === 'progress-report') {
                                            return (
                                                <td key={key} style={{ textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => setSelectedStudent(row)}
                                                        className="rpt-search-btn"
                                                        style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                                                    >
                                                        ✨ Generate
                                                    </button>
                                                </td>
                                            );
                                        }
                                        if (key === 'status' && (val === 'Pass' || val === 'Fail')) {
                                            return <td key={key}><Badge val={String(val)} /></td>;
                                        }
                                        if (key === 'debit' && val !== '—') {
                                            return <td key={key} style={{ color: '#ea5455', fontWeight: 600 }}>{val}</td>;
                                        }
                                        if (key === 'credit' && val !== '—') {
                                            return <td key={key} style={{ color: '#28c76f', fontWeight: 600 }}>{val}</td>;
                                        }
                                        if (key === 'due' || key === 'bal' || key === 'fine' || key === 'amount') {
                                            const n = Number(String(val).replace(/[^0-9]/g, ''));
                                            if (!isNaN(n) && n > 0) {
                                                return <td key={key} style={{ color: '#ea5455', fontWeight: 600 }}>
                                                    {typeof val === 'number' ? `₹${val.toLocaleString()}` : val}
                                                </td>;
                                            }
                                        }
                                        if (key === 'rank') {
                                            return <td key={key}>
                                                <span style={{
                                                    background: val === 1 ? '#ffd700' : val === 2 ? '#c0c0c0' : val === 3 ? '#cd7f32' : '#f0f0f0',
                                                    color: val <= 3 ? '#333' : '#555',
                                                    padding: '2px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13
                                                }}>#{val}</span>
                                            </td>;
                                        }
                                        if (key === 'sno') {
                                            return <td key={key} style={{ color: '#999' }}>{val}</td>;
                                        }
                                        if (key === 'admNo' || key === 'empId' || key === 'id' || key === 'txnId' || key === 'voucher') {
                                            return <td key={key}><strong style={{ color: '#3d5ee1' }}>{val}</strong></td>;
                                        }
                                        return <td key={key}>{val ?? '—'}</td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                <div className="rpt-table-footer">
                    <span style={{ color: '#6e6b7b', fontSize: 13 }}>
                        Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="rpt-pagination">
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                            .reduce((acc, n, i, arr) => {
                                if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
                                acc.push(n);
                                return acc;
                            }, [])
                            .map((n, i) => n === '...'
                                ? <span key={i} style={{ padding: '0 4px', color: '#999' }}>…</span>
                                : <button key={n} className={`rpt-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                            )
                        }
                        <button className="rpt-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                    </div>
                </div>
            </div>

            {/* ── Individual Result / Progress Card Modal ── */}
            {selectedStudent && (
                <div className="rpt-modal-overlay">
                    <div className="rpt-modal-content" style={{ maxWidth: reportType === 'progress-report' ? '900px' : '800px' }}>
                        <div className="rpt-modal-header">
                            <div>
                                <h4 className="rpt-modal-title">{reportType === 'progress-report' ? 'Preview Progress Report' : `Report Card: ${selectedStudent.name}`}</h4>
                                <p className="rpt-modal-subtitle">Adm No: {selectedStudent.admNo} • Class: {selectedStudent.class}-{selectedStudent.section}</p>
                            </div>
                            <button className="rpt-modal-close" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>
                        <div className="rpt-modal-body" style={{ padding: reportType === 'progress-report' ? '0' : '30px' }}>
                            {reportType === 'progress-report' ? (
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
                                    </div>

                                    {/* Student Details */}
                                    <div className="rpt-pc-details">
                                        <div className="pc-detail-item"><span>Student Name:</span> <strong>{selectedStudent.name}</strong></div>
                                        <div className="pc-detail-item"><span>Admission No:</span> <strong>{selectedStudent.admNo}</strong></div>
                                        <div className="pc-detail-item"><span>Class-Sec:</span> <strong>{selectedStudent.class}-{selectedStudent.section}</strong></div>
                                        <div className="pc-detail-item"><span>Attendance:</span> <strong>{selectedStudent.attendance}</strong></div>
                                        <div className="pc-detail-item"><span>Total Marks:</span> <strong>{selectedStudent.total}</strong></div>
                                        <div className="pc-detail-item"><span>Result:</span> <strong>{selectedStudent.status}</strong></div>
                                    </div>

                                    {/* Academic Performance Table */}
                                    <div className="rpt-pc-academic">
                                        <h4 className="pc-section-title">Academic Performance</h4>
                                        <table className="pc-table">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Max Marks</th>
                                                    <th>Obtained</th>
                                                    <th>Grade</th>
                                                    <th>Performance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {['Mathematics', 'Science', 'English', 'Social Studies', 'History', 'Computer'].map(sub => {
                                                    const subMax = 100;
                                                    const subObtained = Math.round(subMax * (selectedStudent.pct / 100 + (Math.random() * 0.1 - 0.05)));
                                                    const finalObtained = Math.min(subMax, Math.max(0, subObtained));
                                                    const subGrade = finalObtained >= 90 ? 'A+' : finalObtained >= 80 ? 'A' : finalObtained >= 70 ? 'B' : finalObtained >= 60 ? 'C' : 'D';

                                                    return (
                                                        <tr key={sub}>
                                                            <td>{sub}</td>
                                                            <td>{subMax}</td>
                                                            <td><strong>{finalObtained}</strong></td>
                                                            <td>{subGrade}</td>
                                                            <td style={{ width: '120px' }}>
                                                                <div className="pc-range-bar">
                                                                    <div className="pc-range-fill" style={{ width: `${finalObtained}%`, background: finalObtained >= 80 ? '#28c76f' : '#ff9f43' }} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Remarks & Signs */}
                                    <div className="rpt-pc-summary" style={{ padding: '20px 30px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px' }}>REMARKS</h5>
                                            <p style={{ fontSize: '13px', margin: 0 }}>Excellent academic performance and participation in co-curricular activities.</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <h5 style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px' }}>FINAL GRADE</h5>
                                            <div style={{ width: '40px', height: '40px', background: '#3d5ee1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto' }}>{selectedStudent.grade}</div>
                                        </div>
                                    </div>

                                    <div className="rpt-pc-signs" style={{ padding: '40px 30px 20px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ textAlign: 'center', width: '120px', borderTop: '1px solid #ccc', paddingTop: '5px', fontSize: '11px', fontWeight: '600' }}>Class Teacher</div>
                                        <div style={{ textAlign: 'center', width: '120px', borderTop: '1px solid #ccc', paddingTop: '5px', fontSize: '11px', fontWeight: '600' }}>Coordinator</div>
                                        <div style={{ textAlign: 'center', width: '120px', borderTop: '1px solid #ccc', paddingTop: '5px', fontSize: '11px', fontWeight: '600' }}>Principal</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="rpt-result-summary">
                                        <div className="rpt-summary-item">
                                            <span>Total Marks</span>
                                            <strong>{selectedStudent.total} / {selectedStudent.maxMarks}</strong>
                                        </div>
                                        <div className="rpt-summary-item">
                                            <span>Percentage</span>
                                            <strong>{selectedStudent.pct}%</strong>
                                        </div>
                                        <div className="rpt-summary-item">
                                            <span>Result</span>
                                            <Badge val={selectedStudent.status} />
                                        </div>
                                        <div className="rpt-summary-item">
                                            <span>Grade</span>
                                            <strong style={{ color: '#3d5ee1' }}>{selectedStudent.grade}</strong>
                                        </div>
                                    </div>

                                    <table className="rpt-subject-table-view">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Max Marks</th>
                                                <th>Obtained</th>
                                                <th>Grade</th>
                                                <th>Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {['Mathematics', 'Science', 'English', 'Social Studies', 'History', 'Computer'].map(sub => {
                                                const subMax = selectedStudent.maxMarks / 6;
                                                const subObtained = Math.round(subMax * (selectedStudent.pct / 100 + (Math.random() * 0.2 - 0.1)));
                                                const finalObtained = Math.min(subMax, Math.max(0, subObtained));
                                                const subPct = Math.round((finalObtained / subMax) * 100);
                                                const subGrade = subPct >= 90 ? 'A+' : subPct >= 80 ? 'A' : subPct >= 70 ? 'B' : subPct >= 60 ? 'C' : 'D';

                                                return (
                                                    <tr key={sub}>
                                                        <td>{sub}</td>
                                                        <td>{subMax}</td>
                                                        <td><strong>{finalObtained}</strong></td>
                                                        <td><span className={`rpt-grade-tag grade-${subGrade[0].toLowerCase()}`}>{subGrade}</span></td>
                                                        <td style={{ width: '120px' }}><BarCell val={subPct} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                        <div className="rpt-modal-footer">
                            <button className="rpt-btn-outline" onClick={() => window.print()}>🖨️ Print Report</button>
                            <button className="rpt-search-btn" onClick={() => setSelectedStudent(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportPlaceholder;
