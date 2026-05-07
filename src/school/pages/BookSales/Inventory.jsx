import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../../api/inventory';
import { vendorService } from '../../../api/vendors';
import './BookSales.css';

const emptyBook = {
    name: '', book_class: '', book_type: 'Set', total_qty: '', sets_qty: '', singles_qty: '',
    cost_price: '', selling_price: '', stock_available: '', vendor_id: '', vendor_name: ''
};
const bookTypes = ['Set', 'Single'];

const getStockStatus = (stock) => {
    const s = Number(stock);
    if (s === 0) return { label: '❌ Out of Stock', cls: 'bs-badge-red' };
    if (s <= 20) return { label: '⚠️ Low Stock', cls: 'bs-badge-orange' };
    return { label: '✅ In Stock', cls: 'bs-badge-green' };
};

// Map backend book → frontend form
const mapToFrontend = (b) => ({
    id: b.id,
    name: b.name,
    book_class: b.book_class || '',
    type: b.book_type,
    qty: b.total_qty,
    sets: b.sets_qty,
    singles: b.singles_qty,
    costPrice: b.cost_price,
    sellingPrice: b.selling_price,
    stock: b.stock_available,
    vendor_id: b.vendor_id || '',
    vendor: b.vendor_name || '',
    date: b.created_at ? new Date(b.created_at).toLocaleString() : 'N/A'
});

// Map frontend form → backend payload
const mapToBackend = (f) => ({
    name: f.name,
    book_class: f.book_class || null,
    book_type: f.type,
    total_qty: Number(f.qty) || 0,
    sets_qty: Number(f.sets) || 0,
    singles_qty: Number(f.singles) || 0,
    cost_price: Number(f.costPrice) || 0,
    selling_price: Number(f.sellingPrice) || 0,
    stock_available: Number(f.stock) || 0,
    vendor_id: f.vendor_id ? Number(f.vendor_id) : null,
    vendor_name: f.vendor || null,
});

const Inventory = () => {
    const [books, setBooks] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyBook);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getAll();
            setBooks(data.map(mapToFrontend));
        } catch (err) {
            console.error('Error fetching books:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVendors = async () => {
        try {
            const data = await vendorService.getAll();
            setVendors(data);
        } catch (err) {
            console.error('Error fetching vendors:', err.message);
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchVendors();
    }, []);

    const filtered = books.filter(b => {
        const status = getStockStatus(b.stock).label;
        return (
            (filterType === 'All' || b.type === filterType) &&
            (filterClass === 'All' || b.book_class === filterClass) &&
            (filterStatus === 'All' || status.includes(filterStatus)) &&
            b.name.toLowerCase().includes(search.toLowerCase())
        );
    });

    const openAdd = () => { setForm(emptyBook); setEditId(null); setShowModal(true); };
    const openEdit = (b) => {
        setForm({
            name: b.name, book_class: b.book_class, type: b.type, qty: b.qty, sets: b.sets,
            singles: b.singles, costPrice: b.costPrice, sellingPrice: b.sellingPrice,
            stock: b.stock, vendor_id: b.vendor_id, vendor: b.vendor
        });
        setEditId(b.id);
        setShowModal(true);
    };

    const handleVendorChange = (e) => {
        const vid = e.target.value;
        const vendorObj = vendors.find(v => String(v.id) === vid);
        setForm({ ...form, vendor_id: vid, vendor: vendorObj ? vendorObj.name : '' });
    };

    const handleSubmit = async () => {
        if (!form.name) return;
        try {
            const payload = mapToBackend(form);
            if (editId) {
                await inventoryService.update(editId, payload);
            } else {
                await inventoryService.create(payload);
            }
            fetchBooks();
            setShowModal(false);
        } catch (err) {
            const msg = err.message || 'Unknown error';
            console.error('Error saving book:', msg);
            alert(`Failed to save: ${msg}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await inventoryService.delete(id);
                fetchBooks();
            } catch (err) {
                console.error('Error deleting book:', err.message);
                alert('Failed to delete book.');
            }
        }
    };

    const totalStock = books.reduce((a, b) => a + Number(b.stock), 0);
    const outOfStock = books.filter(b => Number(b.stock) === 0).length;
    const lowStock = books.filter(b => Number(b.stock) > 0 && Number(b.stock) <= 20).length;

    return (
        <div className="bs-page">
            {/* Header */}
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">📦 Book Inventory</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link><span>/</span>
                        <Link to="/school/book-sales">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Inventory</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-primary" onClick={openAdd}>
                    ＋ Add Stock
                </button>
            </div>

            {/* KPI Row */}
            <div className="bs-row bs-row-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[
                    { label: 'Total Titles', value: books.length, color: '#3d5ee1', bg: '#eef1fd', icon: '📚' },
                    { label: 'Total Stock', value: totalStock, color: '#28c76f', bg: '#e8faf1', icon: '📦' },
                    { label: 'Low Stock', value: lowStock, color: '#ff9f43', bg: '#fff5e6', icon: '⚠️' },
                    { label: 'Out of Stock', value: outOfStock, color: '#ea5455', bg: '#fce8e8', icon: '❌' },
                ].map((card, i) => (
                    <div key={i} className="bs-kpi-card">
                        <div className="bs-kpi-icon" style={{ background: card.bg, color: card.color }}><span>{card.icon}</span></div>
                        <div className="bs-kpi-info">
                            <p className="bs-kpi-label">{card.label}</p>
                            <h3 className="bs-kpi-value">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">Book Stock List</h5>
                    <div className="bs-filter-bar" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                        <div className="bs-search-wrap" style={{ maxWidth: 220 }}>
                            <span className="bs-search-icon">🔍</span>
                            <input type="text" className="bs-search-input" placeholder="Search books..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="bs-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            <option value="All">All Classes</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={`Class ${n}`}>Class {n}</option>
                            ))}
                        </select>
                        <select className="bs-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option>All</option>
                            {bookTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <select className="bs-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
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
                                <th>Total Qty</th>
                                <th>Sets</th>
                                <th>Singles</th>
                                <th>Cost Price</th>
                                <th>Selling Price</th>
                                <th>Vendor</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={14} style={{ textAlign: 'center', padding: 32 }}>Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={14} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No books found.</td></tr>
                            ) : filtered.map((b, i) => {
                                const status = getStockStatus(b.stock);
                                return (
                                    <tr key={b.id}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{b.name}</td>
                                        <td style={{ color: 'var(--bs-muted)' }}>{b.book_class || '—'}</td>
                                        <td><span className={`bs-badge ${b.type === 'Set' ? 'bs-badge-blue' : 'bs-badge-purple'}`}>{b.type}</span></td>
                                        <td>{b.qty}</td>
                                        <td>{b.sets}</td>
                                        <td>{b.singles}</td>
                                        <td>₹{Number(b.costPrice).toLocaleString()}</td>
                                        <td style={{ fontWeight: 700, color: '#28c76f' }}>₹{Number(b.sellingPrice).toLocaleString()}</td>
                                        <td style={{ color: 'var(--bs-muted)', fontSize: 12 }}>{b.vendor || '—'}</td>
                                        <td style={{ fontWeight: 700, color: Number(b.stock) === 0 ? '#ea5455' : Number(b.stock) <= 20 ? '#ff9f43' : '#28c76f' }}>
                                            {b.stock}
                                        </td>
                                        <td><span className={`bs-badge ${status.cls}`}>{status.label}</span></td>
                                        <td style={{ fontSize: 12, color: 'var(--bs-muted)', whiteSpace: 'nowrap' }}>{b.date}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="bs-btn-icon bs-btn-icon-edit" onClick={() => openEdit(b)}>✏️</button>
                                                <button className="bs-btn-icon bs-btn-icon-delete" onClick={() => handleDelete(b.id)}>🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="bs-table-footer">
                    <span>Showing {filtered.length} of {books.length} books</span>
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
                    <div className="bs-modal bs-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">{editId ? '✏️ Edit Book' : '➕ Add Book Stock'}</h5>
                            <button className="bs-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="bs-form-grid">
                                <div className="bs-form-group full-width">
                                    <label className="bs-form-label">Book Name *</label>
                                    <input className="bs-form-input" placeholder="e.g. Mathematics"
                                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Class</label>
                                    <select className="bs-form-select" value={form.book_class} onChange={e => setForm({ ...form, book_class: e.target.value })}>
                                        <option value="">— Select Class —</option>
                                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                            <option key={n} value={`Class ${n}`}>Class {n}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Type</label>
                                    <select className="bs-form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        {bookTypes.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Total Quantity</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 200" value={form.qty}
                                        onChange={e => setForm({ ...form, qty: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">How Many Sets</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 180" value={form.sets}
                                        onChange={e => setForm({ ...form, sets: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">How Many Singles</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 20" value={form.singles}
                                        onChange={e => setForm({ ...form, singles: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Cost Price (₹)</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 450" value={form.costPrice}
                                        onChange={e => setForm({ ...form, costPrice: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Selling Price (₹)</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 550" value={form.sellingPrice}
                                        onChange={e => setForm({ ...form, sellingPrice: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Stock Available</label>
                                    <input className="bs-form-input" type="number" placeholder="e.g. 120" value={form.stock}
                                        onChange={e => setForm({ ...form, stock: e.target.value })} />
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Vendor</label>
                                    <select className="bs-form-select" value={form.vendor_id} onChange={handleVendorChange}>
                                        <option value="">— Select Vendor —</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="bs-btn bs-btn-primary" onClick={handleSubmit}>
                                {editId ? '✔ Update Book' : '✔ Add Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
