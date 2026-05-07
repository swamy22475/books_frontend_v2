import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconSearch, IconCopy, IconFileText,
    IconPrinter, IconEye, IconPencil,
    IconTrash, IconCloudUpload,
    IconCalendar, IconId, IconUser, IconPhone, IconAlertCircle,
    IconPackage, IconScale, IconTruck, IconChevronLeft
} from '@tabler/icons-react';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';
import '../Transport/ManageStudentTransport.css';
import './PostalRecords.css';

const SEED_POSTAL_RECEIVE = [
    { id: 1, refNo: 'RCV87546', receiveDate: '2026-02-19', from: 'Auditor General', to: 'Account Section', address: '45 Finance Ave, Center', phone: '9988776655', postalType: 'Registered Post', trackingNo: 'RP987654321IN', description: 'Rule-Book', receivedBy: 'John Doe (Accountant)', status: 'Received', remarks: 'Received in good condition' },
    { id: 2, refNo: 'RCV87340', receiveDate: '2026-02-26', from: 'Telephone Office', to: 'Admin Department', address: '12 Telco Rd, North', phone: '9876543210', postalType: 'Ordinary Post', trackingNo: '', description: 'Monthly Bill', receivedBy: 'Jane Smith (Receptionist)', status: 'Pending', remarks: 'Awaiting signature from admin' },
];

const STAFF_LIST = [
    'John Doe (Accountant)',
    'Jane Smith (Receptionist)',
    'Mark Johnson (Admin)',
    'Sarah Williams (Principal)'
];

const PostalReceive = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState(SEED_POSTAL_RECEIVE);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [copied, setCopied] = useState(false);

    // Auto generate reference number function
    const generateRefNo = () => 'RCV' + Math.floor(10000 + Math.random() * 90000);

    const initialFormState = {
        refNo: generateRefNo(),
        receiveDate: new Date().toISOString().split('T')[0],
        from: '',
        to: '',
        address: '',
        phone: '',
        postalType: '',
        trackingNo: '',
        description: '',
        receivedBy: '',
        status: 'Received',
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const exportCols = ['refNo', 'receiveDate', 'from', 'to', 'postalType', 'trackingNo', 'receivedBy', 'status'];
    const colLabels = { refNo: 'Reference No', receiveDate: 'Receive Date', from: 'From', to: 'To', postalType: 'Type', trackingNo: 'Tracking No', receivedBy: 'Received By', status: 'Status' };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            setRecords(records.map(r => r.id === editId ? { ...r, ...formData } : r));
            setShowEditModal(false);
            setIsEditing(false);
            setEditId(null);
        } else {
            const newRecord = { id: Date.now(), ...formData };
            setRecords([newRecord, ...records]);
        }
        setFormData({ ...initialFormState, refNo: generateRefNo() });
    };

    const handleReset = () => {
        setFormData({ ...initialFormState, refNo: generateRefNo() });
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setEditId(record.id);
        setFormData(record);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this postal record?')) {
            setRecords(records.filter(r => r.id !== id));
        }
    };

    const handleView = (record) => {
        setViewData(record);
        setShowViewModal(true);
    };

    const onCloseEditModal = () => {
        setShowEditModal(false);
        setIsEditing(false);
        setEditId(null);
        handleReset();
    };

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = (r.from.toLowerCase().includes(searchTerm.toLowerCase()) || r.to.toLowerCase().includes(searchTerm.toLowerCase()) || r.refNo.toLowerCase().includes(searchTerm.toLowerCase()) || r.trackingNo.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDate = filterDate ? r.receiveDate === filterDate : true;
            const matchesStatus = filterStatus ? r.status === filterStatus : true;
            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [records, searchTerm, filterDate, filterStatus]);

    const onCopy = () => {
        copyToClipboard(filteredRecords, exportCols, colLabels).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const onCSV = () => exportToCSV(filteredRecords, exportCols, colLabels, 'Postal_Receive_Records');
    const onExcel = () => exportToExcel(filteredRecords, exportCols, colLabels, 'Postal_Receive_Records');
    const onPDF = () => exportToPDF(filteredRecords, exportCols, colLabels, 'Postal_Receive_Records', 'Postal Receive Records List');
    const onPrint = () => printTable(filteredRecords, exportCols, colLabels, 'Postal Receive Records Report');

    return (
        <div className="student-list-page transport-page postal-records-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Postal Receive</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/postal" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Postal Records</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/postal-receive" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Postal Receive</Link>
                    </nav>
                </div>
            </div>

            <div className="postal-page-container fade-in">
                {/* Left Side: Add Form */}
                <div className="postal-form-card" style={{ flex: '0 0 400px' }}>
                    <div className="postal-form-header flex items-center gap-2">
                        <button onClick={() => navigate('/school/front-office/postal')} className="text-slate-500 hover:text-indigo-600 transition-colors bg-transparent border-0 p-0 cursor-pointer">
                            <IconChevronLeft size={20} />
                        </button>
                        <h5>Add Postal Receive</h5>
                    </div>
                    <form onSubmit={handleSave} className="postal-form-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <div className="postal-input-group">
                            <label className="postal-label">Reference No <span className="text-xs text-slate-400 font-normal">(Auto Generated)</span></label>
                            <input type="text" name="refNo" className="postal-input bg-slate-50" readOnly value={formData.refNo} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Receive Date <span className="required">*</span></label>
                            <input type="date" name="receiveDate" className="postal-input" required value={formData.receiveDate} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">From <span className="required">*</span></label>
                            <input type="text" name="from" className="postal-input" required value={formData.from} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">To (School Name / Dept) <span className="required">*</span></label>
                            <input type="text" name="to" className="postal-input" required value={formData.to} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Address</label>
                            <textarea name="address" className="postal-textarea" value={formData.address} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Phone Number</label>
                            <input type="text" name="phone" className="postal-input" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Courier / Postal Type</label>
                            <select name="postalType" className="postal-input" value={formData.postalType} onChange={handleInputChange}>
                                <option value="">Select Type</option>
                                <option value="Ordinary Post">Ordinary Post</option>
                                <option value="Speed Post">Speed Post</option>
                                <option value="Registered Post">Registered Post</option>
                                <option value="Courier">Courier</option>
                                <option value="Parcel">Parcel</option>
                            </select>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Tracking Number</label>
                            <input type="text" name="trackingNo" className="postal-input" value={formData.trackingNo} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Item Description</label>
                            <textarea name="description" className="postal-textarea" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Received By</label>
                            <select name="receivedBy" className="postal-input" value={formData.receivedBy} onChange={handleInputChange}>
                                <option value="">Select Staff</option>
                                {STAFF_LIST.map(staff => (
                                    <option key={staff} value={staff}>{staff}</option>
                                ))}
                            </select>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Status <span className="required">*</span></label>
                            <select name="status" className="postal-input" required value={formData.status} onChange={handleInputChange}>
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                            </select>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Attach Document</label>
                            <div className="postal-file-upload">
                                <IconCloudUpload size={24} color="#7367f0" style={{ marginBottom: '8px' }} />
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Drag and drop a file here or click</div>
                            </div>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Remarks</label>
                            <textarea name="remarks" className="postal-textarea" value={formData.remarks} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button type="button" onClick={() => navigate('/school/front-office/postal')} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Back</button>
                            <button type="button" onClick={handleReset} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Reset</button>
                            <button type="submit" className="flex-1 py-2.5 rounded-lg border-0 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">Save</button>
                        </div>
                    </form>
                </div>

                {/* Right Side: List Table */}
                <div className="postal-list-card">
                    <div className="postal-form-header">
                        <h5>Postal Receive List</h5>
                    </div>

                    <div className="table-toolbar-premium" style={{ padding: '16px 24px', flexWrap: 'wrap', gap: '16px' }}>
                        <div className="search-pill-wrapper flex-1 min-w-[200px]">
                            <IconSearch size={18} className="search-icon-pill" />
                            <input
                                type="text"
                                placeholder="Search by name, ref no, tracking no..."
                                className="search-input-pill"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 min-w-[200px]">
                            <input
                                type="date"
                                className="postal-input mb-0 h-[42px]"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                title="Filter by Date"
                            />
                            <select
                                className="postal-input mb-0 h-[42px]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                            </select>
                        </div>

                        <div className="export-button-group">
                            <button className={`export-btn ${copied ? 'text-emerald-600 font-bold' : ''}`} onClick={onCopy}>
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                            <button className="export-btn" onClick={onCSV}>CSV</button>
                            <button className="export-btn" onClick={onExcel}>Excel</button>
                            <button className="export-btn" onClick={onPDF}>PDF</button>
                            <button className="export-btn" onClick={onPrint}>Print</button>
                        </div>
                    </div>

                    <div className="table-wrap px-0">
                        <table className="premium-table-v2">
                            <thead>
                                <tr>
                                    <th>Ref No</th>
                                    <th>From</th>
                                    <th>Tracking No</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">No records found</td></tr>
                                ) : filteredRecords.map((r, index) => (
                                    <tr key={r.id} className="table-row-v2" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td><div className="text-slate-700 font-medium text-sm">{r.refNo}</div></td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-medium">{r.from}</span>
                                                <span className="text-slate-500 text-xs mt-0.5 max-w-[150px] truncate" title={r.postalType}>{r.postalType}</span>
                                            </div>
                                        </td>
                                        <td><div className="text-slate-600 font-medium text-sm">{r.trackingNo || 'N/A'}</div></td>
                                        <td><div className="text-slate-500 text-xs">{r.receiveDate}</div></td>
                                        <td>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${r.status === 'Received' ? 'text-emerald-600' :
                                                'text-amber-600'
                                                }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none', cursor: 'pointer' }}
                                                    title="View Details"
                                                    onClick={() => handleView(r)}
                                                ><IconEye size={16} stroke={2} /></button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none', cursor: 'pointer' }}
                                                    title="Edit"
                                                    onClick={() => handleEdit(r)}
                                                ><IconPencil size={16} stroke={2} /></button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none', cursor: 'pointer' }}
                                                    title="Delete"
                                                    onClick={() => handleDelete(r.id)}
                                                ><IconTrash size={16} stroke={2} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                        <span>Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} entries</span>
                    </div>
                </div>
            </div>

            {/* Premium Add/Edit Postal Record Modal */}
            {showEditModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000, padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="view-modal relative" style={{
                        background: '#ffffff', width: '800px', maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                        borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'center'
                    }}>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

                        <div className="view-modal-header relative z-10" style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', padding: '24px 32px', flexShrink: 0,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Edit Postal Receive Record</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Update the information for tracking {formData.refNo}</p>
                            </div>
                            <button
                                onClick={onCloseEditModal}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', backdropFilter: 'blur(4px)'
                                }}
                            >✕</button>
                        </div>

                        <form onSubmit={handleSave} className="view-modal-body relative z-10 flex-1 overflow-y-auto" style={{ padding: '32px', background: '#ffffff', scrollbarWidth: 'thin' }}>
                            <div className="flex flex-col gap-6 mb-6">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconId size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference No</label>
                                        </div>
                                        <input type="text" className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none" readOnly value={formData.refNo} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconUser size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">From *</label>
                                        </div>
                                        <input type="text" name="from" value={formData.from} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconUser size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To *</label>
                                        </div>
                                        <input type="text" name="to" value={formData.to} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receive Date *</label>
                                        </div>
                                        <input type="date" name="receiveDate" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required value={formData.receiveDate} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconPhone size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                                        </div>
                                        <input type="text" name="phone" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconPackage size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Postal Type</label>
                                        </div>
                                        <select name="postalType" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.postalType} onChange={handleInputChange}>
                                            <option value="">Select Type</option>
                                            <option value="Ordinary Post">Ordinary Post</option>
                                            <option value="Speed Post">Speed Post</option>
                                            <option value="Registered Post">Registered Post</option>
                                            <option value="Courier">Courier</option>
                                            <option value="Parcel">Parcel</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconTruck size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking No</label>
                                        </div>
                                        <input type="text" name="trackingNo" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.trackingNo} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconUser size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Received By</label>
                                        </div>
                                        <select name="receivedBy" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.receivedBy} onChange={handleInputChange}>
                                            <option value="">Select Staff</option>
                                            {STAFF_LIST.map(staff => (
                                                <option key={staff} value={staff}>{staff}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconAlertCircle size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status *</label>
                                        </div>
                                        <select name="status" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required value={formData.status} onChange={handleInputChange}>
                                            <option value="Pending">Pending</option>
                                            <option value="Received">Received</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <IconFileText size={16} />
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                                    </div>
                                    <textarea name="address" value={formData.address} className="w-full min-h-[60px] p-0 bg-transparent text-[14px] font-medium text-slate-700 outline-none border-0 border-b border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all resize-y" placeholder="Delivery address..." onChange={handleInputChange}></textarea>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <IconFileText size={16} />
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</label>
                                    </div>
                                    <textarea name="description" value={formData.description} className="w-full min-h-[60px] p-0 bg-transparent text-[14px] font-medium text-slate-700 outline-none border-0 border-b border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all resize-y" placeholder="Contents description..." onChange={handleInputChange}></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-8 text-amber-500">
                                <div className="flex items-center gap-2">
                                    <IconFileText size={16} />
                                    <label className="text-xs font-bold uppercase tracking-wider">Remarks</label>
                                </div>
                                <textarea name="remarks" value={formData.remarks} className="w-full min-h-[60px] p-0 bg-transparent text-[14px] font-medium text-slate-700 outline-none border-0 border-b border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all resize-y" placeholder="Add any additional tracking notes here..." onChange={handleInputChange}></textarea>
                            </div>

                            <div className="flex justify-end pt-5 border-t border-slate-100">
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && viewData && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000, padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="view-modal relative" style={{
                        background: '#ffffff', width: '650px', maxWidth: '100%',
                        borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'center'
                    }}>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

                        <div className="view-modal-header relative z-10" style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', padding: '24px 32px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Postal Receive Details</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Information recorded at front office</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', backdropFilter: 'blur(4px)'
                                }}
                            >✕</button>
                        </div>

                        <div className="view-modal-body relative z-10" style={{ padding: '32px', background: '#ffffff', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-500 rounded-full flex justify-center items-center shadow-inner border border-indigo-100/50">
                                            <IconPackage size={32} stroke={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 m-0 mb-1.5">{viewData.to}</h4>
                                            <p className="text-sm text-slate-500 m-0 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                Ref No: <span className="font-semibold text-slate-700">{viewData.refNo || 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-bold uppercase tracking-wider ${viewData.status === 'Received' ? 'text-emerald-600' :
                                            'text-amber-600'
                                            }`}>
                                            {viewData.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-y-6 gap-x-4 px-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconUser size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">From</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.from || '—'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Receive Date</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.receiveDate}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconTruck size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracking No</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.trackingNo || '—'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconPackage size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Postal Type</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.postalType || '—'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconUser size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Received By</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.receivedBy || '—'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconPhone size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</span>
                                        </div>
                                        <span className="text-[14px] text-slate-700 font-semibold">{viewData.phone || '—'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2 px-2">
                                    {viewData.address && (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</span>
                                            </div>
                                            <div className="text-[14px] text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{viewData.address}</div>
                                        </div>
                                    )}
                                    {viewData.description && (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconFileText size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</span>
                                            </div>
                                            <div className="text-[14px] text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{viewData.description}</div>
                                        </div>
                                    )}
                                </div>

                                {viewData.remarks && (
                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 mt-2 mx-2">
                                        <div className="flex items-center gap-2 mb-2 text-amber-500">
                                            <IconFileText size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Remarks</span>
                                        </div>
                                        <p className="text-sm text-slate-600 m-0 leading-relaxed">{viewData.remarks}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:bg-slate-200"
                                    style={{ background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostalReceive;
