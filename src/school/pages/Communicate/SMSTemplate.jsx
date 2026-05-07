import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import { useCommunication } from '../../../context/CommunicationContext';
import {
    Plus, Search, Trash2, Check, MessageSquare, Copy, PenSquare, X, Smartphone, Eye
} from 'lucide-react';
import './SendSMS.css';
import './EmailTemplate.css';
import './TemplateModal.css';

const SMSTemplate = () => {
    const { smsTemplates, addSmsTemplate, updateSmsTemplate, deleteSmsTemplate } = useCommunication();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({ title: '', message: '' });
    const [viewTemplate, setViewTemplate] = useState(null);

    const filteredTemplates = smsTemplates.filter(t =>
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
        if (editingTemplate) { updateSmsTemplate(editingTemplate.id, formData); }
        else { addSmsTemplate(formData); }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) { deleteSmsTemplate(id); }
    };

    const insertPlaceholder = (tag) => setFormData(prev => ({ ...prev, message: prev.message + tag }));

    return (
        <div className="email-template-page">
            <StudentPageContainer title="SMS Template List" description="Manage pre-defined SMS templates for quick communication.">
                <div className="sms-container" style={{ padding: 0, background: 'transparent' }}>
                    <div className="template-card">
                        <div className="template-header">
                            <div className="search-wrapper">
                                <Search className="search-icon-absolute w-5 h-5 text-slate-400" />
                                <input type="text" placeholder="Search by Title or Message..." className="search-input-field"
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <button className="btn-template-add" onClick={() => handleOpenModal()}>
                                <Plus className="w-5 h-5 stroke-[2.5]" /> Add SMS Template
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
                                                    <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-sm">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm">{template.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="message-preview" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748b' }}>
                                                    {template.message}
                                                </div>
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
                                                        <Smartphone className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <p className="font-medium text-slate-500 text-lg">No SMS templates found</p>
                                                    <button onClick={() => handleOpenModal()} className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
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
                    <div className="tpl-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon sms">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">Template Preview</div>
                                    <div className="tpl-header-sub">SMS Template</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setViewTemplate(null)}><X size={18} /></button>
                        </div>

                        <div className="tpl-body">
                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</span>
                                <div className="tpl-preview-title">{viewTemplate.title}</div>
                                <div className="tpl-preview-meta">
                                    <span className="tpl-preview-badge sms">SMS</span>
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{viewTemplate.message.length} characters</span>
                                </div>
                            </div>

                            <div className="tpl-divider" />

                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message Content</span>
                                <div className="tpl-preview-box">{viewTemplate.message}</div>
                            </div>
                        </div>

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
                    <div className="tpl-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon sms">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">{editingTemplate ? 'Edit SMS Template' : 'Add SMS Template'}</div>
                                    <div className="tpl-header-sub">{editingTemplate ? 'Update the template details below' : 'Fill in the details to create a new template'}</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                        </div>

                        <div className="tpl-body">
                            <div className="tpl-field">
                                <label className="tpl-label">
                                    Template Title <span className="required-star">*</span>
                                </label>
                                <input type="text" className="tpl-input sms"
                                    placeholder="Enter a descriptive title for this template..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div className="tpl-field">
                                <label className="tpl-label">
                                    SMS Message <span className="required-star">*</span>
                                    <span className={`tpl-label-badge ${formData.message.length > 160 ? 'warn' : ''}`}>
                                        {formData.message.length} / 160 chars
                                    </span>
                                </label>
                                <textarea className="tpl-textarea sms"
                                    placeholder="Type your SMS content here..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                            </div>

                            <div className="tpl-vars">
                                <div className="tpl-vars-label">Click to insert variable</div>
                                <div className="tpl-vars-chips">
                                    {['[NAME]', '[DATE]', '[CLASS]', '[ROLL_NO]', '[ADMISSION_NO]'].map(tag => (
                                        <button key={tag} type="button" className="tpl-chip sms" onClick={() => insertPlaceholder(tag)}>{tag}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="tpl-footer">
                            <button className="tpl-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="tpl-btn-save sms" onClick={handleSave}>
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

export default SMSTemplate;
