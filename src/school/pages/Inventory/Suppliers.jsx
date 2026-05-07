import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconBuildingFactory2, IconPlus, IconEdit, IconTrash, IconSearch, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import './Inventory.css';

const Suppliers = () => {
    const title = 'Suppliers';
    const icon = '🏢';

    // Sample suppliers data
    const [suppliers, setSuppliers] = useState([
        {
            id: 1,
            name: 'Office Supplies Co.',
            contactPerson: 'John Anderson',
            email: 'john@officesupplies.com',
            phone: '+91-9876543210',
            address: '123 Business Park, Delhi - 110001',
            gstNumber: '07AAAPL1234C1ZV',
            panNumber: 'AAAPL1234C',
            paymentTerms: '30 Days',
            categories: ['Stationery', 'Furniture'],
            totalOrders: 45,
            totalValue: 2850000,
            status: 'Active',
            rating: 4.5,
            lastOrderDate: '2024-02-15',
            notes: 'Reliable supplier for office stationery'
        },
        {
            id: 2,
            name: 'Science Equipment Ltd.',
            contactPerson: 'Dr. Sarah Mitchell',
            email: 'sarah@scienceequip.com',
            phone: '+91-9876543211',
            address: '456 Industrial Area, Mumbai - 400001',
            gstNumber: '27AAAPL5678B2ZW',
            panNumber: 'AAAPL5678B',
            paymentTerms: '45 Days',
            categories: ['Laboratory Equipment'],
            totalOrders: 28,
            totalValue: 12500000,
            status: 'Active',
            rating: 4.8,
            lastOrderDate: '2024-02-10',
            notes: 'Specialized in high-quality lab equipment'
        },
        {
            id: 3,
            name: 'Tech Solutions Inc.',
            contactPerson: 'Raj Kumar',
            email: 'raj@techsolutions.in',
            phone: '+91-9876543212',
            address: '789 Tech Park, Bangalore - 560001',
            gstNumber: '29AAAPL9012C3ZX',
            panNumber: 'AAAPL9012C',
            paymentTerms: '15 Days',
            categories: ['IT Equipment', 'Electronics'],
            totalOrders: 32,
            totalValue: 8900000,
            status: 'Active',
            rating: 4.2,
            lastOrderDate: '2024-02-08',
            notes: 'Good for computer accessories and electronics'
        },
        {
            id: 4,
            name: 'Sports Gear Co.',
            contactPerson: 'Michael Singh',
            email: 'michael@sportsgear.com',
            phone: '+91-9876543213',
            address: '321 Sports Complex, Chennai - 600001',
            gstNumber: '33AAAPL3456D4ZY',
            panNumber: 'AAAPL3456D',
            paymentTerms: '30 Days',
            categories: ['Sports Equipment'],
            totalOrders: 18,
            totalValue: 3200000,
            status: 'Active',
            rating: 4.6,
            lastOrderDate: '2024-02-05',
            notes: 'Specialized in sports equipment and gear'
        },
        {
            id: 5,
            name: 'Paper World',
            contactPerson: 'Amit Sharma',
            email: 'amit@paperworld.com',
            phone: '+91-9876543214',
            address: '654 Paper Mill, Pune - 411001',
            gstNumber: '27AAAPL7890E5ZA',
            panNumber: 'AAAPL7890E',
            paymentTerms: '60 Days',
            categories: ['Stationery'],
            totalOrders: 56,
            totalValue: 4500000,
            status: 'Active',
            rating: 4.3,
            lastOrderDate: '2024-02-12',
            notes: 'Bulk supplier for paper products'
        },
        {
            id: 6,
            name: 'Safety First Inc.',
            contactPerson: 'Dr. Priya Nair',
            email: 'priya@safetyfirst.com',
            phone: '+91-9876543215',
            address: '987 Safety Zone, Hyderabad - 500001',
            gstNumber: '36AAAPL1234F6ZB',
            panNumber: 'AAAPL1234F',
            paymentTerms: '30 Days',
            categories: ['Medical Supplies', 'Safety Equipment'],
            totalOrders: 22,
            totalValue: 6800000,
            status: 'Active',
            rating: 4.7,
            lastOrderDate: '2024-02-01',
            notes: 'Specialized in safety and medical supplies'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        panNumber: '',
        paymentTerms: '30 Days',
        categories: [],
        status: 'Active',
        notes: ''
    });

    // Get unique categories
    const allCategories = useMemo(() => {
        const cats = new Set();
        suppliers.forEach(supplier => {
            supplier.categories.forEach(cat => cats.add(cat));
        });
        return ['All', ...Array.from(cats)];
    }, [suppliers]);

    // Filter suppliers
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(supplier => {
            const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || supplier.status === filterStatus;
            const matchesCategory = filterCategory === 'All' || 
                                supplier.categories.some(cat => cat === filterCategory);
            
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [suppliers, searchTerm, filterStatus, filterCategory]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Active': { color: '#10b981', bg: '#d1fae5', icon: '✅' },
            'Inactive': { color: '#6b7280', bg: '#f3f4f6', icon: '⏸️' },
            'Blacklisted': { color: '#ef4444', bg: '#fee2e2', icon: '🚫' }
        };
        
        const config = statusConfig[status] || statusConfig['Active'];
        
        return (
            <span 
                className="inv-status-badge"
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                {config.icon} {status}
            </span>
        );
    };

    const getRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        
        return (
            <div className="inv-rating">
                {Array(fullStars).fill(0).map((_, i) => (
                    <span key={`full-${i}`} className="inv-star full">★</span>
                ))}
                {hasHalfStar && <span className="inv-star half">★</span>}
                {Array(emptyStars).fill(0).map((_, i) => (
                    <span key={`empty-${i}`} className="inv-star empty">★</span>
                ))}
                <span className="inv-rating-value">({rating})</span>
            </div>
        );
    };

    const handleAddSupplier = () => {
        setEditingSupplier(null);
        setFormData({
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            gstNumber: '',
            panNumber: '',
            paymentTerms: '30 Days',
            categories: [],
            status: 'Active',
            notes: ''
        });
        setShowModal(true);
    };

    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contactPerson: supplier.contactPerson,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            gstNumber: supplier.gstNumber,
            panNumber: supplier.panNumber,
            paymentTerms: supplier.paymentTerms,
            categories: supplier.categories,
            status: supplier.status,
            notes: supplier.notes
        });
        setShowModal(true);
    };

    const handleDeleteSupplier = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            setSuppliers(suppliers.filter(supplier => supplier.id !== id));
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.contactPerson || !formData.email) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingSupplier) {
            setSuppliers(suppliers.map(supplier => 
                supplier.id === editingSupplier.id 
                    ? { ...supplier, ...formData }
                    : supplier
            ));
        } else {
            const newSupplier = {
                id: Date.now(),
                ...formData,
                totalOrders: 0,
                totalValue: 0,
                rating: 0,
                lastOrderDate: null
            };
            setSuppliers([...suppliers, newSupplier]);
        }

        setShowModal(false);
        setEditingSupplier(null);
    };

    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(supplier => supplier.status === 'Active').length;
    const totalValue = suppliers.reduce((sum, supplier) => sum + supplier.totalValue, 0);

    return (
        <div className="inv-page">
            {/* Header */}
            <div className="inv-page-header">
                <div>
                    <h4 className="inv-page-title">{icon} {title}</h4>
                    <nav className="inv-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/inventory">Inventory</Link> /&nbsp;
                        <span className="inv-breadcrumb-current">{title}</span>
                    </nav>
                </div>
                <button 
                    className="inv-btn inv-btn-primary"
                    onClick={handleAddSupplier}
                >
                    <IconPlus size={18} /> Add Supplier
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="inv-stats-grid">
                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
                        <IconBuildingFactory2 size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">{totalSuppliers}</h3>
                        <p className="inv-stat-label">Total Suppliers</p>
                    </div>
                </div>
                
                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                        <IconPhone size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">{activeSuppliers}</h3>
                        <p className="inv-stat-label">Active Suppliers</p>
                    </div>
                </div>
                
                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                        <IconMail size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">₹{(totalValue / 1000000).toFixed(1)}M</h3>
                        <p className="inv-stat-label">Total Order Value</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="inv-filter-card">
                <div className="inv-filter-grid">
                    <div className="inv-filter-group">
                        <label>Search Suppliers</label>
                        <div className="inv-search-wrapper">
                            <IconSearch size={16} className="inv-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name, contact person, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="inv-search-input"
                            />
                        </div>
                    </div>
                    
                    <div className="inv-filter-group">
                        <label>Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="inv-select"
                        >
                            {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="inv-filter-group">
                        <label>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="inv-select"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Blacklisted">Blacklisted</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="inv-table-card">
                <div className="inv-table-header">
                    <h5 className="inv-table-title">
                        Suppliers ({filteredSuppliers.length})
                    </h5>
                </div>
                
                <div className="inv-table-container">
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>Supplier Details</th>
                                <th>Contact Information</th>
                                <th>Categories</th>
                                <th>Orders</th>
                                <th>Total Value</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="inv-empty-state">
                                        <div>
                                            <IconBuilding size={48} color="#ccc" />
                                            <h6>No suppliers found</h6>
                                            <p>Try adjusting your filters or add a new supplier.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id} className="inv-table-row">
                                        <td className="inv-supplier-details">
                                            <div className="inv-supplier-name">
                                                <strong>{supplier.name}</strong>
                                                <div className="inv-supplier-meta">
                                                    <small>GST: {supplier.gstNumber}</small>
                                                    <small>PAN: {supplier.panNumber}</small>
                                                </div>
                                            </div>
                                            <small className="inv-supplier-address">
                                                <IconMapPin size={12} /> {supplier.address}
                                            </small>
                                        </td>
                                        <td className="inv-contact-info">
                                            <div>
                                                <strong>{supplier.contactPerson}</strong>
                                                <br />
                                                <small className="inv-contact-item">
                                                    <IconPhone size={12} /> {supplier.phone}
                                                </small>
                                                <br />
                                                <small className="inv-contact-item">
                                                    <IconMail size={12} /> {supplier.email}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="inv-categories-list">
                                                {supplier.categories.map((cat, index) => (
                                                    <span key={index} className="inv-category-tag">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{supplier.totalOrders}</strong>
                                                <br />
                                                <small>Last: {supplier.lastOrderDate || 'Never'}</small>
                                            </div>
                                        </td>
                                        <td className="inv-total-value">
                                            ₹{supplier.totalValue.toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            {getRatingStars(supplier.rating)}
                                        </td>
                                        <td>{getStatusBadge(supplier.status)}</td>
                                        <td>
                                            <div className="inv-actions">
                                                <button 
                                                    className="inv-btn-icon inv-btn-edit"
                                                    onClick={() => handleEditSupplier(supplier)}
                                                    title="Edit Supplier"
                                                >
                                                    <IconEdit size={16} />
                                                </button>
                                                <button 
                                                    className="inv-btn-icon inv-btn-delete"
                                                    onClick={() => handleDeleteSupplier(supplier.id)}
                                                    title="Delete Supplier"
                                                >
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Supplier Modal */}
            {showModal && (
                <div className="inv-modal-overlay">
                    <div className="inv-modal-content inv-modal-large">
                        <div className="inv-modal-header">
                            <h5>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h5>
                            <button 
                                className="inv-modal-close"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingSupplier(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="inv-modal-body">
                            <div className="inv-form-grid">
                                <div className="inv-form-group">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter company name"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>Contact Person *</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter contact person name"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        value={formData.gstNumber}
                                        onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter GST number"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>PAN Number</label>
                                    <input
                                        type="text"
                                        value={formData.panNumber}
                                        onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                                        className="inv-form-input"
                                        placeholder="Enter PAN number"
                                    />
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>Payment Terms</label>
                                    <select
                                        value={formData.paymentTerms}
                                        onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                                        className="inv-form-select"
                                    >
                                        <option value="15 Days">15 Days</option>
                                        <option value="30 Days">30 Days</option>
                                        <option value="45 Days">45 Days</option>
                                        <option value="60 Days">60 Days</option>
                                        <option value="90 Days">90 Days</option>
                                    </select>
                                </div>
                                
                                <div className="inv-form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="inv-form-select"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Blacklisted">Blacklisted</option>
                                    </select>
                                </div>
                                
                                <div className="inv-form-group full-width">
                                    <label>Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="inv-form-textarea"
                                        placeholder="Enter complete address"
                                        rows="2"
                                    />
                                </div>
                                
                                <div className="inv-form-group full-width">
                                    <label>Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="inv-form-textarea"
                                        placeholder="Enter any additional notes..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="inv-modal-footer">
                            <button 
                                className="inv-btn inv-btn-outline"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingSupplier(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="inv-btn inv-btn-primary"
                                onClick={handleSubmit}
                            >
                                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
