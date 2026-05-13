import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../../api/sales';
import { inventoryService } from '../../../api/inventory';
import { returnsService } from '../../../api/returns';
import { vendorService } from '../../../api/vendors';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import './BookSales.css';

const today = new Date().toISOString().split('T')[0];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bs-tooltip">
                <p style={{ fontWeight: 600, margin: '0 0 5px', fontSize: 13 }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, margin: '2px 0', fontSize: 12 }}>
                        {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const BookSalesReports = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [returns, setReturns] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('sales');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState(today);
    const [filterVendor, setFilterVendor] = useState('All');
    const [filterBook, setFilterBook] = useState('All');

    // ── Fetch All Data ──
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sData, iData, rData, vData] = await Promise.all([
                    salesService.getAll(),
                    inventoryService.getAll(),
                    returnsService.getAll(),
                    vendorService.getAll()
                ]);
                setSales(Array.isArray(sData) ? sData : []);
                setInventory(Array.isArray(iData) ? iData : []);
                setReturns(Array.isArray(rData) ? rData : []);
                setVendors(Array.isArray(vData) ? vData : []);
            } catch (err) {
                console.error('Error fetching report data:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Metrics & Aggregations ──
    const approvedReturns = useMemo(
        () => returns.filter(r => r.status === 'Approved'),
        [returns]
    );

    const returnedSaleIds = useMemo(
        () => new Set(approvedReturns.map(r => r.sale_id).filter(Boolean)),
        [approvedReturns]
    );

    const activeSales = useMemo(
        () => sales.filter(s => !returnedSaleIds.has(s.id)),
        [sales, returnedSaleIds]
    );

    const returnAmountBySaleId = useMemo(() => {
        return approvedReturns.reduce((acc, r) => {
            if (!r.sale_id) return acc;
            acc[r.sale_id] = (acc[r.sale_id] || 0) + Number(r.total_amount || ((r.unit_price || 0) * (r.qty || 0)));
            return acc;
        }, {});
    }, [approvedReturns]);

    const salesBills = useMemo(() => {
        const groups = {};

        sales.forEach(s => {
            const day = s.date ? new Date(s.date).toISOString().split('T')[0] : 'unknown-date';
            const key = [
                s.student_name || 'Unknown Student',
                s.student_phone || '',
                s.student_class || s.class || '',
                s.student_section || '',
                day,
                s.payment_method || ''
            ].join('|');

            if (!groups[key]) {
                groups[key] = {
                    key,
                    date: s.date,
                    student_name: s.student_name || 'Unknown Student',
                    student_class: s.student_class || s.class || 'N/A',
                    books: [],
                    qty: 0,
                    total_amount: 0,
                    paid_amount: Number(s.paid_amount || 0),
                    concession: Number(s.concession || 0),
                    payment_method: s.payment_method || 'N/A',
                    return_amount: 0,
                    sale_ids: []
                };
            }

            if (!returnedSaleIds.has(s.id)) {
                groups[key].books.push(s.book_name);
                groups[key].qty += Number(s.qty || 0);
            }
            groups[key].total_amount += Number(s.total_amount || 0);
            groups[key].return_amount += Number(returnAmountBySaleId[s.id] || 0);
            groups[key].sale_ids.push(s.id);
        });

        return Object.values(groups).map(bill => {
            const netTotal = Math.max(bill.total_amount - bill.return_amount - bill.concession, 0);
            return {
                ...bill,
                net_total: netTotal,
                balance: Math.max(netTotal - bill.paid_amount, 0),
                fully_returned: bill.sale_ids.length > 0 && bill.sale_ids.every(id => returnedSaleIds.has(id))
            };
        });
    }, [sales, returnAmountBySaleId, returnedSaleIds]);

    const reportSalesBills = useMemo(
        () => salesBills.filter(bill => !bill.fully_returned),
        [salesBills]
    );

    const totalRevenue = useMemo(() => reportSalesBills.reduce((a, s) => a + (s.net_total || 0), 0), [reportSalesBills]);
    const totalCost = useMemo(() => inventory.reduce((a, b) => a + ((b.cost_price || 0) * (b.total_qty - b.stock_available)), 0), [inventory]);
    const totalProfit = totalRevenue - totalCost;
    const totalReturnAmount = useMemo(() => approvedReturns.reduce((a, r) => a + Number(r.total_amount || ((r.unit_price || 0) * (r.qty || 0))), 0), [approvedReturns]);
    const returnRate = useMemo(() => sales.length === 0 ? 0 : ((approvedReturns.length / sales.length) * 100).toFixed(1), [sales, approvedReturns]);

    // Student-wise report (aggregated from sales)
    const studentWise = useMemo(() => {
        return Object.values(
            reportSalesBills.reduce((acc, s) => {
                const name = s.student_name || 'Unknown Student';
                if (!acc[name]) acc[name] = { student: name, class: s.student_class || 'N/A', books: 0, amount: 0 };
                acc[name].books += Number(s.qty || 0);
                acc[name].amount += (s.net_total || 0);
                return acc;
            }, {})
        );
    }, [reportSalesBills]);

    // Book-wise report
    const bookWise = useMemo(() => {
        return inventory.map(b => {
            const sold = (b.total_qty || 0) - (b.stock_available || 0);
            return {
                book: b.name, 
                type: b.book_type || 'Set', 
                costPrice: b.cost_price || 0, 
                sellingPrice: b.selling_price || 0,
                sold: sold, 
                stock: b.stock_available || 0,
                revenue: sold * (b.selling_price || 0),
                profit: sold * ((b.selling_price || 0) - (b.cost_price || 0)),
            };
        });
    }, [inventory]);

    // Monthly Chart Data (Mocking trend from real sales dates)
    const monthlySalesData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ month: m, sales: 0, revenue: 0 }));
        
        reportSalesBills.forEach(s => {
            if (!s.date) return;
            const mIdx = new Date(s.date).getMonth();
            data[mIdx].sales += 1;
            data[mIdx].revenue += (s.net_total || 0);
        });
        return data;
    }, [reportSalesBills]);

    // Vendor Chart Data
    const vendorWiseData = useMemo(() => {
        const vMap = {};
        reportSalesBills.forEach(s => {
            const vName = "Direct"; 
            if (!vMap[vName]) vMap[vName] = 0;
            vMap[vName] += (s.net_total || 0);
        });
        return Object.entries(vMap).map(([vendor, salesRevenue]) => ({ vendor, sales: salesRevenue }));
    }, [reportSalesBills]);

    const handleExport = (type) => {
        alert(`Exporting ${type} report... (Demo)`);
    };

    return (
        <div className="bs-page">
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">📊 Reports & Analytics</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="..">Dashboard</Link><span>/</span>
                        <Link to="..">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Reports</span>
                    </nav>
                </div>
                <div className="bs-export-wrap">
                    <button className="bs-export-btn" onClick={() => handleExport('PDF')}>📄 PDF</button>
                    <button className="bs-export-btn" onClick={() => handleExport('Excel')}>📊 Excel</button>
                </div>
            </div>

            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">🔍 Filters</h5>
                </div>
                <div className="bs-card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Date From</label>
                            <input type="date" className="bs-form-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Date To</label>
                            <input type="date" className="bs-form-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Vendor</label>
                            <select className="bs-form-select" value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                                <option>All</option>
                                {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Book</label>
                            <select className="bs-form-select" value={filterBook} onChange={e => setFilterBook(e.target.value)}>
                                <option>All</option>
                                {inventory.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group" style={{ alignSelf: 'flex-end' }}>
                            <button className="bs-btn bs-btn-primary" style={{ width: '100%' }}>Apply Filters</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Books Sold', value: activeSales.reduce((a, s) => a + Number(s.qty), 0), icon: '📚', color: '#3d5ee1', bg: '#eef1fd', sub: 'After approved returns' },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#28c76f', bg: '#e8faf1', sub: 'Gross' },
                    { label: 'Profit', value: `₹${totalProfit.toLocaleString()}`, icon: '📈', color: '#7367f0', bg: '#efedfd', sub: 'Revenue – Cost' },
                    { label: 'Return Amount', value: `₹${totalReturnAmount.toLocaleString()}`, icon: '🔁', color: '#ea5455', bg: '#fce8e8', sub: `${approvedReturns.length} approved returns` },
                ].map((card, i) => (
                    <div key={i} className="bs-kpi-card">
                        <div className="bs-kpi-icon" style={{ background: card.bg, color: card.color }}><span>{card.icon}</span></div>
                        <div className="bs-kpi-info">
                            <p className="bs-kpi-label">{card.label}</p>
                            <h3 className="bs-kpi-value">{card.value}</h3>
                            <span className="bs-kpi-sub">{card.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bs-row bs-row-2">
                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">📈 Monthly Sales Trend</h5>
                    </div>
                    <div className="bs-chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={monthlySalesData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f7" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="sales" name="Sales" stroke="#3d5ee1" strokeWidth={2.5} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#28c76f" strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">🏢 Vendor-wise Revenue</h5>
                    </div>
                    <div className="bs-chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={vendorWiseData} layout="vertical" margin={{ top: 5, right: 30, bottom: 0, left: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f7" />
                                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <YAxis type="category" dataKey="vendor" tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="sales" name="Revenue" fill="#7367f0" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">📋 Detailed Reports</h5>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[
                            { key: 'sales', label: '🧾 Sales-wise' },
                            { key: 'returns', label: '🔁 Return-wise' },
                            { key: 'student', label: '👤 Student-wise' },
                            { key: 'vendor', label: '🏢 Vendor-wise' },
                            { key: 'book', label: '📚 Book-wise' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`bs-btn bs-btn-sm ${activeTab === tab.key ? 'bs-btn-primary' : 'bs-btn-outline'}`}
                                onClick={() => setActiveTab(tab.key)}
                            >{tab.label}</button>
                        ))}
                    </div>
                </div>

                {activeTab === 'sales' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Books</th>
                                    <th>Total Bill</th>
                                    <th>Paid</th>
                                    <th>Concession</th>
                                    <th>Balance</th>
                                    <th>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportSalesBills.length === 0 ? (
                                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No sales transactions found.</td></tr>
                                ) : reportSalesBills.map((s, i) => (
                                    <tr key={s.key || i}>
                                        <td style={{ fontSize: 12 }}>{s.date ? new Date(s.date).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{ fontWeight: 600 }}>{s.student_name}</td>
                                        <td><span className="bs-badge bs-badge-blue">{s.student_class}</span></td>
                                        <td style={{ fontSize: 12, color: 'var(--bs-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.books.join(', ')}</td>
                                        <td style={{ fontWeight: 600 }}>Rs {(s.net_total || 0).toLocaleString()}</td>
                                        <td style={{ color: '#28c76f' }}>Rs {(s.paid_amount || 0).toLocaleString()}</td>
                                        <td style={{ color: '#ff9f43' }}>Rs {(s.concession || 0).toLocaleString()}</td>
                                        <td style={{ fontWeight: 700, color: ((s.balance || 0) > 0 ? '#ea5455' : '#28c76f') }}>
                                            Rs {(s.balance || 0).toLocaleString()}
                                        </td>
                                        <td><span className="bs-badge bs-badge-purple">{s.payment_method}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                            {reportSalesBills.length > 0 && (
                                <tfoot style={{ background: '#f8f9fb', fontWeight: 800 }}>
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'right', padding: '12px' }}>TOTALS:</td>
                                        <td>Rs {reportSalesBills.reduce((a, s) => a + (s.net_total || 0), 0).toLocaleString()}</td>
                                        <td style={{ color: '#28c76f' }}>Rs {reportSalesBills.reduce((a, s) => a + (s.paid_amount || 0), 0).toLocaleString()}</td>
                                        <td style={{ color: '#ff9f43' }}>Rs {reportSalesBills.reduce((a, s) => a + (s.concession || 0), 0).toLocaleString()}</td>
                                        <td style={{ color: '#ea5455' }}>Rs {reportSalesBills.reduce((a, s) => a + (s.balance || 0), 0).toLocaleString()}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}

                {activeTab === 'returns' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Book</th>
                                    <th>Qty</th>
                                    <th>Return Amount</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returns.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No return transactions found.</td></tr>
                                ) : returns.map((r, i) => (
                                    <tr key={r.id || i}>
                                        <td style={{ fontSize: 12 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                                        <td><span className="bs-badge bs-badge-blue">{r.student_class || 'N/A'}</span></td>
                                        <td style={{ fontSize: 12, color: 'var(--bs-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.book_name}</td>
                                        <td style={{ fontWeight: 700 }}>{r.qty}</td>
                                        <td style={{ fontWeight: 700, color: '#ea5455' }}>Rs {Number(r.total_amount || ((r.unit_price || 0) * (r.qty || 0))).toLocaleString()}</td>
                                        <td><span className="bs-badge bs-badge-orange">{r.reason || 'Return'}</span></td>
                                        <td><span className={`bs-badge ${r.status === 'Approved' ? 'bs-badge-green' : r.status === 'Rejected' ? 'bs-badge-red' : 'bs-badge-orange'}`}>{r.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'student' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Class</th>
                                    <th>Books Purchased</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentWise.map((s, i) => (
                                    <tr key={i}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{s.student}</td>
                                        <td><span className="bs-badge bs-badge-blue">{s.class}</span></td>
                                        <td style={{ fontWeight: 600 }}>{s.books}</td>
                                        <td style={{ fontWeight: 700, color: '#28c76f' }}>₹{s.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'vendor' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Vendor Name</th>
                                    <th>Type</th>
                                    <th>Books Supplied</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map((v, i) => (
                                    <tr key={v.id}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{v.name}</td>
                                        <td><span className="bs-badge bs-badge-purple">{v.type}</span></td>
                                        <td style={{ fontWeight: 600 }}>{v.booksSupplied}</td>
                                        <td style={{ fontWeight: 700, color: '#7367f0' }}>₹{Number(v.amount).toLocaleString()}</td>
                                        <td><span className={`bs-badge ${v.status === 'Active' ? 'bs-badge-green' : 'bs-badge-red'}`}>{v.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'book' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Book Name</th>
                                    <th>Type</th>
                                    <th>Cost Price</th>
                                    <th>Selling Price</th>
                                    <th>Sold</th>
                                    <th>Revenue</th>
                                    <th>Profit</th>
                                    <th>Stock Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookWise.map((b, i) => (
                                    <tr key={i}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{b.book}</td>
                                        <td><span className={`bs-badge ${b.type === 'Set' ? 'bs-badge-blue' : 'bs-badge-purple'}`}>{b.type}</span></td>
                                        <td>₹{b.costPrice}</td>
                                        <td>₹{b.sellingPrice}</td>
                                        <td style={{ fontWeight: 600 }}>{b.sold}</td>
                                        <td style={{ fontWeight: 700, color: '#28c76f' }}>₹{b.revenue.toLocaleString()}</td>
                                        <td style={{ fontWeight: 700, color: b.profit > 0 ? '#7367f0' : '#ea5455' }}>₹{b.profit.toLocaleString()}</td>
                                        <td style={{ fontWeight: 700, color: b.stock === 0 ? '#ea5455' : b.stock <= 20 ? '#ff9f43' : '#28c76f' }}>{b.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="bs-table-footer">
                    <span>
                        {activeTab === 'sales' && `${reportSalesBills.length} sales bills`}
                        {activeTab === 'returns' && `${returns.length} returns`}
                        {activeTab === 'student' && `${studentWise.length} students`}
                        {activeTab === 'vendor' && `${vendors.length} vendors`}
                        {activeTab === 'book' && `${bookWise.length} books`}
                    </span>
                    <div className="bs-export-wrap">
                        <button className="bs-export-btn" onClick={() => handleExport('PDF')}>📄 Export PDF</button>
                        <button className="bs-export-btn" onClick={() => handleExport('Excel')}>📊 Export Excel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSalesReports;

