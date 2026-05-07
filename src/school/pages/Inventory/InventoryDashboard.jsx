import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IconPackage, IconPlus, IconEdit, IconTrash, IconSearch,
    IconFilter, IconTrendingUp, IconAlertTriangle, IconCheck,
    IconDownload, IconRefresh, IconEye, IconBox, IconCurrencyRupee,
    IconAlertCircle, IconChartBar
} from '@tabler/icons-react';
import './Inventory.css';

const InventoryDashboard = () => {
    const [inventoryItems, setInventoryItems] = useState([
        {
            id: 1, name: 'Whiteboard Markers', category: 'Stationery',
            subcategory: 'Writing Supplies', sku: 'INV-WBM-001',
            currentStock: 150, minStockLevel: 50, maxStockLevel: 500,
            unit: 'pieces', unitPrice: 25.50, supplier: 'Office Supplies Co.',
            location: 'Store Room A', lastRestocked: '2024-02-15', status: 'In Stock'
        },
        {
            id: 2, name: 'Laboratory Microscopes', category: 'Laboratory Equipment',
            subcategory: 'Optical Instruments', sku: 'INV-LMO-002',
            currentStock: 12, minStockLevel: 5, maxStockLevel: 30,
            unit: 'units', unitPrice: 3500.00, supplier: 'Science Equipment Ltd.',
            location: 'Lab Room 101', lastRestocked: '2024-01-20', status: 'In Stock'
        },
        {
            id: 3, name: 'Computer Mouse', category: 'IT Equipment',
            subcategory: 'Computer Accessories', sku: 'INV-CMO-003',
            currentStock: 8, minStockLevel: 15, maxStockLevel: 50,
            unit: 'pieces', unitPrice: 450.00, supplier: 'Tech Solutions Inc.',
            location: 'IT Department', lastRestocked: '2024-01-10', status: 'Low Stock'
        },
        {
            id: 4, name: 'Basketball', category: 'Sports Equipment',
            subcategory: 'Balls', sku: 'INV-BBA-004',
            currentStock: 0, minStockLevel: 10, maxStockLevel: 30,
            unit: 'pieces', unitPrice: 850.00, supplier: 'Sports Gear Co.',
            location: 'Sports Room', lastRestocked: '2023-12-15', status: 'Out of Stock'
        },
        {
            id: 5, name: 'Notebooks (A4)', category: 'Stationery',
            subcategory: 'Paper Products', sku: 'INV-NBA-005',
            currentStock: 500, minStockLevel: 200, maxStockLevel: 1000,
            unit: 'pieces', unitPrice: 45.00, supplier: 'Paper World',
            location: 'Store Room B', lastRestocked: '2024-02-10', status: 'In Stock'
        },
        {
            id: 6, name: 'Chemistry Lab Coats', category: 'Laboratory Equipment',
            subcategory: 'Safety Equipment', sku: 'INV-CLC-006',
            currentStock: 25, minStockLevel: 20, maxStockLevel: 60,
            unit: 'pieces', unitPrice: 320.00, supplier: 'Safety First Inc.',
            location: 'Lab Room 201', lastRestocked: '2024-02-01', status: 'In Stock'
        },
        {
            id: 7, name: 'Projector', category: 'IT Equipment',
            subcategory: 'Presentation Equipment', sku: 'INV-PRJ-007',
            currentStock: 5, minStockLevel: 3, maxStockLevel: 15,
            unit: 'units', unitPrice: 25000.00, supplier: 'Tech Solutions Inc.',
            location: 'AV Room', lastRestocked: '2024-01-25', status: 'In Stock'
        },
        {
            id: 8, name: 'First Aid Kit', category: 'Medical Supplies',
            subcategory: 'Emergency Equipment', sku: 'INV-FAK-008',
            currentStock: 3, minStockLevel: 10, maxStockLevel: 30,
            unit: 'kits', unitPrice: 850.00, supplier: 'Medical Supplies Co.',
            location: 'Nurse Office', lastRestocked: '2024-02-05', status: 'Low Stock'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const categories = useMemo(() => {
        const cats = [...new Set(inventoryItems.map(item => item.category))];
        return ['All', ...cats];
    }, [inventoryItems]);

    const filteredItems = useMemo(() => {
        return inventoryItems.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [inventoryItems, searchTerm, filterCategory, filterStatus]);

    const stats = useMemo(() => {
        const totalItems = inventoryItems.length;
        const totalValue = inventoryItems.reduce((s, i) => s + i.currentStock * i.unitPrice, 0);
        const lowStockItems = inventoryItems.filter(i => i.status === 'Low Stock').length;
        const outOfStockItems = inventoryItems.filter(i => i.status === 'Out of Stock').length;
        const inStockItems = inventoryItems.filter(i => i.status === 'In Stock').length;
        return { totalItems, totalValue, lowStockItems, outOfStockItems, inStockItems };
    }, [inventoryItems]);

    const getStockPercent = (item) => {
        if (item.maxStockLevel === 0) return 0;
        return Math.min(100, Math.round((item.currentStock / item.maxStockLevel) * 100));
    };

    const getStockColor = (status) => {
        if (status === 'In Stock') return '#28c76f';
        if (status === 'Low Stock') return '#ff9f43';
        return '#ea5455';
    };

    const getStatusBadge = (status) => {
        if (status === 'In Stock')
            return <span className="inv-status-badge inv-badge-green">✔ In Stock</span>;
        if (status === 'Low Stock')
            return <span className="inv-status-badge inv-badge-orange">⚠ Low Stock</span>;
        return <span className="inv-status-badge inv-badge-red">✕ Out of Stock</span>;
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this inventory item?')) {
            setInventoryItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const kpiCards = [
        {
            label: 'Total Items',
            value: stats.totalItems,
            icon: <IconBox size={24} />,
            bg: '#eef1fd',
            color: '#3d5ee1',
            sub: `${stats.inStockItems} in stock`
        },
        {
            label: 'Total Inventory Value',
            value: `₹${(stats.totalValue / 1000).toFixed(1)}K`,
            icon: <IconCurrencyRupee size={24} />,
            bg: '#e8faf1',
            color: '#28c76f',
            sub: 'Current stock value'
        },
        {
            label: 'Low Stock Alerts',
            value: stats.lowStockItems,
            icon: <IconAlertTriangle size={24} />,
            bg: '#fff5e6',
            color: '#ff9f43',
            sub: 'Need reordering soon'
        },
        {
            label: 'Out of Stock',
            value: stats.outOfStockItems,
            icon: <IconAlertCircle size={24} />,
            bg: '#fce8e8',
            color: '#ea5455',
            sub: 'Immediate action needed'
        },
    ];

    return (
        <div className="inv-page">
            {/* ── Header ── */}
            <div className="inv-page-header">
                <div>
                    <h4 className="inv-page-title">📦 Inventory Management</h4>
                    <nav className="inv-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        {' / '}
                        <span className="inv-breadcrumb-current">Inventory</span>
                    </nav>
                </div>
                <div className="inv-header-actions">
                    <Link to="/school/inventory/item-list" className="inv-btn inv-btn-outline">
                        <IconChartBar size={16} /> Item List
                    </Link>
                    <Link to="/school/inventory/add-stock" className="inv-btn inv-btn-success">
                        <IconPlus size={16} /> Add Stock
                    </Link>
                    <Link to="/school/inventory/issue-item" className="inv-btn inv-btn-primary">
                        <IconPackage size={16} /> Issue Item
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="inv-stats-grid">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="inv-stat-card">
                        <div className="inv-stat-icon" style={{ background: kpi.bg, color: kpi.color }}>
                            {kpi.icon}
                        </div>
                        <div className="inv-stat-content">
                            <p className="inv-stat-label">{kpi.label}</p>
                            <h3 className="inv-stat-value">{kpi.value}</h3>
                            <span className="inv-stat-sub">{kpi.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Card ── */}
            <div className="inv-filter-card">
                <div className="inv-filter-header">
                    <h6 className="inv-filter-title">
                        <IconFilter size={16} /> Filters &amp; Search
                    </h6>
                    <button
                        className="inv-btn-outline"
                        onClick={() => { setSearchTerm(''); setFilterCategory('All'); setFilterStatus('All'); }}
                    >
                        <IconRefresh size={14} /> Reset
                    </button>
                </div>
                <div className="inv-filter-grid">
                    <div className="inv-filter-group">
                        <label>Search</label>
                        <div className="inv-search-wrapper">
                            <IconSearch size={15} className="inv-search-icon" />
                            <input
                                type="text"
                                placeholder="Name, SKU, supplier..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="inv-search-input"
                            />
                        </div>
                    </div>
                    <div className="inv-filter-group">
                        <label>Category</label>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="inv-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-filter-group">
                        <label>Stock Status</label>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="inv-select"
                        >
                            <option value="All">All Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Inventory Table ── */}
            <div className="inv-table-card">
                <div className="inv-table-header">
                    <h5 className="inv-table-title">
                        Inventory Items
                        <span style={{ marginLeft: 8, fontSize: 13, color: '#9b9b9b', fontWeight: 400 }}>
                            ({filteredItems.length} results)
                        </span>
                    </h5>
                    <div className="inv-table-actions">
                        <button className="inv-btn-outline">
                            <IconDownload size={14} /> Export
                        </button>
                        <button
                            className="inv-btn inv-btn-primary"
                            style={{ padding: '7px 14px', fontSize: 13 }}
                            onClick={() => { setEditingItem(null); setShowModal(true); }}
                        >
                            <IconPlus size={15} /> Add Item
                        </button>
                    </div>
                </div>

                <div className="inv-table-container">
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                                <th>Location</th>
                                <th>Supplier</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="10">
                                        <div className="inv-empty-state">
                                            <IconPackage size={48} color="#d1d5db" />
                                            <h6>No items found</h6>
                                            <p>Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => {
                                    const totalVal = item.currentStock * item.unitPrice;
                                    const pct = getStockPercent(item);
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <span className="inv-sku">{item.sku}</span>
                                            </td>
                                            <td>
                                                <div className="inv-item-details">
                                                    <span className="inv-item-name">{item.name}</span>
                                                    <span className="inv-subcategory">{item.subcategory}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: '#555', fontSize: 13 }}>{item.category}</td>
                                            <td>
                                                <div className="inv-stock-quantity">
                                                    {item.currentStock}
                                                    <span style={{ fontWeight: 400, color: '#9b9b9b', fontSize: 12, marginLeft: 4 }}>
                                                        {item.unit}
                                                    </span>
                                                </div>
                                                <div className="inv-stock-bar-wrap">
                                                    <div
                                                        className="inv-stock-bar-fill"
                                                        style={{
                                                            width: `${pct}%`,
                                                            background: getStockColor(item.status)
                                                        }}
                                                    />
                                                </div>
                                                <span className="inv-stock-range">
                                                    Min {item.minStockLevel} / Max {item.maxStockLevel}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 600, color: '#333448' }}>
                                                ₹{item.unitPrice.toFixed(2)}
                                            </td>
                                            <td className="inv-total-value">
                                                ₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                            </td>
                                            <td style={{ fontSize: 13, color: '#555' }}>
                                                {item.location}
                                                <br />
                                                <span className="inv-last-restocked">
                                                    Last: {item.lastRestocked}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: 13, color: '#555' }}>{item.supplier}</td>
                                            <td>{getStatusBadge(item.status)}</td>
                                            <td>
                                                <div className="inv-actions">
                                                    <button
                                                        className="inv-btn-icon inv-btn-view"
                                                        title="View"
                                                    >
                                                        <IconEye size={15} />
                                                    </button>
                                                    <button
                                                        className="inv-btn-icon inv-btn-edit"
                                                        title="Edit"
                                                        onClick={() => { setEditingItem(item); setShowModal(true); }}
                                                    >
                                                        <IconEdit size={15} />
                                                    </button>
                                                    <button
                                                        className="inv-btn-icon inv-btn-delete"
                                                        title="Delete"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <IconTrash size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="inv-table-footer">
                    <span>Showing {filteredItems.length} of {inventoryItems.length} items</span>
                    <div className="inv-pagination">
                        <button className="inv-page-btn">‹</button>
                        <button className="inv-page-btn active">1</button>
                        <button className="inv-page-btn">›</button>
                    </div>
                </div>
            </div>

            {/* ── Low Stock Alerts ── */}
            {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
                <div className="inv-card" style={{ padding: '20px' }}>
                    <h6 style={{ margin: '0 0 14px', fontWeight: 600, color: '#333448', fontSize: '0.95rem' }}>
                        ⚠ Stock Alerts
                    </h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {inventoryItems
                            .filter(i => i.status !== 'In Stock')
                            .map(item => (
                                <div
                                    key={item.id}
                                    className={`inv-alert ${item.status === 'Out of Stock' ? 'inv-alert-danger' : 'inv-alert-warning'}`}
                                >
                                    {item.status === 'Out of Stock' ? <IconAlertCircle size={16} /> : <IconAlertTriangle size={16} />}
                                    <span>
                                        <strong>{item.name}</strong> — {item.status}
                                        {item.status === 'Low Stock' && ` (${item.currentStock} ${item.unit} remaining)`}
                                    </span>
                                    <Link
                                        to="/school/inventory/add-stock"
                                        style={{ marginLeft: 'auto', fontSize: 12, color: 'inherit', textDecoration: 'underline' }}
                                    >
                                        Reorder →
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="inv-modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="inv-modal-content inv-modal-large"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="inv-modal-header">
                            <h5>{editingItem ? 'Edit Item' : 'Add New Item'}</h5>
                            <button className="inv-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="inv-modal-body">
                            <div className="inv-form-grid">
                                {[
                                    { label: 'Item Name *', type: 'text', key: 'name', placeholder: 'e.g. Whiteboard Markers' },
                                    { label: 'SKU', type: 'text', key: 'sku', placeholder: 'e.g. INV-WBM-001' },
                                    { label: 'Category', type: 'text', key: 'category', placeholder: 'e.g. Stationery' },
                                    { label: 'Subcategory', type: 'text', key: 'subcategory', placeholder: 'e.g. Writing Supplies' },
                                    { label: 'Current Stock', type: 'number', key: 'currentStock', placeholder: '0' },
                                    { label: 'Min Stock Level', type: 'number', key: 'minStockLevel', placeholder: '0' },
                                    { label: 'Max Stock Level', type: 'number', key: 'maxStockLevel', placeholder: '0' },
                                    { label: 'Unit', type: 'text', key: 'unit', placeholder: 'pieces / units' },
                                    { label: 'Unit Price (₹)', type: 'number', key: 'unitPrice', placeholder: '0.00' },
                                    { label: 'Supplier', type: 'text', key: 'supplier', placeholder: 'Supplier name' },
                                    { label: 'Location', type: 'text', key: 'location', placeholder: 'Storage location' },
                                ].map(field => (
                                    <div key={field.key} className="inv-form-group">
                                        <label>{field.label}</label>
                                        <input
                                            type={field.type}
                                            className="inv-form-input"
                                            placeholder={field.placeholder}
                                            defaultValue={editingItem ? editingItem[field.key] : ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="inv-modal-footer">
                            <button className="inv-btn inv-btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="inv-btn inv-btn-primary" onClick={() => setShowModal(false)}>
                                <IconCheck size={15} /> {editingItem ? 'Save Changes' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
