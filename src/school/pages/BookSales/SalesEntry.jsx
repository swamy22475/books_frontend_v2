import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../../api/sales';
import { inventoryService } from '../../../api/inventory';
import './BookSales.css';
import './SalesEntry.css';

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const paymentMethods = ['Cash', 'UPI', 'Cheque', 'Card', 'Bank Transfer'];
const today = new Date().toISOString().split('T')[0];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const stockPct = (b) => (b.qty === 0 ? 0 : Math.round((b.stock / b.qty) * 100));

const StockBadge = ({ book }) => {
    const pct = stockPct(book);
    if (book.stock === 0) return <span className="se-stock-badge se-stock-out">Out of Stock</span>;
    if (pct < 30) return <span className="se-stock-badge se-stock-low">Low Stock ({book.stock})</span>;
    return <span className="se-stock-badge se-stock-ok">In Stock ({book.stock})</span>;
};

// Initial empty selected-books map: { bookId: { book, qty, type } }
const emptySelected = {};
const emptyStudent = { 
    name: '', class: 'Class 10', payment: 'Cash', date: today,
    paidAmount: 0, concession: 0 
};

// ─────────────────────────────────────────────────────────────────────────────
// SalesEntry Component
// ─────────────────────────────────────────────────────────────────────────────
const SalesEntry = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);   // books from API
    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [student, setStudent] = useState(emptyStudent);
    const [viewSale, setViewSale] = useState(null);
    const [selected, setSelected] = useState(emptySelected);   // { id: {book, qty, type} }
    const [bookSearch, setBookSearch] = useState('');

    // ── Fetch books and sales from backend on mount ────────────────────────
    const fetchInventory = () => {
        inventoryService.getAll().then(data => {
            const mapped = data.map(b => ({
                id: b.id,
                name: b.name,
                // Handle comma-separated classes or single class string
                book_class: b.book_class ? b.book_class.split(', ').map(c => c.trim()) : [],
                type: b.book_type || 'Set',
                qty: b.total_qty || 0,
                stock: b.stock_available || 0,
                sellingPrice: b.selling_price || 0,
            }));
            setInventory(mapped);
        }).catch(err => console.error('Error fetching inventory:', err.message));
    };

    const fetchSales = () => {
        salesService.getAll().then(data => {
            const mapped = data.map(s => ({
                id: s.id,
                student: s.student_name,
                class: s.student_class || s.class, // Handle both direct and aliased field
                book: s.book_name,
                qty: s.qty,
                type: s.book_type,
                price: s.unit_price,
                total: s.total_amount,
                paid: s.paid_amount || 0,
                concession: s.concession || 0,
                balance: s.remaining_amount || 0,
                payment: s.payment_method,
                date: s.date ? new Date(s.date).toISOString().split('T')[0] : today,
            }));
            setSales(mapped);
        }).catch(err => console.error('Error fetching sales:', err));
    };

    useEffect(() => {
        fetchInventory();
        fetchSales();
    }, []);

    // Table filters
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    // ── Book multi-select helpers ──────────────────────────────────────────
    // Show books that match the selected student class AND search text
    const visibleBooks = useMemo(() =>
        inventory.filter(b => {
            const matchClass = !student.class || (Array.isArray(b.book_class) ? b.book_class.includes(student.class) : b.book_class === student.class);
            const matchSearch = b.name.toLowerCase().includes(bookSearch.toLowerCase());
            return matchClass && matchSearch;
        }),
        [inventory, bookSearch, student.class]
    );

    const toggleBook = (book) => {
        setSelected(prev => {
            if (prev[book.id]) {
                const next = { ...prev };
                delete next[book.id];
                return next;
            }
            return {
                ...prev,
                [book.id]: { book, qty: 1, type: book.type }
            };
        });
    };

    const updateQty = (id, val) => {
        const num = Math.max(1, Number(val));
        setSelected(prev => prev[id]
            ? { ...prev, [id]: { ...prev[id], qty: num } }
            : prev
        );
    };

    const updateType = (id, val) => {
        setSelected(prev => prev[id]
            ? { ...prev, [id]: { ...prev[id], type: val } }
            : prev
        );
    };

    // ── Computed cart totals ────────────────────────────────────────────────
    const cartItems = Object.values(selected);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.book.sellingPrice) * item.qty, 0
    );
    const cartBookCount = cartItems.length;

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!student.name || cartItems.length === 0) return;

        try {
            const totalBill = cartTotal - Number(student.concession || 0);
            const remaining = totalBill - Number(student.paidAmount || 0);

            const promises = cartItems.map(item => {
                const saleData = {
                    book_id: item.book.id,
                    student_name: student.name,
                    class: student.class,
                    book_name: item.book.name,
                    book_type: item.type,
                    qty: item.qty,
                    unit_price: item.book.sellingPrice,
                    total_amount: item.book.sellingPrice * item.qty,
                    paid_amount: Number(student.paidAmount) || 0,
                    concession: Number(student.concession) || 0,
                    remaining_amount: remaining,
                    payment_method: student.payment
                };
                return salesService.create(saleData);
            });

            await Promise.all(promises);

            fetchSales();
            fetchInventory();
            setSelected(emptySelected);
            setStudent(emptyStudent);
            setShowModal(false);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3500);
        } catch (err) {
            console.error('Error recording sale:', err);
            alert('Failed to record sale. Please check your connection and try again.');
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelected(emptySelected);
        setStudent(emptyStudent);
        setBookSearch('');
    };

    // ── Table display ───────────────────────────────────────────────────────
    const filtered = sales.filter(s =>
        (filterClass === 'All' || s.class === filterClass) &&
        (s.student.toLowerCase().includes(search.toLowerCase()) ||
            s.book.toLowerCase().includes(search.toLowerCase()))
    );

    // ── Group filtered records by Student + Class + Date ──
    const groupedSales = useMemo(() => {
        const groups = {};
        filtered.forEach(s => {
            const key = `${s.student}-${s.class}-${s.date}-${s.payment}`;
            if (!groups[key]) {
                groups[key] = {
                    ...s,
                    books: [s.book],
                    items: [{ name: s.book, qty: s.qty, price: s.price, total: Number(s.price) * Number(s.qty) }],
                    totalQty: s.qty,
                    totalAmount: Number(s.price) * Number(s.qty),
                    paid: s.paid,
                    concession: s.concession,
                    balance: s.balance,
                    types: new Set([s.type])
                };
            } else {
                groups[key].books.push(s.book);
                groups[key].items.push({ name: s.book, qty: s.qty, price: s.price, total: Number(s.price) * Number(s.qty) });
                groups[key].totalQty += s.qty;
                groups[key].totalAmount += Number(s.price) * Number(s.qty);
                groups[key].types.add(s.type);
            }
        });
        return Object.values(groups);
    }, [filtered]);

    const totalRevenue = sales.reduce((a, s) => a + Number(s.price) * Number(s.qty), 0);

    return (
        <div className="bs-page">
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">🧾 Sales Entry</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link><span>/</span>
                        <Link to="/school/book-sales">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Sales Entry</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-primary" onClick={() => setShowModal(true)}>
                    ＋ New Sale Entry
                </button>
            </div>

            {submitted && (
                <div className="se-success-banner">
                    ✅ Sale recorded successfully! {cartBookCount > 1 ? `${cartBookCount} books` : ''} added.
                </div>
            )}

            <div className="bs-summary-bar">
                {[
                    { label: 'Total Sales', value: sales.length, color: null },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#28c76f' },
                    { label: "Today's Sales", value: sales.filter(s => s.date === today).length, color: null },
                    { label: "Books Sold Today", value: sales.filter(s => s.date === today).reduce((a, s) => a + Number(s.qty), 0), color: '#3d5ee1' },
                ].map((item, i, arr) => (
                    <React.Fragment key={i}>
                        <div className="bs-summary-item">
                            <span className="bs-summary-label">{item.label}</span>
                            <span className="bs-summary-value" style={item.color ? { color: item.color } : {}}>
                                {item.value}
                            </span>
                        </div>
                        {i < arr.length - 1 && <div className="bs-summary-divider" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">Recent Sales Records</h5>
                    <div className="bs-filter-bar" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                        <div className="bs-search-wrap" style={{ maxWidth: 220 }}>
                            <span className="bs-search-icon">🔍</span>
                            <input type="text" className="bs-search-input" placeholder="Search student/book..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="bs-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                            <option>All</option>
                            {classes.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Books</th>
                                <th>Total Bill</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedSales.length === 0 ? (
                                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No records found.</td></tr>
                            ) : groupedSales.map((s, i) => (
                                <tr key={i}>
                                    <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{s.student}</td>
                                    <td><span className="bs-badge bs-badge-blue">{s.class}</span></td>
                                    <td style={{ color: 'var(--bs-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {s.books.join(', ')}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₹{s.totalAmount.toLocaleString()}</td>
                                    <td style={{ color: '#28c76f', fontWeight: 600 }}>₹{s.paid.toLocaleString()}</td>
                                    <td style={{ color: s.balance > 0 ? '#ea5455' : '#28c76f', fontWeight: 700 }}>₹{s.balance.toLocaleString()}</td>
                                    <td>
                                        <span className={`bs-badge ${s.balance <= 0 ? 'bs-badge-green' : 'bs-badge-orange'}`}>
                                            {s.balance <= 0 ? 'Paid' : 'Due'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--bs-muted)' }}>{s.date}</td>
                                    <td>
                                        <button className="bs-btn-icon bs-btn-icon-view" title="View Bill" onClick={() => setViewSale(s)}>
                                            👁
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bs-table-footer">
                    <span>Showing {groupedSales.length} student records</span>
                    <div className="bs-pagination">
                        <button className="bs-page-btn">‹</button>
                        <button className="bs-page-btn active">1</button>
                        <button className="bs-page-btn">›</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="bs-modal-overlay" onClick={handleClose}>
                    <div className="se-modal" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">🧾 New Sale Entry</h5>
                            <button className="bs-modal-close" onClick={handleClose}>×</button>
                        </div>

                        <div className="se-modal-body">
                            <div className="se-left-panel">
                                <div className="se-section-label">👤 Student Information</div>
                                <div className="bs-form-grid se-student-grid">
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Student Name *</label>
                                        <input className="bs-form-input" placeholder="e.g. Aarav Sharma"
                                            value={student.name}
                                            onChange={e => setStudent({ ...student, name: e.target.value })} />
                                    </div>
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Class</label>
                                        <select className="bs-form-select" value={student.class}
                                            onChange={e => setStudent({ ...student, class: e.target.value })}>
                                            {classes.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Payment Method</label>
                                        <select className="bs-form-select" value={student.payment}
                                            onChange={e => setStudent({ ...student, payment: e.target.value })}>
                                            {paymentMethods.map(m => <option key={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Date</label>
                                        <input className="bs-form-input" type="date" value={student.date}
                                            onChange={e => setStudent({ ...student, date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="se-section-label" style={{ marginTop: 20 }}>
                                    📚 Select Books
                                    <span className="se-section-hint">Tick checkboxes to add multiple books</span>
                                </div>

                                <div className="se-book-search-wrap">
                                    <span className="se-book-search-icon">🔍</span>
                                    <input
                                        type="text"
                                        className="bs-search-input"
                                        placeholder="Search books by name..."
                                        value={bookSearch}
                                        onChange={e => setBookSearch(e.target.value)}
                                    />
                                </div>

                                <div className="se-book-list">
                                    {visibleBooks.length === 0 ? (
                                        <p style={{ color: 'var(--bs-muted)', textAlign: 'center', padding: 16 }}>No books found.</p>
                                    ) : visibleBooks.map(book => {
                                        const isChecked = !!selected[book.id];
                                        const pct = stockPct(book);
                                        const disabled = book.stock === 0;
                                        return (
                                            <div
                                                key={book.id}
                                                className={`se-book-item ${isChecked ? 'se-book-item-active' : ''} ${disabled ? 'se-book-item-disabled' : ''}`}
                                                onClick={() => !disabled && toggleBook(book)}
                                            >
                                                <div className={`se-checkbox ${isChecked ? 'se-checkbox-checked' : ''} ${disabled ? 'se-checkbox-disabled' : ''}`}>
                                                    {isChecked && <span className="se-check-icon">✓</span>}
                                                </div>
                                                <div className="se-book-info">
                                                    <div className="se-book-name">{book.name}</div>
                                                    <div className="se-book-meta">
                                                        <span className={`bs-badge ${book.type === 'Set' ? 'bs-badge-blue' : 'bs-badge-purple'}`} style={{ fontSize: 10 }}>
                                                            {book.type}
                                                        </span>
                                                        <span className="se-book-price">₹{book.sellingPrice}</span>
                                                        <StockBadge book={book} />
                                                    </div>
                                                </div>
                                                <div className="se-mini-bar-wrap">
                                                    <div className="se-mini-bar-track">
                                                        <div className="se-mini-bar-fill" style={{
                                                            width: `${Math.min(pct, 100)}%`,
                                                            background: pct === 0 ? '#ea5455' : pct < 30 ? '#ff9f43' : '#28c76f'
                                                        }} />
                                                    </div>
                                                    <span className="se-mini-bar-pct" style={{
                                                        color: pct === 0 ? '#ea5455' : pct < 30 ? '#ff9f43' : '#28c76f'
                                                    }}>{pct}%</span>
                                                </div>
                                                {isChecked && (
                                                    <div className="se-book-controls" onClick={e => e.stopPropagation()}>
                                                        <div className="se-qty-control">
                                                            <button className="se-qty-btn"
                                                                onClick={() => updateQty(book.id, (selected[book.id].qty || 1) - 1)}>−</button>
                                                            <input
                                                                type="number" min="1"
                                                                className="se-qty-input"
                                                                value={selected[book.id].qty}
                                                                onChange={e => updateQty(book.id, e.target.value)}
                                                            />
                                                            <button className="se-qty-btn"
                                                                onClick={() => updateQty(book.id, (selected[book.id].qty || 1) + 1)}>＋</button>
                                                        </div>
                                                        <select className="se-type-select"
                                                            value={selected[book.id].type}
                                                            onChange={e => updateType(book.id, e.target.value)}>
                                                            <option>Set</option>
                                                            <option>Single</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="se-right-panel">
                                <div className="se-bill-header">
                                    🧾 Bill Summary
                                    {cartBookCount > 0 && (
                                        <span className="se-bill-count">{cartBookCount} book{cartBookCount > 1 ? 's' : ''}</span>
                                    )}
                                </div>

                                {cartItems.length === 0 ? (
                                    <div className="se-bill-empty">
                                        <span style={{ fontSize: 36 }}>📚</span>
                                        <p>Select books from the left<br />to add them to the bill</p>
                                    </div>
                                ) : (
                                    <div className="se-bill-items">
                                        {cartItems.map(item => (
                                            <div key={item.book.id} className="se-bill-item">
                                                <div className="se-bill-item-name">{item.book.name}</div>
                                                <div className="se-bill-item-detail">
                                                    <span className="se-bill-qty">× {item.qty}</span>
                                                    <span className="se-bill-unit">@ ₹{item.book.sellingPrice}</span>
                                                </div>
                                                <div className="se-bill-item-total">
                                                    ₹{(item.book.sellingPrice * item.qty).toLocaleString()}
                                                </div>
                                                <button className="se-bill-remove"
                                                    onClick={() => toggleBook(item.book)} title="Remove">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="se-bill-footer">
                                    <div className="se-bill-row">
                                        <span>Sub Total</span>
                                        <strong>₹{cartTotal.toLocaleString()}</strong>
                                    </div>
                                    <div className="se-bill-row" style={{ marginTop: '10px' }}>
                                        <span>Concession (₹)</span>
                                        <input 
                                            type="number" 
                                            className="se-bill-input"
                                            value={student.concession}
                                            onChange={e => setStudent({ ...student, concession: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="se-bill-row">
                                        <span>Net Total</span>
                                        <strong style={{ color: '#7367f0' }}>₹{(cartTotal - Number(student.concession || 0)).toLocaleString()}</strong>
                                    </div>
                                    <div className="se-bill-row" style={{ marginTop: '10px' }}>
                                        <span>Paid Amount (₹)</span>
                                        <input 
                                            type="number" 
                                            className="se-bill-input"
                                            value={student.paidAmount}
                                            onChange={e => setStudent({ ...student, paidAmount: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="se-bill-row se-bill-total-row" style={{ borderTop: '2px dashed #eee', paddingTop: '15px', marginTop: '15px' }}>
                                        <span>Remaining Balance</span>
                                        <strong className="se-grand-total" style={{ color: (cartTotal - Number(student.concession || 0) - Number(student.paidAmount || 0)) > 0 ? '#ea5455' : '#28c76f' }}>
                                            ₹{(cartTotal - Number(student.concession || 0) - Number(student.paidAmount || 0)).toLocaleString()}
                                        </strong>
                                    </div>
                                    {student.payment && (
                                        <div className="se-bill-row">
                                            <span>Method</span>
                                            <span className="bs-badge bs-badge-green">{student.payment}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={handleClose}>Cancel</button>
                            <button
                                className="bs-btn bs-btn-success"
                                disabled={!student.name || cartItems.length === 0}
                                style={{ opacity: (!student.name || cartItems.length === 0) ? 0.5 : 1, cursor: (!student.name || cartItems.length === 0) ? 'not-allowed' : 'pointer' }}
                                onClick={handleSubmit}
                            >
                                ✔ Submit Sale ({cartBookCount > 0 ? `${cartBookCount} books · ₹${cartTotal.toLocaleString()}` : '—'})
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {viewSale && (
                <div className="bs-modal-overlay" onClick={() => setViewSale(null)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">👁 Sales Bill Details</h5>
                            <button className="bs-modal-close" onClick={() => setViewSale(null)}>×</button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="se-bill-view">
                                <div className="se-bill-view-section">
                                    <label>Student Name</label>
                                    <div className="se-bill-view-value">{viewSale.student}</div>
                                </div>
                                <div className="se-bill-view-section">
                                    <label>Class</label>
                                    <div className="se-bill-view-value">{viewSale.class}</div>
                                </div>
                                <div className="se-bill-view-divider" />
                                <div className="se-bill-view-items-header">
                                    <span>Item Details</span>
                                    <span>Amount</span>
                                </div>
                                <div className="se-bill-view-items">
                                    {viewSale.items.map((item, idx) => (
                                        <div key={idx} className="se-bill-view-item">
                                            <div className="se-bill-view-item-info">
                                                <div className="se-bill-view-item-name">{item.name}</div>
                                                <div className="se-bill-view-item-meta">{item.qty} units @ ₹{item.price}</div>
                                            </div>
                                            <div className="se-bill-view-item-total">
                                                ₹{item.total.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="se-bill-view-footer">
                                    <div className="se-bill-view-row">
                                        <span>Concession</span>
                                        <span>₹{viewSale.concession?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="se-bill-view-row">
                                        <span>Paid Amount</span>
                                        <span style={{ color: '#28c76f', fontWeight: 600 }}>₹{viewSale.paid?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="se-bill-view-row se-bill-view-total">
                                        <span>Balance Due</span>
                                        <span style={{ color: viewSale.balance > 0 ? '#ea5455' : '#28c76f' }}>₹{viewSale.balance?.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-primary" onClick={() => setViewSale(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesEntry;
