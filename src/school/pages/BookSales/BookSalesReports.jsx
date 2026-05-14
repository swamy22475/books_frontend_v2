import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../../api/sales';
import { inventoryService } from '../../../api/inventory';
import { returnsService } from '../../../api/returns';
import { vendorService } from '../../../api/vendors';
import { allocateReturnAdjustments, getNetSaleAmount, getNetSaleQty, lineAmount, toNumber } from './salesMetrics';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import './BookSales.css';

const today = new Date().toISOString().split('T')[0];
const initialFilters = {
    dateFrom: '2026-01-01',
    dateTo: today,
    vendor: 'All',
    className: 'All',
    section: 'All',
    book: 'All',
};

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
    const [filters, setFilters] = useState(initialFilters);
    const [draftFilters, setDraftFilters] = useState(initialFilters);

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
    const filteredSales = useMemo(() => sales.filter(s => {
        const saleDate = s.date ? new Date(s.date).toISOString().split('T')[0] : '';
        const saleClass = s.student_class || s.class || 'N/A';
        const saleSection = s.student_section || 'N/A';
        const book = inventory.find(b => b.id === s.book_id || b.name === s.book_name);
        const saleVendor = book?.vendor_name || book?.vendor || '';
        return (!filters.dateFrom || saleDate >= filters.dateFrom)
            && (!filters.dateTo || saleDate <= filters.dateTo)
            && (filters.book === 'All' || s.book_name === filters.book)
            && (filters.className === 'All' || saleClass === filters.className)
            && (filters.section === 'All' || saleSection === filters.section)
            && (filters.vendor === 'All' || saleVendor === filters.vendor);
    }), [sales, inventory, filters]);

    const filteredReturns = useMemo(() => returns.filter(r => {
        const returnDate = r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '';
        const returnClass = r.student_class || r.class || 'N/A';
        const sale = sales.find(s => Number(s.id) === Number(r.sale_id));
        const returnSection = sale?.student_section || r.student_section || 'N/A';
        const book = inventory.find(b => b.id === r.book_id || b.name === r.book_name);
        const returnVendor = book?.vendor_name || book?.vendor || '';
        return (!filters.dateFrom || returnDate >= filters.dateFrom)
            && (!filters.dateTo || returnDate <= filters.dateTo)
            && (filters.book === 'All' || r.book_name === filters.book)
            && (filters.className === 'All' || returnClass === filters.className)
            && (filters.section === 'All' || returnSection === filters.section)
            && (filters.vendor === 'All' || returnVendor === filters.vendor);
    }), [returns, sales, inventory, filters]);

    const approvedReturns = useMemo(
        () => filteredReturns.filter(r => r.status === 'Approved'),
        [filteredReturns]
    );

    const returnAdjustments = useMemo(
        () => allocateReturnAdjustments(filteredSales, approvedReturns),
        [filteredSales, approvedReturns]
    );
    const netQtyForSale = (sale) => getNetSaleQty(sale, returnAdjustments);
    const netAmountForSale = (sale) => getNetSaleAmount(sale, returnAdjustments);

    const activeSales = useMemo(
        () => filteredSales.filter(s => netQtyForSale(s) > 0),
        [filteredSales, returnAdjustments]
    );

    const salesBills = useMemo(() => {
        const groups = {};

        filteredSales.forEach(s => {
            const day = s.date ? new Date(s.date).toISOString().split('T')[0] : 'unknown-date';
            const key = [
                s.student_name || 'Unknown Student',
                s.student_phone || '',
                s.student_class || s.class || '',
                s.student_section || '',
                day,
                s.payment_method || ''
            ].join('|');

            const netQty = netQtyForSale(s);
            const netAmount = netAmountForSale(s);

            if (!groups[key]) {
                groups[key] = {
                    key,
                    date: s.date,
                    student_name: s.student_name || 'Unknown Student',
                    student_class: s.student_class || s.class || 'N/A',
                    student_section: s.student_section || 'N/A',
                    books: [],
                    qty: 0,
                    total_amount: 0,
                    paid_amount: Number(s.paid_amount || 0),
                    concession: Number(s.concession || 0),
                    payment_method: s.payment_method || 'N/A',
                    return_amount: 0,
                    original_paid_amount: Number(s.paid_amount || 0),
                    sale_ids: []
                };
            }

            if (netQty > 0) {
                groups[key].books.push(`${s.book_name} x ${netQty}`);
                groups[key].qty += netQty;
            }
            groups[key].total_amount += netAmount;
            groups[key].return_amount += toNumber(returnAdjustments[s.id]?.amount);
            groups[key].sale_ids.push(s.id);
        });

        return Object.values(groups).map(bill => {
            const netTotal = Math.max(bill.total_amount - bill.concession, 0);
            const netPaid = Math.min(bill.original_paid_amount, netTotal);
            return {
                ...bill,
                net_total: netTotal,
                paid_amount: netPaid,
                refund_due: Math.max(bill.original_paid_amount - netTotal, 0),
                balance: Math.max(netTotal - netPaid, 0),
                fully_returned: bill.qty <= 0
            };
        });
    }, [filteredSales, returnAdjustments]);

    const reportSalesBills = useMemo(
        () => salesBills.filter(bill => !bill.fully_returned),
        [salesBills]
    );

    const totalRevenue = useMemo(() => reportSalesBills.reduce((a, s) => a + (s.net_total || 0), 0), [reportSalesBills]);
    const totalPaid = useMemo(() => reportSalesBills.reduce((a, s) => a + (s.paid_amount || 0), 0), [reportSalesBills]);
    const totalDue = useMemo(() => reportSalesBills.reduce((a, s) => a + (s.balance || 0), 0), [reportSalesBills]);
    const totalCost = useMemo(() => filteredSales.reduce((total, sale) => {
        const book = inventory.find(b => b.id === sale.book_id || b.name === sale.book_name);
        return total + (netQtyForSale(sale) * toNumber(book?.cost_price));
    }, 0), [filteredSales, inventory, returnAdjustments]);
    const totalProfit = totalRevenue - totalCost;
    const totalReturnAmount = useMemo(() => approvedReturns.reduce((a, r) => a + lineAmount(r), 0), [approvedReturns]);
    const totalSoldQty = useMemo(() => activeSales.reduce((a, s) => a + netQtyForSale(s), 0), [activeSales, returnAdjustments]);
    const returnRate = useMemo(() => {
        const soldQty = filteredSales.reduce((a, s) => a + toNumber(s.qty), 0);
        const returnedQty = approvedReturns.reduce((a, r) => a + toNumber(r.qty), 0);
        return soldQty === 0 ? 0 : ((returnedQty / soldQty) * 100).toFixed(1);
    }, [filteredSales, approvedReturns]);

    const classOptions = useMemo(() => {
        const names = new Set();
        sales.forEach(s => {
            const className = s.student_class || s.class;
            if (className) names.add(className);
        });
        returns.forEach(r => {
            const className = r.student_class || r.class;
            if (className) names.add(className);
        });
        return Array.from(names).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
    }, [sales, returns]);

    const sectionOptions = useMemo(() => {
        const names = new Set();
        sales.forEach(s => {
            const className = s.student_class || s.class || 'N/A';
            const section = s.student_section || 'N/A';
            if (draftFilters.className === 'All' || className === draftFilters.className) {
                names.add(section);
            }
        });
        return Array.from(names).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
    }, [sales, draftFilters.className]);

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

    const emptyClassGroup = (className, sectionName = 'N/A') => ({
        className,
        sectionName,
        bills: 0,
        students: new Set(),
        books: 0,
        revenue: 0,
        paid: 0,
        due: 0,
        concession: 0,
        returnQty: 0,
        returnAmount: 0,
        cost: 0,
    });

    const classWise = useMemo(() => {
        const groups = {};

        reportSalesBills.forEach(bill => {
            const className = bill.student_class || 'N/A';
            const sectionName = bill.student_section || 'N/A';
            const key = `${className}|${sectionName}`;
            if (!groups[key]) groups[key] = emptyClassGroup(className, sectionName);
            groups[key].bills += 1;
            groups[key].students.add(bill.student_name);
            groups[key].books += toNumber(bill.qty);
            groups[key].revenue += toNumber(bill.net_total);
            groups[key].paid += toNumber(bill.paid_amount);
            groups[key].due += toNumber(bill.balance);
            groups[key].concession += toNumber(bill.concession);
        });

        approvedReturns.forEach(entry => {
            const className = entry.student_class || entry.class || 'N/A';
            const sale = sales.find(s => Number(s.id) === Number(entry.sale_id));
            const sectionName = sale?.student_section || entry.student_section || 'N/A';
            const key = `${className}|${sectionName}`;
            if (!groups[key]) groups[key] = emptyClassGroup(className, sectionName);
            groups[key].returnQty += toNumber(entry.qty);
            groups[key].returnAmount += lineAmount(entry);
        });

        filteredSales.forEach(sale => {
            const className = sale.student_class || sale.class || 'N/A';
            const sectionName = sale.student_section || 'N/A';
            const key = `${className}|${sectionName}`;
            if (!groups[key]) return;
            const book = inventory.find(b => b.id === sale.book_id || b.name === sale.book_name);
            groups[key].cost += netQtyForSale(sale) * toNumber(book?.cost_price);
        });

        return Object.values(groups)
            .map(group => ({
                ...group,
                students: group.students.size,
                profit: group.revenue - group.cost,
            }))
            .sort((a, b) => `${a.className}-${a.sectionName}`.localeCompare(`${b.className}-${b.sectionName}`, undefined, { numeric: true }));
    }, [reportSalesBills, approvedReturns, filteredSales, inventory, returnAdjustments, sales]);

    // Book-wise report
    const bookWise = useMemo(() => {
        return inventory.map(b => {
            const matchingSales = filteredSales.filter(s => s.book_id === b.id || s.book_name === b.name);
            const sold = matchingSales.reduce((sum, s) => sum + netQtyForSale(s), 0);
            const revenue = matchingSales.reduce((sum, s) => sum + netAmountForSale(s), 0);
            return {
                book: b.name, 
                type: b.book_type || 'Set', 
                costPrice: b.cost_price || 0, 
                sellingPrice: b.selling_price || 0,
                sold: sold, 
                stock: b.stock_available || 0,
                revenue,
                profit: revenue - (sold * (b.cost_price || 0)),
            };
        });
    }, [inventory, filteredSales, returnAdjustments]);

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
        filteredSales.forEach(s => {
            const book = inventory.find(b => b.id === s.book_id || b.name === s.book_name);
            const vName = book?.vendor_name || book?.vendor || 'Direct';
            if (!vMap[vName]) vMap[vName] = 0;
            vMap[vName] += netAmountForSale(s);
        });
        return Object.entries(vMap).map(([vendor, salesRevenue]) => ({ vendor, sales: salesRevenue }));
    }, [filteredSales, inventory, returnAdjustments]);

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
                            <input type="date" className="bs-form-input" value={draftFilters.dateFrom} onChange={e => setDraftFilters(prev => ({ ...prev, dateFrom: e.target.value }))} />
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Date To</label>
                            <input type="date" className="bs-form-input" value={draftFilters.dateTo} onChange={e => setDraftFilters(prev => ({ ...prev, dateTo: e.target.value }))} />
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Vendor</label>
                            <select className="bs-form-select" value={draftFilters.vendor} onChange={e => setDraftFilters(prev => ({ ...prev, vendor: e.target.value }))}>
                                <option>All</option>
                                {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Class</label>
                            <select className="bs-form-select" value={draftFilters.className} onChange={e => setDraftFilters(prev => ({ ...prev, className: e.target.value, section: 'All' }))}>
                                <option>All</option>
                                {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Section</label>
                            <select className="bs-form-select" value={draftFilters.section} onChange={e => setDraftFilters(prev => ({ ...prev, section: e.target.value }))}>
                                <option>All</option>
                                {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Book</label>
                            <select className="bs-form-select" value={draftFilters.book} onChange={e => setDraftFilters(prev => ({ ...prev, book: e.target.value }))}>
                                <option>All</option>
                                {inventory.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group" style={{ alignSelf: 'flex-end' }}>
                            <button className="bs-btn bs-btn-primary" style={{ width: '100%' }} onClick={() => setFilters(draftFilters)}>Apply Filters</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
                {[
                    { label: 'Total Books Sold', value: totalSoldQty, icon: '📚', color: '#3d5ee1', bg: '#eef1fd', sub: 'After approved returns' },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#28c76f', bg: '#e8faf1', sub: 'After returns and concession' },
                    { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, icon: '✓', color: '#00cfe8', bg: '#e6fafe', sub: 'Collected' },
                    { label: 'Total Due', value: `₹${totalDue.toLocaleString()}`, icon: '₹', color: '#ff9f43', bg: '#fff5e6', sub: 'Outstanding' },
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
                            { key: 'class', label: 'Class-wise' },
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
                                    <th>Return</th>
                                    <th>Paid</th>
                                    <th>Concession</th>
                                    <th>Balance</th>
                                    <th>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportSalesBills.length === 0 ? (
                                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No sales transactions found.</td></tr>
                                ) : reportSalesBills.map((s, i) => (
                                    <tr key={s.key || i}>
                                        <td style={{ fontSize: 12 }}>{s.date ? new Date(s.date).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{ fontWeight: 600 }}>{s.student_name}</td>
                                        <td><span className="bs-badge bs-badge-blue">{s.student_class}</span></td>
                                        <td style={{ fontSize: 12, color: 'var(--bs-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.books.join(', ')}</td>
                                        <td style={{ fontWeight: 600 }}>Rs {(s.net_total || 0).toLocaleString()}</td>
                                        <td style={{ color: '#ea5455', fontWeight: 600 }}>Rs {(s.return_amount || 0).toLocaleString()}</td>
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
                                        <td style={{ color: '#ea5455' }}>Rs {reportSalesBills.reduce((a, s) => a + (s.return_amount || 0), 0).toLocaleString()}</td>
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
                                {filteredReturns.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No return transactions found.</td></tr>
                                ) : filteredReturns.map((r, i) => (
                                    <tr key={r.id || i}>
                                        <td style={{ fontSize: 12 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                                        <td><span className="bs-badge bs-badge-blue">{r.student_class || 'N/A'}</span></td>
                                        <td style={{ fontSize: 12, color: 'var(--bs-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.book_name}</td>
                                        <td style={{ fontWeight: 700 }}>{r.qty}</td>
                                        <td style={{ fontWeight: 700, color: '#ea5455' }}>Rs {lineAmount(r).toLocaleString()}</td>
                                        <td><span className="bs-badge bs-badge-orange">{r.reason || 'Return'}</span></td>
                                        <td><span className={`bs-badge ${r.status === 'Approved' ? 'bs-badge-green' : r.status === 'Rejected' ? 'bs-badge-red' : 'bs-badge-orange'}`}>{r.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'class' && (
                    <div className="bs-table-wrap">
                        <table className="bs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Bills</th>
                                    <th>Students</th>
                                    <th>Books Sold</th>
                                    <th>Revenue</th>
                                    <th>Paid</th>
                                    <th>Due</th>
                                    <th>Returns</th>
                                    <th>Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classWise.length === 0 ? (
                                    <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: 'var(--bs-muted)' }}>No class-wise data found.</td></tr>
                                ) : classWise.map((row, i) => (
                                    <tr key={`${row.className}-${row.sectionName}`}>
                                        <td style={{ color: 'var(--bs-muted)' }}>{i + 1}</td>
                                        <td><span className="bs-badge bs-badge-blue">{row.className}</span></td>
                                        <td><span className="bs-badge bs-badge-purple">{row.sectionName}</span></td>
                                        <td style={{ fontWeight: 600 }}>{row.bills}</td>
                                        <td style={{ fontWeight: 600 }}>{row.students}</td>
                                        <td style={{ fontWeight: 700 }}>{row.books}</td>
                                        <td style={{ fontWeight: 700, color: '#28c76f' }}>Rs {row.revenue.toLocaleString()}</td>
                                        <td style={{ color: '#28c76f' }}>Rs {row.paid.toLocaleString()}</td>
                                        <td style={{ color: row.due > 0 ? '#ea5455' : '#28c76f', fontWeight: 700 }}>Rs {row.due.toLocaleString()}</td>
                                        <td style={{ color: '#ea5455' }}>{row.returnQty} / Rs {row.returnAmount.toLocaleString()}</td>
                                        <td style={{ fontWeight: 700, color: row.profit >= 0 ? '#7367f0' : '#ea5455' }}>Rs {row.profit.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {classWise.length > 0 && (
                                <tfoot style={{ background: '#f8f9fb', fontWeight: 800 }}>
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'right', padding: '12px' }}>TOTALS:</td>
                                        <td>{classWise.reduce((a, row) => a + row.books, 0).toLocaleString()}</td>
                                        <td style={{ color: '#28c76f' }}>Rs {classWise.reduce((a, row) => a + row.revenue, 0).toLocaleString()}</td>
                                        <td style={{ color: '#28c76f' }}>Rs {classWise.reduce((a, row) => a + row.paid, 0).toLocaleString()}</td>
                                        <td style={{ color: '#ea5455' }}>Rs {classWise.reduce((a, row) => a + row.due, 0).toLocaleString()}</td>
                                        <td style={{ color: '#ea5455' }}>{classWise.reduce((a, row) => a + row.returnQty, 0).toLocaleString()} / Rs {classWise.reduce((a, row) => a + row.returnAmount, 0).toLocaleString()}</td>
                                        <td style={{ color: '#7367f0' }}>Rs {classWise.reduce((a, row) => a + row.profit, 0).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            )}
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
                        {activeTab === 'returns' && `${filteredReturns.length} returns`}
                        {activeTab === 'class' && `${classWise.length} classes`}
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

