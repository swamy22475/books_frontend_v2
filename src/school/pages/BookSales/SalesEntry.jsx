import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconCash, IconEye, IconTrash, IconX } from '@tabler/icons-react';
import { salesService } from '../../../api/sales';
import { inventoryService } from '../../../api/inventory';
import { AcademicsContext } from '../../../context/AcademicsContext';
import SaveFeedbackOverlay from './SaveFeedbackOverlay';
import './BookSales.css';
import './SalesEntry.css';

const paymentMethods = ['Cash', 'UPI', 'Cheque', 'Card', 'Bank Transfer'];
const today = new Date().toISOString().split('T')[0];

const stockPct = (b) => (b.qty === 0 ? 0 : Math.round((b.stock / b.qty) * 100));

const StockBadge = ({ book }) => {
    const pct = stockPct(book);
    if (book.stock === 0) return <span className="se-stock-badge se-stock-out">Out of Stock</span>;
    if (pct < 30) return <span className="se-stock-badge se-stock-low">Low Stock ({book.stock})</span>;
    return <span className="se-stock-badge se-stock-ok">In Stock ({book.stock})</span>;
};

const emptySelected = {};
const emptyStudent = { 
    name: '', phone: '', class: '', section: '', payment: 'Cash', date: today,
    paidAmount: 0, concession: 0 
};

const SalesEntry = () => {
    const { classes, sections } = useContext(AcademicsContext);
    const classOptions = useMemo(
        () => classes.filter(c => (c.academicStatus || 'Active') === 'Active'),
        [classes]
    );
    const classNames = useMemo(() => classOptions.map(c => c.name), [classOptions]);
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [saveState, setSaveState] = useState('idle');
    const [student, setStudent] = useState(emptyStudent);
    const [viewSale, setViewSale] = useState(null);
    const [paySale, setPaySale] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const [selected, setSelected] = useState(emptySelected);
    const [bookSearch, setBookSearch] = useState('');
    const selectedClassMeta = classOptions.find(c => c.name === student.class);
    const sectionOptions = selectedClassMeta
        ? sections.filter(s => Number(s.classId) === Number(selectedClassMeta.id) && (s.academicStatus || 'Active') === 'Active')
        : [];

    const fetchInventory = () => {
        return inventoryService.getAll().then(data => {
            const mapped = data.map(b => ({
                id: b.id,
                name: b.name,
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
        return salesService.getAll().then(data => {
            const mapped = data.map(s => {
                const total = Number(s.total_amount) || 0;
                const paid = Number(s.paid_amount) || 0;
                const concession = Number(s.concession) || 0;
                const savedBalance = Number(s.remaining_amount);
                const balance = Number.isFinite(savedBalance) && savedBalance > 0
                    ? savedBalance
                    : Math.max(total - concession - paid, 0);

                return ({
                id: s.id,
                book_id: s.book_id,
                student: s.student_name,
                phone: s.student_phone || '',
                class: s.student_class || s.class,
                section: s.student_section || '',
                book: s.book_name,
                qty: s.qty,
                type: s.book_type,
                price: s.unit_price,
                total,
                paid,
                concession,
                balance,
                payment: s.payment_method,
                book_selection: s.book_selection || 'Single',
                date: s.date ? new Date(s.date).toISOString().split('T')[0] : today,
            });
            });
            setSales(mapped);
        }).catch(err => console.error('Error fetching sales:', err));
    };

    useEffect(() => {
        fetchInventory();
        fetchSales();
    }, []);

    useEffect(() => {
        if (!student.class && classNames.length > 0) {
            setStudent(prev => ({ ...prev, class: classNames[0] }));
        }
    }, [classNames, student.class]);

    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('All');

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

    const cartItems = Object.values(selected);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.book.sellingPrice) * item.qty, 0
    );
    const cartBookCount = cartItems.length;

    const handleSubmit = async () => {
        if (!student.name || cartItems.length === 0) return;

        setSaveState('saving');
        const startTime = Date.now();
        setShowModal(false);

        try {
            const totalBill = cartTotal - Number(student.concession || 0);
            const remaining = totalBill - Number(student.paidAmount || 0);

            const promises = cartItems.map(item => {
                const saleData = {
                    book_id: item.book.id,
                    student_name: student.name,
                    student_phone: student.phone,
                    class: student.class,
                    student_section: student.section || null,
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

            const elapsed = Date.now() - startTime;
            if (elapsed < 800) await new Promise(resolve => setTimeout(resolve, 800 - elapsed));

            await Promise.all([fetchSales(), fetchInventory()]);
            setSelected(emptySelected);
            setStudent(emptyStudent);
            setSubmitted(true);
            setSaveState('success');
            setTimeout(() => setSubmitted(false), 3500);
            setTimeout(() => setSaveState('idle'), 2500);
        } catch (err) {
            setSaveState('idle');
            setShowModal(true);
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

    const openPayModal = (sale) => {
        setPaySale(sale);
        setPayAmount(sale.balance > 0 ? String(sale.balance) : '');
    };

    const closePayModal = () => {
        setPaySale(null);
        setPayAmount('');
    };

    const handlePaySubmit = async () => {
        if (!paySale) return;

        const amount = Number(payAmount);
        if (!amount || amount <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }

        const currentBalance = Number(paySale.balance) || 0;
        const appliedAmount = Math.min(amount, currentBalance);
        const newPaid = (Number(paySale.paid) || 0) + appliedAmount;
        const newBalance = Math.max(currentBalance - appliedAmount, 0);

        try {
            const updates = paySale.records.map(record => salesService.update(record.id, {
                book_id: record.book_id,
                student_name: record.student,
                student_phone: record.phone,
                class: record.class,
                student_section: record.section || null,
                book_name: record.book,
                book_type: record.type,
                qty: record.qty,
                unit_price: record.price,
                total_amount: record.total,
                paid_amount: newPaid,
                concession: record.concession,
                remaining_amount: newBalance,
                payment_method: record.payment,
                book_selection: record.book_selection || 'Single'
            }));

            await Promise.all(updates);
            closePayModal();
            fetchSales();
        } catch (err) {
            console.error('Error updating payment:', err);
            alert('Failed to update payment. Please try again.');
        }
    };

    const handleDeleteSale = async (sale) => {
        const confirmed = window.confirm(`Delete sale record for ${sale.student}? This will remove all books in this bill.`);
        if (!confirmed) return;

        try {
            await Promise.all(sale.records.map(record => salesService.delete(record.id)));
            fetchSales();
            fetchInventory();
        } catch (err) {
            console.error('Error deleting sale:', err);
            alert('Failed to delete sale. Please try again.');
        }
    };

    const filtered = sales.filter(s =>
        (filterClass === 'All' || s.class === filterClass) &&
        (s.student.toLowerCase().includes(search.toLowerCase()) ||
            (s.phone || '').includes(search) ||
            s.book.toLowerCase().includes(search.toLowerCase()))
    );

    const groupedSales = useMemo(() => {
        const groups = {};
        filtered.forEach(s => {
            const key = `${s.student}-${s.phone}-${s.class}-${s.section || ''}-${s.date}-${s.payment}`;
            if (!groups[key]) {
                groups[key] = {
                    ...s,
                    books: [s.book],
                    items: [{ name: s.book, qty: s.qty, price: s.price, total: Number(s.price) * Number(s.qty) }],
                    records: [s],
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
                groups[key].records.push(s);
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
            <SaveFeedbackOverlay state={saveState} type="sale" />

            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">🧾 Sales Entry</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="..">Dashboard</Link><span>/</span>
                        <Link to="..">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Sales Entry</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-primary bs-btn-animated" onClick={() => setShowModal(true)}>
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
                            {classNames.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Phone</th>
                                <th>Class</th>
                                <th>Section</th>
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
                                <tr><td colSpan={12} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No records found.</td></tr>
                            ) : groupedSales.map((s, i) => (
                                <tr key={i}>
                                    <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{s.student}</td>
                                    <td style={{ color: 'var(--bs-muted)' }}>{s.phone || '-'}</td>
                                    <td><span className="bs-badge bs-badge-blue">{s.class}</span></td>
                                    <td style={{ color: 'var(--bs-muted)' }}>{s.section || '-'}</td>
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
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <button className="bs-btn-icon bs-btn-icon-view" title="View Bill" onClick={() => setViewSale(s)}>
                                                <IconEye size={16} />
                                            </button>
                                            {s.balance > 0 && (
                                                <button
                                                    className="bs-btn bs-btn-success"
                                                    style={{ padding: '7px 12px', gap: 6, minHeight: 34 }}
                                                    title="Pay Due"
                                                    onClick={() => openPayModal(s)}
                                                >
                                                    <IconCash size={16} />
                                                    Pay
                                                </button>
                                            )}
                                            <button
                                                className="bs-btn-icon bs-btn-icon-delete"
                                                title="Delete Sale"
                                                onClick={() => handleDeleteSale(s)}
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                        <label className="bs-form-label">Phone Number</label>
                                        <input
                                            className="bs-form-input"
                                            type="tel"
                                            inputMode="numeric"
                                            placeholder="e.g. 9876543210"
                                            value={student.phone}
                                            onChange={e => {
                                                const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setStudent({ ...student, phone });
                                            }}
                                        />
                                    </div>
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Class</label>
                                        <select className="bs-form-select" value={student.class}
                                            onChange={e => setStudent({ ...student, class: e.target.value, section: '' })}>
                                            {classNames.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="bs-form-group">
                                        <label className="bs-form-label">Section <span style={{ color: 'var(--bs-muted)' }}>(optional)</span></label>
                                        <select
                                            className="bs-form-select"
                                            value={student.section}
                                            onChange={e => setStudent({ ...student, section: e.target.value })}
                                            disabled={sectionOptions.length === 0}
                                        >
                                            <option value="">{sectionOptions.length === 0 ? 'No sections for this class' : 'No section'}</option>
                                            {sectionOptions.map(section => (
                                                <option key={section.id} value={section.name}>{section.name}</option>
                                            ))}
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
                                className="bs-btn bs-btn-success bs-btn-animated"
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
                                    <label>Phone Number</label>
                                    <div className="se-bill-view-value">{viewSale.phone || '-'}</div>
                                </div>
                                <div className="se-bill-view-section">
                                    <label>Class</label>
                                    <div className="se-bill-view-value">{viewSale.class}</div>
                                </div>
                                <div className="se-bill-view-section">
                                    <label>Section</label>
                                    <div className="se-bill-view-value">{viewSale.section || '-'}</div>
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

            {paySale && (
                <div className="bs-modal-overlay" onClick={closePayModal}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">Update Due Payment</h5>
                            <button className="bs-modal-close" onClick={closePayModal}><IconX size={18} /></button>
                        </div>
                        <div className="bs-modal-body">
                            <div className="se-bill-view" style={{ marginBottom: 18 }}>
                                <div className="se-bill-view-section">
                                    <label>Student</label>
                                    <div className="se-bill-view-value">{paySale.student}</div>
                                </div>
                                <div className="se-bill-view-footer">
                                    <div className="se-bill-view-row">
                                        <span>Total Bill</span>
                                        <span>₹{paySale.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="se-bill-view-row">
                                        <span>Already Paid</span>
                                        <span style={{ color: '#28c76f', fontWeight: 700 }}>₹{paySale.paid.toLocaleString()}</span>
                                    </div>
                                    <div className="se-bill-view-row se-bill-view-total">
                                        <span>Current Due</span>
                                        <span style={{ color: '#ea5455' }}>₹{paySale.balance.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bs-form-group">
                                <label className="bs-form-label">Amount Paying Now</label>
                                <input
                                    className="bs-form-input"
                                    type="number"
                                    min="1"
                                    max={paySale.balance}
                                    value={payAmount}
                                    onChange={e => setPayAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div style={{ color: 'var(--bs-muted)', fontSize: 13 }}>
                                New due will be ₹{Math.max((Number(paySale.balance) || 0) - (Number(payAmount) || 0), 0).toLocaleString()}.
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={closePayModal}>Cancel</button>
                            <button className="bs-btn bs-btn-success bs-btn-animated" onClick={handlePaySubmit}>
                                <IconCash size={16} />
                                Update Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesEntry;
