import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const Permissions = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        roleName: '',
        permissions: [],
    });

    const [roles, setRoles] = useState([
        { id: 1, roleName: 'Hostel Warden', permissions: ['Manage Allocation', 'Manage Rooms', 'View Reports'] },
        { id: 2, roleName: 'Hostel Admin', permissions: ['All Permissions'] },
    ]);

    const availablePermissions = ['Manage Allocation', 'Manage Rooms', 'Manage Room Types', 'Manage Hostels', 'View Reports', 'All Permissions'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newPerms = [...formData.permissions];
        if (checked) {
            newPerms.push(value);
        } else {
            newPerms = newPerms.filter(p => p !== value);
        }
        setFormData(prev => ({ ...prev, permissions: newPerms }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAddModal(false);
    };

    const handleEdit = (role) => {
        setFormData(role);
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this permission role?")) {
            setRoles(prev => prev.filter(item => item.id !== id));
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
                        <h4>Hostel Permissions</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Hostel</span> / <span className="current">Permissions</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconPlus size={18} />
                    Add Role Rule
                </button>
            </div>

            <div className="accounts-card">
                <div className="card-header">
                    <h5>Configured Permissions</h5>
                </div>
                <div className="card-body">
                    <div className="filters-row">
                        <div className="search-box">
                            <IconSearch size={18} />
                            <input
                                type="text"
                                placeholder="Search by role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Assigned Permissions</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(role => (
                                    <tr key={role.id}>
                                        <td style={{ fontWeight: '500' }}>{role.roleName}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {role.permissions.map((p, idx) => (
                                                    <span key={idx} style={{ background: '#e0e7ff', color: '#4361ee', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(role)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(role.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header">
                            <h3>Assign Permissions</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <div className="form-group full-width">
                                <label>Role Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="text" name="roleName" value={formData.roleName} onChange={handleChange} required placeholder="Enter role name" />
                            </div>
                            <div className="form-group full-width">
                                <label>Permissions</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                    {availablePermissions.map((perm, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                value={perm}
                                                checked={formData.permissions.includes(perm)}
                                                onChange={handleCheckboxChange}
                                                style={{ width: 'auto' }}
                                            />
                                            {perm}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: '20px' }}>
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Permissions;
