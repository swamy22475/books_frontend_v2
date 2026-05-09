import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import { useCommunication } from '../../../context/CommunicationContext';
import {
    Plus, Search, Trash2, Check, MailOpen, Copy, PenSquare, X, Eye
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';
import './SendEmail.css';
import './EmailTemplate.css';
import './TemplateModal.css';

const EmailTemplate = () => {
    const { emailTemplates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useCommunication();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({ title: '', message: '' });
    const [viewTemplate, setViewTemplate] = useState(null);

    const filteredTemplates = emailTemplates.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (template = null) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({ title: template.title, message: template.message });
        } else {
            setEditingTemplate(null);
            setFormData({ title: '', message: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.title || !formData.message) { alert('Please fill all fields'); return; }
        if (editingTemplate) { updateEmailTemplate(editingTemplate.id, formData); }
        else { addEmailTemplate(formData); }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) { deleteEmailTemplate(id); }
    };

    return (
        <div className="email-template-page">
            <StudentPageContainer title="Email Template List" description="Manage and customize your email templates.">
                <div className="sms-container" style={{ padding: 0, background: 'transparent' }}>
                    <div className="template-card">
                        <div className="template-header">
                            <div className="search-wrapper">
                                <Search className="search-icon-absolute w-5 h-5 text-slate-400" />
                                <input type="text" placeholder="Search by Title or Message..." className="search-input-field"
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <button className="btn-template-add" onClick={() => handleOpenModal()}>
                                <Plus className="w-5 h-5 stroke-[2.5]" /> Add Template
                            </button>
                        </div>

                        <div className="template-table-container">
                            <table className="template-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '30%' }}>Title</th>
                                        <th style={{ width: '55%' }}>Message</th>
                                        <th style={{ width: '15%', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
                                        <tr key={template.id}>
                                            <td style={{ fontWeight: 600, color: '#334155' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                                                        <MailOpen className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm">{template.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="message-preview" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748b' }}
                                                    dangerouslySetInnerHTML={{ __html: template.message }} />
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className='flex justify-end gap-2'>
                                                    <button onClick={() => setViewTemplate(template)} className="action-btn view" title="View"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => handleOpenModal(template)} className="action-btn edit" title="Edit"><PenSquare className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(template.id)} className="action-btn delete" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '80px 0', textAlign: 'center' }}>
                                                <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                        <MailOpen className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <p className="font-medium text-slate-500 text-lg">No email templates found</p>
                                                    <button onClick={() => handleOpenModal()} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                                        <Plus className="w-4 h-4" /> Create New Template
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </StudentPageContainer>

            {/* ── VIEW MODAL ── */}
            {viewTemplate && (
                <div className="tpl-overlay" onClick={() => setViewTemplate(null)}>
                    <div className="tpl-modal tpl-modal--wide" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon email">
                                    <MailOpen size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">Template Preview</div>
                                    <div className="tpl-header-sub">Email Template</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setViewTemplate(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="tpl-body">
                            {/* Title */}
                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</span>
                                <div className="tpl-preview-title">{viewTemplate.title}</div>
                                <div className="tpl-preview-meta">
                                    <span className="tpl-preview-badge email">Email</span>
                                </div>
                            </div>

                            <div className="tpl-divider" />

                            {/* Message */}
                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message Content</span>
                                <div className="tpl-preview-box">
                                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewTemplate.message }} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="tpl-footer">
                            <button className="tpl-btn-close" onClick={() => setViewTemplate(null)}>Close</button>
                            <button className="tpl-btn-edit" onClick={() => { setViewTemplate(null); handleOpenModal(viewTemplate); }}>
                                <PenSquare size={14} /> Edit Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ADD / EDIT MODAL ── */}
            {isModalOpen && (
                <div className="tpl-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="tpl-modal tpl-modal--wide" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon email">
                                    <MailOpen size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">{editingTemplate ? 'Edit Email Template' : 'Add Email Template'}</div>
                                    <div className="tpl-header-sub">{editingTemplate ? 'Update the template details below' : 'Fill in the details to create a new template'}</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="tpl-body">
                            {/* Title */}
                            <div className="tpl-field">
                                <label className="tpl-label">
                                    Template Title <span className="required-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="tpl-input email"
                                    placeholder="Enter a descriptive title for this template..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Message */}
                            <div className="tpl-field">
                                <label className="tpl-label">
                                    Message <span className="required-star">*</span>
                                    <span className="tpl-label-badge">Rich text supported</span>
                                </label>
                                <div className="tpl-rte-wrapper">
                                    <RichTextEditor
                                        value={formData.message}
                                        onChange={(html) => setFormData({ ...formData, message: html })}
                                        placeholder="Type your email content here..."
                                    />
                                </div>
                            </div>

                            {/* Variable chips */}
                            <div className="tpl-vars">
                                <div className="tpl-vars-label">Click to insert variable</div>
                                <div className="tpl-vars-chips">
                                    {['[NAME]', '[DATE]', '[CLASS]', '[ROLL_NO]', '[ADMISSION_NO]'].map(tag => (
                                        <button key={tag} type="button" className="tpl-chip email"
                                            onClick={() => setFormData(prev => ({ ...prev, message: prev.message + tag }))}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="tpl-footer">
                            <button className="tpl-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="tpl-btn-save email" onClick={handleSave}>
                                <Check size={15} />
                                {editingTemplate ? 'Update Template' : 'Save Template'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplate;
