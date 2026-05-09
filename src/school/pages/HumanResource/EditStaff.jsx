import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Save, X, User, ArrowLeft } from 'lucide-react';
import './HumanResourceDashboard.css';

const EditStaff = () => {
    const { id } = useParams();

    // In a real app, fetch data by id
    const staff = {
        firstName: 'Rahul',
        lastName: 'Sharma',
        gender: 'Male',
        dob: '1985-05-12',
        dept: 'Administration',
        designation: 'Manager'
    };

    return (
        <div className="hr-dashboard">
            <div className="hr-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to={`/school/hr/staff/view/${id}`} className="hr-table-btn" style={{ padding: '8px' }}><ArrowLeft size={18} /></Link>
                    <div>
                        <h4 className="hr-page-title">Edit Staff Profile</h4>
                        <div className="hr-breadcrumb">Human Resource / Staff / Edit / {staff.firstName} {staff.lastName}</div>
                    </div>
                </div>
            </div>

            <div className="hr-card" style={{ padding: '30px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#3d5ee110', color: '#3d5ee1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #3d5ee1' }}>
                            <span style={{ fontSize: '32px', fontWeight: '600' }}>RS</span>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 5px 0' }}>Profile Photograph</h5>
                            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Update photograph. Max 2MB.</p>
                            <button className="hr-table-btn" style={{ marginTop: '10px' }}>Change Photo</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>First Name *</label>
                            <input type="text" className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.firstName} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Last Name *</label>
                            <input type="text" className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.lastName} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Gender *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.gender}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Date of Birth *</label>
                            <input type="date" className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.dob} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Department *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.dept}>
                                <option>Teaching</option>
                                <option>Administration</option>
                                <option>Accounts</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Designation *</label>
                            <select className="hr-select" style={{ width: '100%', padding: '10px' }} defaultValue={staff.designation}>
                                <option>Teacher</option>
                                <option>Principal</option>
                                <option>Manager</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <button className="hr-action-btn primary"><Save size={16} /> Save Changes</button>
                        <Link to={`/school/hr/staff/view/${id}`} className="hr-action-btn" style={{ background: '#f5f5f5', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <X size={16} /> Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditStaff;
