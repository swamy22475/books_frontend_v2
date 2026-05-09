import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const ManageHostels = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        hostelName: '',
        type: '',
        address: '',
        intake: '',
        description: '',
    });

    const [hostels, setHostels] = useState([
        { id: 1, hostelName: 'Boys Hostel A', type: 'Boys', address: 'North Campus', intake: 150, description: 'Main boys dormitory' },
        { id: 2, hostelName: 'Girls Hostel B', type: 'Girls', address: 'South Campus', intake: 100, description: 'Main girls dormitory' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAddModal(false);
    };

    const handleEdit = (hostel) => {
        setFormData(hostel);
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this hostel?")) {
            setHostels(prev => prev.filter(item => item.id !== id));
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
                        <h4>Manage Hostels</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Hostel</span> / <span className="current">Manage Hostels</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconPlus size={18} />
                    Add Hostel
                </button>
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Hostel List</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '360px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search hostel..."
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
                                <th>Hostel Name</th>
                                <th>Type</th>
                                <th>Address</th>
                                <th>Intake</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hostels.map(hostel => (
                                <tr key={hostel.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{hostel.hostelName}</td>
                                    <td style={{ color: 'var(--text-primary)' }}><span className="badge-category" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>{hostel.type}</span></td>
                                    <td style={{ color: 'var(--text-primary)' }}>{hostel.address}</td>
                                    <td style={{ color: 'var(--text-primary)' }}>{hostel.intake}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{hostel.description}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" title="Edit" onClick={() => handleEdit(hostel)}><IconEdit size={16} /></button>
                                            <button className="action-btn delete" title="Delete" onClick={() => handleDelete(hostel.id)}><IconTrash size={16} /></button>
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
                                <h3>Add Hostel</h3>
                                <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                    <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                                </button>
                            </div>
                            <form className="modal-body" onSubmit={handleSubmit}>
                                <div className="form-group full-width">
                                    <label>Hostel Name <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input type="text" name="hostelName" value={formData.hostelName} onChange={handleChange} required placeholder="Enter hostel name" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Type <span style={{ color: '#ea5455' }}>*</span></label>
                                    <select name="type" value={formData.type} onChange={handleChange} required>
                                        <option value="">Select Type</option>
                                        <option value="Boys">Boys</option>
                                        <option value="Girls">Girls</option>
                                        <option value="Combine">Combine</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Intake</label>
                                    <input type="number" name="intake" value={formData.intake} onChange={handleChange} placeholder="Enter capacity" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Enter definition"></textarea>
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

export default ManageHostels;
