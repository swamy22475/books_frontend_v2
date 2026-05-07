import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IconPackage, IconPlus, IconEdit, IconTrash, IconSearch,
    IconBarcode, IconCalendar, IconChevronRight, IconBox,
    IconAlertTriangle, IconCircleCheck, IconCircleX,
    IconLayoutGrid, IconList, IconEye, IconTrendingUp,
    IconBuildingWarehouse, IconTag
} from '@tabler/icons-react';
import './Inventory.css';

/* ── Category colour palette ─────────────────────────────── */
const CAT_CONFIG = {
    'Stationery': { color: '#3d5ee1', bg: '#eef1fd', emoji: '📝' },
    'Laboratory Equipment': { color: '#7367f0', bg: '#f0edff', emoji: '🔬' },
    'IT Equipment': { color: '#00cfe8', bg: '#e0f9fc', emoji: '💻' },
    'Sports Equipment': { color: '#ff9f43', bg: '#fff5e6', emoji: '⚽' },
    'Medical Supplies': { color: '#ea5455', bg: '#fce8e8', emoji: '🩺' },
};
const getCatCfg = cat => CAT_CONFIG[cat] || { color: '#9b9b9b', bg: '#f0f0f0', emoji: '📦' };

/* ── Status config ────────────────────────────────────────── */
const STATUS_CFG = {
    'In Stock': { color: '#28c76f', bg: '#e8faf1', icon: <IconCircleCheck size={13} /> },
    'Low Stock': { color: '#ff9f43', bg: '#fff5e6', icon: <IconAlertTriangle size={13} /> },
    'Out of Stock': { color: '#ea5455', bg: '#fce8e8', icon: <IconCircleX size={13} /> },
};

const ItemList = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Whiteboard Markers', category: 'Stationery', subcategory: 'Writing Supplies', sku: 'INV-WBM-001', barcode: '123456789001', description: 'Dry erase markers, assorted colors, pack of 12', currentStock: 150, minStockLevel: 50, maxStockLevel: 500, unit: 'pieces', unitPrice: 25.50, sellingPrice: 35.00, supplier: 'Office Supplies Co.', manufacturer: 'Stationery Pro', location: 'Store Room A', lastRestocked: '2024-02-15', status: 'In Stock' },
        { id: 2, name: 'Laboratory Microscopes', category: 'Laboratory Equipment', subcategory: 'Optical Instruments', sku: 'INV-LMO-002', barcode: '123456789002', description: 'Compound microscope 400x, LED illumination', currentStock: 12, minStockLevel: 5, maxStockLevel: 30, unit: 'units', unitPrice: 3500.00, sellingPrice: 4500.00, supplier: 'Science Equipment Ltd.', manufacturer: 'LabTech Industries', location: 'Lab Room 101', lastRestocked: '2024-01-20', status: 'In Stock' },
        { id: 3, name: 'Computer Mouse', category: 'IT Equipment', subcategory: 'Computer Accessories', sku: 'INV-CMO-003', barcode: '123456789003', description: 'Wireless optical mouse, USB receiver', currentStock: 8, minStockLevel: 15, maxStockLevel: 50, unit: 'pieces', unitPrice: 450.00, sellingPrice: 599.00, supplier: 'Tech Solutions Inc.', manufacturer: 'TechGear Pro', location: 'IT Department', lastRestocked: '2024-01-10', status: 'Low Stock' },
        { id: 4, name: 'Basketball', category: 'Sports Equipment', subcategory: 'Balls', sku: 'INV-BBA-004', barcode: '123456789004', description: 'Size 7 rubber basketball, official weight', currentStock: 0, minStockLevel: 10, maxStockLevel: 30, unit: 'pieces', unitPrice: 850.00, sellingPrice: 1200.00, supplier: 'Sports Gear Co.', manufacturer: 'SportsPro', location: 'Sports Room', lastRestocked: '2023-12-15', status: 'Out of Stock' },
        { id: 5, name: 'Notebooks (A4)', category: 'Stationery', subcategory: 'Paper Products', sku: 'INV-NBA-005', barcode: '123456789005', description: '200 pages ruled notebook, A4 size', currentStock: 500, minStockLevel: 200, maxStockLevel: 1000, unit: 'pieces', unitPrice: 45.00, sellingPrice: 65.00, supplier: 'Paper World', manufacturer: 'Paper Mills Ltd.', location: 'Store Room B', lastRestocked: '2024-02-10', status: 'In Stock' },
        { id: 6, name: 'Chemistry Lab Coats', category: 'Laboratory Equipment', subcategory: 'Safety Equipment', sku: 'INV-CLC-006', barcode: '123456789006', description: 'White lab coat, cotton, size L', currentStock: 25, minStockLevel: 20, maxStockLevel: 60, unit: 'pieces', unitPrice: 320.00, sellingPrice: 450.00, supplier: 'Safety First Inc.', manufacturer: 'SafetyWear Pro', location: 'Lab Room 201', lastRestocked: '2024-02-01', status: 'In Stock' },
        { id: 7, name: 'Projector', category: 'IT Equipment', subcategory: 'Presentation Equip.', sku: 'INV-PRJ-007', barcode: '123456789007', description: 'HD projector, 3000 lumens, HDMI', currentStock: 5, minStockLevel: 3, maxStockLevel: 15, unit: 'units', unitPrice: 25000.00, sellingPrice: 32000.00, supplier: 'Tech Solutions Inc.', manufacturer: 'ProVision', location: 'AV Room', lastRestocked: '2024-01-25', status: 'In Stock' },
        { id: 8, name: 'First Aid Kit', category: 'Medical Supplies', subcategory: 'Emergency Equipment', sku: 'INV-FAK-008', barcode: '123456789008', description: 'Complete first aid kit, 100 pieces', currentStock: 15, minStockLevel: 10, maxStockLevel: 30, unit: 'kits', unitPrice: 850.00, sellingPrice: 1200.00, supplier: 'Medical Supplies Co.', manufacturer: 'HealthFirst', location: 'Nurse Office', lastRestocked: '2024-02-05', status: 'In Stock' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const categories = useMemo(() => ['All', ...new Set(items.map(i => i.category))], [items]);

    const filteredItems = useMemo(() => items.filter(item => {
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.barcode.includes(q) || item.supplier.toLowerCase().includes(q);
        return matchSearch && (filterCategory === 'All' || item.category === filterCategory) && (filterStatus === 'All' || item.status === filterStatus);
    }), [items, searchTerm, filterCategory, filterStatus]);

    const stats = useMemo(() => ({
        total: items.length,
        inStock: items.filter(i => i.status === 'In Stock').length,
        lowStock: items.filter(i => i.status === 'Low Stock').length,
        outStock: items.filter(i => i.status === 'Out of Stock').length,
    }), [items]);

    const stockPct = item => Math.min(100, Math.round((item.currentStock / item.maxStockLevel) * 100));
    const stockBarColor = status => status === 'In Stock' ? '#28c76f' : status === 'Low Stock' ? '#ff9f43' : '#ea5455';

    const handleDelete = id => { if (window.confirm('Delete this item?')) setItems(items.filter(i => i.id !== id)); };
    const handleEdit = item => { setEditingItem(item); setShowModal(true); };

    const StatusPill = ({ status }) => {
        const cfg = STATUS_CFG[status] || STATUS_CFG['In Stock'];
        return (
            <span className="il-status-pill" style={{ color: cfg.color, background: cfg.bg }}>
                {cfg.icon} {status}
            </span>
        );
    };

    return (
        <div className="inv-page">

            {/* ── Header ─────────────────────────────────── */}
            <div className="inv-page-header">
                <div>
                    <h4 className="inv-page-title">
                        <span className="il-title-icon"><IconBox size={20} /></span>
                        Item List
                    </h4>
                    <nav className="inv-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        <IconChevronRight size={12} style={{ margin: '0 4px', opacity: 0.4 }} />
                        <Link to="/school/inventory">Inventory</Link>
                        <IconChevronRight size={12} style={{ margin: '0 4px', opacity: 0.4 }} />
                        <span className="inv-breadcrumb-current">Item List</span>
                    </nav>
                </div>
                <button className="inv-btn inv-btn-primary" onClick={() => setShowModal(true)}>
                    <IconPlus size={18} /> Add Item
                </button>
            </div>

            {/* ── Stat Cards ─────────────────────────────── */}
            <div className="il-stats-row">
                <div className="il-stat-card il-stat-blue">
                    <div className="il-stat-icon"><IconPackage size={22} /></div>
                    <div className="il-stat-body"><p>Total Items</p><h3>{stats.total}</h3></div>
                    <div className="il-stat-orb" />
                </div>
                <div className="il-stat-card il-stat-green">
                    <div className="il-stat-icon"><IconCircleCheck size={22} /></div>
                    <div className="il-stat-body"><p>In Stock</p><h3>{stats.inStock}</h3></div>
                    <div className="il-stat-orb" />
                </div>
                <div className="il-stat-card il-stat-orange">
                    <div className="il-stat-icon"><IconAlertTriangle size={22} /></div>
                    <div className="il-stat-body"><p>Low Stock</p><h3>{stats.lowStock}</h3></div>
                    <div className="il-stat-orb" />
                </div>
                <div className="il-stat-card il-stat-red">
                    <div className="il-stat-icon"><IconCircleX size={22} /></div>
                    <div className="il-stat-body"><p>Out of Stock</p><h3>{stats.outStock}</h3></div>
                    <div className="il-stat-orb" />
                </div>
            </div>

            {/* ── Filter Bar ─────────────────────────────── */}
            <div className="il-filter-bar">
                <div className="il-search-box">
                    <IconSearch size={15} className="il-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, SKU, barcode, supplier…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="il-filter-selects">
                    <div className="il-select-wrap">
                        <IconTag size={14} className="il-sel-icon" />
                        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="il-select-wrap">
                        <IconTrendingUp size={14} className="il-sel-icon" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
                <div className="il-view-toggle">
                    <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')} title="Table view"><IconList size={16} /></button>
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grid view"><IconLayoutGrid size={16} /></button>
                </div>
            </div>

            {/* ── Category Quick Pills ───────────────────── */}
            <div className="il-cat-pills">
                <button className={`il-cat-pill ${filterCategory === 'All' ? 'il-cat-active-all' : ''}`} onClick={() => setFilterCategory('All')}>
                    📦 All <span>{items.length}</span>
                </button>
                {categories.filter(c => c !== 'All').map(cat => {
                    const cfg = getCatCfg(cat);
                    const cnt = items.filter(i => i.category === cat).length;
                    return (
                        <button
                            key={cat}
                            className={`il-cat-pill ${filterCategory === cat ? 'il-cat-active' : ''}`}
                            style={filterCategory === cat ? { '--pill-c': cfg.color, '--pill-bg': cfg.bg } : {}}
                            onClick={() => setFilterCategory(filterCategory === cat ? 'All' : cat)}
                        >
                            {cfg.emoji} {cat} <span>{cnt}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── TABLE VIEW ─────────────────────────────── */}
            {viewMode === 'table' ? (
                <div className="il-table-wrap">
                    <div className="il-table-head-bar">
                        <h5 className="il-table-heading">
                            <IconBuildingWarehouse size={18} /> All Items
                            <span className="il-count-badge">{filteredItems.length}</span>
                        </h5>
                    </div>
                    <div className="il-table-scroll">
                        <table className="il-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Pricing</th>
                                    <th>Supplier</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr><td colSpan="8">
                                        <div className="il-empty">
                                            <IconPackage size={52} color="#ccc" />
                                            <h6>No items found</h6>
                                            <p>Adjust your filters or <button className="il-inline-link" onClick={() => setShowModal(true)}>add a new item</button>.</p>
                                        </div>
                                    </td></tr>
                                ) : filteredItems.map(item => {
                                    const cfg = getCatCfg(item.category);
                                    const pct = stockPct(item);
                                    const bClr = stockBarColor(item.status);
                                    return (
                                        <tr key={item.id} className="il-tr">
                                            {/* Item */}
                                            <td>
                                                <div className="il-item-cell">
                                                    <div className="il-item-avatar" style={{ background: cfg.bg, color: cfg.color }}>
                                                        {cfg.emoji}
                                                    </div>
                                                    <div>
                                                        <div className="il-item-name">{item.name}</div>
                                                        <div className="il-item-sub">
                                                            <span className="il-sku-tag">{item.sku}</span>
                                                            <span className="il-barcode-tag"><IconBarcode size={11} />{item.barcode}</span>
                                                        </div>
                                                        <div className="il-item-desc">{item.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Category */}
                                            <td>
                                                <span className="il-cat-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.emoji} {item.category}</span>
                                                <div className="il-sub-text">{item.subcategory}</div>
                                            </td>
                                            {/* Stock */}
                                            <td>
                                                <div className="il-stock-qty" style={{ color: bClr }}>
                                                    <strong>{item.currentStock}</strong> <span>{item.unit}</span>
                                                </div>
                                                <div className="il-stock-bar-wrap">
                                                    <div className="il-stock-bar-fill" style={{ width: `${pct}%`, background: bClr }} />
                                                </div>
                                                <div className="il-sub-text">Min {item.minStockLevel} · Max {item.maxStockLevel}</div>
                                            </td>
                                            {/* Pricing */}
                                            <td>
                                                <div className="il-price-cost">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                                <div className="il-price-sell">Sell ₹{item.sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                            </td>
                                            {/* Supplier */}
                                            <td>
                                                <div className="il-supplier-name">{item.supplier}</div>
                                                <div className="il-sub-text">{item.manufacturer}</div>
                                            </td>
                                            {/* Location */}
                                            <td>
                                                <div className="il-location-name">{item.location}</div>
                                                <div className="il-sub-text"><IconCalendar size={11} /> {item.lastRestocked}</div>
                                            </td>
                                            {/* Status */}
                                            <td><StatusPill status={item.status} /></td>
                                            {/* Actions */}
                                            <td>
                                                <div className="il-actions">
                                                    <button className="il-act-btn il-act-view" title="View"><IconEye size={15} /></button>
                                                    <button className="il-act-btn il-act-edit" title="Edit" onClick={() => handleEdit(item)}><IconEdit size={15} /></button>
                                                    <button className="il-act-btn il-act-delete" title="Delete" onClick={() => handleDelete(item.id)}><IconTrash size={15} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredItems.length > 0 && (
                        <div className="il-table-footer">
                            <span>Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> items</span>
                        </div>
                    )}
                </div>
            ) : (
                /* ── GRID VIEW ─────────────────────────── */
                <div className="il-grid">
                    {filteredItems.length === 0 ? (
                        <div className="il-empty" style={{ gridColumn: '1/-1' }}>
                            <IconPackage size={52} color="#ccc" />
                            <h6>No items found</h6>
                            <p>Adjust your filters or <button className="il-inline-link" onClick={() => setShowModal(true)}>add a new item</button>.</p>
                        </div>
                    ) : filteredItems.map(item => {
                        const cfg = getCatCfg(item.category);
                        const pct = stockPct(item);
                        const bClr = stockBarColor(item.status);
                        return (
                            <div key={item.id} className="il-grid-card">
                                <div className="il-grid-card-top" style={{ background: `linear-gradient(135deg, ${cfg.color}22 0%, ${cfg.color}08 100%)`, borderBottom: `2px solid ${cfg.color}30` }}>
                                    <div className="il-grid-avatar" style={{ background: cfg.bg, color: cfg.color }}>{cfg.emoji}</div>
                                    <StatusPill status={item.status} />
                                </div>
                                <div className="il-grid-body">
                                    <h6 className="il-grid-name">{item.name}</h6>
                                    <span className="il-sku-tag" style={{ marginBottom: 8, display: 'inline-block' }}>{item.sku}</span>
                                    <p className="il-grid-desc">{item.description}</p>
                                    <div className="il-grid-stock">
                                        <span style={{ color: bClr, fontWeight: 700 }}>{item.currentStock} {item.unit}</span>
                                        <span className="il-sub-text">{pct}%</span>
                                    </div>
                                    <div className="il-stock-bar-wrap" style={{ marginBottom: 10 }}>
                                        <div className="il-stock-bar-fill" style={{ width: `${pct}%`, background: bClr }} />
                                    </div>
                                    <div className="il-grid-meta">
                                        <span className="il-cat-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.emoji} {item.category}</span>
                                        <span className="il-price-sell">₹{item.sellingPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="il-sub-text" style={{ marginTop: 6 }}>{item.location}</div>
                                </div>
                                <div className="il-grid-actions">
                                    <button className="il-act-btn il-act-view" title="View"><IconEye size={15} /></button>
                                    <button className="il-act-btn il-act-edit" title="Edit" onClick={() => handleEdit(item)}><IconEdit size={15} /></button>
                                    <button className="il-act-btn il-act-delete" title="Delete" onClick={() => handleDelete(item.id)}><IconTrash size={15} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modal ──────────────────────────────────── */}
            {showModal && (
                <div className="inv-modal-overlay" onClick={e => e.target === e.currentTarget && (setShowModal(false), setEditingItem(null))}>
                    <div className="inv-modal-content inv-modal-large">
                        <div className="inv-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3d5ee1,#7367f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <IconPackage size={18} />
                                </div>
                                <h5 style={{ margin: 0 }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h5>
                            </div>
                            <button className="inv-modal-close" onClick={() => { setShowModal(false); setEditingItem(null); }}>×</button>
                        </div>
                        <div className="inv-modal-body">
                            <p style={{ color: '#9b9b9b', textAlign: 'center', padding: '30px 0' }}>Item form fields would be implemented here.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemList;
