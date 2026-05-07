import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconCopy, IconFileText,
    IconFileSpreadsheet, IconPrinter, IconEye, IconPencil,
    IconTrash, IconChevronDown, IconFilter, IconUser,
    IconClock, IconCalendar, IconId, IconUsers, IconPhone, IconIdBadge
} from '@tabler/icons-react';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';
import '../Transport/ManageStudentTransport.css';
import './VisitorBook.css';

const SEED_VISITORS = [
    {
        id: 1,
        purpose: 'Curriculum Enrichment',
        meetingWith: 'Student (Rocky Flintoff - 8900)',
        visitorName: 'Rihan',
        phone: '675757555',
        idCard: '34354',
        numberOfPerson: 5,
        date: '02/13/2026',
        inTime: '11:51 AM',
        outTime: '12:51 PM',
        status: 'Active'
    },
    {
        id: 2,
        purpose: 'School Events',
        meetingWith: 'Staff (William Abbot - 9003)',
        visitorName: 'John wood',
        phone: '565464644',
        idCard: '—',
        numberOfPerson: 4,
        date: '02/11/2026',
        inTime: '02:48 PM',
        outTime: '02:45 PM',
        status: 'Active'
    },
    {
        id: 3,
        purpose: 'Principal Meeting',
        meetingWith: 'Staff (Shivam Verma - 9002)',
        visitorName: 'Jolly',
        phone: '656545464',
        idCard: '6554',
        numberOfPerson: 7,
        date: '02/09/2026',
        inTime: '02:47 PM',
        outTime: '03:47 PM',
        status: 'Active'
    },
    {
        id: 4,
        purpose: 'Parent Teacher Meeting',
        meetingWith: 'Student (Ayan Desai - 120036)',
        visitorName: 'Aadi',
        phone: '56546464',
        idCard: '4564',
        numberOfPerson: 5,
        date: '02/05/2026',
        inTime: '12:45 PM',
        outTime: '12:49 PM',
        status: 'Active'
    }
];

const VisitorBook = () => {
    const navigate = useNavigate();
    const [visitors, setVisitors] = useState(SEED_VISITORS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [copied, setCopied] = useState(false);

    // Column configuration for exports
    const exportCols = ['purpose', 'meetingWith', 'visitorName', 'phone', 'idCard', 'numberOfPerson', 'date', 'inTime', 'outTime'];
    const colLabels = {
        purpose: 'Purpose',
        meetingWith: 'Meeting With',
        visitorName: 'Visitor Name',
        phone: 'Phone',
        idCard: 'ID Card',
        numberOfPerson: 'Count',
        date: 'Date',
        inTime: 'In Time',
        outTime: 'Out Time'
    };

    const [formData, setFormData] = useState({
        purpose: '',
        meetingWith: '',
        visitorName: '',
        phone: '',
        idCard: '',
        numberOfPerson: '',
        date: new Date().toISOString().split('T')[0],
        inTime: '03:47 PM',
        outTime: '03:47 PM'
    });

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            setVisitors(visitors.map(v => v.id === editId ? { ...formData, id: editId, status: 'Active' } : v));
        } else {
            const newVisitor = {
                id: visitors.length + 1,
                ...formData,
                status: 'Active'
            };
            setVisitors([newVisitor, ...visitors]);
        }
        setShowAddModal(false);
    };

    const handleEdit = (visitor) => {
        setIsEditing(true);
        setEditId(visitor.id);
        setFormData({ ...visitor });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this visitor record?')) {
            setVisitors(visitors.filter(v => v.id !== id));
        }
    };

    const handleView = (visitor) => {
        setViewData(visitor);
        setShowViewModal(true);
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            purpose: '',
            meetingWith: '',
            visitorName: '',
            phone: '',
            idCard: '',
            numberOfPerson: '',
            date: new Date().toISOString().split('T')[0],
            inTime: '03:47 PM',
            outTime: '03:47 PM'
        });
        setShowAddModal(true);
    };

    const filteredVisitors = useMemo(() => {
        return visitors.filter(v =>
            v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.meetingWith.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [visitors, searchTerm]);

    /* Toolbar Actions */
    const onCopy = () => {
        copyToClipboard(filteredVisitors, exportCols, colLabels).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const onCSV = () => exportToCSV(filteredVisitors, exportCols, colLabels, 'Visitor_Book');
    const onExcel = () => exportToExcel(filteredVisitors, exportCols, colLabels, 'Visitor_Book');
    const onPDF = () => exportToPDF(filteredVisitors, exportCols, colLabels, 'Visitor_Book', 'Visitor Book List');
    const onPrint = () => printTable(filteredVisitors, exportCols, colLabels, 'Visitor Book Report');

    return (
        <div className="student-list-page transport-page visitor-book-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Visitor Book</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Visitor Book</Link>
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
                        <IconPlus size={18} /> Add Visitor
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Visitor List</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search visitor..."
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
                                    <h6 className="text-xs font-bold text-slate-400 uppercase mb-3">Group By Purpose</h6>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input type="checkbox" checked /> <span className="text-sm">Public Relations</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input type="checkbox" checked /> <span className="text-sm">Official Work</span>
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
                                <th>Purpose</th>
                                <th>Meeting With</th>
                                <th>Visitor Name</th>
                                <th>Phone</th>
                                <th>ID Card</th>
                                <th>Count</th>
                                <th>Date</th>
                                <th>In Time</th>
                                <th>Out Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVisitors.map((v) => (
                                <tr key={v.id} className="table-row-v2">
                                    <td>
                                        <div className="font-medium text-slate-700">{v.purpose}</div>
                                    </td>
                                    <td>
                                        <div className="text-slate-600 text-xs font-semibold whitespace-nowrap">{v.meetingWith}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3 justify-start px-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                <IconUser size={16} />
                                            </div>
                                            <span className="font-bold text-slate-700 whitespace-nowrap">{v.visitorName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-slate-500">{v.phone}</div>
                                    </td>
                                    <td>
                                        <div className="text-slate-500">{v.idCard}</div>
                                    </td>
                                    <td>
                                        <span className="status-text active" style={{ background: '#f1f5f9', color: '#475569' }}>
                                            {v.numberOfPerson}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-slate-600 text-xs font-medium">{v.date}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold whitespace-nowrap">
                                            <IconClock size={14} />
                                            {v.inTime}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-1 text-rose-500 font-bold whitespace-nowrap">
                                            <IconClock size={14} />
                                            {v.outTime}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none' }}
                                                title="View"
                                                onClick={() => handleView(v)}
                                            >
                                                <IconEye size={18} stroke={2} />
                                            </button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none' }}
                                                title="Edit"
                                                onClick={() => handleEdit(v)}
                                            >
                                                <IconPencil size={18} stroke={2} />
                                            </button>
                                            <button
                                                className="flex items-center justify-center transition-all hover:scale-110"
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none' }}
                                                title="Delete"
                                                onClick={() => handleDelete(v.id)}
                                            >
                                                <IconTrash size={18} stroke={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex items-center justify-between text-[13px] text-gray-500 border-t border-slate-100 bg-slate-50/30">
                    <span>Showing 1 to {filteredVisitors.length} of {filteredVisitors.length} entries</span>
                    <div className="flex items-center gap-10">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Premium Add/Edit Visitor Modal */}
            {showAddModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000, padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="view-modal relative" style={{
                        background: '#ffffff', width: '700px', maxWidth: '100%',
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
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{isEditing ? 'Edit Visitor' : 'Add Visitor'}</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Fill out the information below</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', backdropFilter: 'blur(4px)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >✕</button>
                        </div>

                        <form onSubmit={handleSave} className="view-modal-body relative z-10" style={{ padding: '32px', background: '#ffffff' }}>
                            <div className="flex flex-col gap-6 mb-6">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.1s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconId size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purpose *</label>
                                        </div>
                                        <select name="purpose" value={formData.purpose} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer" required onChange={handleInputChange}>
                                            <option value="">Select</option>
                                            <option value="Curriculum Enrichment">Curriculum Enrichment</option>
                                            <option value="School Events">School Events</option>
                                            <option value="Principal Meeting">Principal Meeting</option>
                                            <option value="Parent Teacher Meeting">Parent Teacher Meeting</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.15s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconUser size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meeting With *</label>
                                        </div>
                                        <select name="meetingWith" value={formData.meetingWith} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer" required onChange={handleInputChange}>
                                            <option value="">Select</option>
                                            <option value="Staff (William Abbot - 9003)">Staff (William Abbot)</option>
                                            <option value="Staff (Shivam Verma - 9002)">Staff (Shivam Verma)</option>
                                            <option value="Student (Rocky Flintoff - 8900)">Student (Rocky Flintoff)</option>
                                            <option value="Student (Ayan Desai - 120036)">Student (Ayan Desai)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.2s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconIdBadge size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitor Name *</label>
                                        </div>
                                        <input type="text" name="visitorName" value={formData.visitorName} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.25s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconPhone size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                                        </div>
                                        <input type="text" name="phone" value={formData.phone} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.3s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconId size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID Card</label>
                                        </div>
                                        <input type="text" name="idCard" value={formData.idCard} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.35s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconUsers size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Count</label>
                                        </div>
                                        <input type="number" name="numberOfPerson" value={formData.numberOfPerson} className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.4s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date *</label>
                                        </div>
                                        <input type="date" name="date" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" required value={formData.date} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.45s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconClock size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Time</label>
                                        </div>
                                        <input type="time" name="inTime" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.inTime} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-2 form-group-premium" style={{ animationDelay: '0.5s' }}>
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconClock size={16} />
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Out Time</label>
                                        </div>
                                        <input type="time" name="outTime" className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all" value={formData.outTime} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-6 ml-1 form-group-premium" style={{ animationDelay: '0.55s' }}>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attach Document</span>
                                <div className="border border-dashed border-indigo-200 bg-indigo-50/20 rounded-xl p-4 text-center text-indigo-400 transition-colors hover:bg-indigo-50/50 cursor-pointer flex flex-col items-center justify-center gap-2 w-full max-w-[250px] file-upload-area">
                                    <IconFileText size={20} />
                                    <div className="text-[12px] font-medium">Drag and drop or click</div>
                                </div>
                            </div>


                            <div className="flex justify-center pt-6 border-t border-slate-100">
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
                                    {isEditing ? 'Save Changes' : 'Save Visitor'}
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
                        background: '#ffffff', width: '550px', maxWidth: '100%',
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
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Visitor Details</h3>
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
                                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-500 rounded-full flex justify-center items-center shadow-inner border border-indigo-100/50">
                                        <IconUser size={32} stroke={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 m-0 mb-1.5">{viewData.visitorName}</h4>
                                        <p className="text-sm text-slate-500 m-0 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            Meeting: <span className="font-semibold text-slate-700">{viewData.meetingWith}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 px-2">
                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.1s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconId size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Purpose</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.purpose}</span>
                                    </div>

                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.15s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconPhone size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.phone || '—'}</span>
                                    </div>

                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.2s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconIdBadge size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ID Card</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.idCard || '—'}</span>
                                    </div>

                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.25s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconUsers size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Count</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.numberOfPerson || 1} Person(s)</span>
                                    </div>

                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.3s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconCalendar size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.date}</span>
                                    </div>

                                    <div className="flex flex-col form-group-premium" style={{ animationDelay: '0.35s' }}>
                                        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                                            <IconClock size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time</span>
                                        </div>
                                        <span className="text-[15px] text-slate-700 font-semibold">{viewData.inTime} - {viewData.outTime}</span>
                                    </div>
                                </div>

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

export default VisitorBook;
