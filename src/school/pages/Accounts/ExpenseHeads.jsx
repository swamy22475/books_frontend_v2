import React, { useState } from 'react';
import {
    IconPlus, IconSearch, IconEdit, IconTrash,
    IconWallet, IconTag, IconNotes, IconFilter, IconChevronDown,
    IconCopy, IconFileSpreadsheet, IconFileTypeCsv, IconFileTypePdf
} from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Accounts.css';

const ExpenseHeads = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: ''
    });

    // Sample data
    const [headsData, setHeadsData] = useState([
        { id: 1, name: 'Utility Bills', description: 'Electricity, water, and internet bills', category: 'Operations' },
        { id: 2, name: 'Office Supplies', description: 'Stationery, ink, and small office tools', category: 'Administrative' },
        { id: 3, name: 'Salaries', description: 'Staff, teachers, and security wages', category: 'Human Resources' },
        { id: 4, name: 'Maintenance', description: 'Building repairs and equipment servicing', category: 'Operations' },
        { id: 5, name: 'Sports', description: 'Physical education gear and events', category: 'Academic' },
        { id: 6, name: 'Marketing', description: 'Advertisements and promotional events', category: 'Promotion' }
    ]);

    const categories = ['all', 'Operations', 'Administrative', 'Human Resources', 'Academic', 'Promotion'];

    const filteredData = headsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this head?')) {
            setHeadsData(headsData.filter(item => item.id !== id));
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', description: '', category: '' });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category
        });
        setShowAddModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setHeadsData(headsData.map(item =>
                item.id === editingId
                    ? { ...item, ...formData }
                    : item
            ));
        } else {
            const newHead = {
                id: headsData.length + 1,
                ...formData
            };
            setHeadsData([...headsData, newHead]);
        }
        setShowAddModal(false);
    };

    const handleCopy = () => {
        const text = filteredData.map(item => `${item.name}\t${item.description}\t${item.category}`).join('\n');
        navigator.clipboard.writeText(`Name\tDescription\tCategory\n${text}`);
        alert('Table data copied to clipboard!');
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Description', 'Category'];
        const rows = filteredData.map(item => [item.name, item.description, item.category]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'expense-heads.csv';
        link.click();
    };

    const handleExportExcel = () => {
        const headers = ['Name', 'Description', 'Category'];
        const rows = filteredData.map(item => [item.name, item.description, item.category]);
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ExpenseHeads');
        XLSX.writeFile(wb, 'expense-heads.xlsx');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Expense Heads Report', 14, 15);
        autoTable(doc, {
            head: [['Name', 'Description', 'Category']],
            body: filteredData.map(item => [item.name, item.description, item.category]),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [61, 94, 225] }
        });
        doc.save('expense-heads.pdf');
    };

    return (
        <div className="heads-page">
            {/* Page Header */}
            <div className="heads-page-header">
                <div className="heads-page-title">
                    <h1>Expense Heads</h1>
                    <nav className="heads-breadcrumb">
                        <span>Accounts</span>
                        <span className="separator">/</span>
                        <span className="current">Expense Heads</span>
                    </nav>
                </div>
                <button className="heads-add-btn blue" onClick={handleOpenAddModal}>
                    <IconPlus size={18} />
                    Add Expense Head
                </button>
            </div>

            {/* Add/Edit Expense Head Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header" style={{ background: '#3d5ee1' }}>
                            <h3>{isEditing ? 'Edit Expense Head' : 'Add Expense Head'}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Title <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Category</label>
                                <div className="select-with-icon">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.filter(c => c !== 'all').map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <IconChevronDown size={18} className="field-icon" />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    placeholder="Enter description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" style={{ background: '#3d5ee1' }}>
                                    {isEditing ? 'Save Changes' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search & Filter Row */}
            <div className="heads-filter-row">
                <div className="heads-search-box">
                    <IconSearch size={18} />
                    <input
                        type="text"
                        placeholder="Search expense heads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="heads-filter-right">
                    <div className="heads-select-wrapper">
                        <IconFilter size={14} className="heads-filter-icon" />
                        <select
                            className="heads-filter-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                        <IconChevronDown size={14} className="heads-select-chevron" />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="heads-table-card">
                <div className="heads-table-header">
                    <div className="table-header-left">
                        <div className="export-actions">
                            <button className="export-action-btn" onClick={handleCopy} title="Copy to Clipboard">
                                <IconCopy size={16} />
                                <span>Copy</span>
                            </button>
                            <button className="export-action-btn" onClick={handleExportExcel} title="Export to Excel">
                                <IconFileSpreadsheet size={16} />
                                <span>Excel</span>
                            </button>
                            <button className="export-action-btn" onClick={handleExportCSV} title="Export to CSV">
                                <IconFileTypeCsv size={16} />
                                <span>CSV</span>
                            </button>
                            <button className="export-action-btn" onClick={handleExportPDF} title="Export to PDF">
                                <IconFileTypePdf size={16} />
                                <span>PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="heads-table-body">
                    <div className="table-container">
                        <table className="heads-data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="heads-item-name">{item.name}</span>
                                        </td>
                                        <td>
                                            <span className="heads-item-desc">{item.description}</span>
                                        </td>
                                        <td>
                                            <span className="heads-category-badge purple">{item.category}</span>
                                        </td>
                                        <td>
                                            <div className="heads-action-buttons">
                                                <button className="heads-action-btn edit" title="Edit" onClick={() => handleOpenEditModal(item)}>
                                                    <IconEdit size={16} />
                                                </button>
                                                <button className="heads-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="heads-table-footer">
                        <span className="heads-showing-text">
                            Showing {filteredData.length} of {headsData.length} entries
                        </span>
                        <div className="heads-pagination">
                            <button className="heads-page-btn" disabled>Previous</button>
                            <button className="heads-page-btn active">1</button>
                            <button className="heads-page-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHeads;
