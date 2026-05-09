import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import {
    Search, Edit2, Trash2, Eye, Calendar, Clock,
    Users, User, GraduationCap, Info, CheckCircle2,
    Mail, Smartphone, MessageCircle, X
} from 'lucide-react';
import './ScheduleLog.css';
import './TemplateModal.css';

const INITIAL_LOGS = [
    {
        id: 1,
        title: "Online Classes",
        message: "Be very punctual in log in time, screen off time, activity time table etc. Be ready with necessary text books, note books, pen, pencil and other accessories before class begins.",
        createdDate: "02/04/2025 06:02 pm",
        scheduleDate: "02/12/2025 05:02 pm",
        isEmail: true, isSMS: true, isWhatsapp: false,
        isGroup: true, isIndividual: false, isClass: false,
        status: 'Scheduled'
    },
    {
        id: 2,
        title: "New Academic admission start (2025-26)",
        message: "NEW ADMISSIONS FOR THE NEXT SESSION 2025-26 ARE OPEN FROM CLASSES NURSERY TO CLASS-VIII FROM 1ST APRIL 2025.",
        createdDate: "04/04/2025 01:27 pm",
        scheduleDate: "04/05/2025 11:27 am",
        isEmail: true, isSMS: true, isWhatsapp: false,
        isGroup: true, isIndividual: false, isClass: false,
        status: 'Scheduled'
    },
    {
        id: 3,
        title: "International Yoga Day",
        message: "International Yoga Day, celebrated annually on June 21st, offers schools a valuable opportunity to promote physical and mental well-being.",
        createdDate: "06/03/2025 03:33 pm",
        scheduleDate: "06/21/2025 07:00 am",
        isEmail: true, isSMS: true, isWhatsapp: false,
        isGroup: true, isIndividual: false, isClass: false,
        status: 'Scheduled'
    },
    {
        id: 4,
        title: "Annual Day Celebration",
        message: "A day in School – In this theme the program can showcase, what all goes in school. The ringing of bell, the class, the love of teachers, happy-go-lucky punishments.",
        createdDate: "01/06/2026 01:15 pm",
        scheduleDate: "12/02/2025 03:39 pm",
        isEmail: true, isSMS: false, isWhatsapp: false,
        isGroup: false, isIndividual: true, isClass: false,
        status: 'Scheduled'
    }
];

const ScheduleEmailSMSLog = () => {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);
    const [editingLog, setEditingLog] = useState(null);

    const filteredLogs = logs.filter(log =>
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this scheduled message?')) {
            setLogs(logs.filter(log => log.id !== id));
        }
    };

    const handleUpdate = () => {
        setLogs(prev => prev.map(log => log.id === editingLog.id ? editingLog : log));
        setEditingLog(null);
    };

    return (
        <StudentPageContainer title="Schedule Email SMS Log" description="View and manage scheduled communications.">
            <div className="schedule-log-container">
                <div className="schedule-card">
                    <div className="schedule-header">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Scheduled Messages
                        </h2>
                        <div className="schedule-search-wrapper">
                            <Search className="schedule-search-icon w-4 h-4" />
                            <input type="text" placeholder="Search by Title or Message..." className="schedule-search-input"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    <div className="schedule-table-container">
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th className="w-[30%]">Title &amp; Message</th>
                                    <th>Schedule Date</th>
                                    <th>Created Date</th>
                                    <th>Channel</th>
                                    <th>Send To</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? filteredLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="col-title-message">
                                            <div className="log-title">{log.title}</div>
                                            <div className="log-message" title={log.message}>{log.message}</div>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <span className="font-semibold text-slate-700 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-indigo-500" /> {log.scheduleDate.split(' ')[0]}
                                                </span>
                                                <span className="text-xs text-slate-500 pl-4">{log.scheduleDate.split(' ')[1]} {log.scheduleDate.split(' ')[2]}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <span>{log.createdDate.split(' ')[0]}</span>
                                                <span className="text-xs text-slate-500">{log.createdDate.split(' ')[1]} {log.createdDate.split(' ')[2]}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {log.isEmail && <span className="channel-badge badge-email">Email</span>}
                                                {log.isSMS && <span className="channel-badge badge-sms">SMS</span>}
                                                {log.isWhatsapp && <span className="channel-badge badge-whatsapp">WhatsApp</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {log.isGroup && <div className="flex flex-col items-center justify-center p-1 bg-purple-50 rounded text-purple-600 border border-purple-100 w-8 h-8" title="Group"><Users className="w-4 h-4" /></div>}
                                                {log.isIndividual && <div className="flex flex-col items-center justify-center p-1 bg-cyan-50 rounded text-cyan-600 border border-cyan-100 w-8 h-8" title="Individual"><User className="w-4 h-4" /></div>}
                                                {log.isClass && <div className="flex flex-col items-center justify-center p-1 bg-green-50 rounded text-green-600 border border-green-100 w-8 h-8" title="Class"><GraduationCap className="w-4 h-4" /></div>}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-btn-group">
                                                <button className="btn-action btn-view" onClick={() => setSelectedLog(log)} title="View Details"><Eye className="w-4 h-4" /></button>
                                                <button className="btn-action btn-edit" onClick={() => setEditingLog({ ...log })} title="Edit Schedule"><Edit2 className="w-4 h-4" /></button>
                                                <button className="btn-action btn-delete" onClick={() => handleDelete(log.id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Info className="w-10 h-10 mb-2 text-slate-300" />
                                                <p>No scheduled messages found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── VIEW MODAL ── */}
            {selectedLog && (
                <div className="tpl-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="tpl-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon" style={{ background: '#eff6ff', color: '#6366f1' }}>
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">Message Details</div>
                                    <div className="tpl-header-sub">Scheduled Communication</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setSelectedLog(null)}><X size={18} /></button>
                        </div>

                        <div className="tpl-body">
                            {/* Title + Status */}
                            <div className="tpl-field">
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                    <div className="tpl-preview-title" style={{ flex: 1 }}>{selectedLog.title}</div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                                        background: '#fef9c3', color: '#a16207', whiteSpace: 'nowrap', flexShrink: 0
                                    }}>
                                        {selectedLog.status}
                                    </span>
                                </div>
                                <div className="tpl-preview-meta" style={{ marginTop: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                    {selectedLog.isEmail && <span className="tpl-preview-badge email">Email</span>}
                                    {selectedLog.isSMS && <span className="tpl-preview-badge sms">SMS</span>}
                                    {selectedLog.isWhatsapp && <span className="tpl-preview-badge wa">WhatsApp</span>}
                                </div>
                            </div>

                            <div className="tpl-divider" />

                            {/* Meta rows */}
                            <div className="tpl-field" style={{ gap: '10px' }}>
                                {[
                                    { label: 'Schedule Date', value: selectedLog.scheduleDate },
                                    { label: 'Created Date', value: selectedLog.createdDate },
                                    {
                                        label: 'Recipient Type',
                                        value: selectedLog.isGroup ? 'Group' : selectedLog.isClass ? 'Class' : 'Individual'
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</span>
                                        <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="tpl-divider" />

                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message Content</span>
                                <div className="tpl-preview-box">{selectedLog.message}</div>
                            </div>
                        </div>

                        <div className="tpl-footer">
                            <button className="tpl-btn-close" onClick={() => setSelectedLog(null)}>Close</button>
                            <button className="tpl-btn-edit" onClick={() => { setSelectedLog(null); setEditingLog({ ...selectedLog }); }}>
                                <Edit2 size={14} /> Edit Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {editingLog && (
                <div className="tpl-overlay" onClick={() => setEditingLog(null)}>
                    <div className="tpl-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon" style={{ background: '#fef9c3', color: '#a16207' }}>
                                    <Edit2 size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">Edit Schedule</div>
                                    <div className="tpl-header-sub">Update the scheduled message details</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setEditingLog(null)}><X size={18} /></button>
                        </div>

                        <div className="tpl-body">
                            {/* Title */}
                            <div className="tpl-field">
                                <label className="tpl-label">Title <span className="required-star">*</span></label>
                                <input type="text" className="tpl-input"
                                    style={{ '--focus-color': '#f59e0b' }}
                                    value={editingLog.title}
                                    onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })} />
                            </div>

                            {/* Schedule Date + Status */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="tpl-field">
                                    <label className="tpl-label">Schedule Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input type="text" className="tpl-input" style={{ paddingLeft: '36px' }}
                                            value={editingLog.scheduleDate}
                                            onChange={(e) => setEditingLog({ ...editingLog, scheduleDate: e.target.value })}
                                            placeholder="MM/DD/YYYY HH:MM am/pm" />
                                    </div>
                                </div>
                                <div className="tpl-field">
                                    <label className="tpl-label">Status</label>
                                    <select className="tpl-input" style={{ cursor: 'pointer' }}
                                        value={editingLog.status}
                                        onChange={(e) => setEditingLog({ ...editingLog, status: e.target.value })}>
                                        <option>Scheduled</option>
                                        <option>Draft</option>
                                        <option>Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="tpl-field">
                                <label className="tpl-label">Message Content <span className="required-star">*</span></label>
                                <textarea className="tpl-textarea"
                                    value={editingLog.message}
                                    onChange={(e) => setEditingLog({ ...editingLog, message: e.target.value })} />
                            </div>
                        </div>

                        <div className="tpl-footer">
                            <button className="tpl-btn-cancel" onClick={() => setEditingLog(null)}>Cancel</button>
                            <button className="tpl-btn-save" style={{ background: '#f59e0b' }}
                                onClick={handleUpdate}>
                                <CheckCircle2 size={15} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StudentPageContainer>
    );
};

export default ScheduleEmailSMSLog;
