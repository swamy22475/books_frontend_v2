import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { StudentContext } from '../../../context/StudentContext';
import { AcademicsContext } from '../../../context/AcademicsContext';
import './BulkEdit.css';
import BackButton from './components/BackButton';
import { PlaceholderAvatar } from '../../../components/Icons';

/* ── Toast snackbar ──────────────────────────────────────── */
const showSnack = (msg, type = 'default') => {
    const prev = document.getElementById('be-snack');
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.id = 'be-snack';
    el.className = `be-snack be-snack-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('be-snack-out'); setTimeout(() => el.remove(), 300); }, 2600);
};

/* ── Field definitions ───────────────────────────────────── */
const FIELDS = [
    { key: 'class', label: 'Class', type: 'select' },
    { key: 'section', label: 'Section', type: 'select' },
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'rollNo', label: 'Roll No', type: 'number' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'gender', label: 'Gender', type: 'select' },
    { key: 'aadhaar', label: 'Aadhaar', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'dob', label: 'Date of Birth', type: 'date' },
    { key: 'photo', label: 'Photo', type: 'photo' },
];

const getFieldValue = (s, key) => {
    switch (key) {
        case 'firstName': return s.firstName || (s.name ? s.name.split(' ')[0] : '');
        case 'lastName': return s.lastName || (s.name ? s.name.split(' ').slice(1).join(' ') : '');
        case 'phone': return s.phone || s.fatherPhone || '';
        case 'whatsapp': return s.whatsapp || '';
        case 'aadhaar': return s.aadhaar || '';
        case 'photo': return s.photo || s.image || '';
        default: return s[key] != null ? String(s[key]) : '';
    }
};

const downloadFile = (content, name, type) => {
    const a = document.createElement('a');
    a.href = `data:${type};charset=utf-8,${encodeURIComponent(content)}`;
    a.download = name; a.click();
};

/* ═══════════════════════════════════════════════════════════
   EDITABLE CELL COMPONENT
═══════════════════════════════════════════════════════════ */
const EditableCell = ({ studentId, field, value, type, options, isSelected, isEditing, onEdit, onSave, onCancel, editValue, onChangeEdit, isChanged }) => {
    if (!isSelected) {
        return <span className="be-cell-locked">{value || '—'}</span>;
    }
    if (isEditing) {
        return (
            <div className="be-cell-editing">
                {type === 'select' ? (
                    <select className="be-edit-input" value={editValue} autoFocus onChange={onChangeEdit}>
                        <option value="">Select…</option>
                        {(options || []).map((o, i) => (
                            <option key={i} value={typeof o === 'string' ? o : o.id}>
                                {typeof o === 'string' ? o : o.name}
                            </option>
                        ))}
                    </select>
                ) : type === 'date' ? (
                    <input className="be-edit-input" type="date" value={editValue} autoFocus onChange={onChangeEdit} />
                ) : (
                    <input className="be-edit-input" type={type === 'number' ? 'number' : 'text'}
                        value={editValue} autoFocus onChange={onChangeEdit} />
                )}
                <button className="be-edit-save" title="Save" onClick={onSave}>✔</button>
                <button className="be-edit-cancel" title="Cancel" onClick={onCancel}>✖</button>
            </div>
        );
    }
    return (
        <span
            className={`be-cell-value ${isSelected ? 'be-cell-clickable' : ''} ${isChanged ? 'be-cell-changed' : ''}`}
            onClick={onEdit}
            title={isSelected ? 'Click to edit' : ''}
        >
            {value || '—'}
            {isSelected && <span className="be-edit-hint">✎</span>}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const BulkEdit = () => {
    const { students } = useContext(StudentContext);
    const { classes: academicClasses } = useContext(AcademicsContext);

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFields, setSelectedFields] = useState(new Set());
    const [editingCell, setEditingCell] = useState(null); // { id, field }
    const [editValue, setEditValue] = useState('');
    const [changedRows, setChangedRows] = useState(new Set());

    const classList = academicClasses || [];
    const sections = ['A', 'B', 'C', 'D'];
    const genders = ['Male', 'Female', 'Other'];

    /* Filtered students */
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return students.filter(s =>
            (s.name || '').toLowerCase().includes(q) ||
            (s.admissionNo || s.id || '').toLowerCase().includes(q) ||
            (s.fatherName || '').toLowerCase().includes(q) ||
            (s.fatherPhone || s.phone || '').toLowerCase().includes(q)
        );
    }, [students, searchQuery]);

    /* Selection */
    const isAll = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));
    const toggleAll = (e) => setSelectedIds(e.target.checked ? new Set(filtered.map(s => s.id)) : new Set());
    const toggleRow = (id) => setSelectedIds(prev => {
        const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
    });

    /* Field toggle */
    const toggleField = (key) => setSelectedFields(prev => {
        const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s;
    });

    /* Active fields list (preserves order) */
    const activeFields = FIELDS.filter(f => selectedFields.has(f.key));

    /* Cell editing */
    const startEdit = (id, field, val) => {
        if (!selectedIds.has(id)) return;
        setEditingCell({ id, field });
        setEditValue(val || '');
    };
    const saveEdit = (id, field) => {
        const student = students.find(s => s.id === id);
        if (student) { student[field] = editValue; setChangedRows(prev => new Set(prev).add(id)); }
        setEditingCell(null);
    };
    const cancelEdit = () => setEditingCell(null);

    /* Save all */
    const handleSaveAll = () => {
        if (changedRows.size === 0) { showSnack('No changes to save', 'warn'); return; }
        showSnack(`Saved changes for ${changedRows.size} student(s)!`, 'success');
        setChangedRows(new Set());
    };

    /* Export */
    const getRows = () => selectedIds.size ? filtered.filter(s => selectedIds.has(s.id)) : filtered;
    const ensureFields = () => { if (selectedFields.size === 0) { showSnack('Select fields to export first', 'warn'); return false; } return true; };

    const exportCopy = () => {
        if (!ensureFields()) return;
        const hdrs = activeFields.map(f => f.label);
        const data = getRows().map(s => activeFields.map(f => getFieldValue(s, f.key)).join('\t'));
        navigator.clipboard.writeText([hdrs.join('\t'), ...data].join('\n'))
            .then(() => showSnack('Copied to clipboard!', 'success'));
    };
    const exportCSV = () => {
        if (!ensureFields()) return;
        const hdrs = activeFields.map(f => f.label);
        const rows = getRows().map(s => activeFields.map(f => `"${getFieldValue(s, f.key).replace(/"/g, '""')}"`));
        downloadFile('\uFEFF' + [hdrs, ...rows].map(r => r.join(',')).join('\n'), 'bulk-edit.csv', 'text/csv');
        showSnack('CSV downloaded', 'success');
    };
    const exportExcel = () => {
        if (!ensureFields()) return;
        const hdrs = activeFields.map(f => f.label);
        const rows = getRows().map(s => activeFields.map(f => getFieldValue(s, f.key)));
        downloadFile([hdrs, ...rows].map(r => r.join('\t')).join('\n'), 'bulk-edit.xls', 'application/vnd.ms-excel');
        showSnack('Excel downloaded', 'success');
    };
    const handlePrint = () => window.print();

    return (
        <div className="be-page">

            {/* ── Page Header ──────────────────────────────────── */}
            <div className="be-header">
                <div className="be-header-left">
                    <BackButton title="Go back to Students" />
                    <div>
                        <h4 className="be-title">Bulk Edit Students</h4>
                        <nav className="be-breadcrumb">
                            Student Management / <span>Bulk Edit</span>
                        </nav>
                    </div>
                </div>
                {changedRows.size > 0 && (
                    <button className="be-save-btn" onClick={handleSaveAll}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save Changes ({changedRows.size})
                    </button>
                )}
            </div>

            {/* ── Info Banner ───────────────────────────────────── */}
            {selectedIds.size === 0 && (
                <div className="be-info-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                    </svg>
                    Select students using the checkboxes below, then click any cell in a selected row to edit it.
                </div>
            )}

            {/* ── Empty state ───────────────────────────────────── */}
            {students.length === 0 ? (
                <div className="be-empty">
                    <div className="be-empty-icon">👨‍🎓</div>
                    <h3>No Students Found</h3>
                    <p>Add students first before using bulk edit</p>
                </div>
            ) : (
                <div className="be-card">

                    {/* ── Toolbar ──────────────────────────────── */}
                    <div className="be-toolbar">
                        {/* Search */}
                        <div className="be-search-wrap">
                            <svg className="be-search-icon" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input className="be-search" placeholder="Search student by name, ID, father…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)} />
                        </div>

                        <div className="be-toolbar-spacer" />

                        {/* Stats */}
                        <span className="be-stats">
                            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
                            {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
                            {changedRows.size > 0 && <span className="be-modified-badge"> · {changedRows.size} modified</span>}
                        </span>

                        {/* Export group */}
                        <div className="be-export-group">
                            <button className="be-export-btn" onClick={exportCopy}>📋 Copy</button>
                            <button className="be-export-btn" onClick={exportCSV}>📄 CSV</button>
                            <button className="be-export-btn" onClick={exportExcel}>📊 Excel</button>
                            <button className="be-export-btn" onClick={handlePrint}>🖨️ Print</button>
                        </div>
                    </div>

                    {/* ── Field Selector ───────────────────────── */}
                    <div className="be-field-selector">
                        <div className="be-fs-label">
                            <span>Select columns to edit</span>
                            <div className="be-fs-actions">
                                <button className="be-fs-btn" onClick={() => setSelectedFields(new Set(FIELDS.map(f => f.key)))}>
                                    All
                                </button>
                                <button className="be-fs-btn" onClick={() => setSelectedFields(new Set())}>
                                    None
                                </button>
                            </div>
                        </div>
                        <div className="be-fs-chips">
                            {FIELDS.map(f => (
                                <button
                                    key={f.key}
                                    className={`be-fs-chip ${selectedFields.has(f.key) ? 'active' : ''}`}
                                    onClick={() => toggleField(f.key)}
                                >
                                    {selectedFields.has(f.key) && <span className="be-chip-check">✓</span>}
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        {selectedFields.size === 0 && (
                            <p className="be-fs-hint">⬆ Click the fields above to show them as table columns</p>
                        )}
                    </div>

                    {/* ── Table ────────────────────────────────── */}
                    <div className="be-table-wrap">
                        <table className="be-table">
                            <thead>
                                <tr>
                                    <th className="be-th-check">
                                        <input type="checkbox" checked={isAll} onChange={toggleAll}
                                            disabled={selectedFields.size === 0} />
                                    </th>
                                    {/* Sticky name column always shown */}
                                    <th className="be-th-student">Student</th>
                                    {selectedFields.size === 0 ? (
                                        <th className="be-th-placeholder">Select fields above to begin editing</th>
                                    ) : (
                                        activeFields.map(f => (
                                            <th key={f.key} className="be-th-col">{f.label}</th>
                                        ))
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={2 + activeFields.length} className="be-empty-row">
                                            No students match your search
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(s => {
                                        const isSel = selectedIds.has(s.id);
                                        const isChanged = changedRows.has(s.id);
                                        return (
                                            <tr key={s.id}
                                                className={`be-row ${isSel ? 'be-row-selected' : ''} ${isChanged ? 'be-row-changed' : ''}`}>

                                                {/* Checkbox */}
                                                <td className="be-td-check">
                                                    <input type="checkbox"
                                                        checked={isSel}
                                                        disabled={selectedFields.size === 0}
                                                        onChange={() => toggleRow(s.id)} />
                                                </td>

                                                {/* Student identity (always visible) */}
                                                <td className="be-td-student">
                                                    <div className="be-student-cell">
                                                        <div className="be-avatar-wrap">
                                                            {s.image
                                                                ? <img src={s.image} alt={s.name} className="be-avatar" />
                                                                : <PlaceholderAvatar gender={s.gender} size={34} />
                                                            }
                                                            {isChanged && <span className="be-dot-changed" title="Modified" />}
                                                        </div>
                                                        <div>
                                                            <div className="be-student-name">{s.name || '—'}</div>
                                                            <div className="be-student-meta">
                                                                <span className="be-adm-pill">{s.admissionNo || s.id || '—'}</span>
                                                                {(s.class || s.className) && (
                                                                    <span className="be-class-pill">{s.class || s.className}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Dynamic editable columns */}
                                                {selectedFields.size === 0 ? null : (
                                                    activeFields.map(f => {
                                                        const val = getFieldValue(s, f.key);
                                                        const isEdit = editingCell?.id === s.id && editingCell?.field === f.key;
                                                        const options = f.key === 'class' ? classList.map(c => c.name || c)
                                                            : f.key === 'gender' ? genders
                                                                : f.key === 'section' ? sections : null;
                                                        return (
                                                            <td key={f.key} className={`be-td-col ${isSel ? 'be-td-editable' : ''}`}>
                                                                {f.type === 'photo' ? (
                                                                    <label className="be-photo-btn" title="Upload photo">
                                                                        {val
                                                                            ? <img src={val} alt="photo" className="be-photo-thumb" />
                                                                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                                                <path d="M21 15l-5-5L5 21" />
                                                                            </svg>
                                                                        }
                                                                        <input type="file" accept="image/*" style={{ display: 'none' }}
                                                                            onChange={e => {
                                                                                const file = e.target.files?.[0];
                                                                                if (!file) return;
                                                                                const reader = new FileReader();
                                                                                reader.onload = ev => {
                                                                                    const st = students.find(x => x.id === s.id);
                                                                                    if (st) { st.photo = ev.target.result; setChangedRows(p => new Set(p).add(s.id)); }
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }} />
                                                                    </label>
                                                                ) : (
                                                                    <EditableCell
                                                                        studentId={s.id}
                                                                        field={f.key}
                                                                        value={val}
                                                                        type={f.type}
                                                                        options={options}
                                                                        isSelected={isSel}
                                                                        isEditing={isEdit}
                                                                        isChanged={isChanged}
                                                                        editValue={editValue}
                                                                        onChangeEdit={e => setEditValue(e.target.value)}
                                                                        onEdit={() => startEdit(s.id, f.key, val)}
                                                                        onSave={() => saveEdit(s.id, f.key)}
                                                                        onCancel={cancelEdit}
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Selection Summary Bar ─────────────────── */}
                    {selectedIds.size > 0 && (
                        <div className="be-selection-bar">
                            <span>
                                <strong>{selectedIds.size}</strong> student{selectedIds.size !== 1 ? 's' : ''} selected
                                {changedRows.size > 0 && <> · <strong className="be-mod-count">{changedRows.size} modified</strong></>}
                            </span>
                            <div className="be-sel-actions">
                                <button className="be-sel-clear" onClick={() => setSelectedIds(new Set())}>Deselect All</button>
                                {changedRows.size > 0 && (
                                    <button className="be-sel-save" onClick={handleSaveAll}>
                                        💾 Save {changedRows.size} Change{changedRows.size !== 1 ? 's' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BulkEdit;
