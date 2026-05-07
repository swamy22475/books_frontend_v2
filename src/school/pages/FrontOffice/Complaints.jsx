import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconCopy, IconFileText,
    IconFileSpreadsheet, IconPrinter, IconEye, IconPencil,
    IconTrash, IconChevronDown, IconFilter, IconUser,
    IconClock, IconCalendar, IconAlertCircle, IconId, IconPhone, IconIdBadge
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';
import '../Transport/ManageStudentTransport.css';
import './Complaints.css';

const SEED_COMPLAINTS = [
    {
        id: 1,
        complaintNo: 'COM-001',
        type: 'General',
        source: 'Online',
        name: 'Amit Sharma',
        phone: '9876543210',
        date: '2026-02-20',
        description: 'Need better lighting in the hallway.',
        status: 'Open'
    },
    {
        id: 2,
        complaintNo: 'COM-002',
        type: 'Academic',
        source: 'In Person',
        name: 'Suman Lata',
        phone: '9876543211',
        date: '2026-02-18',
        description: 'Course material for Physics not received.',
        status: 'In Progress'
    },
    {
        id: 3,
        complaintNo: 'COM-003',
        type: 'Infrastructure',
        source: 'Phone',
        name: 'Rajesh Kumar',
        phone: '9876543212',
        date: '2026-02-15',
        description: 'Water cooler near room 204 not working.',
        status: 'Resolved'
    },
    {
        id: 4,
        complaintNo: 'COM-004',
        type: 'Transportation',
        source: 'Email',
        name: 'Pooja Singh',
        phone: '9876543213',
        date: '2026-02-12',
        description: 'Bus 5 was late by 20 minutes.',
        status: 'Closed'
    }
];

const Complaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState(SEED_COMPLAINTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        complaintType: '',
        source: '',
        name: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        actionTaken: '',
        assigned: '',
        status: 'Open'
    });

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Column configuration for exports
    const exportCols = ['complaintNo', 'type', 'source', 'name', 'phone', 'date', 'status'];
    const colLabels = {
        complaintNo: 'Complaint No',
        type: 'Type',
        source: 'Source',
        name: 'Name',
        phone: 'Phone',
        date: 'Date',
        status: 'Status'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            setComplaints(complaints.map(c => c.id === editId ? {
                ...c,
                type: formData.complaintType,
                source: formData.source,
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                description: formData.description,
                actionTaken: formData.actionTaken,
                assigned: formData.assigned,
                status: formData.status
            } : c));
        } else {
            const newComplaint = {
                id: complaints.length + 1,
                complaintNo: `COM-00${complaints.length + 1}`,
                type: formData.complaintType,
                source: formData.source,
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                description: formData.description,
                actionTaken: formData.actionTaken,
                assigned: formData.assigned,
                status: formData.status
            };
            setComplaints([newComplaint, ...complaints]);
        }
        setShowAddModal(false);
    };

    const handleEdit = (complaint) => {
        setIsEditing(true);
        setEditId(complaint.id);
        setFormData({
            complaintType: complaint.type,
            source: complaint.source,
            name: complaint.name,
            phone: complaint.phone,
            date: complaint.date,
            description: complaint.description,
            actionTaken: complaint.actionTaken || '',
            assigned: complaint.assigned || '',
            status: complaint.status || 'Open'
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            setComplaints(complaints.filter(c => c.id !== id));
        }
    };

    const handleView = (complaint) => {
        setViewData(complaint);
        setShowViewModal(true);
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            complaintType: '',
            source: '',
            name: '',
            phone: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            actionTaken: '',
            assigned: '',
            status: 'Open'
        });
        setShowAddModal(true);
    };

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [complaints, searchTerm]);

    /* Toolbar Actions */
    const onCopy = () => {
        copyToClipboard(filteredComplaints, exportCols, colLabels).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const onCSV = () => exportToCSV(filteredComplaints, exportCols, colLabels, 'Complaints');
    const onExcel = () => exportToExcel(filteredComplaints, exportCols, colLabels, 'Complaints');
    const onPDF = () => exportToPDF(filteredComplaints, exportCols, colLabels, 'Complaints', 'Complaints List');
    const onPrint = () => printTable(filteredComplaints, exportCols, colLabels, 'Complaints Report');

    const updateStatus = (id, newStatus) => {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open':
                return { color: '#e11d48' };
            case 'In Progress':
                return { color: '#0369a1' };
            case 'Resolved':
                return { color: '#16a34a' };
            case 'Closed':
                return { color: '#475569' };
            default:
                return { color: '#475569' };
        }
    };

    return (
        <div className="student-list-page transport-page complaints-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Complaints</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/complaints" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Complaints</Link>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button
                        className="btn btn-primary"
                        style={{
                            background: 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(61, 94, 225, 0.2)'
                        }}
                        onClick={handleOpenAddModal}
                    >
                        <IconPlus size={18} /> Add Complaint
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Complaint List</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            className="search-input-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="export-button-group">
                        <button className={`export-btn ${copied ? 'text-emerald-600 font-bold' : ''}`} onClick={onCopy}>
                            {copied ? '✓ Copied' : 'Copy'}
                        </button>
                        <button className="export-btn" onClick={onCSV}>CSV</button>
                        <button className="export-btn" onClick={onExcel}>Excel</button>
                        <button className="export-btn" onClick={onPDF}>PDF</button>
                        <button className="export-btn" onClick={onPrint}>Print</button>
                        <div className="filter-dropdown-btn" onClick={() => setShowFilter(!showFilter)} style={{ position: 'relative' }}>
                            <IconFilter size={16} />
                            <span>Filter</span>
                            <IconChevronDown size={14} style={{ transform: showFilter ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />

                            {showFilter && (
                                <div className="filter-dropdown-content shadow-lg" style={{
                                    position: 'absolute', top: '120%', right: 0, background: 'white',
                                    padding: '15px', borderRadius: '12px', width: '250px', zIndex: 100,
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <h6 className="text-xs font-bold text-slate-400 uppercase mb-3">Filter By Type</h6>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input type="checkbox" checked /> <span className="text-sm">Academic</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input type="checkbox" checked /> <span className="text-sm">Infrastructure</span>
                                        </label>
                                        <div className="border-t border-slate-100 my-2 pt-2">
                                            <button className="btn btn-primary w-full py-2 text-xs" style={{ background: '#7367f0', color: 'white' }}>Apply Filters</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="table-wrap px-0">
                    <table className="premium-table-v2">
                        <thead>
                            <tr>
                                <th>Complaint No</th>
                                <th>Type</th>
                                <th>Source</th>
                                <th>Complainant Name</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map((c, index) => (
                                <tr key={c.id} className="table-row-v2" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                                    <td>
                                        <div className="font-bold text-indigo-600">{c.complaintNo}</div>
                                    </td>
                                    <td>
                                        <div className="text-slate-700 font-medium">{c.type}</div>
                                    </td>
                                    <td>
                                        <div className="text-slate-600 text-xs font-semibold">{c.source}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-start gap-2 px-4 whitespace-nowrap">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                <IconUser size={16} />
                                            </div>
                                            <span className="font-bold text-slate-700">{c.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-slate-500">{c.phone}</div>
                                    </td>
                                    <td>
                                        <div className="text-slate-600 text-xs font-medium">{c.date}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center">
                                            <span
                                                className="text-sm font-bold uppercase tracking-wider"
                                                style={getStatusStyle(c.status)}
                                            >
                                                {c.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none' }}
                                                title="View"
                                                onClick={() => handleView(c)}
                                            ><IconEye size={18} stroke={2} /></button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none' }}
                                                title="Edit"
                                                onClick={() => handleEdit(c)}
                                            ><IconPencil size={18} stroke={2} /></button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none' }}
                                                title="Delete"
                                                onClick={() => handleDelete(c.id)}
                                            ><IconTrash size={18} stroke={2} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex items-center justify-between text-[13px] text-gray-500 border-t border-slate-100 bg-slate-50/30">
                    <span>Showing 1 to {filteredComplaints.length} of {filteredComplaints.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Premium Add/Edit Complaint Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 2000, padding: '20px',
                        }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="view-modal relative"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#ffffff', width: '700px', maxWidth: '100%',
                                borderRadius: '24px', overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            }}
                        >
                            {/* Decorative background element */}
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="view-modal-header relative z-10"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', padding: '24px 32px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{isEditing ? 'Edit Complaint' : 'Add Complaint'}</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Fill out the information below</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >✕</motion.button>
                            </motion.div>

                            <form onSubmit={handleSave} className="view-modal-body relative z-10" style={{ padding: '32px', background: '#ffffff' }}>
                                <div className="flex flex-col gap-6 mb-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complaint Type *</label>
                                            </div>
                                            <select name="complaintType" value={formData.complaintType} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer" required onChange={handleInputChange}>
                                                <option value="">Select</option>
                                                <option value="Academic">Academic</option>
                                                <option value="Infrastructure">Infrastructure</option>
                                                <option value="General">General</option>
                                                <option value="Transportation">Transportation</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconUser size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source *</label>
                                            </div>
                                            <select name="source" value={formData.source} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer" required onChange={handleInputChange}>
                                                <option value="">Select</option>
                                                <option value="Online">Online</option>
                                                <option value="In Person">In Person</option>
                                                <option value="Phone">Phone</option>
                                                <option value="Email">Email</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconIdBadge size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complainant Name *</label>
                                            </div>
                                            <input type="text" name="name" value={formData.name} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required onChange={handleInputChange} />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
                                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconPhone size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                                            </div>
                                            <input type="text" name="phone" value={formData.phone} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconUser size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned To</label>
                                            </div>
                                            <input type="text" name="assigned" value={formData.assigned} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconCalendar size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date *</label>
                                            </div>
                                            <input type="date" name="date" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required value={formData.date} onChange={handleInputChange} />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 20 }}
                                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Taken</label>
                                            </div>
                                            <input type="text" name="actionTaken" value={formData.actionTaken} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                            </div>
                                            <select name="status" value={formData.status || 'Open'} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer" onChange={handleInputChange}>
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                                    className="flex flex-col gap-2 mb-6 ml-1"
                                >
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <IconFileText size={16} />
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                    </div>
                                    <textarea name="description" value={formData.description} className="w-full min-h-[60px] p-0 bg-transparent text-[14px] font-medium text-slate-700 outline-none border-0 border-b border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all resize-y" placeholder="Describe the complaint..." onChange={handleInputChange}></textarea>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 20 }}
                                    className="flex flex-col gap-2 mb-6 ml-1"
                                >
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attach Document</span>
                                    <motion.div
                                        whileHover={{ scale: 1.02, borderColor: '#818cf8' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="border border-dashed border-indigo-200 bg-indigo-50/20 rounded-xl p-4 text-center text-indigo-400 transition-colors hover:bg-indigo-50/50 cursor-pointer flex flex-col items-center justify-center gap-2 w-full max-w-[250px]"
                                    >
                                        <IconFileText size={20} />
                                        <div className="text-[12px] font-medium">Drag and drop or click</div>
                                    </motion.div>
                                </motion.div>


                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                                    className="flex justify-center pt-6 border-t border-slate-100"
                                >
                                    <motion.button
                                        type="submit"
                                        whileHover={{ y: -2, boxShadow: '0 10px 32px rgba(139, 92, 246, 0.35)' }}
                                        whileTap={{ scale: 0.96 }}
                                        style={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '16px',
                                            padding: '12px 40px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            letterSpacing: '0.03em',
                                            cursor: 'pointer',
                                            boxShadow: '0 6px 24px rgba(139, 92, 246, 0.3)',
                                            minWidth: '160px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        {isEditing ? 'Save Changes' : 'Save Complaint'}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Modal */}
            <AnimatePresence>
                {showViewModal && viewData && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 2000, padding: '20px',
                        }}
                        onClick={() => setShowViewModal(false)}
                    >
                        <motion.div
                            className="view-modal relative"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#ffffff', width: '550px', maxWidth: '100%',
                                borderRadius: '24px', overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            }}
                        >
                            {/* Decorative background element */}
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="view-modal-header relative z-10"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', padding: '24px 32px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Complaint Details</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Information recorded at front office</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowViewModal(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >✕</motion.button>
                            </motion.div>

                            <div className="view-modal-body relative z-10" style={{ padding: '32px', background: '#ffffff' }}>
                                <div className="flex flex-col gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                                        className="flex items-center gap-5 pb-6 border-b border-slate-100"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                            className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-500 rounded-full flex justify-center items-center shadow-inner border border-indigo-100/50"
                                        >
                                            <IconUser size={32} stroke={1.5} />
                                        </motion.div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 m-0 mb-1.5">{viewData.name}</h4>
                                            <p className="text-sm text-slate-500 m-0 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                Complaint No: <span className="font-semibold text-slate-700">{viewData.complaintNo}</span>
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
                                        className="grid grid-cols-2 gap-y-6 gap-x-4 px-2"
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.type}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconUser size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.source || '—'}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconPhone size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.phone || '—'}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconCalendar size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.date}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconUser size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned To</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.assigned || '—'}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                                <IconAlertCircle size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.status}</span>
                                        </div>
                                    </motion.div>

                                    {viewData.actionTaken && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                            className="flex flex-col px-2 mt-2"
                                        >
                                            <div className="flex items-center gap-2 mb-1.5 text-emerald-500">
                                                <IconAlertCircle size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Action Taken</span>
                                            </div>
                                            <span className="text-[15px] text-slate-700 font-semibold">{viewData.actionTaken}</span>
                                        </motion.div>
                                    )}

                                    {viewData.description && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2 mx-2"
                                        >
                                            <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                                <IconFileText size={18} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</span>
                                            </div>
                                            <p className="text-sm text-slate-600 m-0 leading-relaxed">{viewData.description}</p>
                                        </motion.div>
                                    )}

                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="flex justify-end pt-6 mt-4 border-t border-slate-100"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowViewModal(false)}
                                        className="btn px-6 py-2 rounded-xl font-semibold"
                                        style={{ background: '#f1f5f9', color: '#475569', border: 'none' }}
                                    >
                                        Close
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Complaints;
