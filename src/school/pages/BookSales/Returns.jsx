import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api-client';
import './BookSales.css';
import './SalesEntry.css';

const today = new Date().toISOString().split('T')[0];
const reasons = ['Damaged pages', 'Wrong edition', 'Duplicate', 'Not needed', 'Wrong class', 'Defective binding', 'Other'];
const emptyForm = { book_id: null, student: '', book: '', qty: 1, reason: reasons[0], date: today, student_class: '', unit_price: 0 };

const Returns = () => {
    const [returns, setReturns] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [studentSearch, setStudentSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Fetch Data ──
    const fetchSales = async () => {
        try {
            const data = await api.get('/sales/');
            setAllSales(data);
        } catch (err) { console.error('Error fetching sales:', err); }
    };

    const fetchReturns = async () => {
        try {
            const data = await api.get('/returns/');
            const mapped = data.map(r => ({
                id: r.id,
                student: r.student_name,
                class: r.student_class,
                book: r.book_name,
                qty: r.qty,
                reason: r.reason,
                date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : today,
                status: r.status
            }));
            setReturns(mapped);
        } catch (err) {
            console.error('Error fetching returns:', err);
            setReturns([]);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchReturns();
    }, []);

    // ── Student Book Selection Logic ──
    const studentSales = useMemo(() => {
        if (!studentSearch) return [];
        return allSales.filter(s => 
            s.student_name.toLowerCase().includes(studentSearch.toLowerCase())
        );
    }, [allSales, studentSearch]);

    // Unique students from search
    const uniqueStudents = useMemo(() => {
        const names = [...new Set(studentSales.map(s => s.student_name))];
        return names.slice(0, 5);
    }, [studentSales]);

    // Books for selected student
    const studentBooks = useMemo(() => {
        if (!form.student) return [];
        return allSales.filter(s => s.student_name === form.student);
    }, [allSales, form.student]);

    const filtered = returns.filter(r =>
        (filterStatus === 'All' || r.status === filterStatus) &&
        (r.student.toLowerCase().includes(search.toLowerCase()) || r.book.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSubmit = async () => {
        if (!form.student || !form.book || loading) return;
        setLoading(true);
        try {
            const payload = {
                book_id: form.book_id,
                student_name: form.student,
                student_class: form.student_class,
                book_name: form.book,
                qty: Number(form.qty),
                reason: form.reason,
                status: 'Pending'
            };
            await api.post('/returns/', payload);
            await fetchReturns(); // Refresh list
            setForm(emptyForm);
            setStudentSearch('');
            setShowModal(false);
        } catch (err) { 
            console.error('Error submitting return:', err);
            const msg = err.response?.data?.detail || err.message || 'Unknown error';
            alert(`Failed to save return: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/returns/${id}`, { status });
            fetchReturns(); // Refresh list
        } catch (err) { console.error('Error updating status:', err); }
    };

    const totalReturns = returns.length;
    const pendingReturns = returns.filter(r => r.status === 'Pending').length;
    const approvedReturns = returns.filter(r => r.status === 'Approved').length;

    return (
        <div className="bs-page">
            {/* Header */}
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">🔁 Returns Management</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link><span>/</span>
                        <Link to="/school/book-sales">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Returns</span>
                    </nav>
                </div>
                <button className="bs-btn bs-btn-warning" onClick={() => setShowModal(true)}>
                    ＋ Add Return
                </button>
            </div>

            {/* Summary Cards */}
            <div className="bs-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { label: 'Total Returns', value: totalReturns, icon: '🔁', color: '#3d5ee1', bg: '#eef1fd' },
                    { label: 'Pending Approval', value: pendingReturns, icon: '⏳', color: '#ff9f43', bg: '#fff5e6' },
                    { label: 'Approved Returns', value: approvedReturns, icon: '✅', color: '#28c76f', bg: '#e8faf1' },
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
                    <h5 className="bs-card-title">Return Records</h5>
                    <div className="bs-filter-bar" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                        <div className="bs-search-wrap" style={{ maxWidth: 220 }}>
                            <span className="bs-search-icon">🔍</span>
                            <input type="text" className="bs-search-input" placeholder="Search..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="bs-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option>All</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Book Name</th>
                                <th>Qty Returned</th>
                                <th>Reason</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No returns found.</td></tr>
                            ) : filtered.map((r, i) => (
                                <tr key={r.id}>
                                    <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{r.student}</td>
                                    <td style={{ color: 'var(--bs-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.book}</td>
                                    <td style={{ fontWeight: 700, color: '#ea5455' }}>{r.qty}</td>
                                    <td>
                                        <span className="bs-badge bs-badge-orange">{r.reason}</span>
                                    </td>
                                    <td style={{ color: 'var(--bs-muted)' }}>{r.date}</td>
                                    <td>
                                        <span className={`bs-badge ${r.status === 'Approved' ? 'bs-badge-green' : r.status === 'Rejected' ? 'bs-badge-red' : 'bs-badge-orange'}`}>
                                            {r.status === 'Approved' ? '✅' : r.status === 'Rejected' ? '❌' : '⏳'} {r.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {r.status === 'Pending' && (
                                                <>
                                                    <button
                                                        className="bs-btn bs-btn-success bs-btn-sm"
                                                        onClick={() => updateStatus(r.id, 'Approved')}
                                                    >Approve</button>
                                                    <button
                                                        className="bs-btn bs-btn-danger bs-btn-sm"
                                                        onClick={() => updateStatus(r.id, 'Rejected')}
                                                    >Reject</button>
                                                </>
                                            )}
                                            {r.status !== 'Pending' && (
                                                <span style={{ color: 'var(--bs-muted)', fontSize: 12, padding: '4px 8px' }}>No action</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bs-table-footer">
                    <span>Showing {filtered.length} of {returns.length} returns</span>
                    <div className="bs-pagination">
                        <button className="bs-page-btn">‹</button>
                        <button className="bs-page-btn active">1</button>
                        <button className="bs-page-btn">›</button>
                    </div>
                </div>
            </div>

            {/* Add Return Modal */}
            {showModal && (
                <div className="bs-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">🔁 Add Book Return</h5>
                            <button className="bs-modal-close" onClick={() => { setShowModal(false); setStudentSearch(''); }}>×</button>
                        </div>
                        <div className="bs-modal-body" style={{ minHeight: 400 }}>
                            <div className="bs-form-grid">
                                <div className="bs-form-group full-width" style={{ position: 'relative' }}>
                                    <label className="bs-form-label">Search Student Name *</label>
                                    <input 
                                        className="bs-form-input" 
                                        placeholder="Type student name to find history..."
                                        value={form.student ? form.student : studentSearch} 
                                        onChange={e => {
                                            setStudentSearch(e.target.value);
                                            if (form.student) setForm({ ...form, student: '', book: '' });
                                        }} 
                                    />
                                    {!form.student && studentSearch && uniqueStudents.length > 0 && (
                                        <div className="bs-suggestion-dropdown">
                                            {uniqueStudents.map(name => (
                                                <div 
                                                    key={name} 
                                                    className="bs-suggestion-item"
                                                    onClick={() => {
                                                        const firstSale = studentSales.find(s => s.student_name === name);
                                                        setForm({ ...form, student: name, student_class: firstSale.student_class });
                                                        setStudentSearch(name);
                                                    }}
                                                >
                                                    👤 {name} ({studentSales.find(s => s.student_name === name)?.student_class})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {form.student && (
                                    <>
                                        <div className="bs-form-group full-width">
                                            <label className="bs-form-label">Select Purchased Book *</label>
                                            <div className="se-book-list" style={{ maxHeight: 180 }}>
                                                {studentBooks.length === 0 ? (
                                                    <p style={{ fontSize: 12, color: 'var(--bs-muted)' }}>No purchase history found.</p>
                                                ) : studentBooks.map((s, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`se-book-item ${form.book === s.book_name ? 'se-book-item-active' : ''}`}
                                                        onClick={() => setForm({ ...form, book: s.book_name, book_id: s.book_id, unit_price: s.unit_price })}
                                                    >
                                                        <div className="se-book-info">
                                                            <div className="se-book-name">{s.book_name}</div>
                                                            <div className="se-book-meta">
                                                                <span className="se-book-price">Bought: {s.qty} units @ ₹{s.unit_price}</span>
                                                                <span style={{ fontSize: 11, color: 'var(--bs-muted)' }}>Date: {s.date}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`se-checkbox ${form.book === s.book_name ? 'se-checkbox-checked' : ''}`}>
                                                            {form.book === s.book_name && <span className="se-check-icon">✓</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bs-form-group">
                                            <label className="bs-form-label">Qty to Return</label>
                                            <input className="bs-form-input" type="number" min="1" max={studentBooks.find(b => b.book_name === form.book)?.qty || 1}
                                                value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                                        </div>
                                        <div className="bs-form-group">
                                            <label className="bs-form-label">Return Date</label>
                                            <input className="bs-form-input" type="date" value={form.date}
                                                onChange={e => setForm({ ...form, date: e.target.value })} />
                                        </div>
                                        <div className="bs-form-group full-width">
                                            <label className="bs-form-label">Reason for Return</label>
                                            <select className="bs-form-select" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                                                {reasons.map(r => <option key={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bs-modal-footer">
                            <button className="bs-btn bs-btn-outline" onClick={() => { setShowModal(false); setStudentSearch(''); }}>Cancel</button>
                            <button 
                                className="bs-btn bs-btn-warning" 
                                onClick={handleSubmit}
                                disabled={!form.student || !form.book || loading}
                                style={{ opacity: (!form.student || !form.book || loading) ? 0.6 : 1 }}
                            >
                                {loading ? 'Saving...' : '✔ Submit Return'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Returns;
