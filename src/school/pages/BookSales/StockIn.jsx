import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../../api/inventory';
import { vendorService } from '../../../api/vendors';
import { stockService } from '../../../api/stock';
import './BookSales.css';
import './StockIn.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcSold = (item) => Math.max(0, Number(item.qty) - Number(item.stock));
const calcPct = (item) => (Number(item.qty) === 0 ? 0 : (Number(item.stock) / Number(item.qty)) * 100);

const getStatus = (pct) => {
    if (pct === 0) return { label: 'Out of Stock', tag: 'si-tag-red', dot: 'si-dot-red', bar: '#ea5455', icon: '🔴' };
    if (pct < 30) return { label: 'Low Stock', tag: 'si-tag-orange', dot: 'si-dot-orange', bar: '#ff9f43', icon: '🟠' };
    if (pct >= 40) return { label: 'Available', tag: 'si-tag-green', dot: 'si-dot-green', bar: '#28c76f', icon: '🟢' };
    return { label: 'Low Stock', tag: 'si-tag-orange', dot: 'si-dot-orange', bar: '#ff9f43', icon: '🟠' };
};

const today = new Date().toISOString().split('T')[0];
const emptyForm = { book: '', vendor: '', received: '', date: today, invoice: '', remarks: '' };

// ─── Component ────────────────────────────────────────────────────────────────
const StockIn = () => {
    const [inventory, setInventory] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [log, setLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [activeTab, setActiveTab] = useState('overview');

    // ── Fetch books, vendors, and log from backend ──
    const load = async () => {
        try {
            setLoading(true);
            const [books, vendors, stockLog] = await Promise.all([
                inventoryService.getAll(),
                vendorService.getAll(),
                stockService.getAll(),
            ]);
            // Map backend fields to what the component uses
            const mapped = books.map(b => ({
                id: b.id,
                name: b.name,
                book_class: b.book_class || '',
                type: b.book_type,
                qty: b.total_qty,
                stock: b.stock_available,
                vendor: b.vendor_name || '',
            }));
            setInventory(mapped);
            setVendorList(vendors);
            setLog(stockLog.map(s => ({
                id: s.id,
                book: s.book_name,
                vendor: s.vendor_name,
                received: s.quantity,
                date: s.date ? new Date(s.date).toISOString().split('T')[0] : today,
                invoice: s.invoice_no,
                remarks: s.remarks
            })));

            if (mapped.length > 0 && !form.book) setForm(f => ({ ...f, book: mapped[0].name }));
            if (vendors.length > 0 && !form.vendor) setForm(f => ({ ...f, vendor: vendors[0].name }));
        } catch (err) {
            console.error('Error loading StockIn data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // ── derived stock overview ──
    const overview = inventory.map(item => {
        const sold = calcSold(item);
        const pct = calcPct(item);
        return { ...item, sold, pct: Math.round(pct) };
    });

    const filtered = overview.filter(item => {
        const st = getStatus(item.pct);
        return (
            (filterClass === 'All' || item.book_class === filterClass) &&
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            (filterStatus === 'All' || st.label === filterStatus)
        );
    });

    // ── summary totals ──
    const totalReceived = overview.reduce((a, b) => a + Number(b.qty), 0);
    const totalRemaining = overview.reduce((a, b) => a + Number(b.stock), 0);
    const totalSold = overview.reduce((a, b) => a + b.sold, 0);
    const available = overview.filter(b => b.pct >= 40).length;
    const lowStock = overview.filter(b => b.pct > 0 && b.pct < 40).length;
    const outOfStock = overview.filter(b => b.pct === 0).length;

    const handleSubmit = async () => {
        if (!form.book || !form.received || saving) return;
        
        const selectedBook = inventory.find(b => b.name === form.book);
        const selectedVendor = vendorList.find(v => v.name === form.vendor);
        
        if (!selectedBook) return;

        setSaving(true);
        try {
            const payload = {
                book_id: selectedBook.id,
                book_name: selectedBook.name,
                vendor_id: selectedVendor?.id || null,
                vendor_name: selectedVendor?.name || form.vendor,
                quantity: Number(form.received),
                invoice_no: form.invoice,
                date: form.date,
                remarks: form.remarks
            };
            
            await stockService.create(payload);
            await load(); // Reload all data
            setForm(emptyForm);
            setShowModal(false);
        } catch (err) {
            console.error('Error saving stock entry:', err);
            alert('Failed to save stock entry. Please check your connection.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bs-page">
            {/* ── Header ── */}
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">📥 Stock In Management</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link><span>/</span>
                        <Link to="/school/book-sales">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Stock In</span>
                    </nav>
                </div>

            </div>

            {/* ── KPI Strip ── */}
            <div className="si-kpi-strip">
                {[
                    { label: 'Total Received', value: totalReceived.toLocaleString(), icon: '📦', color: '#3d5ee1', bg: '#eef1fd' },
                    { label: 'Total Remaining', value: totalRemaining.toLocaleString(), icon: '🗃️', color: '#7367f0', bg: '#efedfd' },
                    { label: 'Total Sold', value: totalSold.toLocaleString(), icon: '🛒', color: '#28c76f', bg: '#e8faf1' },
                    { label: 'Available', value: available, icon: '🟢', color: '#28c76f', bg: '#e8faf1' },
                    { label: 'Low Stock', value: lowStock, icon: '🟠', color: '#ff9f43', bg: '#fff5e6' },
                    { label: 'Out of Stock', value: outOfStock, icon: '🔴', color: '#ea5455', bg: '#fce8e8' },
                ].map((card, i) => (
                    <div key={i} className="bs-kpi-card si-kpi-card">
                        <div className="bs-kpi-icon" style={{ background: card.bg, color: card.color }}>
                            <span>{card.icon}</span>
                        </div>
                        <div className="bs-kpi-info">
                            <p className="bs-kpi-label">{card.label}</p>
                            <h3 className="bs-kpi-value">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Status Legend ── */}
            <div className="si-legend-bar">
                <span className="si-legend-title">Status Guide:</span>
                <span className="si-legend-item">
                    <span className="si-dot si-dot-green"></span>
                    <strong>Available</strong> — remaining ≥ 40% of received
                </span>
                <span className="si-legend-item">
                    <span className="si-dot si-dot-orange"></span>
                    <strong>Low Stock</strong> — remaining &lt; 30% of received
                </span>
                <span className="si-legend-item">
                    <span className="si-dot si-dot-red"></span>
                    <strong>Out of Stock</strong> — 0 remaining
                </span>
            </div>

            {/* ── Tab Switch ── */}
            <div className="si-tab-row">
                {[
                    { key: 'overview', label: '📋 Stock Overview' },
                    { key: 'log', label: '📥 Stock-In Log' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`si-tab-btn ${activeTab === tab.key ? 'si-tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >{tab.label}</button>
                ))}
            </div>

            {/* ══════════════════════ OVERVIEW TABLE ══════════════════════ */}
            {activeTab === 'overview' && (
                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">📦 Product Stock Overview</h5>
                        <div className="bs-filter-bar" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                            <div className="bs-search-wrap" style={{ maxWidth: 220 }}>
                                <span className="bs-search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="bs-search-input"
                                    placeholder="Search books..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <select className="bs-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                                <option value="All">All Classes</option>
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <option key={n} value={`Class ${n}`}>Class {n}</option>
                                ))}
                            </select>
                            <select className="bs-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="Available">✅ Available</option>
                                <option value="Low Stock">⚠️ Low Stock</option>
                                <option value="Out of Stock">❌ Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Book Name</th>
                                    <th>Class</th>
                                    <th>Type</th>
                                    <th>Vendor</th>
                                    <th style={{ textAlign: 'center' }}>Received</th>
                                    <th style={{ textAlign: 'center' }}>Sold</th>
                                    <th style={{ textAlign: 'center' }}>Remaining</th>
                                    <th style={{ minWidth: 160 }}>Stock Level</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="si-empty-row">No products found.</td>
                                    </tr>
                                ) : filtered.map((item, i) => {
                                    const st = getStatus(item.pct);
                                    return (
                                        <tr key={item.id} className="si-product-row">
                                            <td style={{ color: 'var(--bs-muted)', fontWeight: 500 }}>{i + 1}</td>

                                            {/* Book name */}
                                            <td>
                                                <div className="si-book-name">{item.name}</div>
                                            </td>

                                            {/* Class */}
                                            <td>
                                                <span className="bs-badge bs-badge-blue" style={{ fontSize: 11 }}>
                                                    {item.book_class || '—'}
                                                </span>
                                            </td>

                                            {/* Type badge */}
                                            <td>
                                                <span className={`bs-badge ${item.type === 'Set' ? 'bs-badge-blue' : 'bs-badge-purple'}`}>
                                                    {item.type}
                                                </span>
                                            </td>

                                            {/* Vendor */}
                                            <td style={{ color: 'var(--bs-muted)', fontSize: 12 }}>{item.vendor}</td>

                                            {/* Received */}
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="si-count si-count-blue">{item.qty}</span>
                                            </td>

                                            {/* Sold */}
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="si-count si-count-green">{item.sold}</span>
                                            </td>

                                            {/* Remaining */}
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`si-count ${item.pct === 0 ? 'si-count-red' :
                                                        item.pct < 30 ? 'si-count-orange' :
                                                            'si-count-teal'
                                                    }`}>{item.stock}</span>
                                            </td>

                                            {/* Progress bar */}
                                            <td>
                                                <div className="si-bar-wrap">
                                                    <div className="si-bar-track">
                                                        <div
                                                            className="si-bar-fill"
                                                            style={{
                                                                width: `${Math.min(item.pct, 100)}%`,
                                                                background: st.bar,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="si-bar-pct" style={{ color: st.bar }}>{item.pct}%</span>
                                                </div>
                                            </td>

                                            {/* Status button */}
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`si-status-btn ${st.tag}`}>
                                                    <span className={`si-dot ${st.dot}`} />
                                                    {st.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="bs-table-footer">
                        <span>Showing {filtered.length} of {overview.length} products</span>
                        <div className="si-status-mini">
                            <span className="si-tag-green si-status-btn" style={{ fontSize: 11, padding: '3px 10px' }}>
                                <span className="si-dot si-dot-green" /> {available} Available
                            </span>
                            <span className="si-tag-orange si-status-btn" style={{ fontSize: 11, padding: '3px 10px' }}>
                                <span className="si-dot si-dot-orange" /> {lowStock} Low
                            </span>
                            <span className="si-tag-red si-status-btn" style={{ fontSize: 11, padding: '3px 10px' }}>
                                <span className="si-dot si-dot-red" /> {outOfStock} Out
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ STOCK-IN LOG ══════════════════════ */}
            {activeTab === 'log' && (
                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">📥 Stock-In Receipts</h5>
                        <button className="bs-btn bs-btn-primary bs-btn-sm" onClick={() => setShowModal(true)}>
                            ＋ Add Entry
                        </button>
                    </div>
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Book Name</th>
                                    <th>Vendor</th>
                                    <th style={{ textAlign: 'center' }}>Qty Received</th>
                                    <th>Invoice No.</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {log.map((entry, i) => (
                                    <tr key={entry.id}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{entry.book}</td>
                                        <td style={{ color: 'var(--bs-muted)', fontSize: 12 }}>{entry.vendor}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="si-count si-count-blue">{entry.received}</span>
                                        </td>
                                        <td>
                                            <span className="bs-badge bs-badge-gray">{entry.invoice || '—'}</span>
                                        </td>
                                        <td style={{ color: 'var(--bs-muted)' }}>{entry.date}</td>
                                        <td style={{ color: 'var(--bs-muted)', fontSize: 12 }}>{entry.remarks || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bs-table-footer">
                        <span>{log.length} stock-in entries</span>
                    </div>
                </div>
            )}

            {/* ══════════════════════ ADD STOCK-IN MODAL ══════════════════════ */}
            {showModal && (
                <div className="bs-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="bs-modal bs-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">📥 Add Stock In Entry</h5>
                            <button className="bs-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="bs-form-grid">
                                {/* Book */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Book Name *</label>
                                    <select className="bs-form-select" value={form.book}
                                        onChange={e => setForm({ ...form, book: e.target.value })}>
                                        <option value="">— Select Book —</option>
                                        {inventory.map(b => (
                                            <option key={b.id} value={b.name}>
                                                {b.name}{b.book_class ? ` (${b.book_class})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Vendor */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Vendor</label>
                                    <select className="bs-form-select" value={form.vendor}
                                        onChange={e => setForm({ ...form, vendor: e.target.value })}>
                                        <option value="">— Select Vendor —</option>
                                        {vendorList.map(v => (
                                            <option key={v.id} value={v.name}>{v.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Quantity Received *</label>
                                    <input className="bs-form-input" type="number" min="1"
                                        placeholder="e.g. 100"
                                        value={form.received}
                                        onChange={e => setForm({ ...form, received: e.target.value })} />
                                </div>

                                {/* Invoice */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Invoice No.</label>
                                    <input className="bs-form-input" placeholder="e.g. INV-009"
                                        value={form.invoice}
                                        onChange={e => setForm({ ...form, invoice: e.target.value })} />
                                </div>

                                {/* Date */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Date</label>
                                    <input className="bs-form-input" type="date" value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })} />
                                </div>

                                {/* Remarks */}
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Remarks</label>
                                    <input className="bs-form-input" placeholder="Optional note..."
                                        value={form.remarks}
                                        onChange={e => setForm({ ...form, remarks: e.target.value })} />
                                </div>
                            </div>

                            {/* Mini preview of current stock for selected book */}
                            {(() => {
                                const sel = inventory.find(b => b.name === form.book);
                                if (!sel) return null;
                                const sp = getStatus(calcPct(sel));
                                return (
                                    <div className="si-preview-box">
                                        <p className="si-preview-title">📊 Current stock for <strong>{sel.name}</strong></p>
                                        <div className="si-preview-row">
                                            <div className="si-preview-item">
                                                <span>Received</span>
                                                <strong style={{ color: '#3d5ee1' }}>{sel.qty}</strong>
                                            </div>
                                            <div className="si-preview-item">
                                                <span>Sold</span>
                                                <strong style={{ color: '#28c76f' }}>{calcSold(sel)}</strong>
                                            </div>
                                            <div className="si-preview-item">
                                                <span>Remaining</span>
                                                <strong style={{ color: sp.bar }}>{sel.stock}</strong>
                                            </div>
                                            <div className="si-preview-item">
                                                <span>Status</span>
                                                <span className={`si-status-btn ${sp.tag}`} style={{ fontSize: 11 }}>
                                                    <span className={`si-dot ${sp.dot}`} />{sp.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="bs-btn bs-btn-primary" onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving...' : '✔ Save Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockIn;
