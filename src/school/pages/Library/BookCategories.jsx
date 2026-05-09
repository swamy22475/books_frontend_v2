import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const BookCategories = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryCode: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Category Added:', formData);
        setShowAddModal(false);
        setFormData({ categoryName: '', categoryCode: '', description: '' });
    };

    const [categories, setCategories] = useState([
        { id: 1, name: 'Fiction', description: 'Imaginary stories and novels', bookCount: 120 },
        { id: 2, name: 'Science', description: 'Scientific journals and textbooks', bookCount: 85 },
        { id: 3, name: 'History', description: 'Historical records and biographies', bookCount: 45 },
        { id: 4, name: 'Mathematics', description: 'Math textbooks and workbooks', bookCount: 60 },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setCategories(prev => prev.filter(cat => cat.id !== id));
        }
    };

    const handleEdit = (category) => {
        setFormData({
            categoryName: category.name,
            categoryCode: '', // Default placeholder as it's not in the object
            description: category.description
        });
        setShowAddModal(true);
    };

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Book Categories</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Library</span> / <span className="current">Categories</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconPlus size={18} />
                    Add Category
                </button>
            </div>

            <div className="accounts-card">
                <div className="card-header">
                    <h5>Manage Categories</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th style={{ textAlign: 'center' }}>Total Books</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td style={{ fontWeight: '600' }}>{cat.name}</td>
                                        <td>{cat.description}</td>
                                        <td style={{ textAlign: 'center' }}>{cat.bookCount}</td>
                                        <td>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(cat)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(cat.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Add Category</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Category Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Category Code</label>
                                <input
                                    type="text"
                                    name="categoryCode"
                                    value={formData.categoryCode}
                                    onChange={handleChange}
                                    placeholder="Enter category code"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter category description"
                                ></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookCategories;
