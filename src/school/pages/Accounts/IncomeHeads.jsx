import React, { useState } from 'react';
import {
    IconPlus, IconSearch, IconEdit, IconTrash,
    IconWallet, IconTag, IconNotes, IconChevronDown,
    IconCopy, IconFileSpreadsheet, IconFileTypeCsv, IconFileTypePdf
} from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Accounts.css';

const IncomeHeads = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [headsData, setHeadsData] = useState([
        { id: 1, name: 'Tuition Fees', description: 'Standard monthly tuition fees from students' },
        { id: 2, name: 'Transport Fees', description: 'Monthly transportation/bus charges' },
        { id: 3, name: 'Library', description: 'Library membership and late fines' },
        { id: 4, name: 'Hostel Fees', description: 'Residential and mess charges' },
        { id: 5, name: 'Donations', description: 'External grants and alumni donations' },
        { id: 6, name: 'Admission Fees', description: 'One-time admission fee for new joins' }
    ]);

    const filteredData = headsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this head?')) {
            setHeadsData(headsData.filter(item => item.id !== id));
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description
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
        const text = filteredData.map(item => `${item.name}\t${item.description}`).join('\n');
        navigator.clipboard.writeText(`Name\tDescription\n${text}`);
        alert('Table data copied to clipboard!');
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Description'];
        const rows = filteredData.map(item => [item.name, item.description]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'income-heads.csv';
        link.click();
    };

    const handleExportExcel = () => {
        const headers = ['Name', 'Description'];
        const rows = filteredData.map(item => [item.name, item.description]);
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'IncomeHeads');
        XLSX.writeFile(wb, 'income-heads.xlsx');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Income Heads Report', 14, 15);
        autoTable(doc, {
            head: [['Name', 'Description']],
            body: filteredData.map(item => [item.name, item.description]),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [61, 94, 225] }
        });
        doc.save('income-heads.pdf');
    };

    return (
        <div className="heads-page">
            {/* Page Header */}
            <div className="heads-page-header">
                <div className="heads-page-title">
                    <h1>Income Heads</h1>
                    <nav className="heads-breadcrumb">
                        <span>Accounts</span>
                        <span className="separator">/</span>
                        <span className="current">Income Heads</span>
                    </nav>
                </div>
                <button className="heads-add-btn blue" onClick={handleOpenAddModal}>
                    <IconPlus size={18} />
                    Add Income Head
                </button>
            </div>

            {/* Add/Edit Income Head Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header" style={{ background: '#3d5ee1' }}>
                            <h3>{isEditing ? 'Edit Income Head' : 'Add Income Head'}</h3>
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

            {/* Search Row */}
            <div className="heads-filter-row">
                <div className="heads-search-box">
                    <IconSearch size={18} />
                    <input
                        type="text"
                        placeholder="Search income heads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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

export default IncomeHeads;
