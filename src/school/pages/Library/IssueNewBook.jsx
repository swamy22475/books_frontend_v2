import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const IssueNewBook = () => {
    const navigate = useNavigate();
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
        navigate('/school/library/issue-return');
    };

    return (
        <div className="accounts-page" style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '40px',
            backgroundColor: 'var(--bg-main)'
        }}>
            <div className="modal-content add-income-modal" style={{ position: 'relative', margin: '0', transform: 'none', width: '100%', maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3>Issue</h3>
                    <button type="button" className="close-btn" onClick={() => navigate(-1)}>
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
                        <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn-submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IssueNewBook;
