import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconBuildingHospital,
    IconCategory,
    IconBed,
    IconUsers,
    IconChevronRight,
    IconHome,
    IconPlus,
    IconSearch,
    IconEdit,
    IconTrash,
    IconX,
    IconChevronLeft
} from '@tabler/icons-react';
import '../Examination/ExamSchedule.css';
import '../Accounts/Accounts.css';

const HostelDashboard = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Initial dummy data for hostels
    const [hostels, setHostels] = useState([
        { id: 1, name: 'Boys Premier Hostel', category: 'Luxury', address: 'North Campus, Building A', intake: 150, occupied: 120, description: 'Premium boys dormitory with AC' },
        { id: 2, name: 'Girls Serenity Hall', category: 'Normal', address: 'South Campus, Block C', intake: 100, occupied: 85, description: 'Secure girls residence' },
        { id: 3, name: 'Standard Mix Hostel', category: 'Normal', address: 'East Wing', intake: 200, occupied: 190, description: 'Large capacity hostel' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        address: '',
        intake: '',
        description: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const stats = [
        {
            title: 'Total Hostels',
            count: hostels.length,
            icon: IconBuildingHospital,
            color: 'var(--primary)',
            path: '/school/hostel/manage'
        },
        {
            title: 'Hostel Categories',
            count: 3,
            icon: IconCategory,
            color: 'var(--success)',
            path: '/school/hostel/category'
        },
        {
            title: 'Total Capacity',
            count: hostels.reduce((acc, curr) => acc + Number(curr.intake), 0),
            icon: IconBed,
            color: 'var(--warning)',
            path: '/school/hostel/rooms'
        },
        {
            title: 'Total Occupancy',
            count: hostels.reduce((acc, curr) => acc + Number(curr.occupied), 0),
            icon: IconUsers,
            color: 'var(--error)',
            path: '/school/hostel/allocation'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', category: '', address: '', intake: '', description: '' });
        setShowAddModal(true);
    };

    const handleEdit = (hostel) => {
        setIsEditing(true);
        setEditingId(hostel.id);
        setFormData({
            name: hostel.name,
            category: hostel.category,
            address: hostel.address,
            intake: hostel.intake,
            description: hostel.description || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            setHostels(hostels.filter(h => h.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            setHostels(hostels.map(h =>
                h.id === editingId
                    ? { ...h, ...formData }
                    : h
            ));
        } else {
            const newHostel = {
                ...formData,
                id: Date.now(),
                occupied: 0,
            };
            setHostels(prev => [newHostel, ...prev]);
        }

        setShowAddModal(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', category: '', address: '', intake: '', description: '' });
    };

    const filteredHostels = hostels.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)} style={{ background: 'var(--bg-main)', border: 'none', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)' }}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Hostel Dashboard</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span className="current">Hostel Dashboard</span>
                    </nav>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleOpenAddModal}>
                        <IconPlus size={18} />
                        Add New Hostel
                    </button>
                </div>
            </div>

            <div className="stats-row">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        onClick={() => navigate(stat.path)}
                        style={{ cursor: 'pointer', background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    >
                        <div className="stat-icon" style={{ background: `color-mix(in oklab, ${stat.color} 12%, transparent)`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label" style={{ color: 'var(--text-secondary)' }}>{stat.title}</span>
                            <h3 className="stat-value" style={{ color: 'var(--text-primary)' }}>{stat.count}</h3>
                        </div>
                        <IconChevronRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
                    </div>
                ))}
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Hostel Information List</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '380px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search by hostel name, address..."
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
                                <th>Category</th>
                                <th>Address</th>
                                <th>Capacity</th>
                                <th>Occupied</th>
                                <th>Availability</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHostels.length > 0 ? filteredHostels.map(hostel => (
                                <tr key={hostel.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{hostel.name}</td>
                                    <td><span className="badge-category" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>{hostel.category}</span></td>
                                    <td style={{ color: 'var(--text-primary)' }}>{hostel.address}</td>
                                    <td className="text-center" style={{ color: 'var(--text-primary)' }}>{hostel.intake}</td>
                                    <td className="text-center" style={{ color: 'var(--text-primary)' }}>{hostel.occupied}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(hostel.occupied / hostel.intake) * 100}%`, height: '100%', background: (hostel.occupied / hostel.intake) > 0.8 ? 'var(--error)' : 'var(--success)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '600', minWidth: '30px', color: 'var(--text-primary)' }}>{hostel.intake - hostel.occupied}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" title="Edit" onClick={() => handleEdit(hostel)}><IconEdit size={16} /></button>
                                            <button className="action-btn delete" title="Delete" onClick={() => handleDelete(hostel.id)}><IconTrash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-8" style={{ color: 'var(--text-secondary)' }}>No hostels found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Form Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Hostel Details' : 'Add New Hostel Details'}</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconX size={20} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Hostel Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter hostel name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hostel Category <span style={{ color: '#ea5455' }}>*</span></label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Luxury">Luxury</option>
                                        <option value="AC">AC</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Intake (Capacity) <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input
                                        type="number"
                                        name="intake"
                                        value={formData.intake}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter total capacity"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Hostel Address <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full address"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter hostel details or rules"
                                ></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">{isEditing ? 'Save Changes' : 'Register Hostel'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelDashboard;
