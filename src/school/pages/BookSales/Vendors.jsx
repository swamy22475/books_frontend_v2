import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../api/vendors';
import './BookSales.css';

const emptyVendor = { name: '', type: 'Wholesaler', phone: '', address: '', payment: 'Cash', booksSupplied: 0, amount: 0, paidAmount: 0, remainingAmount: 0, billNo: '', status: 'Active' };
const vendorTypes = ['Wholesaler', 'Publisher', 'Distributor', 'Retailer'];
const paymentMethods = ['Cash', 'UPI', 'Cheque', 'Bank Transfer', 'Card'];

// Helper to map backend vendor to frontend format
const mapToFrontend = (v) => ({
    id: v.id,
    name: v.name,
    type: v.vendor_type,
    phone: v.contact,
    address: v.address,
    payment: v.payment_method,
    booksSupplied: v.books_supplied,
    amount: v.total_amount,
    // Fallback to amount_paid if paid_amount is 0/missing (for compatibility with existing DB data)
    paidAmount: v.paid_amount || v.amount_paid || 0,
    remainingAmount: v.remaining_amount || 0,
    billNo: v.bill_no || '',
    status: v.status,
    date: v.created_at ? new Date(v.created_at).toLocaleString() : 'N/A'
});

// Helper to map frontend form to backend format
const mapToBackend = (f) => ({
    name: f.name,
    vendor_type: f.type,
    contact: f.phone,
    address: f.address,
    payment_method: f.payment,
    books_supplied: Number(f.booksSupplied) || 0,
    total_amount: Number(f.amount) || 0,
    paid_amount: Number(f.paidAmount) || 0,
    remaining_amount: (Number(f.amount) || 0) - (Number(f.paidAmount) || 0),
    bill_no: f.billNo,
    status: f.status
});

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyVendor);
    const [viewVendor, setViewVendor] = useState(null);
    const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'success'

    // Fetch vendors from DB
    const fetchVendors = async () => {
        try {
            setLoading(true);
            const data = await vendorService.getAll();
            console.log('[Vendors] API Data Received:', data);
            setVendors(data.map(mapToFrontend));
        } catch (error) {
            console.error('[Vendors] Fetch Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filtered = vendors.filter(v =>
        (filterType === 'All' || v.type === filterType) &&
        (v.name.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search))
    );

    const openAdd = () => { setForm(emptyVendor); setEditId(null); setShowModal(true); };
    const openEdit = (v) => { setForm({ ...v }); setEditId(v.id); setShowModal(true); };

    const handleSubmit = async () => {
        if (!form.name || !form.phone) return;

        console.log('[Vendors] Saving with Payload:', mapToBackend(form));
        setSaveState('saving');
        const startTime = Date.now();
        setShowModal(false);

        try {
            const payload = mapToBackend(form);
            if (editId) {
                await vendorService.update(editId, payload);
            } else {
                await vendorService.create(payload);
            }
            
            // Ensure spinner shows for at least 800ms for "premium" feel
            const elapsed = Date.now() - startTime;
            if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));

            await fetchVendors();
            setForm(emptyVendor);
            setEditId(null);

            // Switch from spinner → checkmark
            setSaveState('success');
            setTimeout(() => setSaveState('idle'), 2500);
        } catch (error) {
            setSaveState('idle');
            setShowModal(true);
            const msg = error.message || 'Unknown error';
            console.error('[Vendors] Save Error:', msg);
            alert(`Failed to save vendor: ${msg}`);
        }
    };

    const handlePayment = async (vendor, type) => {
        const remaining = Number(vendor.remainingAmount);
        if (remaining <= 0) {
            alert('No outstanding balance for this vendor.');
            return;
        }

        let paymentAmount = type === 'full' ? remaining : remaining / 2;
        const confirmMsg = `Are you sure you want to process a ${type} payment of ₹${paymentAmount.toLocaleString()} for ${vendor.name}?`;

        if (window.confirm(confirmMsg)) {
            try {
                // Update amounts in backend
                const newPaidAmount = Number(vendor.paidAmount) + paymentAmount;
                const newRemaining = Number(vendor.amount) - newPaidAmount;
                
                await vendorService.update(vendor.id, {
                    ...mapToBackend(vendor),
                    paid_amount: newPaidAmount,
                    remaining_amount: newRemaining
                });
                alert(`Successfully processed ${type} payment!`);
                fetchVendors(); // Refresh list
            } catch (error) {
                console.error('Error processing payment:', error.message);
                alert('Failed to process payment.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await vendorService.delete(id);
                fetchVendors(); // Refresh list from DB
            } catch (error) {
                console.error('Error deleting vendor:', error.message);
                alert('Failed to delete vendor.');
            }
        }
    };

    const totalAmount = vendors.reduce((acc, v) => acc + Number(v.amount), 0);
    const totalBooks = vendors.reduce((acc, v) => acc + Number(v.booksSupplied), 0);

    return (
        <div className="bs-page">
            {/* ── Center-screen Save Overlay ─────────────────────────── */}
            <style>{`
                @keyframes vSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes vPopIn {
                    0%   { transform: scale(0.4); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    80%  { transform: scale(0.92); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes vCheckDraw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes vCircleDraw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes vFadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes vPulseRing {
                    0%   { transform: scale(0.9); opacity: 0.6; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
            `}</style>

            {saveState !== 'idle' && (
                <div style={{
                    position: 'fixed', inset: 0,
                    zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(10, 15, 30, 0.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '48px 56px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        boxShadow: '0 32px 64px -12px rgba(0,0,0,0.4)',
                        minWidth: '300px',
                        textAlign: 'center',
                        animation: 'vPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
                    }}>

                        {/* SAVING: Spinner */}
                        {saveState === 'saving' && (
                            <>
                                <div style={{
                                    width: '80px', height: '80px',
                                    borderRadius: '50%',
                                    border: '5px solid #e8eaf6',
                                    borderTopColor: '#6366f1',
                                    animation: 'vSpin 0.8s linear infinite',
                                }} />
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                                        Saving Vendor...
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                        Please wait while we store your data
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SUCCESS: Animated Checkmark */}
                        {saveState === 'success' && (
                            <>
                                {/* Pulse ring behind circle */}
                                <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        borderRadius: '50%',
                                        background: 'rgba(16,185,129,0.15)',
                                        animation: 'vPulseRing 1.2s ease-out infinite',
                                    }} />
                                    {/* SVG Checkmark */}
                                    <svg viewBox="0 0 90 90" width="90" height="90">
                                        {/* Green circle */}
                                        <circle
                                            cx="45" cy="45" r="40"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray="251"
                                            strokeDashoffset="251"
                                            style={{ animation: 'vCircleDraw 0.5s ease forwards' }}
                                        />
                                        {/* Tick */}
                                        <polyline
                                            points="26,47 39,60 64,32"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="5.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="60"
                                            strokeDashoffset="60"
                                            style={{ animation: 'vCheckDraw 0.4s 0.4s ease forwards' }}
                                        />
                                    </svg>
                                </div>

                                <div style={{ animation: 'vFadeInUp 0.4s 0.6s both' }}>
                                    <div style={{
                                        fontSize: '20px', fontWeight: 800,
                                        color: '#10b981', marginBottom: '6px',
                                    }}>
                                        Saved Successfully!
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                                        Vendor details have been stored.
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* Header */}

            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">🏢 Vendor Details</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link><span>/</span>
                        <Link to="/school/book-sales">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Vendors</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-primary" onClick={openAdd}>
                    ＋ Add Vendor
                </button>
            </div>

            {/* Summary Bar */}
            <div className="bs-summary-bar">
                <div className="bs-summary-item">
                    <span className="bs-summary-label">Total Vendors</span>
                    <span className="bs-summary-value">{vendors.length}</span>
                </div>
                <div className="bs-summary-divider" />
                <div className="bs-summary-item">
                    <span className="bs-summary-label">Active</span>
                    <span className="bs-summary-value" style={{ color: '#28c76f' }}>{vendors.filter(v => v.status === 'Active').length}</span>
                </div>
                <div className="bs-summary-divider" />
                <div className="bs-summary-item">
                    <span className="bs-summary-label">Total Books Supplied</span>
                    <span className="bs-summary-value">{totalBooks.toLocaleString()}</span>
                </div>
                <div className="bs-summary-divider" />
                <div className="bs-summary-item">
                    <span className="bs-summary-label">Total Amount</span>
                    <span className="bs-summary-value" style={{ color: '#7367f0' }}>₹{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Table Card */}
            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">All Vendors</h5>
                    <div className="bs-filter-bar" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                        <div className="bs-search-wrap" style={{ maxWidth: 240 }}>
                            <span className="bs-search-icon">🔍</span>
                            <input
                                type="text"
                                className="bs-search-input"
                                placeholder="Search vendors..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <select className="bs-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option>All</option>
                            {vendorTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vendor Name</th>
                                <th>Type</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Payment</th>
                                <th>Books Supplied</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Remaining</th>
                                <th>Bill No</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32 }}><div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No vendors found.</td></tr>
                            ) : filtered.map((v, i) => (
                                <tr key={v.id}>
                                    <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                                    <td>
                                        <span className={`bs-badge ${v.type === 'Wholesaler' ? 'bs-badge-blue' : v.type === 'Publisher' ? 'bs-badge-purple' : v.type === 'Distributor' ? 'bs-badge-cyan' : 'bs-badge-orange'}`}>
                                            {v.type}
                                        </span>
                                    </td>
                                    <td>{v.phone}</td>
                                    <td style={{ color: 'var(--bs-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.address}</td>
                                    <td><span className="bs-badge bs-badge-gray">{v.payment}</span></td>
                                    <td style={{ fontWeight: 600 }}>{Number(v.booksSupplied).toLocaleString()}</td>
                                    <td style={{ fontWeight: 700, color: '#7367f0' }}>₹{Number(v.amount).toLocaleString()}</td>
                                    <td style={{ fontWeight: 600, color: '#28c76f' }}>₹{Number(v.paidAmount).toLocaleString()}</td>
                                    <td style={{ fontWeight: 600, color: '#ea5455' }}>₹{Number(v.remainingAmount).toLocaleString()}</td>
                                    <td>{v.billNo || '-'}</td>
                                    <td>
                                        <span className={`bs-badge ${v.status === 'Active' ? 'bs-badge-green' : 'bs-badge-red'}`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--bs-muted)', whiteSpace: 'nowrap' }}>{v.date}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <button className="bs-btn-icon bs-btn-icon-view" title="View" onClick={() => setViewVendor(v)}>👁</button>
                                            <button className="bs-btn-icon bs-btn-icon-edit" title="Edit" onClick={() => openEdit(v)}>✏️</button>
                                            <button className="bs-btn-icon bs-btn-icon-delete" title="Delete" onClick={() => handleDelete(v.id)}>🗑</button>
                                            
                                            <div className="bs-dropdown">
                                                <button className="bs-btn-pay">💸 Pay Bill ▾</button>
                                                <div className="bs-dropdown-content">
                                                    <div className="bs-dropdown-item" onClick={() => handlePayment(v, 'full')}>
                                                        ✅ Full Payment
                                                    </div>
                                                    <div className="bs-dropdown-item" onClick={() => handlePayment(v, 'half')}>
                                                        🌓 Half Payment
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bs-table-footer">
                    <span>Showing {filtered.length} of {vendors.length} vendors</span>
                    <div className="bs-pagination">
                        <button className="bs-page-btn">‹</button>
                        <button className="bs-page-btn active">1</button>
                        <button className="bs-page-btn">›</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="bs-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">{editId ? '✏️ Edit Vendor' : '➕ Add New Vendor'}</h5>
                            <button className="bs-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="bs-form-grid">
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Vendor Name *</label>
                                    <input className="bs-form-input" placeholder="e.g. SRI VIJAYA BOOK HOUSE" value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value.toUpperCase() })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Vendor Type</label>
                                    <select className="bs-form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        {vendorTypes.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Phone *</label>
                                    <input className="bs-form-input" placeholder="e.g. 9876543210" value={form.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setForm({ ...form, phone: val });
                                        }} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Payment Method</label>
                                    <select className="bs-form-select" value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })}>
                                        {paymentMethods.map(m => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Total Books Supplied</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 500" value={form.booksSupplied}
                                        onChange={e => setForm({ ...form, booksSupplied: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Total Amount (₹)</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 200000" value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value, remainingAmount: (Number(e.target.value) || 0) - (Number(form.paidAmount) || 0) })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Paid Amount (₹)</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 100000" value={form.paidAmount}
                                        onChange={e => setForm({ ...form, paidAmount: e.target.value, remainingAmount: (Number(form.amount) || 0) - (Number(e.target.value) || 0) })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Remaining Amount (₹)</label>
                                    <input className="bs-form-input" type="number" value={form.remainingAmount} disabled style={{ backgroundColor: '#f5f5f9' }} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Bill No</label>
                                    <input className="bs-form-input" placeholder="e.g. BILL-001" value={form.billNo}
                                        onChange={e => setForm({ ...form, billNo: e.target.value })} />
                                </div>
                                <div className="bs-form-group full-width">
                                    <label className="bs-form-label">Address</label>
                                    <textarea className="bs-form-textarea" placeholder="Full address..." value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Status</label>
                                    <select className="bs-form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="bs-btn bs-btn-primary" onClick={handleSubmit}>
                                {editId ? '✔ Update Vendor' : '✔ Add Vendor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewVendor && (
                <div className="bs-modal-overlay" onClick={() => setViewVendor(null)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">👁 Vendor Details</h5>
                            <button className="bs-modal-close" onClick={() => setViewVendor(null)}>×</button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="bs-form-grid">
                                {[
                                    ['Vendor Name', viewVendor.name],
                                    ['Type', viewVendor.type],
                                    ['Phone', viewVendor.phone],
                                    ['Payment', viewVendor.payment],
                                    ['Books Supplied', viewVendor.booksSupplied],
                                    ['Total Amount', `₹${Number(viewVendor.amount).toLocaleString()}`],
                                    ['Paid Amount', `₹${Number(viewVendor.paidAmount).toLocaleString()}`],
                                    ['Remaining Amount', `₹${Number(viewVendor.remainingAmount).toLocaleString()}`],
                                    ['Bill No', viewVendor.billNo || '-'],
                                    ['Status', viewVendor.status],
                                    ['Address', viewVendor.address],
                                ].map(([label, value]) => (
                                    <div key={label} className="bs-form-group">
                                        <label className="bs-form-label">{label}</label>
                                        <div style={{ fontWeight: 600, color: 'var(--bs-text)', paddingTop: 4 }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={() => setViewVendor(null)}>Close</button>
                            <button className="bs-btn bs-btn-primary" onClick={() => { setViewVendor(null); openEdit(viewVendor); }}>Edit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendors;
