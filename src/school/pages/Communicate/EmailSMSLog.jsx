import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import {
    Search, Trash2, Eye, Clock, Users, User, GraduationCap,
    Mail, Smartphone, MessageCircle, ListFilter, CalendarCheck,
    History, X, Info
} from 'lucide-react';
import './ScheduleLog.css';
import './TemplateModal.css';

const INITIAL_LOGS = [
    {
        id: 1,
        title: "Sports Day Events",
        message: "Games that are played on school sports days can be wide and varied. They can include straightforward sprints and longer races for all age groups as well as egg and spoon races.",
        sentDate: "01/22/2026 02:50 pm",
        scheduleDate: "01/22/2026 02:50 pm",
        isEmail: false, isSMS: true, isWhatsapp: false,
        isGroup: false, isIndividual: false, isClass: true,
        status: 'Sent'
    },
    {
        id: 2,
        title: "Fee Reminder - Term 2",
        message: "Dear Parents, This is a gentle reminder that the fee payment for Term 2 is due by 01/30/2026. Please ignore if already paid.",
        sentDate: "01/20/2026 10:00 am",
        scheduleDate: "-",
        isEmail: true, isSMS: true, isWhatsapp: false,
        isGroup: false, isIndividual: true, isClass: false,
        status: 'Sent'
    },
    {
        id: 3,
        title: "Holiday Announcement",
        message: "School will remain closed on 01/26/2026 for Republic Day.",
        sentDate: "01/25/2026 09:15 am",
        scheduleDate: "01/26/2026 08:00 am",
        isEmail: true, isSMS: true, isWhatsapp: true,
        isGroup: true, isIndividual: false, isClass: false,
        status: 'Sent'
    },
    {
        id: 4,
        title: "Exam Schedule Released",
        message: "The exam schedule for the upcoming final exams has been released. Please check the student portal.",
        sentDate: "01/15/2026 02:30 pm",
        scheduleDate: "-",
        isEmail: true, isSMS: false, isWhatsapp: false,
        isGroup: false, isIndividual: false, isClass: true,
        status: 'Failed'
    }
];

const EmailSMSLog = () => {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    const filteredLogs = logs.filter(log =>
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this log entry?')) {
            setLogs(logs.filter(log => log.id !== id));
        }
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete ALL logs? This action cannot be undone.')) {
            setLogs([]);
        }
    };

    return (
        <StudentPageContainer title="Email / SMS Log" description="View history of all sent communications.">
            <div className="schedule-log-container">
                <div className="schedule-card">
                    <div className="schedule-header">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-500" />
                                Communication Logs
                            </h2>
                            {logs.length > 0 && (
                                <button onClick={handleClearAll}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center gap-1.5">
                                    <Trash2 className="w-3.5 h-3.5" /> Clear All Logs
                                </button>
                            )}
                        </div>
                        <div className="schedule-search-wrapper">
                            <Search className="schedule-search-icon w-4 h-4" />
                            <input type="text" placeholder="Search logs..." className="schedule-search-input"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    <div className="schedule-table-container">
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th className="w-[35%]">Title &amp; Message</th>
                                    <th>Date Sent</th>
                                    <th>Scheduled For</th>
                                    <th>Channel</th>
                                    <th>Recipient Type</th>
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
                                                    <CalendarCheck className="w-3 h-3 text-indigo-500" /> {log.sentDate.split(' ')[0]}
                                                </span>
                                                <span className="text-xs text-slate-500 pl-4">{log.sentDate.split(' ')[1]} {log.sentDate.split(' ')[2]}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {log.scheduleDate === '-' ? (
                                                <span className="text-slate-400">-</span>
                                            ) : (
                                                <div className="date-info">
                                                    <span>{log.scheduleDate.split(' ')[0]}</span>
                                                    <span className="text-xs text-slate-500">{log.scheduleDate.split(' ')[1]} {log.scheduleDate.split(' ')[2]}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {log.isEmail && <span className="channel-badge badge-email"><Mail className="w-3 h-3 mr-1 inline" />Email</span>}
                                                {log.isSMS && <span className="channel-badge badge-sms"><Smartphone className="w-3 h-3 mr-1 inline" />SMS</span>}
                                                {log.isWhatsapp && <span className="channel-badge badge-whatsapp"><MessageCircle className="w-3 h-3 mr-1 inline" />WhatsApp</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {log.isGroup && <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold border border-purple-100"><Users className="w-3 h-3" />Group</div>}
                                                {log.isIndividual && <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs font-semibold border border-cyan-100"><User className="w-3 h-3" />Individual</div>}
                                                {log.isClass && <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold border border-green-100"><GraduationCap className="w-3 h-3" />Class</div>}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-btn-group">
                                                <button className="btn-action btn-view" onClick={() => setSelectedLog(log)} title="View Log Details"><Eye className="w-4 h-4" /></button>
                                                <button className="btn-action btn-delete" onClick={() => handleDelete(log.id)} title="Delete Log"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <ListFilter className="w-10 h-10 mb-2 text-slate-300" />
                                                <p>No communication logs found matching your search.</p>
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
                        {/* Header */}
                        <div className="tpl-header">
                            <div className="tpl-header-left">
                                <div className="tpl-header-icon email">
                                    <History size={18} />
                                </div>
                                <div>
                                    <div className="tpl-header-title">Log Details</div>
                                    <div className="tpl-header-sub">Communication History</div>
                                </div>
                            </div>
                            <button className="tpl-close-btn" onClick={() => setSelectedLog(null)}><X size={18} /></button>
                        </div>

                        {/* Body */}
                        <div className="tpl-body">
                            {/* Title + Status */}
                            <div className="tpl-field">
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                    <div className="tpl-preview-title" style={{ flex: 1 }}>{selectedLog.title}</div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                                        background: selectedLog.status === 'Sent' ? '#dcfce7' : '#fee2e2',
                                        color: selectedLog.status === 'Sent' ? '#15803d' : '#dc2626',
                                        whiteSpace: 'nowrap', flexShrink: 0
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
                            <div className="tpl-field" style={{ gap: '12px' }}>
                                {[
                                    { label: 'Date Sent', value: selectedLog.sentDate },
                                    { label: 'Scheduled For', value: selectedLog.scheduleDate },
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

                            {/* Message */}
                            <div className="tpl-field">
                                <span className="tpl-label" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message Content</span>
                                <div className="tpl-preview-box">{selectedLog.message}</div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="tpl-footer">
                            <button className="tpl-btn-close" onClick={() => setSelectedLog(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </StudentPageContainer>
    );
};

export default EmailSMSLog;
