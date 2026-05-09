import React, { useState, useRef, useEffect } from 'react';
import {
    IconPlus, IconSearch, IconFilter, IconDownload, IconEdit, IconTrash,
    IconTrendingDown, IconWallet, IconCalendar, IconFileText, IconEye, IconChevronDown,
    IconFileTypePdf, IconFileSpreadsheet
} from '@tabler/icons-react';
import { exportToCSV, exportToPDF, printTable } from '../../../utils/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Accounts.css';

const Expense = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterHead, setFilterHead] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const exportMenuRef = useRef(null);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const expenseColumns = ['invoiceNo', 'name', 'head', 'date', 'amount'];
    const expenseColumnLabels = {
        invoiceNo: 'Invoice No',
        name: 'Title',
        head: 'Expense Head',
        date: 'Date',
        amount: 'Amount'
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Expense Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        const headers = expenseColumns.map(col => expenseColumnLabels[col]);
        const rows = filteredData.map(item =>
            expenseColumns.map(col => {
                if (col === 'amount') return `₹${Number(item[col]).toLocaleString('en-IN')}`;
                return item[col] ?? '';
            })
        );

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [61, 94, 225], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4 },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        });

        doc.save('expense-report.pdf');
        setShowExportMenu(false);
    };

    const handleExportExcel = () => {
        const headers = expenseColumns.map(col => expenseColumnLabels[col]);
        const rows = filteredData.map(item =>
            expenseColumns.map(col => item[col] ?? '')
        );
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = expenseColumns.map(() => ({ wch: 20 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
        XLSX.writeFile(wb, 'expense-report.xlsx');
        setShowExportMenu(false);
    };
    const [formData, setFormData] = useState({
        invoiceNo: '',
        title: '',
        head: '',
        date: '',
        paymentMode: '',
        bankDetails: '',
        amount: '',
        description: ''
    });

    const bankNames = [
        'State Bank of India',
        'HDFC Bank',
        'ICICI Bank',
        'Punjab National Bank',
        'Bank of Baroda',
        'Axis Bank',
        'Canara Bank',
        'Union Bank of India',
        'Indian Bank',
        'Kotak Mahindra Bank'
    ];

    // Sample expense data
    const [expenseData, setExpenseData] = useState([
        {
            id: 1,
            name: 'Electricity Bill - Jan 2024',
            head: 'Utility Bills',
            date: '2024-02-01',
            invoiceNo: 'EXP-001',
            amount: 15600,
            description: 'Monthly electricity charges for main building'
        },
        {
            id: 2,
            name: 'Stationery Purchase',
            head: 'Office Supplies',
            date: '2024-02-02',
            invoiceNo: 'EXP-002',
            amount: 4500,
            description: 'Pens, papers, and files for office use'
        },
        {
            id: 3,
            name: 'Teacher Salaries - Jan',
            head: 'Salaries',
            date: '2024-02-03',
            invoiceNo: 'EXP-003',
            amount: 450000,
            description: 'Monthly salary distribution for teaching staff'
        },
        {
            id: 4,
            name: 'Plumbing Repairs',
            head: 'Maintenance',
            date: '2024-02-04',
            invoiceNo: 'EXP-004',
            amount: 2500,
            description: 'Fixed leaking pipes in secondary wing'
        },
        {
            id: 5,
            name: 'Internet Subscription',
            head: 'Utility Bills',
            date: '2024-02-05',
            invoiceNo: 'EXP-005',
            amount: 8000,
            description: 'High-speed fiber connection charges'
        },
        {
            id: 6,
            name: 'Sports Equipment',
            head: 'Sports',
            date: '2024-02-06',
            invoiceNo: 'EXP-006',
            amount: 25000,
            description: 'New footballs and cricket kits'
        }
    ]);

    const expenseHeads = ['all', 'Utility Bills', 'Office Supplies', 'Salaries', 'Maintenance', 'Sports'];

    const filteredData = expenseData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesHead = filterHead === 'all' || item.head === filterHead;
        return matchesSearch && matchesHead;
    });

    const totalExpense = filteredData.reduce((sum, item) => sum + item.amount, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            setExpenseData(expenseData.filter(item => item.id !== id));
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            invoiceNo: `EXP-${String(expenseData.length + 1).padStart(3, '0')}`,
            title: '',
            head: '',
            date: new Date().toISOString().split('T')[0],
            paymentMode: '',
            bankDetails: '',
            amount: '',
            description: ''
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setFormData({
            invoiceNo: item.invoiceNo,
            title: item.name,
            head: item.head,
            date: item.date,
            paymentMode: item.paymentMode || '',
            bankDetails: item.bankDetails || '',
            amount: item.amount,
            description: item.description
        });
        setShowAddModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setExpenseData(expenseData.map(item =>
                item.id === editingId
                    ? { ...item, name: formData.title, head: formData.head, date: formData.date, amount: Number(formData.amount), invoiceNo: formData.invoiceNo, description: formData.description }
                    : item
            ));
        } else {
            const nextId = expenseData.length > 0 ? Math.max(...expenseData.map(item => item.id)) + 1 : 1;
            const newExpense = {
                id: nextId,
                name: formData.title,
                head: formData.head,
                date: formData.date,
                invoiceNo: formData.invoiceNo,
                amount: Number(formData.amount),
                description: formData.description
            };
            setExpenseData([...expenseData, newExpense]);
        }
        setShowAddModal(false);
    };

    return (
        <div className="expense-page">
            {/* Page Header */}
            <div className="expense-page-header">
                <div className="expense-page-title">
                    <h1>Expense</h1>
                    <nav className="expense-breadcrumb">
                        <span>Accounts</span>
                        <span className="separator">/</span>
                        <span className="current">Expense</span>
                    </nav>
                </div>
                <button className="expense-add-btn" onClick={handleOpenAddModal}>
                    <IconPlus size={18} />
                    Add Expense
                </button>
            </div>

            {/* Add/Edit Expense Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header" style={{ background: '#3d5ee1' }}>
                            <h3>{isEditing ? 'Edit Expense' : 'Add Expense'}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Invoice No <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter invoice no"
                                    required
                                    value={formData.invoiceNo}
                                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Title <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter expense title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expense Head <span style={{ color: '#ea5455' }}>*</span></label>
                                <div className="select-with-icon">
                                    <select
                                        required
                                        value={formData.head}
                                        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                    >
                                        <option value="">Select Head</option>
                                        {expenseHeads.filter(h => h !== 'all').map((head, idx) => (
                                            <option key={idx} value={head}>{head}</option>
                                        ))}
                                    </select>
                                    <IconChevronDown size={18} className="field-icon" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Date <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Payment Mode <span style={{ color: '#ea5455' }}>*</span></label>
                                <div className="select-with-icon">
                                    <select
                                        required
                                        value={formData.paymentMode}
                                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value, bankDetails: '', amount: '' })}
                                    >
                                        <option value="">Select Payment Mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank</option>
                                    </select>
                                    <IconChevronDown size={18} className="field-icon" />
                                </div>
                            </div>
                            {formData.paymentMode === 'Bank' && (
                                <div className="form-group">
                                    <label>Bank Details <span style={{ color: '#ea5455' }}>*</span></label>
                                    <div className="select-with-icon">
                                        <select
                                            required
                                            value={formData.bankDetails}
                                            onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                                        >
                                            <option value="">Select Bank</option>
                                            {bankNames.map((bank, idx) => (
                                                <option key={idx} value={bank}>{bank}</option>
                                            ))}
                                        </select>
                                        <IconChevronDown size={18} className="field-icon" />
                                    </div>
                                </div>
                            )}
                            {formData.paymentMode && (
                                <div className="form-group">
                                    <label>Amount <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            )}
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    placeholder="Enter description"
                                    rows="3"
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

            {/* Stats Cards */}
            <div className="expense-stats-row">
                <div className="expense-stat-card">
                    <div className="expense-stat-icon blue">
                        <IconTrendingDown size={22} />
                    </div>
                    <div className="expense-stat-info">
                        <span className="expense-stat-label">Total Expense</span>
                        <h3 className="expense-stat-value">{formatCurrency(totalExpense)}</h3>
                    </div>
                </div>
                <div className="expense-stat-card">
                    <div className="expense-stat-icon blue">
                        <IconFileText size={22} />
                    </div>
                    <div className="expense-stat-info">
                        <span className="expense-stat-label">Total Transactions</span>
                        <h3 className="expense-stat-value">{filteredData.length}</h3>
                    </div>
                </div>
                <div className="expense-stat-card">
                    <div className="expense-stat-icon orange">
                        <IconWallet size={22} />
                    </div>
                    <div className="expense-stat-info">
                        <span className="expense-stat-label">Expense Heads</span>
                        <h3 className="expense-stat-value">{expenseHeads.length - 1}</h3>
                    </div>
                </div>
            </div>

            {/* Search & Filter Row */}
            <div className="expense-filter-row">
                <div className="expense-search-box">
                    <IconSearch size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or invoice..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="expense-filter-right">
                    <div className="expense-select-wrapper">
                        <select
                            className="expense-filter-select"
                            value={filterHead}
                            onChange={(e) => setFilterHead(e.target.value)}
                        >
                            {expenseHeads.map((head, idx) => (
                                <option key={idx} value={head}>
                                    {head === 'all' ? 'All Expense Heads' : head}
                                </option>
                            ))}
                        </select>
                        <IconChevronDown size={14} className="expense-select-chevron" />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="expense-table-card">
                <div className="expense-table-header">
                    <h5>Expense List</h5>
                    <div className="expense-header-actions">
                        <div className="export-dropdown-wrapper" ref={exportMenuRef}>
                            <button className="expense-export-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
                                <IconDownload size={16} />
                                Export
                            </button>
                            {showExportMenu && (
                                <div className="export-dropdown-menu">
                                    <button className="export-dropdown-item" onClick={handleExportPDF}>
                                        <IconFileTypePdf size={20} />
                                        Export as PDF
                                    </button>
                                    <button className="export-dropdown-item" onClick={handleExportExcel}>
                                        <IconFileSpreadsheet size={20} />
                                        Export as Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="expense-table-body">
                    <div className="table-container">
                        <table className="expense-data-table">
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Title</th>
                                    <th>Expense Head</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="expense-invoice-badge">{item.invoiceNo}</span>
                                        </td>
                                        <td>
                                            <div className="expense-item-info">
                                                <span className="expense-item-name">{item.name}</span>
                                                <span className="expense-item-desc">{item.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="expense-head-badge">{item.head}</span>
                                        </td>
                                        <td>
                                            <div className="expense-date-cell">
                                                <IconCalendar size={14} />
                                                {formatDate(item.date)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="expense-amount-cell">
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="expense-action-buttons">
                                                <button className="expense-action-btn view" title="View" onClick={() => setViewingItem(item)}>
                                                    <IconEye size={16} />
                                                </button>
                                                <button className="expense-action-btn edit" title="Edit" onClick={() => handleOpenEditModal(item)}>
                                                    <IconEdit size={16} />
                                                </button>
                                                <button className="expense-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
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
                    <div className="expense-table-footer">
                        <span className="expense-showing-text">
                            Showing {filteredData.length} of {expenseData.length} entries
                        </span>
                        <div className="expense-pagination">
                            <button className="expense-page-btn" disabled>Previous</button>
                            <button className="expense-page-btn active">1</button>
                            <button className="expense-page-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Expense Modal */}
            {viewingItem && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header" style={{ background: '#3d5ee1' }}>
                            <h3>Expense Details</h3>
                            <button className="close-btn" onClick={() => setViewingItem(null)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #e9ecef)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Invoice No</span>
                                    <span style={{ fontWeight: 600, color: '#3d5ee1' }}>{viewingItem.invoiceNo}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #e9ecef)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Title</span>
                                    <span style={{ color: 'var(--text-primary, #333448)' }}>{viewingItem.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #e9ecef)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Expense Head</span>
                                    <span className="expense-head-badge">{viewingItem.head}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #e9ecef)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Date</span>
                                    <span style={{ color: 'var(--text-primary, #333448)' }}>{formatDate(viewingItem.date)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #e9ecef)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Amount</span>
                                    <span style={{ fontWeight: 700, color: '#ea5455', fontSize: '16px' }}>{formatCurrency(viewingItem.amount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary, #6e6b7b)' }}>Description</span>
                                    <span style={{ color: 'var(--text-primary, #333448)', textAlign: 'right', maxWidth: '60%' }}>{viewingItem.description}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-cancel" onClick={() => setViewingItem(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expense;
