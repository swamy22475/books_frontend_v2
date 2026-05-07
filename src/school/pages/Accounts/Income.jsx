import React, { useState, useRef, useEffect } from 'react';
import {
    IconPlus, IconSearch, IconFilter, IconDownload, IconEdit, IconTrash,
    IconTrendingUp, IconWallet, IconCalendar, IconFileText, IconEye, IconChevronDown,
    IconFileTypePdf, IconFileSpreadsheet
} from '@tabler/icons-react';
import { exportToCSV, exportToPDF, printTable } from '../../../utils/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Accounts.css';

const Income = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterHead, setFilterHead] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
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

    const incomeColumns = ['invoiceNo', 'name', 'head', 'date', 'amount'];
    const incomeColumnLabels = {
        invoiceNo: 'Invoice No',
        name: 'Name',
        head: 'Income Head',
        date: 'Date',
        amount: 'Amount'
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Income Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        const headers = incomeColumns.map(col => incomeColumnLabels[col]);
        const rows = filteredData.map(item =>
            incomeColumns.map(col => {
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

        doc.save('income-report.pdf');
        setShowExportMenu(false);
    };

    const handleExportExcel = () => {
        const headers = incomeColumns.map(col => incomeColumnLabels[col]);
        const rows = filteredData.map(item =>
            incomeColumns.map(col => item[col] ?? '')
        );
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = incomeColumns.map(() => ({ wch: 20 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Income');
        XLSX.writeFile(wb, 'income-report.xlsx');
        setShowExportMenu(false);
    };
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        amount: '',
        paymentMethod: '',
        description: '',
        utrId: '',
        transactionId: '',
        senderBank: '',
        receiverBank: ''
    });

    // Sample income data
    const [incomeData, setIncomeData] = useState([
        {
            id: 1,
            name: 'Tuition Fees - Class 10',
            head: 'Tuition Fees',
            date: '2024-02-01',
            invoiceNo: 'INV-001',
            amount: 125000,
            description: 'Monthly tuition fees collection'
        },
        {
            id: 2,
            name: 'Transport Fee Collection',
            head: 'Transport Fees',
            date: '2024-02-02',
            invoiceNo: 'INV-002',
            amount: 45000,
            description: 'Bus fee for February 2024'
        },
        {
            id: 3,
            name: 'Library Fine Collection',
            head: 'Library',
            date: '2024-02-03',
            invoiceNo: 'INV-003',
            amount: 2500,
            description: 'Late book return fines'
        },
        {
            id: 4,
            name: 'Hostel Fee - Boys Wing',
            head: 'Hostel Fees',
            date: '2024-02-04',
            invoiceNo: 'INV-004',
            amount: 85000,
            description: 'Monthly hostel charges'
        },
        {
            id: 5,
            name: 'Lab Equipment Donation',
            head: 'Donations',
            date: '2024-02-05',
            invoiceNo: 'INV-005',
            amount: 50000,
            description: 'Donation for science lab equipment'
        },
        {
            id: 6,
            name: 'Admission Fee - New Students',
            head: 'Admission Fees',
            date: '2024-02-06',
            invoiceNo: 'INV-006',
            amount: 200000,
            description: 'New admission fee collection'
        }
    ]);

    const incomeHeads = ['all', 'Tuition Fees', 'Transport Fees', 'Library', 'Hostel Fees', 'Donations', 'Admission Fees'];

    const filteredData = incomeData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesHead = filterHead === 'all' || item.head === filterHead;
        return matchesSearch && matchesHead;
    });

    const totalIncome = filteredData.reduce((sum, item) => sum + item.amount, 0);

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

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            name: '',
            date: '',
            amount: '',
            paymentMethod: '',
            description: '',
            utrId: '',
            transactionId: '',
            senderBank: '',
            receiverBank: ''
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setFormData({
            name: item.name,
            date: item.date,
            amount: item.amount,
            paymentMethod: 'CASH', // Mocking payment method
            description: item.description,
            utrId: '',
            transactionId: '',
            senderBank: '',
            receiverBank: ''
        });
        setShowAddModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setIncomeData(incomeData.map(item =>
                item.id === editingId
                    ? { ...item, name: formData.name, date: formData.date, amount: Number(formData.amount), description: formData.description }
                    : item
            ));
        } else {
            const newIncome = {
                id: incomeData.length + 1,
                name: formData.name,
                head: 'General', // Default head
                date: formData.date,
                invoiceNo: `INV-${String(incomeData.length + 1).padStart(3, '0')}`, // Auto-generate invoice number
                amount: Number(formData.amount),
                description: formData.description
            };
            setIncomeData([...incomeData, newIncome]);
        }
        setShowAddModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setIncomeData(incomeData.filter(item => item.id !== id));
        }
    };

    return (
        <div className="income-page">
            {/* Page Header */}
            <div className="income-page-header">
                <div className="income-page-title">
                    <h1>Income</h1>
                    <nav className="income-breadcrumb">
                        <span>Accounts</span>
                        <span className="separator">/</span>
                        <span className="current">Income</span>
                    </nav>
                </div>
                <button className="income-add-btn" onClick={handleOpenAddModal}>
                    <IconPlus size={18} />
                    Add Income
                </button>
            </div>

            {/* Add/Edit Income Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Income' : 'Add Income'}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Income Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter income name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                <div className="form-group">
                                    <label>Date</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Amount</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            className="amount-input"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <div className="select-with-icon">
                                        <select
                                            className="payment-select"
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="UPI">UPI</option>
                                            <option value="BANK">BANK</option>
                                            <option value="CASH">CASH</option>
                                        </select>
                                        <IconChevronDown size={16} className="field-icon select-chevron" />
                                    </div>
                                </div>
                            </div>

                            {formData.paymentMethod === 'UPI' && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>UTR ID</label>
                                        <input
                                            type="text"
                                            placeholder="Enter UTR ID"
                                            value={formData.utrId}
                                            onChange={(e) => setFormData({ ...formData, utrId: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transaction ID</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Transaction ID"
                                            value={formData.transactionId}
                                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'BANK' && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Receiver's Bank</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Receiver's Bank"
                                                value={formData.receiverBank}
                                                onChange={(e) => setFormData({ ...formData, receiverBank: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Sender's Bank</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Sender's Bank"
                                                value={formData.senderBank}
                                                onChange={(e) => setFormData({ ...formData, senderBank: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>UTR ID</label>
                                            <input
                                                type="text"
                                                placeholder="Enter UTR ID"
                                                value={formData.utrId}
                                                onChange={(e) => setFormData({ ...formData, utrId: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Transaction ID</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Transaction ID"
                                                value={formData.transactionId}
                                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
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
                                <button type="submit" className="btn-submit">
                                    {isEditing ? 'Save Changes' : 'Add Income'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="income-stats-row">
                <div className="income-stat-card">
                    <div className="income-stat-icon green">
                        <IconTrendingUp size={22} />
                    </div>
                    <div className="income-stat-info">
                        <span className="income-stat-label">Total Income</span>
                        <h3 className="income-stat-value">{formatCurrency(totalIncome)}</h3>
                    </div>
                </div>
                <div className="income-stat-card">
                    <div className="income-stat-icon blue">
                        <IconFileText size={22} />
                    </div>
                    <div className="income-stat-info">
                        <span className="income-stat-label">Total Transactions</span>
                        <h3 className="income-stat-value">{filteredData.length}</h3>
                    </div>
                </div>
                <div className="income-stat-card">
                    <div className="income-stat-icon orange">
                        <IconWallet size={22} />
                    </div>
                    <div className="income-stat-info">
                        <span className="income-stat-label">Income Heads</span>
                        <h3 className="income-stat-value">{incomeHeads.length - 1}</h3>
                    </div>
                </div>
                <div className="income-stat-card">
                    <div className="income-stat-icon purple">
                        <IconCalendar size={22} />
                    </div>
                    <div className="income-stat-info">
                        <span className="income-stat-label">Monthly Income</span>
                        <h3 className="income-stat-value">{formatCurrency(totalIncome * 0.8)}</h3>
                    </div>
                </div>
            </div>

            {/* Search & Filter Row */}
            <div className="income-filter-row">
                <div className="income-search-box">
                    <IconSearch size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or invoice..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="income-filter-right">
                    <div className="income-select-wrapper">
                        <select
                            className="income-filter-select"
                            value={filterHead}
                            onChange={(e) => setFilterHead(e.target.value)}
                        >
                            {incomeHeads.map((head, idx) => (
                                <option key={idx} value={head}>
                                    {head === 'all' ? 'All Income Heads' : head}
                                </option>
                            ))}
                        </select>
                        <IconChevronDown size={14} className="income-select-chevron" />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="income-table-card">
                <div className="income-table-header">
                    <h5>Income List</h5>
                    <div className="income-header-actions">
                        <div className="export-dropdown-wrapper" ref={exportMenuRef}>
                            <button className="income-export-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
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
                <div className="income-table-body">
                    <div className="table-container">
                        <table className="income-data-table">
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Name</th>
                                    <th>Income Head</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="income-invoice-badge">{item.invoiceNo}</span>
                                        </td>
                                        <td>
                                            <div className="income-item-info">
                                                <span className="income-item-name">{item.name}</span>
                                                <span className="income-item-desc">{item.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="income-head-badge">{item.head}</span>
                                        </td>
                                        <td>
                                            <div className="income-date-cell">
                                                <IconCalendar size={14} />
                                                {formatDate(item.date)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="income-amount-cell">
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="income-action-buttons">
                                                <button className="income-action-btn edit" title="Edit" onClick={() => handleOpenEditModal(item)}>
                                                    <IconEdit size={16} />
                                                </button>
                                                <button className="income-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
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
                    <div className="income-table-footer">
                        <span className="income-showing-text">
                            Showing {filteredData.length} of {incomeData.length} entries
                        </span>
                        <div className="income-pagination">
                            <button className="income-page-btn" disabled>Previous</button>
                            <button className="income-page-btn active">1</button>
                            <button className="income-page-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Income;
