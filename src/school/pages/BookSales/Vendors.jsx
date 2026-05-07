import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../api/vendors';
import './BookSales.css';

const emptyVendor = { name: '', type: 'Wholesaler', phone: '', address: '', payment: 'Cash', booksSupplied: 0, amount: 0, status: 'Active' };
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

    // Fetch vendors from DB
    const fetchVendors = async () => {
        try {
            setLoading(true);
            const data = await vendorService.getAll();
            setVendors(data.map(mapToFrontend));
        } catch (error) {
            console.error('Error fetching vendors:', error.message);
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
        
        try {
            const payload = mapToBackend(form);
            if (editId) {
                await vendorService.update(editId, payload);
            } else {
                await vendorService.create(payload);
            }
            setShowModal(false);
            fetchVendors(); // Refresh list from DB
            setForm(emptyVendor);
            setEditId(null);
        } catch (error) {
            console.error('Error saving vendor:', error.message);
            alert('Failed to save vendor. Please try again.');
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
                                    <td>
                                        <span className={`bs-badge ${v.status === 'Active' ? 'bs-badge-green' : 'bs-badge-red'}`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--bs-muted)', whiteSpace: 'nowrap' }}>{v.date}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="bs-btn-icon bs-btn-icon-view" title="View" onClick={() => setViewVendor(v)}>👁</button>
                                            <button className="bs-btn-icon bs-btn-icon-edit" title="Edit" onClick={() => openEdit(v)}>✏️</button>
                                            <button className="bs-btn-icon bs-btn-icon-delete" title="Delete" onClick={() => handleDelete(v.id)}>🗑</button>
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
                                        onChange={e => setForm({ ...form, amount: e.target.value })} />
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
