import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IconChartBar, IconDownload, IconFilter, IconCalendar, IconPrinter,
    IconPackage, IconAlertTriangle, IconTrendingUp, IconTrendingDown,
    IconBox, IconRefresh, IconChevronRight, IconCircleCheck,
    IconAlertCircle, IconInfoCircle, IconLayoutGrid
} from '@tabler/icons-react';
import './Inventory.css';

const InventoryReports = () => {
    const title = 'Inventory Reports';
    const icon = '📊';

    const [reportType, setReportType] = useState('stock-summary');
    const [dateRange, setDateRange] = useState('this-month');
    const [category, setCategory] = useState('all');

    const stockSummaryData = useMemo(() => [
        { category: 'Stationery', emoji: '✏️', color: '#3b82f6', totalItems: 45, totalValue: 285000, lowStock: 8, outOfStock: 2, lastUpdated: '2024-02-15' },
        { category: 'Laboratory Equipment', emoji: '🔬', color: '#10b981', totalItems: 28, totalValue: 12500000, lowStock: 3, outOfStock: 1, lastUpdated: '2024-02-14' },
        { category: 'IT Equipment', emoji: '💻', color: '#8b5cf6', totalItems: 35, totalValue: 8900000, lowStock: 5, outOfStock: 0, lastUpdated: '2024-02-13' },
        { category: 'Sports Equipment', emoji: '⚽', color: '#f59e0b', totalItems: 22, totalValue: 3200000, lowStock: 4, outOfStock: 3, lastUpdated: '2024-02-12' },
        { category: 'Medical Supplies', emoji: '🏥', color: '#ef4444', totalItems: 18, totalValue: 6800000, lowStock: 2, outOfStock: 0, lastUpdated: '2024-02-11' },
        { category: 'Furniture', emoji: '🪑', color: '#6b7280', totalItems: 15, totalValue: 1950000, lowStock: 1, outOfStock: 0, lastUpdated: '2024-02-10' },
    ], []);

    const stockMovementData = useMemo(() => [
        { date: '2024-02-15', itemName: 'Whiteboard Markers', type: 'Stock In', quantity: 100, reference: 'PO-2024-015', party: 'Office Supplies Co.', value: 2500 },
        { date: '2024-02-14', itemName: 'Laboratory Microscopes', type: 'Issue', quantity: 2, reference: 'ISS-2024-008', party: 'Science Department', value: 7000 },
        { date: '2024-02-13', itemName: 'Computer Mouse', type: 'Stock In', quantity: 20, reference: 'PO-2024-014', party: 'Tech Solutions Inc.', value: 9000 },
        { date: '2024-02-12', itemName: 'Basketball', type: 'Issue', quantity: 5, reference: 'ISS-2024-007', party: 'Sports Department', value: 4250 },
        { date: '2024-02-11', itemName: 'Notebooks (A4)', type: 'Stock In', quantity: 200, reference: 'PO-2024-013', party: 'Paper World', value: 9000 },
        { date: '2024-02-10', itemName: 'First Aid Kit', type: 'Return', quantity: 1, reference: 'RTN-2024-002', party: 'Admin Office', value: 1200 },
    ], []);

    const lowStockAlerts = useMemo(() => [
        { itemName: 'Computer Mouse', currentStock: 8, minStockLevel: 15, category: 'IT Equipment', urgency: 'High', lastRestocked: '2024-01-10' },
        { itemName: 'Basketball', currentStock: 0, minStockLevel: 10, category: 'Sports Equipment', urgency: 'Critical', lastRestocked: '2023-12-15' },
        { itemName: 'Whiteboard Markers', currentStock: 45, minStockLevel: 50, category: 'Stationery', urgency: 'Medium', lastRestocked: '2024-02-15' },
        { itemName: 'Microscope Slides', currentStock: 12, minStockLevel: 30, category: 'Lab Equipment', urgency: 'High', lastRestocked: '2024-01-20' },
        { itemName: 'A4 Paper Reams', currentStock: 5, minStockLevel: 20, category: 'Stationery', urgency: 'Critical', lastRestocked: '2024-02-01' },
    ], []);

    const categories = ['all', 'Stationery', 'Laboratory Equipment', 'IT Equipment', 'Sports Equipment', 'Medical Supplies'];
    const reportTypes = [
        { value: 'stock-summary', label: '📦 Stock Summary' },
        { value: 'stock-movement', label: '🔄 Stock Movement' },
        { value: 'low-stock-alerts', label: '⚠️ Low Stock Alerts' },
        { value: 'valuation-report', label: '💰 Valuation Report' },
        { value: 'supplier-performance', label: '🏭 Supplier Performance' },
    ];
    const dateRanges = [
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'This Week' },
        { value: 'this-month', label: 'This Month' },
        { value: 'last-month', label: 'Last Month' },
        { value: 'this-quarter', label: 'This Quarter' },
        { value: 'this-year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' },
    ];

    const urgencyConfig = {
        'Critical': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
        'High': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
        'Medium': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
        'Low': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
    };

    const movementConfig = {
        'Stock In': { color: '#16a34a', bg: '#f0fdf4', icon: <IconTrendingUp size={12} /> },
        'Issue': { color: '#dc2626', bg: '#fef2f2', icon: <IconTrendingDown size={12} /> },
        'Return': { color: '#2563eb', bg: '#eff6ff', icon: <IconRefresh size={12} /> },
    };

    const totalItems = stockSummaryData.reduce((s, r) => s + r.totalItems, 0);
    const totalValue = stockSummaryData.reduce((s, r) => s + r.totalValue, 0);
    const totalLow = stockSummaryData.reduce((s, r) => s + r.lowStock, 0);
    const totalOut = stockSummaryData.reduce((s, r) => s + r.outOfStock, 0);

    /* ── KPI summary strip ─────────────────────────────────────── */
    const KpiStrip = () => (
        <div className="ir-kpi-strip">
            {[
                { icon: <IconBox size={22} />, label: 'Total Items', value: totalItems, color: '#3b82f6', bg: '#eff6ff' },
                { icon: <IconChartBar size={22} />, label: 'Total Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, color: '#8b5cf6', bg: '#f5f3ff' },
                { icon: <IconAlertTriangle size={22} />, label: 'Low Stock', value: totalLow, color: '#f59e0b', bg: '#fffbeb' },
                { icon: <IconAlertCircle size={22} />, label: 'Out of Stock', value: totalOut, color: '#ef4444', bg: '#fef2f2' },
            ].map((k, i) => (
                <div key={i} className="ir-kpi-card">
                    <div className="ir-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
                    <div>
                        <div className="ir-kpi-value" style={{ color: k.color }}>{k.value}</div>
                        <div className="ir-kpi-label">{k.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    /* ── Stock Summary view ────────────────────────────────────── */
    const renderStockSummary = () => (
        <div className="ir-section">
            <div className="ir-section-header">
                <h5 className="ir-section-title"><IconLayoutGrid size={18} /> Category Overview</h5>
                <span className="ir-section-badge">{stockSummaryData.length} Categories</span>
            </div>
            <div className="ir-summary-grid">
                {stockSummaryData.map((item, i) => {
                    const healthPct = Math.max(0, Math.min(100, 100 - ((item.lowStock + item.outOfStock * 2) / item.totalItems) * 100));
                    return (
                        <div key={i} className="ir-summary-card" style={{ '--accent': item.color }}>
                            <div className="ir-summary-card-top">
                                <div className="ir-summary-emoji" style={{ background: `${item.color}18` }}>{item.emoji}</div>
                                <div className="ir-summary-info">
                                    <h6 className="ir-summary-name">{item.category}</h6>
                                    <small className="ir-summary-date">Updated {item.lastUpdated}</small>
                                </div>
                                <div className="ir-summary-total-val">₹{(item.totalValue / 100000).toFixed(1)}L</div>
                            </div>
                            <div className="ir-summary-metrics">
                                <div className="ir-metric-box">
                                    <span className="ir-metric-n">{item.totalItems}</span>
                                    <span className="ir-metric-l">Total Items</span>
                                </div>
                                <div className="ir-metric-box warn">
                                    <span className="ir-metric-n">{item.lowStock}</span>
                                    <span className="ir-metric-l">Low Stock</span>
                                </div>
                                <div className="ir-metric-box danger">
                                    <span className="ir-metric-n">{item.outOfStock}</span>
                                    <span className="ir-metric-l">Out of Stock</span>
                                </div>
                            </div>
                            <div className="ir-health-bar-wrap">
                                <div className="ir-health-bar-track">
                                    <div
                                        className="ir-health-bar-fill"
                                        style={{ width: `${healthPct}%`, background: item.color }}
                                    />
                                </div>
                                <span className="ir-health-pct">{healthPct.toFixed(0)}% healthy</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    /* ── Stock Movement view ───────────────────────────────────── */
    const renderStockMovement = () => (
        <div className="ir-section">
            <div className="ir-section-header">
                <h5 className="ir-section-title"><IconRefresh size={18} /> Movement Log</h5>
                <span className="ir-section-badge">{stockMovementData.length} Transactions</span>
            </div>
            <div className="ir-table-wrap">
                <table className="ir-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>Reference</th>
                            <th>Supplier / Issued To</th>
                            <th style={{ textAlign: 'right' }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockMovementData.map((item, i) => {
                            const mc = movementConfig[item.type] || movementConfig['Stock In'];
                            return (
                                <tr key={i}>
                                    <td className="ir-td-date">{item.date}</td>
                                    <td className="ir-td-name">{item.itemName}</td>
                                    <td>
                                        <span className="ir-movement-badge"
                                            style={{ color: mc.color, background: mc.bg }}>
                                            {mc.icon} {item.type}
                                        </span>
                                    </td>
                                    <td className="ir-td-qty">{item.quantity}</td>
                                    <td className="ir-td-ref">{item.reference}</td>
                                    <td>{item.party}</td>
                                    <td className="ir-td-val">₹{item.value.toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    /* ── Low Stock Alerts view ─────────────────────────────────── */
    const renderLowStockAlerts = () => (
        <div className="ir-section">
            <div className="ir-section-header">
                <h5 className="ir-section-title"><IconAlertTriangle size={18} /> Low Stock Alerts</h5>
                <span className="ir-section-badge ir-section-badge-red">{lowStockAlerts.length} Alerts</span>
            </div>
            <div className="ir-alerts-list">
                {lowStockAlerts.map((alert, i) => {
                    const uc = urgencyConfig[alert.urgency] || urgencyConfig['Low'];
                    const pct = Math.min(100, (alert.currentStock / alert.minStockLevel) * 100);
                    return (
                        <div key={i} className="ir-alert-row" style={{ borderLeftColor: uc.dot }}>
                            <div className="ir-alert-dot" style={{ background: uc.dot }} />
                            <div className="ir-alert-content">
                                <div className="ir-alert-top">
                                    <span className="ir-alert-name">{alert.itemName}</span>
                                    <span className="ir-urgency-badge" style={{ color: uc.color, background: uc.bg, border: `1px solid ${uc.border}` }}>
                                        {alert.urgency}
                                    </span>
                                </div>
                                <div className="ir-alert-meta">
                                    <span>{alert.category}</span>
                                    <span>·</span>
                                    <span>Last restocked: {alert.lastRestocked}</span>
                                    <span>·</span>
                                    <span style={{ color: uc.color, fontWeight: 600 }}>
                                        {alert.currentStock} / {alert.minStockLevel} units
                                    </span>
                                </div>
                                <div className="ir-alert-bar-track">
                                    <div className="ir-alert-bar-fill" style={{ width: `${pct}%`, background: uc.dot }} />
                                </div>
                            </div>
                            <button className="inv-btn inv-btn-primary ir-order-btn">
                                Order Now <IconChevronRight size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderReportContent = () => {
        switch (reportType) {
            case 'stock-summary': return renderStockSummary();
            case 'stock-movement': return renderStockMovement();
            case 'low-stock-alerts': return renderLowStockAlerts();
            default:
                return (
                    <div className="ir-placeholder">
                        <IconInfoCircle size={48} color="#d1d5db" />
                        <h6>Coming Soon</h6>
                        <p>This report is under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="inv-page">
            {/* ── Header ─────────────────────────────────────── */}
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
                    <button className="inv-btn inv-btn-primary" onClick={() => alert('Exporting...')}>
                        <IconDownload size={16} /> Export
                    </button>
                </div>
            </div>

            {/* ── KPI Strip ──────────────────────────────────── */}
            <KpiStrip />

            {/* ── Filter Controls ────────────────────────────── */}
            <div className="inv-filter-card">
                <div className="ir-filter-label">
                    <IconFilter size={15} /> Filter Report
                </div>
                <div className="ir-filter-row">
                    <div className="inv-filter-group">
                        <label>Report Type</label>
                        <select
                            value={reportType}
                            onChange={e => setReportType(e.target.value)}
                            className="inv-select"
                        >
                            {reportTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-filter-group">
                        <label>Date Range</label>
                        <select
                            value={dateRange}
                            onChange={e => setDateRange(e.target.value)}
                            className="inv-select"
                        >
                            {dateRanges.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-filter-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="inv-select"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>
                                    {c === 'all' ? 'All Categories' : c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Report Content ──────────────────────────────── */}
            {renderReportContent()}
        </div>
    );
};

export default InventoryReports;
