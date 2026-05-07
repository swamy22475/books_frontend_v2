import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, UserPlus, FileText, MoreVertical, Mail, Phone, MapPin, Eye, Edit2 } from 'lucide-react';
import './HumanResourceDashboard.css'; // Reusing some styles

const staffData = [
    { id: 1, name: 'Rahul Sharma', role: 'Manager', dept: 'Administration', email: 'rahul@school.com', phone: '9876543210', status: 'Active', color: '#3d5ee1' },
    { id: 2, name: 'Anita Rao', role: 'Teacher', dept: 'Teaching', email: 'anita@school.com', phone: '9123456780', status: 'Active', color: '#28c76f' },
    { id: 3, name: 'Suresh Kumar', role: 'Driver', dept: 'Transport', email: 'suresh@school.com', phone: '9988776655', status: 'Active', color: '#ff9f43' },
    { id: 4, name: 'Meena Iyer', role: 'Accountant', dept: 'Accounts', email: 'meena@school.com', phone: '9012345678', status: 'Inactive', color: '#ea5455' },
    { id: 5, name: 'Jessica Taylor', role: 'Teacher', dept: 'Teaching', email: 'jessica@school.com', phone: '9012345000', status: 'Active', color: '#7367f0' },
];

const StaffDirectory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredStaff = staffData.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || staff.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="hr-dashboard">
            <div className="hr-page-header">
                <div>
                    <h4 className="hr-page-title">Staff Directory</h4>
                    <nav className="hr-breadcrumb">
                        <span>Human Resource</span>
                        <span> / </span>
                        <span className="hr-breadcrumb-current">Staff Directory</span>
                    </nav>
                </div>
                <div className="hr-header-actions">
                    <button className="hr-action-btn primary" onClick={() => navigate('/school/hr/staff/add')}>
                        <UserPlus size={16} /> Add Staff
                    </button>
                    <button className="hr-action-btn"><FileText size={16} /> Export</button>
                </div>
            </div>

            <div className="hr-card">
                <div className="hr-card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
                    <div className="search-box" style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search staff name or role..."
                            className="hr-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select className="hr-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                </div>
                <div className="hr-table-wrap" style={{ padding: '0' }}>
                    <table className="hr-mini-table">
                        <thead>
                            <tr>
                                <th>Staff Name</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map(staff => (
                                <tr key={staff.id}>
                                    <td>
                                        <div className="hr-staff-info">
                                            <div className="hr-avatar">
                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{staff.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{staff.role}</td>
                                    <td>{staff.dept}</td>
                                    <td>
                                        <div style={{ fontSize: '12px' }}>{staff.email}</div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>{staff.phone}</div>
                                    </td>
                                    <td>
                                        <span className={`hr-status-badge ${staff.status === 'Active' ? 'approved' :
                                            staff.status === 'On Leave' ? 'pending' :
                                                'rejected'
                                            }`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                className="hr-table-btn"
                                                title="View Profile"
                                                onClick={() => navigate(`/school/hr/staff/view/${staff.id}`)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="hr-table-btn"
                                                title="Edit Profile"
                                                style={{ color: '#3d5ee1' }}
                                                onClick={() => navigate(`/school/hr/staff/edit/${staff.id}`)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="hr-table-btn"
                                                title="Delete"
                                                style={{ color: '#ea5455' }}
                                            >
                                                <MoreVertical size={16} />
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
    );
};

export default StaffDirectory;
