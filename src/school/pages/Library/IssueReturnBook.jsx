import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconBook, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const IssueReturnBook = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        bookTitle: '',
        memberName: '',
        issueDate: '',
        dueDate: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Book Issued:', formData);
        setShowAddModal(false);
    };

    const [recentIssues, setRecentIssues] = useState([
        { id: 1, bookTitle: 'The Great Gatsby', memberName: 'John Doe', issueDate: '2026-02-15', dueDate: '2026-03-01', status: 'Issued' },
        { id: 2, bookTitle: 'A Brief History of Time', memberName: 'Jane Smith', issueDate: '2026-02-10', dueDate: '2026-02-24', status: 'Overdue' },
        { id: 3, bookTitle: 'To Kill a Mockingbird', memberName: 'Samuel Wilson', issueDate: '2026-02-18', dueDate: '2026-03-04', status: 'Returned' },
    ]);

    const handleReturn = (id) => {
        if (window.confirm("Are you sure you want to return this book?")) {
            setRecentIssues(prev =>
                prev.map(issue =>
                    issue.id === id ? { ...issue, status: 'Returned' } : issue
                )
            );
        }
    };

    const handleReIssue = (issue) => {
        setFormData({
            bookTitle: issue.bookTitle,
            memberName: issue.memberName,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: '', // Needs to be filled
            remarks: ''
        });
        setShowAddModal(true);
    };

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Issue / Return Book</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Library</span> / <span className="current">Issue & Return</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconBook size={18} />
                    Issue New Book
                </button>
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Search & Manage Issues</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '360px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search by book title or member name..."
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    padding: '0',
                                    height: '100%',
                                    width: '100%',
                                    boxShadow: 'none'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Member Name</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentIssues.map(issue => (
                                    <tr key={issue.id}>
                                        <td>{issue.bookTitle}</td>
                                        <td>{issue.memberName}</td>
                                        <td>{issue.issueDate}</td>
                                        <td>{issue.dueDate}</td>
                                        <td>
                                            <span className={`status-badge ${issue.status.toLowerCase()}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn edit" title="Re-issue" onClick={() => handleReIssue(issue)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Return Book" onClick={() => handleReturn(issue.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header">
                            <h3>Issue</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Book Title <span style={{ color: '#ea5455' }}>*</span></label>
                                <select
                                    name="bookTitle"
                                    value={formData.bookTitle}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Book</option>
                                    <option value="The Great Gatsby">The Great Gatsby</option>
                                    <option value="A Brief History of Time">A Brief History of Time</option>
                                    <option value="To Kill a Mockingbird">To Kill a Mockingbird</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Member Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <select
                                    name="memberName"
                                    value={formData.memberName}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Member</option>
                                    <option value="John Doe">John Doe</option>
                                    <option value="Jane Smith">Jane Smith</option>
                                    <option value="Samuel Wilson">Samuel Wilson</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Issue Date <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Due Date <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter remarks"
                                ></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssueReturnBook;
