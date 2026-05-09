import React, { useState } from 'react';
import {
    IconSearch,
    IconPlus,
    IconFilter,
    IconChevronDown,
    IconEye,
    IconPencil,
    IconTrash,
    IconId,
    IconUser,
    IconIdBadge,
    IconPhone,
    IconUsers,
    IconCalendar,
    IconClock,
    IconFileText,
    IconBook
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import '../Transport/ManageStudentTransport.css';
import '../FrontOffice/VisitorBook.css';
import '../Academics/Academics.css';

const SEED_MATERIALS = [];

const CLASSES = ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const SUBJECTS = ['English', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology'];

const ManageResources = () => {
    const [materials, setMaterials] = useState(SEED_MATERIALS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        class: '',
        section: '',
        subject: '',
        topic: '',
        title: '',
        type: 'PDF',
        file: null,
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.title) return;

        if (isEditing) {
            // Update logic here
            setShowAddModal(false);
            return;
        }

        const newItem = {
            id: Date.now(),
            title: formData.title,
            className: formData.class || 'N/A',
            sectionName: formData.section || 'N/A',
            subjectName: formData.subject || 'N/A',
            topic: formData.topic || 'General',
            type: formData.type || 'Document',
            date: new Date().toISOString().split('T')[0],
            iconColor: formData.type === 'PDF' ? '#0ea5e9' : '#3b82f6',
            uploadedBy: 'Current User'
        };

        setMaterials([...materials, newItem]);
        setShowAddModal(false);
        setFormData({ class: '', section: '', subject: '', topic: '', title: '', type: 'PDF', file: null, description: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            setMaterials(materials.filter(m => m.id !== id));
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="student-list-page transport-page visitor-book-page w-full min-h-screen bg-slate-50/50">
            <div className="page-header">
                <div className="page-title">
                    <h4>Manage Study Resources</h4>
                    <nav className="breadcrumb">
                        <span className="breadcrumb-link">Study Center</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="current">Manage Resources</span>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                            background: '#1d4ed8', // blue-700 to match the exact exact shade
                            color: 'white',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '8px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)'
                        }}
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({ class: '', section: '', subject: '', topic: '', title: '', type: 'PDF', file: null, description: '' });
                            setShowAddModal(true);
                        }}
                    >
                        <IconPlus size={18} /> Add Resource
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in bg-white">

                {/* Header Area */}
                <div className="px-6 py-5 border-b border-slate-100 bg-white">
                    <h5 className="text-[17px] font-bold text-slate-800 m-0 tracking-tight">All Resources</h5>
                    <p className="text-[13px] text-slate-500 mt-1 mb-0">Manage and view all uploaded study materials</p>
                </div>

                {/* Table */}
                <div className="table-wrap px-0 border-none">
                    <table className="w-full text-left border-collapse" style={{ border: 'none' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderTop: 'none', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class & Section</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded By</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors bg-white group">
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-semibold text-slate-800 text-[14px]">{item.title}</div>
                                                    <div className="text-slate-500 text-[12px]">{item.date} • {item.topic}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 text-[12px] font-bold">
                                                {item.className} - {item.sectionName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="font-semibold text-slate-700 text-[14px]">{item.subjectName}</div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                                                    {item.uploadedBy.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-slate-600 text-[13px] font-medium">{item.uploadedBy}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                    title="Download/View"
                                                >
                                                    <IconEye size={16} />
                                                </button>
                                                <button
                                                    className="w-8 h-8 rounded-md flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setFormData({
                                                            class: item.className,
                                                            section: item.sectionName,
                                                            subject: item.subjectName,
                                                            topic: item.topic,
                                                            title: item.title,
                                                            type: item.type,
                                                            file: null,
                                                            description: ''
                                                        });
                                                        setShowAddModal(true);
                                                    }}
                                                >
                                                    <IconPencil size={16} />
                                                </button>
                                                <button
                                                    className="w-8 h-8 rounded-md flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                                                    title="Delete"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500 bg-white">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
                                                <IconSearch size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-[14px] font-semibold text-slate-500">No resources found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 flex items-center justify-between text-[13px] text-slate-500 border-t border-slate-100 bg-white">
                    <span>Showing 1 to {filteredMaterials.length} of {filteredMaterials.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 min-w-[32px] rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-medium transition-colors" disabled>Previous</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1d4ed8] text-white font-bold shadow-sm">1</button>
                        <button className="px-3 py-1 min-w-[32px] rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-medium transition-colors" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Premium Add/Edit Resource Modal */}
            {showAddModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000, padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="view-modal relative" style={{
                        background: '#ffffff', width: '800px', maxWidth: '100%',
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
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{isEditing ? 'Edit Resource' : 'Add Resource'}</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Fill out the resource details below</p>
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

                        <form onSubmit={handleSave} className="view-modal-body relative z-10 p-8 bg-white">

                            {/* BASIC DETAILS SECTION */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-[#4f46e5] font-bold text-[13px] uppercase tracking-wide mb-4">
                                    <IconId size={18} />
                                    <span>Basic Details</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconPencil size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Document Title *</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconBook size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Subject *</label>
                                        </div>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select Subject</option>
                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconFileText size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Topic</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all"
                                            placeholder="Optional topic name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconFileText size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Document Type</label>
                                        </div>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="PDF">PDF File</option>
                                            <option value="Word">Word Document</option>
                                            <option value="Video">Video URL</option>
                                            <option value="Image">Image</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* ASSIGNMENT INFORMATION SECTION */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-[#4f46e5] font-bold text-[13px] uppercase tracking-wide mb-4">
                                    <IconUsers size={18} />
                                    <span>Assignment Information</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconUsers size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Class *</label>
                                        </div>
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select Class</option>
                                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 relative">
                                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                                            <IconIdBadge size={15} />
                                            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Section *</label>
                                        </div>
                                        <select
                                            name="section"
                                            value={formData.section}
                                            onChange={handleInputChange}
                                            className="w-full h-11 px-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select Section</option>
                                            {SECTIONS.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative mb-6">
                                <div className="flex items-center gap-2 text-[#8b5cf6]">
                                    <IconFileText size={15} />
                                    <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Description</label>
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[80px] p-4 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 outline-none focus:border-[#8b5cf6] transition-all resize-y"
                                    placeholder="Additional details..."
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <div className="flex items-center gap-2 text-[#64748b]">
                                    <label className="text-[11px] font-bold uppercase tracking-wider">Attach Document {isEditing ? '(Replace)' : ''}</label>
                                </div>
                                <label className="border border-dashed border-[#8b5cf6] bg-white rounded-xl p-4 text-center text-[#8b5cf6] transition-colors hover:bg-slate-50 cursor-pointer flex flex-col items-center justify-center gap-2 w-full max-w-[200px]">
                                    <IconFileText size={20} />
                                    <div className="text-[12px] font-medium">{formData.file ? formData.file.name : 'Drag and drop or click'}</div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                    }}
                                >
                                    {isEditing ? 'Save Changes' : 'Upload Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageResources;
