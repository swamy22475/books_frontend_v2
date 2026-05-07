import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    IconPackageImport, IconSearch, IconUser, IconPackage,
    IconPrinter, IconPlus, IconTrash, IconX, IconCheck,
    IconListDetails, IconChevronRight, IconClipboardList
} from '@tabler/icons-react';
import './Inventory.css';

const IssueItem = () => {
    const title = 'Issue Item';
    const icon = '📤';

    const availableItems = [
        { id: 1, name: 'Whiteboard Markers', sku: 'INV-WBM-001', currentStock: 150, unit: 'pieces', emoji: '🖊️' },
        { id: 2, name: 'Laboratory Microscopes', sku: 'INV-LMO-002', currentStock: 12, unit: 'units', emoji: '🔬' },
        { id: 3, name: 'Computer Mouse', sku: 'INV-CMO-003', currentStock: 8, unit: 'pieces', emoji: '🖱️' },
        { id: 4, name: 'Notebooks (A4)', sku: 'INV-NBA-005', currentStock: 500, unit: 'pieces', emoji: '📓' },
        { id: 5, name: 'Chemistry Lab Coats', sku: 'INV-CLC-006', currentStock: 25, unit: 'pieces', emoji: '🥼' },
        { id: 6, name: 'Projector', sku: 'INV-PRJ-007', currentStock: 5, unit: 'units', emoji: '📽️' },
        { id: 7, name: 'First Aid Kit', sku: 'INV-FAK-008', currentStock: 15, unit: 'kits', emoji: '🩺' },
    ];

    const staffMembers = [
        { id: 1, name: 'John Smith', department: 'IT Department', employeeId: 'EMP001', avatar: 'JS' },
        { id: 2, name: 'Sarah Johnson', department: 'Academic', employeeId: 'EMP002', avatar: 'SJ' },
        { id: 3, name: 'Michael Brown', department: 'Laboratory', employeeId: 'EMP003', avatar: 'MB' },
        { id: 4, name: 'Emily Davis', department: 'Administration', employeeId: 'EMP004', avatar: 'ED' },
        { id: 5, name: 'Robert Wilson', department: 'Sports Department', employeeId: 'EMP005', avatar: 'RW' },
    ];

    const mkEntry = () => ({
        id: Date.now() + Math.random(),
        itemId: '', itemName: '', itemSku: '', itemEmoji: '',
        quantity: '', currentStock: '', unit: '',
        issuedTo: '', department: '', employeeId: '',
        purpose: '', issueDate: '', expectedReturnDate: '', notes: '',
    });

    const [entries, setEntries] = useState([mkEntry()]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showItemModal, setShowItemModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [activeEntryIdx, setActiveEntryIdx] = useState(null);

    const filteredItems = availableItems.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredStaff = staffMembers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateEntry = (id, patch) =>
        setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));

    const addEntry = () => setEntries(prev => [...prev, mkEntry()]);
    const removeEntry = id => setEntries(prev => prev.filter(e => e.id !== id));

    const openItemModal = idx => { setActiveEntryIdx(idx); setSearchTerm(''); setShowItemModal(true); };
    const openUserModal = idx => { setActiveEntryIdx(idx); setSearchTerm(''); setShowUserModal(true); };

    const selectItem = item => {
        const e = entries[activeEntryIdx];
        updateEntry(e.id, {
            itemId: item.id, itemName: item.name, itemSku: item.sku,
            itemEmoji: item.emoji, currentStock: item.currentStock, unit: item.unit,
        });
        setShowItemModal(false);
    };

    const selectUser = staff => {
        const e = entries[activeEntryIdx];
        updateEntry(e.id, {
            issuedTo: staff.name, department: staff.department, employeeId: staff.employeeId,
        });
        setShowUserModal(false);
    };

    const totalQty = entries.reduce((s, e) => s + (parseFloat(e.quantity) || 0), 0);

    const handleSubmit = () => {
        const invalid = entries.some(e => !e.itemId || !e.quantity || !e.issuedTo || !e.issueDate || !e.purpose);
        if (invalid) { alert('Please fill in all required fields for each entry.'); return; }
        const overstock = entries.some(e => parseFloat(e.quantity) > parseFloat(e.currentStock));
        if (overstock) { alert('Insufficient stock for one or more items.'); return; }
        alert(`Items issued successfully! Total: ${totalQty} items across ${entries.length} entr${entries.length > 1 ? 'ies' : 'y'}.`);
        setEntries([mkEntry()]);
    };

    /* ── avatar colour palette ──────────────────────────── */
    const avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="inv-page">

            {/* ── Page Header ──────────────────────────────── */}
            <div className="inv-page-header">
                <div>
                    <h4 className="inv-page-title">{icon} {title}</h4>
                    <nav className="inv-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/inventory">Inventory</Link> /&nbsp;
                        <span className="inv-breadcrumb-current">{title}</span>
                    </nav>
                </div>
                <div className="inv-header-actions">
                    <button className="inv-btn inv-btn-secondary" onClick={() => window.print()}>
                        <IconPrinter size={16} /> Print
                    </button>
                </div>
            </div>

            {/* ── Entries ──────────────────────────────────── */}
            <div className="ii-entries-wrap">
                <div className="ii-section-header">
                    <span className="ii-section-icon"><IconListDetails size={18} /></span>
                    <h5 className="ii-section-title">Issue Item Details</h5>
                    <span className="ii-entry-count">{entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}</span>
                </div>

                <div className="ii-entries-list">
                    {entries.map((entry, idx) => {
                        const stockOk = !entry.quantity || !entry.currentStock ||
                            parseFloat(entry.quantity) <= parseFloat(entry.currentStock);
                        return (
                            <div key={entry.id} className="ii-entry-card">
                                {/* Card header */}
                                <div className="ii-entry-head">
                                    <div className="ii-entry-num">
                                        <span className="ii-entry-badge">#{idx + 1}</span>
                                        <span className="ii-entry-label">
                                            {entry.itemName || 'New Entry'}
                                        </span>
                                    </div>
                                    {entries.length > 1 && (
                                        <button
                                            className="ii-remove-btn"
                                            onClick={() => removeEntry(entry.id)}
                                            title="Remove entry"
                                        >
                                            <IconTrash size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* ── Row 1: Item  |  Available Stock  |  Qty ── */}
                                <div className="ii-form-row">
                                    {/* Select Item */}
                                    <div className="inv-form-group">
                                        <label>Select Item <span className="ii-req">*</span></label>
                                        {entry.itemId ? (
                                            <div className="ii-chip ii-chip-item">
                                                <span className="ii-chip-emoji">{entry.itemEmoji}</span>
                                                <div className="ii-chip-text">
                                                    <strong>{entry.itemName}</strong>
                                                    <small>{entry.itemSku}</small>
                                                </div>
                                                <button className="ii-chip-change" onClick={() => openItemModal(idx)}>
                                                    <IconSearch size={13} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="ii-pick-btn" onClick={() => openItemModal(idx)}>
                                                <IconSearch size={15} /> Select Item
                                            </button>
                                        )}
                                    </div>

                                    {/* Available Stock */}
                                    <div className="inv-form-group">
                                        <label>Available Stock</label>
                                        <div className="ii-stock-display">
                                            <span className="ii-stock-val">
                                                {entry.currentStock
                                                    ? <>{entry.currentStock} <em>{entry.unit}</em></>
                                                    : <span className="ii-placeholder">—</span>}
                                            </span>
                                            {entry.currentStock && (
                                                <div
                                                    className="ii-stock-pill"
                                                    style={{
                                                        background: entry.currentStock < 10 ? '#fef2f2' : '#f0fdf4',
                                                        color: entry.currentStock < 10 ? '#dc2626' : '#16a34a',
                                                    }}
                                                >
                                                    {entry.currentStock < 10 ? '⚠ Low' : '✓ OK'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="inv-form-group">
                                        <label>Quantity to Issue <span className="ii-req">*</span></label>
                                        <input
                                            type="number"
                                            value={entry.quantity}
                                            onChange={e => updateEntry(entry.id, { quantity: e.target.value })}
                                            className={`inv-form-input${!stockOk ? ' ii-input-error' : ''}`}
                                            placeholder="0"
                                            min="1"
                                            max={entry.currentStock || undefined}
                                        />
                                        {!stockOk && (
                                            <span className="ii-error-msg">Exceeds available stock</span>
                                        )}
                                    </div>
                                </div>

                                {/* ── Row 2: Issued To  |  Department  |  Purpose ── */}
                                <div className="ii-form-row">
                                    {/* Issued To */}
                                    <div className="inv-form-group">
                                        <label>Issued To <span className="ii-req">*</span></label>
                                        {entry.issuedTo ? (
                                            <div className="ii-chip ii-chip-user">
                                                <div
                                                    className="ii-avatar"
                                                    style={{ background: avatarColors[entry.id % avatarColors.length] ?? '#3b82f6' }}
                                                >
                                                    {entry.issuedTo.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="ii-chip-text">
                                                    <strong>{entry.issuedTo}</strong>
                                                    <small>{entry.employeeId}</small>
                                                </div>
                                                <button className="ii-chip-change" onClick={() => openUserModal(idx)}>
                                                    <IconSearch size={13} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="ii-pick-btn" onClick={() => openUserModal(idx)}>
                                                <IconUser size={15} /> Select Person
                                            </button>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div className="inv-form-group">
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            value={entry.department}
                                            readOnly
                                            className="inv-form-input inv-readonly"
                                            placeholder="Auto-filled"
                                        />
                                    </div>

                                    {/* Purpose */}
                                    <div className="inv-form-group">
                                        <label>Purpose <span className="ii-req">*</span></label>
                                        <input
                                            type="text"
                                            value={entry.purpose}
                                            onChange={e => updateEntry(entry.id, { purpose: e.target.value })}
                                            className="inv-form-input"
                                            placeholder="e.g. Classroom use"
                                        />
                                    </div>
                                </div>

                                {/* ── Row 3: Issue Date  |  Return Date  |  Notes ── */}
                                <div className="ii-form-row">
                                    <div className="inv-form-group">
                                        <label>Issue Date <span className="ii-req">*</span></label>
                                        <input
                                            type="date"
                                            value={entry.issueDate}
                                            onChange={e => updateEntry(entry.id, { issueDate: e.target.value })}
                                            className="inv-form-input"
                                        />
                                    </div>

                                    <div className="inv-form-group">
                                        <label>Expected Return Date</label>
                                        <input
                                            type="date"
                                            value={entry.expectedReturnDate}
                                            onChange={e => updateEntry(entry.id, { expectedReturnDate: e.target.value })}
                                            className="inv-form-input"
                                            min={entry.issueDate || undefined}
                                        />
                                    </div>

                                    <div className="inv-form-group">
                                        <label>Notes</label>
                                        <input
                                            type="text"
                                            value={entry.notes}
                                            onChange={e => updateEntry(entry.id, { notes: e.target.value })}
                                            className="inv-form-input"
                                            placeholder="Optional notes..."
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Add Entry + Summary ───────────────────── */}
                <div className="ii-bottom-zone">
                    <button className="ii-add-entry-btn" onClick={addEntry}>
                        <IconPlus size={16} /> Add Another Entry
                    </button>

                    {/* Summary strip */}
                    <div className="ii-summary-strip">
                        <div className="ii-summary-item">
                            <span className="ii-summary-lbl">Total Entries</span>
                            <span className="ii-summary-val">{entries.length}</span>
                        </div>
                        <div className="ii-summary-divider" />
                        <div className="ii-summary-item">
                            <span className="ii-summary-lbl">Total Items</span>
                            <span className="ii-summary-val">{totalQty}</span>
                        </div>
                        <div className="ii-summary-divider" />
                        <div className="ii-summary-item">
                            <span className="ii-summary-lbl">Issued By</span>
                            <span className="ii-summary-val">Current User</span>
                        </div>
                    </div>
                </div>

                {/* ── Footer Actions ────────────────────────── */}
                <div className="ii-footer">
                    <Link to="/school/inventory" className="inv-btn inv-btn-outline">
                        Cancel
                    </Link>
                    <button className="inv-btn inv-btn-primary" onClick={handleSubmit}>
                        <IconPackageImport size={16} /> Issue Items
                    </button>
                </div>
            </div>

            {/* ══ Item Selector Modal ══════════════════════ */}
            {showItemModal && (
                <div className="inv-modal-overlay" onClick={() => setShowItemModal(false)}>
                    <div className="ii-modal" onClick={e => e.stopPropagation()}>
                        <div className="ii-modal-header">
                            <div className="ii-modal-title">
                                <IconPackage size={18} /> Select Item
                            </div>
                            <button className="ii-modal-close" onClick={() => setShowItemModal(false)}>
                                <IconX size={18} />
                            </button>
                        </div>
                        <div className="ii-modal-search">
                            <IconSearch size={15} className="inv-search-icon" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search by name or SKU..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="inv-search-input"
                            />
                        </div>
                        <div className="ii-modal-list">
                            {filteredItems.map(item => (
                                <div key={item.id} className="ii-modal-row" onClick={() => selectItem(item)}>
                                    <div className="ii-modal-row-icon">{item.emoji}</div>
                                    <div className="ii-modal-row-info">
                                        <strong>{item.name}</strong>
                                        <small>{item.sku}</small>
                                    </div>
                                    <div className="ii-modal-row-stock"
                                        style={{ color: item.currentStock < 10 ? '#dc2626' : '#16a34a' }}>
                                        {item.currentStock} {item.unit}
                                    </div>
                                    <IconChevronRight size={16} color="#cbd5e1" />
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="ii-modal-empty">No items found</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ══ User Selector Modal ══════════════════════ */}
            {showUserModal && (
                <div className="inv-modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="ii-modal" onClick={e => e.stopPropagation()}>
                        <div className="ii-modal-header">
                            <div className="ii-modal-title">
                                <IconUser size={18} /> Select Person
                            </div>
                            <button className="ii-modal-close" onClick={() => setShowUserModal(false)}>
                                <IconX size={18} />
                            </button>
                        </div>
                        <div className="ii-modal-search">
                            <IconSearch size={15} className="inv-search-icon" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search by name, ID or department..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="inv-search-input"
                            />
                        </div>
                        <div className="ii-modal-list">
                            {filteredStaff.map((staff, i) => (
                                <div key={staff.id} className="ii-modal-row" onClick={() => selectUser(staff)}>
                                    <div
                                        className="ii-modal-avatar"
                                        style={{ background: avatarColors[i % avatarColors.length] }}
                                    >
                                        {staff.avatar}
                                    </div>
                                    <div className="ii-modal-row-info">
                                        <strong>{staff.name}</strong>
                                        <small>{staff.department} · {staff.employeeId}</small>
                                    </div>
                                    <IconChevronRight size={16} color="#cbd5e1" />
                                </div>
                            ))}
                            {filteredStaff.length === 0 && (
                                <div className="ii-modal-empty">No staff found</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssueItem;
