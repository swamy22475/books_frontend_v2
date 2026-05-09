import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconTag, IconPlus, IconEdit, IconTrash, IconSearch, IconCategory2, IconPackage, IconCategory } from '@tabler/icons-react';
import './Inventory.css';

const Categories = () => {
    const title = 'Item Categories';
    const icon = '🏷️';

    // Sample categories with subcategories
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Stationery',
            description: 'All types of stationery items',
            color: '#3b82f6',
            icon: '✏️',
            itemCount: 45,
            subcategories: ['Writing Supplies', 'Paper Products', 'Files & Folders', 'Art Supplies'],
            createdAt: '2024-01-15',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Laboratory Equipment',
            description: 'Science lab equipment and supplies',
            color: '#10b981',
            icon: '🔬',
            itemCount: 28,
            subcategories: ['Optical Instruments', 'Safety Equipment', 'Glassware', 'Chemicals'],
            createdAt: '2024-01-10',
            status: 'Active'
        },
        {
            id: 3,
            name: 'IT Equipment',
            description: 'Computers and related accessories',
            color: '#8b5cf6',
            icon: '💻',
            itemCount: 35,
            subcategories: ['Computers', 'Computer Accessories', 'Presentation Equipment', 'Storage Devices'],
            createdAt: '2024-01-12',
            status: 'Active'
        },
        {
            id: 4,
            name: 'Sports Equipment',
            description: 'Sports and physical education equipment',
            color: '#f59e0b',
            icon: '⚽',
            itemCount: 22,
            subcategories: ['Balls', 'Rackets', 'Fitness Equipment', 'Safety Gear'],
            createdAt: '2024-01-08',
            status: 'Active'
        },
        {
            id: 5,
            name: 'Medical Supplies',
            description: 'First aid and medical equipment',
            color: '#ef4444',
            icon: '🏥',
            itemCount: 18,
            subcategories: ['Emergency Equipment', 'First Aid Supplies', 'Medical Instruments', 'Safety Supplies'],
            createdAt: '2024-01-20',
            status: 'Active'
        },
        {
            id: 6,
            name: 'Furniture',
            description: 'Office and classroom furniture',
            color: '#6b7280',
            icon: '🪑',
            itemCount: 15,
            subcategories: ['Chairs', 'Tables', 'Storage', 'Office Furniture'],
            createdAt: '2024-01-25',
            status: 'Inactive'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        icon: '📦',
        subcategories: '',
        status: 'Active'
    });

    // Filter categories
    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || category.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [categories, searchTerm, filterStatus]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Active': { color: '#10b981', bg: '#d1fae5', icon: '✅' },
            'Inactive': { color: '#6b7280', bg: '#f3f4f6', icon: '⏸️' }
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

    const handleAddCategory = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            color: '#3b82f6',
            icon: '📦',
            subcategories: '',
            status: 'Active'
        });
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
            subcategories: category.subcategories.join(', '),
            status: category.status
        });
        setShowModal(true);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category? This will also delete all items in this category.')) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    const handleSubmit = () => {
        if (!formData.name) {
            alert('Category name is required');
            return;
        }

        const subcategoriesArray = formData.subcategories
            .split(',')
            .map(sub => sub.trim())
            .filter(sub => sub.length > 0);

        if (editingCategory) {
            setCategories(categories.map(cat =>
                cat.id === editingCategory.id
                    ? {
                        ...cat,
                        ...formData,
                        subcategories: subcategoriesArray
                    }
                    : cat
            ));
        } else {
            const newCategory = {
                id: Date.now(),
                ...formData,
                subcategories: subcategoriesArray,
                itemCount: 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setCategories([...categories, newCategory]);
        }

        setShowModal(false);
        setEditingCategory(null);
    };

    const totalCategories = categories.length;
    const activeCategories = categories.filter(cat => cat.status === 'Active').length;
    const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);

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
                    onClick={handleAddCategory}
                >
                    <IconPlus size={18} /> Add Category
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="inv-stats-grid">
                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
                        <IconCategory2 size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">{totalCategories}</h3>
                        <p className="inv-stat-label">Total Categories</p>
                    </div>
                </div>

                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                        <IconTag size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">{activeCategories}</h3>
                        <p className="inv-stat-label">Active Categories</p>
                    </div>
                </div>

                <div className="inv-stat-card">
                    <div className="inv-stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                        <IconPackage size={24} />
                    </div>
                    <div className="inv-stat-content">
                        <h3 className="inv-stat-value">{totalItems}</h3>
                        <p className="inv-stat-label">Total Items</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="inv-filter-card">
                <div className="inv-filter-grid">
                    <div className="inv-filter-group">
                        <label>Search Categories</label>
                        <div className="inv-search-wrapper">
                            <IconSearch size={16} className="inv-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="inv-search-input"
                            />
                        </div>
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
                        </select>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="inv-categories-grid">
                {filteredCategories.length === 0 ? (
                    <div className="inv-empty-state">
                        <IconCategory size={48} color="#ccc" />
                        <h6>No categories found</h6>
                        <p>Try adjusting your search or create a new category.</p>
                    </div>
                ) : (
                    filteredCategories.map(category => (
                        <div key={category.id} className="inv-category-card">
                            <div className="inv-category-header">
                                <div
                                    className="inv-category-icon"
                                    style={{ backgroundColor: category.color }}
                                >
                                    <span style={{ fontSize: '24px' }}>{category.icon}</span>
                                </div>
                                <div className="inv-category-actions">
                                    <button
                                        className="inv-btn-icon inv-btn-edit"
                                        onClick={() => handleEditCategory(category)}
                                        title="Edit Category"
                                    >
                                        <IconEdit size={16} />
                                    </button>
                                    <button
                                        className="inv-btn-icon inv-btn-delete"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        title="Delete Category"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="inv-category-content">
                                <h5 className="inv-category-name">{category.name}</h5>
                                <p className="inv-category-description">{category.description}</p>

                                <div className="inv-category-meta">
                                    <div className="inv-category-stat">
                                        <span className="inv-stat-label">Items:</span>
                                        <strong>{category.itemCount}</strong>
                                    </div>
                                    <div className="inv-category-stat">
                                        <span className="inv-stat-label">Subcategories:</span>
                                        <strong>{category.subcategories.length}</strong>
                                    </div>
                                </div>

                                <div className="inv-category-subcategories">
                                    {category.subcategories.slice(0, 3).map((sub, index) => (
                                        <span key={index} className="inv-subcategory-tag">
                                            {sub}
                                        </span>
                                    ))}
                                    {category.subcategories.length > 3 && (
                                        <span className="inv-subcategory-more">
                                            +{category.subcategories.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="inv-category-footer">
                                    <small className="inv-created-date">
                                        Created: {category.createdAt}
                                    </small>
                                    {getStatusBadge(category.status)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Category Modal */}
            {showModal && (
                <div className="inv-modal-overlay">
                    <div className="inv-modal-content">
                        <div className="inv-modal-header">
                            <h5>{editingCategory ? 'Edit Category' : 'Add New Category'}</h5>
                            <button
                                className="inv-modal-close"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingCategory(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="inv-modal-body">
                            <div className="inv-form-grid">
                                <div className="inv-form-group">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="inv-form-input"
                                        placeholder="e.g., Stationery"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Icon</label>
                                    <div className="inv-icon-selector">
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="inv-form-input"
                                            placeholder="📦"
                                            maxLength={2}
                                        />
                                        <div className="inv-icon-preview" style={{ fontSize: '24px' }}>
                                            {formData.icon || '📦'}
                                        </div>
                                    </div>
                                </div>

                                <div className="inv-form-group">
                                    <label>Color</label>
                                    <div className="inv-color-selector">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="inv-color-input"
                                        />
                                        <div
                                            className="inv-color-preview"
                                            style={{ backgroundColor: formData.color }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="inv-form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="inv-form-select"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="inv-form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="inv-form-textarea"
                                        placeholder="Describe this category..."
                                        rows="3"
                                    />
                                </div>

                                <div className="inv-form-group full-width">
                                    <label>Subcategories (comma-separated)</label>
                                    <textarea
                                        value={formData.subcategories}
                                        onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                                        className="inv-form-textarea"
                                        placeholder="e.g., Writing Supplies, Paper Products, Files & Folders"
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
                                    setEditingCategory(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="inv-btn inv-btn-primary"
                                onClick={handleSubmit}
                            >
                                {editingCategory ? 'Update Category' : 'Add Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
