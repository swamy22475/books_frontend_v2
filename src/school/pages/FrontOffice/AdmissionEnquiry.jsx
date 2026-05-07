import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconCopy, IconFileText,
    IconFileSpreadsheet, IconPrinter, IconEye, IconPencil,
    IconTrash, IconUser, IconCalendar, IconPhone,
    IconIdBadge, IconAlertCircle, IconTimelineEvent, IconFilter
} from '@tabler/icons-react';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';
import '../Transport/ManageStudentTransport.css';
import './AdmissionEnquiry.css';

const SEED_ENQUIRIES = [
    { id: 1, name: 'Rahul Sharma', phone: '9876543210', source: 'Website', date: '2026-02-20', followUpDate: '2026-02-25', status: 'Active', class: 'Grade 10' },
    { id: 2, name: 'Priya Patel', phone: '9876587654', source: 'Walk-in', date: '2026-02-21', followUpDate: '2026-02-28', status: 'Closed', class: 'Grade 8' },
    { id: 3, name: 'Amit Singh', phone: '9812345678', source: 'Reference', date: '2026-02-24', followUpDate: '2026-03-05', status: 'Active', class: 'Grade 5' },
];

const MOCK_TEACHERS = [
    'Mr. Amit Kumar',
    'Mrs. Anjali Sharma',
    'Ms. Priya Singh',
    'Mr. Rajesh Verma',
    'Mrs. Kavita Gupta',
    'Mr. Vikram Rathore'
];

const AdmissionEnquiry = () => {
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState(SEED_ENQUIRIES);
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(false);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', phone: '', address: '', description: '',
        date: new Date().toISOString().split('T')[0],
        followUpDate: '', source: '', reference: '',
        email: '', assigned: '', class: '', noOfChildren: ''
    });

    const exportCols = ['name', 'phone', 'source', 'date', 'followUpDate', 'status'];
    const colLabels = { name: 'Name', phone: 'Phone', source: 'Source', date: 'Enquiry Date', followUpDate: 'Next Follow Up Date', status: 'Status' };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            setEnquiries(enquiries.map(enq => enq.id === editId ? {
                ...enq,
                name: formData.name, phone: formData.phone,
                source: formData.source, date: formData.date,
                followUpDate: formData.followUpDate, class: formData.class,
                address: formData.address, description: formData.description,
                email: formData.email,
                assigned: formData.assigned, reference: formData.reference,
                noOfChildren: formData.noOfChildren
            } : enq));
        } else {
            const newEnquiry = {
                id: Date.now(),
                ...formData,
                status: 'Active'
            };
            setEnquiries([newEnquiry, ...enquiries]);
        }
        setShowAddModal(false);
    };

    const handleEdit = (enquiry) => {
        setIsEditing(true);
        setEditId(enquiry.id);
        setFormData({
            name: enquiry.name, phone: enquiry.phone,
            source: enquiry.source || '', date: enquiry.date,
            followUpDate: enquiry.followUpDate || '',
            class: enquiry.class || '', address: enquiry.address || '',
            description: enquiry.description || '',
            email: enquiry.email || '', assigned: enquiry.assigned || '',
            reference: enquiry.reference || '', noOfChildren: enquiry.noOfChildren || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            setEnquiries(enquiries.filter(e => e.id !== id));
        }
    };

    const handleView = (enquiry) => {
        setViewData(enquiry);
        setShowViewModal(true);
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            name: '', phone: '', address: '', description: '',
            date: new Date().toISOString().split('T')[0],
            followUpDate: '', source: '', reference: '',
            email: '', assigned: '', class: '', noOfChildren: ''
        });
        setShowAddModal(true);
    };

    const filteredEnquiries = useMemo(() => {
        return enquiries.filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.source?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [enquiries, searchTerm]);

    const onCopy = () => {
        copyToClipboard(filteredEnquiries, exportCols, colLabels).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const onCSV = () => exportToCSV(filteredEnquiries, exportCols, colLabels, 'Admission_Enquiry');
    const onExcel = () => exportToExcel(filteredEnquiries, exportCols, colLabels, 'Admission_Enquiry');
    const onPDF = () => exportToPDF(filteredEnquiries, exportCols, colLabels, 'Admission_Enquiry', 'Admission Enquiry List');
    const onPrint = () => printTable(filteredEnquiries, exportCols, colLabels, 'Admission Enquiry Report');

    return (
        <div className="student-list-page transport-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Admission Enquiry</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/admission-enquiry" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Admission Enquiry</Link>
                    </nav>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Enquiry List</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search by Name, Phone, Source..."
                            className="search-input-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="header-actions">
                        <div className="export-button-group" style={{ display: 'flex', gap: '8px', padding: '6px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <button className={`export-btn-text ${copied ? 'text-emerald-500 font-bold' : ''}`} onClick={onCopy} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                            <button className="export-btn-text" onClick={onCSV} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                                CSV
                            </button>
                            <button className="export-btn-text" onClick={onExcel} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                                Excel
                            </button>
                            <button className="export-btn-text" onClick={onPDF} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                                PDF
                            </button>
                            <button className="export-btn-text" onClick={onPrint} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                                Print
                            </button>
                            <div style={{ width: '1px', background: '#e2e8f0', margin: '4px 8px' }}></div>
                            <button className="export-btn-text flex items-center gap-2" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = '#c7d2fe'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                <IconFilter size={16} stroke={2} />
                                Filter
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                        </div>
                        <button
                            className="btn btn-primary ml-4"
                            style={{
                                background: 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(61, 94, 225, 0.2)'
                            }}
                            onClick={handleOpenAddModal}
                        >
                            <IconPlus size={18} /> Add Enquiry
                        </button>
                    </div>
                </div>

                <div className="table-wrap px-0">
                    <table className="premium-table-v2">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Source</th>
                                <th>Enquiry Date</th>
                                <th>Follow Up Date</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map((enquiry, idx) => (
                                <tr key={enquiry.id} className="table-row-v2" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <td><span className="font-semibold text-slate-700">{enquiry.name}</span></td>
                                    <td><span className="text-sm font-medium text-slate-600">{enquiry.phone}</span></td>
                                    <td><span className="font-medium text-slate-600">{enquiry.source || '—'}</span></td>
                                    <td><span className="text-slate-500 text-sm">{enquiry.date}</span></td>
                                    <td><span className="text-slate-500 text-sm">{enquiry.followUpDate || '—'}</span></td>
                                    <td>
                                        <span className={`text-sm font-bold ${enquiry.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none' }}
                                                title="View"
                                                onClick={() => handleView(enquiry)}
                                            ><IconEye size={18} stroke={2} /></button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none' }}
                                                title="Edit"
                                                onClick={() => handleEdit(enquiry)}
                                            ><IconPencil size={18} stroke={2} /></button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none' }}
                                                title="Delete"
                                                onClick={() => handleDelete(enquiry.id)}
                                            ><IconTrash size={18} stroke={2} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEnquiries.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No admission enquiries found
                        </div>
                    )}
                </div>

                <div className="p-6 flex items-center justify-between text-[13px] text-gray-500 border-t border-slate-100 bg-slate-50/30">
                    <span>Showing 1 to {filteredEnquiries.length} of {filteredEnquiries.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Premium Add/Edit Enquiry Modal */}
            {showAddModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000, padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="view-modal relative" style={{
                        background: '#ffffff', width: '850px', maxWidth: '100%', maxHeight: '90vh',
                        borderRadius: '16px', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                        animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'center', display: 'flex', flexDirection: 'column'
                    }}>
                        <div className="view-modal-header relative z-10 sticky top-0" style={{
                            background: '#8b5cf6', color: 'white', padding: '24px 32px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
                            borderTopLeftRadius: '16px', borderTopRightRadius: '16px'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>{isEditing ? 'Edit Admission Enquiry' : 'Add Admission Enquiry'}</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Fill out the prospective student's information</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', cursor: 'pointer',
                                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', backdropFilter: 'blur(4px)', padding: 0
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            >✕</button>
                        </div>

                        <form onSubmit={handleSave} className="view-modal-body relative z-10 flex-1" style={{ padding: '32px 40px', background: '#ffffff' }}>
                            <div className="flex flex-col gap-8 mb-6">
                                {/* Section 1: Basic Info */}
                                <div>
                                    <h5 className="text-[13px] font-bold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
                                        <IconIdBadge size={16} className="text-indigo-500" /> BASIC DETAILS
                                    </h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div className="flex flex-col gap-1.5 form-group-premium">
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconUser size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NAME *</label>
                                            </div>
                                            <input type="text" name="name" value={formData.name} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" required onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 form-group-premium" style={{ animationDelay: '0.15s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconPhone size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PHONE *</label>
                                            </div>
                                            <input type="text" name="phone" value={formData.phone} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" required onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-2 form-group-premium" style={{ animationDelay: '0.2s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconFileText size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">EMAIL</label>
                                            </div>
                                            <input type="email" name="email" value={formData.email} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-2 form-group-premium" style={{ animationDelay: '0.25s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconFileText size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ADDRESS</label>
                                            </div>
                                            <input type="text" name="address" value={formData.address} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Enquiry Details */}
                                <div>
                                    <h5 className="text-[13px] font-bold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> ENQUIRY INFORMATION
                                    </h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '24px' }}>
                                        <div className="flex flex-col gap-1.5 form-group-premium" style={{ animationDelay: '0.3s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconAlertCircle size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SOURCE *</label>
                                            </div>
                                            <select name="source" value={formData.source} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all cursor-pointer" required onChange={handleInputChange}>
                                                <option value="">Select Option</option>
                                                <option value="Website">Website</option>
                                                <option value="Advertisement">Advertisement</option>
                                                <option value="Reference">Reference</option>
                                                <option value="Walk-in">Walk-in</option>
                                                <option value="Phone Call">Phone Call</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5 form-group-premium" style={{ animationDelay: '0.35s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconFileText size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">REFERENCE</label>
                                            </div>
                                            <select name="reference" value={formData.reference} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all cursor-pointer" onChange={handleInputChange}>
                                                <option value="">Select Teacher</option>
                                                {MOCK_TEACHERS.map((teacher, idx) => (
                                                    <option key={idx} value={teacher}>{teacher}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5 form-group-premium" style={{ animationDelay: '0.4s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconFileText size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CLASS</label>
                                            </div>
                                            <input type="text" name="class" value={formData.class} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" onChange={handleInputChange} />
                                        </div>

                                        <div className="flex flex-col gap-1.5 mt-2 form-group-premium" style={{ animationDelay: '0.45s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconFileText size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NO. OF CHILD</label>
                                            </div>
                                            <input type="number" name="noOfChildren" value={formData.noOfChildren} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-2 form-group-premium" style={{ animationDelay: '0.5s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconCalendar size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DATE *</label>
                                            </div>
                                            <input type="date" name="date" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" required value={formData.date} onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-2 form-group-premium" style={{ animationDelay: '0.55s' }}>
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <IconCalendar size={14} />
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NEXT FOLLOW UP</label>
                                            </div>
                                            <input type="date" name="followUpDate" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" value={formData.followUpDate} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 mb-6 form-group-premium" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-1.5 text-indigo-400">
                                    <IconFileText size={14} />
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DESCRIPTION</label>
                                </div>
                                <textarea name="description" value={formData.description} className="w-full min-h-[50px] p-3 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all resize-y" placeholder="Additional details..." onChange={handleInputChange}></textarea>
                            </div>

                            <div className="flex flex-col gap-1.5 mb-8 form-group-premium" style={{ animationDelay: '0.65s' }}>
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ATTACH DOCUMENT</span>
                                <div className="border border-dashed border-indigo-200 bg-white rounded-xl p-4 text-center text-indigo-400 transition-colors hover:bg-slate-50 cursor-pointer flex flex-col items-center justify-center gap-1 w-[200px] file-upload-area">
                                    <IconFileText size={18} />
                                    <div className="text-[11px] font-medium text-indigo-400">Drag and drop or click</div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-6 border-t border-slate-100 mt-4">
                                <button
                                    type="submit"
                                    className="transition-all active:scale-95"
                                    style={{
                                        background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
                                        color: '#5b21b6',
                                        border: '1.5px solid #c4b5fd',
                                        borderRadius: '16px',
                                        padding: '12px 40px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        letterSpacing: '0.03em',
                                        cursor: 'pointer',
                                        boxShadow: '0 6px 24px rgba(139, 92, 246, 0.25), 0 1px 4px rgba(139,92,246,0.12)',
                                        minWidth: '160px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 50%, #a78bfa 100%)';
                                        e.currentTarget.style.boxShadow = '0 10px 32px rgba(139, 92, 246, 0.35)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)';
                                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.25), 0 1px 4px rgba(139,92,246,0.12)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    {isEditing ? 'Save Changes' : 'Save Enquiry'}
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
                        background: '#ffffff', width: '600px', maxWidth: '100%',
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
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Enquiry Details</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Information recorded at front office</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', backdropFilter: 'blur(4px)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >✕</button>
                        </div>

                        <div className="view-modal-body relative z-10" style={{ padding: '32px', background: '#ffffff' }}>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-500 rounded-full flex justify-center items-center shadow-inner border border-indigo-100/50">
                                            <IconUser size={32} stroke={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 m-0 mb-1.5">{viewData.name}</h4>
                                            <p className="text-sm text-slate-500 m-0 flex items-center gap-1.5">
                                                <IconPhone size={14} className="text-slate-400" />
                                                <span className="font-semibold text-slate-700">{viewData.phone || 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${viewData.status === 'Active' ? 'bg-emerald-500 text-white' :
                                            'bg-slate-200 text-slate-600'
                                            }`}>
                                            {viewData.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 px-2">
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.1s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconAlertCircle size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.source || '—'}</span>
                                    </div>
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.15s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconFileText size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reference</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.reference || '—'}</span>
                                    </div>
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.2s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enquiry Date</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.date}</span>
                                    </div>
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.25s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Follow-Up</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.followUpDate || '—'}</span>
                                    </div>
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.3s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconFileText size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.class || '—'}</span>
                                    </div>
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.35s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconUser size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned To</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.assigned || '—'}</span>
                                    </div>
                                </div>

                                {viewData.address && (
                                    <div className="flex flex-col px-2 mt-2 form-group-premium" style={{ animationDelay: '0.4s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconAlertCircle size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold leading-relaxed">{viewData.address}</span>
                                    </div>
                                )}

                                {viewData.description && (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2 mx-2 text-sm text-slate-600 leading-relaxed form-group-premium" style={{ animationDelay: '0.45s' }}>
                                        <strong>Description:</strong> {viewData.description}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="btn px-6 py-2 rounded-xl font-semibold transition-all hover:bg-slate-100"
                                    style={{ background: '#f1f5f9', color: '#475569', border: 'none' }}
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

export default AdmissionEnquiry;
