import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const StudentAllocation = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        admissionNo: '',
        hostelName: '',
        roomNo: '',
        roomType: '',
    });

    const [allocations, setAllocations] = useState([
        { id: 1, studentName: 'John Doe', admissionNo: 'ADM1001', hostelName: 'Boys Hostel A', roomNo: '101', roomType: '2 Seater' },
        { id: 2, studentName: 'Jane Smith', admissionNo: 'ADM1002', hostelName: 'Girls Hostel B', roomNo: '205', roomType: '4 Seater' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAddModal(false);
    };

    const handleEdit = (allocation) => {
        setFormData(allocation);
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this allocation?")) {
            setAllocations(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Student Allocation</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Hostel</span> / <span className="current">Student Allocation</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconPlus size={18} />
                    Add Allocation
                </button>
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Allocated Students</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '360px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search student..."
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

                <div className="table-container p-0">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Admission No</th>
                                <th>Hostel Name</th>
                                <th>Room No</th>
                                <th>Room Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.map(allocation => (
                                <tr key={allocation.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{allocation.studentName}</td>
                                    <td style={{ color: 'var(--text-primary)' }}>{allocation.admissionNo}</td>
                                    <td style={{ color: 'var(--text-primary)' }}>{allocation.hostelName}</td>
                                    <td style={{ color: 'var(--text-primary)' }}>{allocation.roomNo}</td>
                                    <td style={{ color: 'var(--text-primary)' }}><span className="badge-category" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>{allocation.roomType}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" title="Edit" onClick={() => handleEdit(allocation)}><IconEdit size={16} /></button>
                                            <button className="action-btn delete" title="Delete" onClick={() => handleDelete(allocation.id)}><IconTrash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content add-income-modal">
                            <div className="modal-header">
                                <h3>Add Allocation</h3>
                                <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                    <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                                </button>
                            </div>
                            <form className="modal-body" onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                <div className="form-group full-width">
                                    <label>Student Name <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required placeholder="Enter student name" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Admission No <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleChange} required placeholder="Enter admission number" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Hostel Name <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input type="text" name="hostelName" value={formData.hostelName} onChange={handleChange} required placeholder="Select hostel" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Room No <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} required placeholder="Select room" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default StudentAllocation;
