import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { StudentContext } from '../../../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import './StudentList.css';
import BackButton from './components/BackButton';
import ExportToolbar from '../Reports/ExportToolbar';
import { EyeIcon, EditIcon, BanIcon, PlaceholderAvatar } from '../../../components/Icons';

/* ── Toast snackbar ──────────────────────────────────────── */
const showSnack = (msg) => {
    const prev = document.getElementById('sl-snack');
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.id = 'sl-snack'; el.className = 'sl-snack'; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('sl-snack-out'); setTimeout(() => el.remove(), 300); }, 2400);
};

/* ── Column definitions ──────────────────────────────────── */
const ALL_COLS = [
    { key: 'adm', label: 'Adm No.' },
    { key: 'photo', label: 'Photo' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'father', label: 'Father' },
    { key: 'phone', label: 'Phone' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'due', label: 'Due' },
    { key: 'actions', label: 'Actions' },
];

/* ── Excel (XLSX-like TSV) helper ────────────────────────── */
const downloadFile = (content, name, type) => {
    const a = document.createElement('a');
    a.href = `data:${type};charset=utf-8,${encodeURIComponent(content)}`;
    a.download = name; a.click();
};

/* ── Filter Dropdown Component ────────────────────────────── */
const FilterPanel = ({
    open, onClose,
    visibleCols, setVisibleCols,
    filterName, setFilterName,
    filterClass, setFilterClass,
    filterStatus, setFilterStatus,
    filterSection, setFilterSection,
    filterGender, setFilterGender,
    uniqueNames, uniqueClasses,
    onReset, onApply,
}) => {
    const ref = useRef();
    const sections = ['A', 'B', 'C', 'D'];
    const genders = ['Male', 'Female', 'Other'];

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                // Check if click was on the filter button itself handled by parent
                onClose();
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="sl-filter-dropdown" ref={ref}>
            <div className="sl-fd-head">
                <span className="sl-fd-title">Filter</span>
            </div>

            <div className="sl-fd-body">
                {/* Class & Section row */}
                <div className="sl-fd-row">
                    <div className="sl-fd-field">
                        <label>Class</label>
                        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            <option value="">Select</option>
                            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="sl-fd-field">
                        <label>Section</label>
                        <select value={filterSection} onChange={e => setFilterSection(e.target.value)}>
                            <option value="">Select</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Name row */}
                <div className="sl-fd-field">
                    <label>Name</label>
                    <select value={filterName} onChange={e => setFilterName(e.target.value)}>
                        <option value="">Select</option>
                        {uniqueNames.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                {/* Gender & Status row */}
                <div className="sl-fd-row">
                    <div className="sl-fd-field">
                        <label>Gender</label>
                        <select value={filterGender} onChange={e => setFilterGender(e.target.value)}>
                            <option value="">Select</option>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="sl-fd-field">
                        <label>Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">Select</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="sl-fd-columns-toggle">
                    <div className="sl-fd-cols-header">Show/Hide Columns</div>
                    <div className="sl-fd-cols-grid">
                        {ALL_COLS.map(c => (
                            <label key={c.key}>
                                <input type="checkbox"
                                    checked={visibleCols.has(c.key)}
                                    onChange={() => {
                                        const s = new Set(visibleCols);
                                        s.has(c.key) ? s.delete(c.key) : s.add(c.key);
                                        setVisibleCols(s);
                                    }}
                                />
                                {c.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sl-fd-footer">
                <button className="sl-fd-reset" onClick={onReset}>Reset</button>
                <button className="sl-fd-apply" onClick={() => { onApply(); onClose(); }}>Apply</button>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const StudentList = () => {
    const navigate = useNavigate();
    const { students, disablingIds } = useContext(StudentContext);

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    /* Filter panel state (staged — applied on "Apply") */
    const [panelOpen, setPanelOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    /* Close Sort dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.sl-sort-container')) setSortOpen(false);
        };
        if (sortOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [sortOpen]);
    const [stageName, setStageName] = useState('');
    const [stageClass, setStageClass] = useState('');
    const [stageStatus, setStageStatus] = useState('');
    const [stageSection, setStageSection] = useState('');
    const [stageGender, setStageGender] = useState('');
    const [visibleCols, setVisibleCols] = useState(new Set(ALL_COLS.map(c => c.key)));

    /* Applied filters */
    const [filterName, setFilterName] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [filterGender, setFilterGender] = useState('');

    const [sortKey, setSortKey] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    /* unique values for filter panel dropdowns */
    const uniqueClasses = useMemo(() =>
        [...new Set(students.map(s => s.class || s.className).filter(Boolean))].sort(),
        [students]);
    const uniqueNames = useMemo(() =>
        [...new Set(students.map(s => s.name).filter(Boolean))].sort(),
        [students]);

    /* filtered + sorted list */
    const filtered = useMemo(() => {
        let list = students.filter(s => {
            const q = searchQuery.toLowerCase();
            const matchQ = !q ||
                (s.name || '').toLowerCase().includes(q) ||
                (s.admissionNo || s.id || '').toLowerCase().includes(q) ||
                (s.fatherName || '').toLowerCase().includes(q) ||
                (s.fatherPhone || s.phone || '').toLowerCase().includes(q);
            if (!matchQ) return false;
            if (filterName && s.name !== filterName) return false;
            if (filterClass && (s.class || s.className) !== filterClass) return false;
            if (filterSection && (s.section || s.sectionName || '') !== filterSection) return false;
            if (filterGender && s.gender !== filterGender) return false;
            if (filterStatus) {
                const st = disablingIds.includes(s.id) ? 'Inactive' : 'Active';
                if (st !== filterStatus) return false;
            }
            return true;
        });
        list = [...list].sort((a, b) => {
            const av = sortKey === 'adm' ? (a.admissionNo || a.id) : a[sortKey] || '';
            const bv = sortKey === 'adm' ? (b.admissionNo || b.id) : b[sortKey] || '';
            return sortDir === 'asc'
                ? String(av).localeCompare(String(bv), undefined, { numeric: true })
                : String(bv).localeCompare(String(av), undefined, { numeric: true });
        });
        return list;
    }, [students, searchQuery, filterName, filterClass, filterStatus, sortKey, sortDir, disablingIds]);

    /* pagination */
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const goPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

    /* sort */
    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
        setPage(1);
    };
    const SortArrow = ({ col }) => {
        if (sortKey !== col) return <span className="sl-sort-idle">↕</span>;
        return <span className="sl-sort-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    /* selection */
    const toggleRow = (id) => setSelectedIds(prev => {
        const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
    });
    const isAll = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));
    const toggleAll = (e) => setSelectedIds(e.target.checked ? new Set(filtered.map(s => s.id)) : new Set());

    /* active filter count badge */
    const activeFilters = [filterName, filterClass, filterStatus, filterSection, filterGender].filter(Boolean).length;
    const clearAllFilters = () => {
        setFilterName(''); setFilterClass(''); setFilterStatus(''); setFilterSection(''); setFilterGender('');
        setStageName(''); setStageClass(''); setStageStatus(''); setStageSection(''); setStageGender('');
        setSearchQuery(''); setPage(1);
    };

    /* exports */
    const exportData = useMemo(() => {
        const rows = selectedIds.size ? filtered.filter(s => selectedIds.has(s.id)) : filtered;
        return rows.map(s => ({
            adm: s.admissionNo || s.id,
            name: s.name,
            class: s.class || s.className,
            father: s.fatherName,
            phone: s.fatherPhone || s.phone,
            assigned: s.totalAssigned?.toFixed(2) || '0',
            due: s.totalDue?.toFixed(2) || '0'
        }));
    }, [filtered, selectedIds]);

    return (
        <div className="sl-page">

            {/* ── Page Header ──────────────────────────────────── */}
            <div className="sl-header">
                <div className="sl-header-left">
                    <BackButton title="Go back" />
                    <div>
                        <h4 className="sl-title">Students</h4>
                        <nav className="sl-breadcrumb">
                            Student Management / <span>Students</span>
                        </nav>
                    </div>
                </div>

                <div className="sl-header-actions">
                    <button className="sl-h-icon-btn" title="Refresh" onClick={() => window.location.reload()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                    </button>
                    <button className="sl-h-icon-btn" title="Print" onClick={() => window.print()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                    </button>

                    <div className="sl-export-dropdown-wrap">
                        <ExportToolbar
                            rows={exportData}
                            columns={['Adm No', 'Name', 'Class', 'Father Name', 'Phone', 'Assigned', 'Due']}
                            rowKeys={['adm', 'name', 'class', 'father', 'phone', 'assigned', 'due']}
                            title="Student_List"
                        />
                    </div>

                    <button className="sl-btn-add" onClick={() => navigate('/school/student-list/add')}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Student
                    </button>
                </div>
            </div>

            {/* ── Empty state ───────────────────────────────────── */}
            {students.length === 0 ? (
                <div className="sl-empty">
                    <div className="sl-empty-icon">👨‍🎓</div>
                    <h3>No Students Yet</h3>
                    <p>Start by adding your first student to the system</p>
                    <button className="sl-btn-add sl-mt" onClick={() => navigate('/school/student-list/add')}>
                        + Add First Student
                    </button>
                </div>
            ) : (
                <div className={`sl-card ${panelOpen || sortOpen ? 'sl-card-allow-overflow' : ''}`}>

                    {/* ── Toolbar ──────────────────────────────── */}
                    <div className="sl-toolbar">
                        {/* Date Picker (Mock) */}
                        <div className="sl-tool-date">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', color: '#6e6b7b' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            <span>02/21/2026 - 02/27/2026</span>
                        </div>

                        {/* Filter Container */}
                        <div className="sl-filter-container">
                            <button
                                className={`sl-filter-btn ${activeFilters > 0 ? 'sl-filter-btn-active' : ''}`}
                                onClick={() => setPanelOpen(!panelOpen)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                Filter
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="3" style={{ marginLeft: '4px' }}>
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                                {activeFilters > 0 && <span className="sl-filter-badge">{activeFilters}</span>}
                            </button>

                            <FilterPanel
                                open={panelOpen}
                                onClose={() => setPanelOpen(false)}
                                visibleCols={visibleCols} setVisibleCols={setVisibleCols}
                                filterName={stageName} setFilterName={setStageName}
                                filterClass={stageClass} setFilterClass={setStageClass}
                                filterStatus={stageStatus} setFilterStatus={setStageStatus}
                                filterSection={stageSection} setFilterSection={setStageSection}
                                filterGender={stageGender} setFilterGender={setStageGender}
                                uniqueNames={uniqueNames} uniqueClasses={uniqueClasses}
                                onReset={() => {
                                    setStageName(''); setStageClass(''); setStageStatus('');
                                    setStageSection(''); setStageGender('');
                                    setVisibleCols(new Set(ALL_COLS.map(c => c.key)));
                                }}
                                onApply={() => {
                                    setFilterName(stageName); setFilterClass(stageClass); setFilterStatus(stageStatus);
                                    setFilterSection(stageSection); setFilterGender(stageGender);
                                    setPage(1);
                                }}
                            />
                        </div>



                        {/* Sort Dropdown */}
                        <div className="sl-sort-container">
                            <button className="sl-sort-dropdown-btn" onClick={() => setSortOpen(!sortOpen)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}><path d="M11 5L6 9l5 4M6 9h12M13 19l5-4-5-4M18 15H6" /></svg>
                                Sort: {sortKey === 'name' ? (sortDir === 'asc' ? 'A-Z' : 'Z-A') : (sortDir === 'asc' ? 'ID (L-H)' : 'ID (H-L)')}
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '4px' }}><path d="M6 9l6 6 6-6" /></svg>
                            </button>

                            {sortOpen && (
                                <div className="sl-sort-dropdown">
                                    <div className="sl-sd-item" onClick={() => { setSortKey('name'); setSortDir('asc'); setSortOpen(false); }}>Name A-Z</div>
                                    <div className="sl-sd-item" onClick={() => { setSortKey('name'); setSortDir('desc'); setSortOpen(false); }}>Name Z-A</div>
                                    <div className="sl-sd-item" onClick={() => { setSortKey('adm'); setSortDir('asc'); setSortOpen(false); }}>Adm No (Low-High)</div>
                                    <div className="sl-sd-item" onClick={() => { setSortKey('adm'); setSortDir('desc'); setSortOpen(false); }}>Adm No (High-Low)</div>
                                </div>
                            )}
                        </div>

                        <div className="sl-toolbar-spacer" />

                        {/* Search */}
                        <div className="sl-search-wrap">
                            <svg className="sl-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input className="sl-search" placeholder="Search..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} />
                        </div>
                    </div>

                    {/* ── Table ────────────────────────────────── */}
                    <div className="sl-table-wrap">
                        <table className="sl-table">
                            <thead>
                                <tr>
                                    <th className="sl-th-check">
                                        <input type="checkbox" checked={isAll} onChange={toggleAll} />
                                    </th>
                                    {visibleCols.has('adm') && (
                                        <th className="sl-th-adm" onClick={() => toggleSort('adm')}>
                                            Adm No. <SortArrow col="adm" />
                                        </th>
                                    )}
                                    {visibleCols.has('photo') && <th className="sl-th-photo">Photo</th>}
                                    {visibleCols.has('name') && (
                                        <th className="sl-th-name" onClick={() => toggleSort('name')}>
                                            Name <SortArrow col="name" />
                                        </th>
                                    )}
                                    {visibleCols.has('class') && (
                                        <th className="sl-th-class" onClick={() => toggleSort('class')}>
                                            Class <SortArrow col="class" />
                                        </th>
                                    )}
                                    {visibleCols.has('father') && <th className="sl-th-father">Father</th>}
                                    {visibleCols.has('phone') && <th className="sl-th-phone">Phone</th>}
                                    {visibleCols.has('assigned') && <th className="sl-th-amt">Assigned</th>}
                                    {visibleCols.has('due') && <th className="sl-th-amt">Due</th>}
                                    {visibleCols.has('actions') && <th className="sl-th-actions">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleCols.size + 1} className="sl-empty-row">
                                            No students match your filters
                                        </td>
                                    </tr>
                                ) : paginated.map(s => {
                                    const isDisabled = disablingIds.includes(s.id);
                                    const due = s.totalDue ?? null;
                                    return (
                                        <tr key={s.id} className={`sl-row ${selectedIds.has(s.id) ? 'sl-row-selected' : ''}`}>
                                            <td className="sl-td-check">
                                                <input type="checkbox"
                                                    checked={selectedIds.has(s.id)}
                                                    onChange={() => toggleRow(s.id)} />
                                            </td>
                                            {visibleCols.has('adm') && (
                                                <td className="sl-td-adm">
                                                    <span className="sl-adm-badge">{s.admissionNo || s.id || '—'}</span>
                                                </td>
                                            )}
                                            {visibleCols.has('photo') && (
                                                <td className="sl-td-photo">
                                                    {s.image
                                                        ? <img src={s.image} alt={s.name} className="sl-avatar" />
                                                        : <PlaceholderAvatar gender={s.gender} size={36} />
                                                    }
                                                </td>
                                            )}
                                            {visibleCols.has('name') && (
                                                <td className="sl-td-name">
                                                    <div className="sl-name-row">
                                                        <span className="sl-name">{s.name || '—'}</span>
                                                        {isDisabled && <span className="sl-badge-inactive">Inactive</span>}
                                                    </div>
                                                </td>
                                            )}
                                            {visibleCols.has('class') && (
                                                <td>
                                                    <span className="sl-class-pill">{s.class || s.className || '—'}</span>
                                                </td>
                                            )}
                                            {visibleCols.has('father') && <td className="sl-td-text">{s.fatherName || '—'}</td>}
                                            {visibleCols.has('phone') && <td className="sl-td-text">{s.fatherPhone || s.phone || '—'}</td>}
                                            {visibleCols.has('assigned') && (
                                                <td className="sl-td-amt">
                                                    {s.totalAssigned != null ? `₹${s.totalAssigned.toFixed(2)}` : '—'}
                                                </td>
                                            )}
                                            {visibleCols.has('due') && (
                                                <td className="sl-td-amt">
                                                    {due == null ? '—' : (
                                                        <span className={`sl-due-badge ${due > 0 ? 'danger' : 'clear'}`}>
                                                            {due > 0 ? `₹${due.toFixed(2)}` : 'Clear'}
                                                        </span>
                                                    )}
                                                </td>
                                            )}
                                            {visibleCols.has('actions') && (
                                                <td className="sl-td-actions">
                                                    <button className="sl-icon-btn view" title="View"
                                                        onClick={() => navigate(`/school/student-profile/${s.id}`)}>
                                                        <EyeIcon />
                                                    </button>
                                                    <button className="sl-icon-btn edit" title="Edit"
                                                        onClick={() => navigate('/school/student-list/add', { state: { editId: s.id } })}>
                                                        <EditIcon />
                                                    </button>
                                                    <button className="sl-icon-btn disable" title="Disable"
                                                        disabled={isDisabled}
                                                        onClick={() => navigate(`/school/disable-student/${s.id}`)}>
                                                        <BanIcon />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ────────────────────────────── */}
                    {totalPages > 1 && (
                        <div className="sl-pagination">
                            <span className="sl-page-info">
                                Page {page} of {totalPages} · {filtered.length} results
                            </span>
                            <div className="sl-page-btns">
                                <button className="sl-page-btn" disabled={page === 1} onClick={() => goPage(1)}>«</button>
                                <button className="sl-page-btn" disabled={page === 1} onClick={() => goPage(page - 1)}>‹</button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const p = Math.min(Math.max(page - 2, 1) + i, totalPages);
                                    return (
                                        <button key={p}
                                            className={`sl-page-btn ${p === page ? 'sl-page-active' : ''}`}
                                            onClick={() => goPage(p)}>{p}
                                        </button>
                                    );
                                })}
                                <button className="sl-page-btn" disabled={page === totalPages} onClick={() => goPage(page + 1)}>›</button>
                                <button className="sl-page-btn" disabled={page === totalPages} onClick={() => goPage(totalPages)}>»</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default StudentList;
