import React from 'react';
import { Link } from 'react-router-dom';
import { Save, X, User } from 'lucide-react';
import './HumanResourceDashboard.css';

const AddStaff = () => {
    return (
        <div className="hr-dashboard">
            <div className="hr-page-header">
                <div>
                    <h4 className="hr-page-title">Add New Staff</h4>
                    <nav className="hr-breadcrumb">
                        <Link to="/school/hr">Human Resource</Link>
                        <span> / </span>
                        <Link to="/school/hr/staff">Staff Directory</Link>
                        <span> / </span>
                        <span className="hr-breadcrumb-current">Add Staff</span>
                    </nav>
                </div>
            </div>

            <div className="hr-card" style={{ padding: '30px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd' }}>
                            <User size={40} color="#999" />
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 5px 0' }}>Staff Photograph</h5>
                            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Upload a professional photograph. Max 2MB.</p>
                            <button className="hr-table-btn" style={{ marginTop: '10px' }}>Upload Photo</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>First Name *</label>
                            <input type="text" className="hr-select" style={{ width: '100%', padding: '10px' }} placeholder="Enter first name" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Last Name *</label>
                            <input type="text" className="hr-select" style={{ width: '100%', padding: '10px' }} placeholder="Enter last name" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Gender *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }}>
                                <option>Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Date of Birth *</label>
                            <input type="date" className="hr-select" style={{ width: '100%', padding: '10px' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Department *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }}>
                                <option>Select Department</option>
                                <option>Teaching</option>
                                <option>Administration</option>
                                <option>Accounts</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Designation *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }}>
                                <option>Select Designation</option>
                                <option>Teacher</option>
                                <option>Principal</option>
                                <option>Manager</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <button className="hr-action-btn primary"><Save size={16} /> Save Staff Member</button>
                        <Link to="/school/hr/staff" className="hr-action-btn" style={{ background: '#f5f5f5', color: '#555', textDecoration: 'none' }}>Cancel</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;
