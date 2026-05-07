import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import ExportToolbar from '../Reports/ExportToolbar';
import {
    Plus,
    Trash2,
    Calendar,
    User,
    Edit2,
    Search,
    Megaphone,
    AlertTriangle,
    FileText,
    Bell,
    X,
    Check,
    Image as ImageIcon
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import './NoticeBoard.css';

// --- DUMMY DATA ---
const INITIAL_NOTICES = [
    {
        id: 1,
        title: "Annual Function Practice Schedule",
        date: "Feb 20, 2026",
        author: "Admin",
        description: "Practice for the upcoming annual function will start from Monday at 3 PM in the main auditorium. All participants must attend.",
        type: "event"
    },
    {
        id: 2,
        title: "School Holiday Notice related to Holi",
        date: "Mar 05, 2026",
        author: "Principal",
        description: "The school will remain closed on March 25th and 26th for Holi celebrations. Have a safe and happy holiday!",
        type: "holiday"
    },
    {
        id: 3,
        title: "Parent-Teacher Meeting (PTM)",
        date: "Feb 28, 2026",
        author: "Coordinator",
        description: "PTM for Class X will be held on Saturday from 9 AM to 12 PM. Parents are requested to adhere to the time slots provided.",
        type: "meeting"
    },
    {
        id: 4,
        title: "Fee Submission Reminder",
        date: "Feb 15, 2026",
        author: "Accounts Dept",
        description: "Last date for fee submission without fine is Feb 28th. Please clear your dues to avoid late fees.",
        type: "alert"
    },
    {
        id: 5,
        title: "February Monthly Examination Schedule",
        date: "Feb 10, 2026",
        author: "Exam Cell",
        description: "Datesheet for monthly tests has been published on the student portal. Check the exam section for details.",
        type: "exam"
    },
    {
        id: 6,
        title: "Online Learning Notice",
        date: "Feb 08, 2026",
        author: "Admin",
        description: "Access to new online courses is now available for Class XI. Log in to the LMS to view the new modules.",
        type: "general"
    },
    {
        id: 7,
        title: "Staff Meeting",
        date: "Feb 05, 2026",
        author: "Principal",
        description: "Urgent staff meeting in the conference room at 2 PM today. Agenda: Annual Day Preparations.",
        type: "staff"
    }
];

const getIconForType = (type) => {
    switch (type) {
        case 'holiday': return <Calendar className="w-5 h-5" />;
        case 'exam': return <FileText className="w-5 h-5" />;
        case 'alert': return <AlertTriangle className="w-5 h-5" />;
        case 'event': return <Megaphone className="w-5 h-5" />;
        default: return <Bell className="w-5 h-5" />;
    }
};

const NoticeBoard = () => {
    const [notices, setNotices] = useState(INITIAL_NOTICES);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Create Form State
    const [newNotice, setNewNotice] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        author: 'Admin',
        type: 'general',
        image: null
    });

    const [editingId, setEditingId] = useState(null);

    const handleSaveNotice = () => {
        if (!newNotice.title || !newNotice.description) return;

        if (editingId) {
            // Update existing notice
            setNotices(notices.map(n =>
                n.id === editingId ? { ...newNotice, id: editingId } : n
            ));
        } else {
            // Create new notice
            const notice = {
                id: notices.length + 1,
                ...newNotice
            };
            setNotices([notice, ...notices]);
        }

        closeModal();
    };

    const handleEditNotice = (notice) => {
        setNewNotice({
            title: notice.title,
            date: notice.date,
            description: notice.description,
            author: notice.author,
            type: notice.type
        });
        setEditingId(notice.id);
        setIsCreateModalOpen(true);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setEditingId(null);
        setNewNotice({ title: '', date: new Date().toISOString().split('T')[0], description: '', author: 'Admin', type: 'general', image: null });
    };


    const handleDeleteNotice = (id) => {
        if (window.confirm("Delete this notice?")) {
            setNotices(notices.filter(n => n.id !== id));
        }
    };

    const handleDeleteAll = () => {
        if (window.confirm("Delete ALL notices? This cannot be undone.")) {
            setNotices([]);
        }
    }

    // Filter Logic
    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentPageContainer title="Notice Board" description="Manage school announcements and notices">
            <div className="nb-container">

                {/* Main Card */}
                <div className="nb-card">
                    {/* Toolbar */}
                    <div className="nb-card-body">
                        <div className="nb-toolbar">
                            <div className="nb-search-box">
                                <Search className="nb-search-icon" />
                                <input
                                    className="nb-search-input"
                                    placeholder="Search notices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="nb-actions">
                                <ExportToolbar
                                    rows={filteredNotices}
                                    columns={['Title', 'Date', 'Type', 'Description', 'Author']}
                                    rowKeys={['title', 'date', 'type', 'description', 'author']}
                                    title="Notices"
                                />
                                <button className="btn-nb-primary" onClick={() => {
                                    setEditingId(null);
                                    setNewNotice({ title: '', date: new Date().toISOString().split('T')[0], description: '', author: 'Admin', type: 'general', image: null });
                                    setIsCreateModalOpen(true);
                                }}>
                                    <Plus className="w-4 h-4" /> Post New Notice
                                </button>
                                {notices.length > 0 && (
                                    <button className="btn-nb-danger-outline" onClick={handleDeleteAll}>
                                        <Trash2 className="w-4 h-4" /> Delete All
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notice Grid */}
                        <div className="nb-grid">
                            {filteredNotices.length > 0 ? (
                                filteredNotices.map((notice) => (
                                    <div key={notice.id} className={`notice-card ${notice.type}`}>
                                        {/* Icon */}
                                        <div className="notice-icon-box">
                                            {getIconForType(notice.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="notice-content">
                                            <div className="notice-header">
                                                <h3 className="notice-title">{notice.title}</h3>
                                                <span className="notice-date">{notice.date}</span>
                                            </div>

                                            <p className="notice-desc">
                                                {notice.description}
                                            </p>

                                            {notice.image && (
                                                <div className="notice-attached-image-wrapper">
                                                    <img src={notice.image} alt="Attachment" className="notice-attached-image" />
                                                </div>
                                            )}

                                            <div className="notice-footer">
                                                <div className="notice-author">
                                                    Posted by {notice.author}
                                                </div>

                                                <div className="notice-actions">
                                                    <button className="action-btn" title="Edit" onClick={() => handleEditNotice(notice)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="action-btn delete" title="Delete" onClick={() => handleDeleteNotice(notice.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="nb-empty-state">
                                    <h3>No Notices Found</h3>
                                    <p>Try adjusting your search or add a new notice.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Clean Admin Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="nb-dialog-content sm:max-w-[500px]">
                    <div className="nb-modal-header">
                        <h3 className="nb-modal-title">{editingId ? 'Edit Notice' : 'Post New Notice'}</h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="nb-modal-body">
                        <div className="nb-form-group">
                            <label className="nb-label">Title</label>
                            <input
                                type="text"
                                className="nb-input"
                                placeholder="Enter notice title"
                                value={newNotice.title}
                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="nb-form-group">
                                <label className="nb-label">Date</label>
                                <input
                                    type="date"
                                    className="nb-input"
                                    value={newNotice.date}
                                    onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                                />
                            </div>
                            <div className="nb-form-group">
                                <label className="nb-label">Type</label>
                                <select
                                    className="nb-select"
                                    value={newNotice.type}
                                    onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                                >
                                    <option value="general">General</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="exam">Exam</option>
                                    <option value="alert">Alert</option>
                                    <option value="event">Event</option>
                                    <option value="meeting">Meeting</option>
                                </select>
                            </div>
                        </div>

                        <div className="nb-form-group">
                            <label className="nb-label">Message</label>
                            <textarea
                                className="nb-textarea"
                                placeholder="Type your message here..."
                                value={newNotice.description}
                                onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                            />
                        </div>

                        <div className="nb-form-group">
                            <label className="nb-label">Attachment (Optional)</label>
                            <label className="nb-file-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setNewNotice({ ...newNotice, image: url });
                                        }
                                    }}
                                />
                                {newNotice.image ? (
                                    <div className="nb-file-preview">
                                        <img src={newNotice.image} alt="Preview" />
                                        <div className="nb-file-preview-overlay">
                                            <ImageIcon className="w-6 h-6 mb-1" />
                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="nb-upload-placeholder">
                                        <ImageIcon className="w-8 h-8" style={{ color: '#94a3b8', marginBottom: 8 }} />
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Click to upload an image</span>
                                        <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>PNG, JPG or GIF (max. 5MB)</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="nb-modal-footer">
                        <button className="btn-nb-secondary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="btn-nb-primary" onClick={handleSaveNotice}>
                            {editingId ? 'Update Notice' : 'Publish Notice'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </StudentPageContainer>
    );
};

export default NoticeBoard;
