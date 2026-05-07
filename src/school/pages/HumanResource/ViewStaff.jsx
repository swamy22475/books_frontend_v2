import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Briefcase, Building2, User, FileText, ArrowLeft, Edit2 } from 'lucide-react';
import './HumanResourceDashboard.css';

const ViewStaff = () => {
    const { id } = useParams();

    // In a real app, you'd fetch staff data by ID
    const staff = {
        name: 'Rahul Sharma',
        role: 'Manager',
        dept: 'Administration',
        email: 'rahul@school.com',
        phone: '9876543210',
        status: 'Active',
        dob: '12 May 1985',
        joiningDate: '01 Jan 2020',
        qualification: 'MBA',
        address: '123, School Lane, Education City',
        emergencyContact: 'Meera Sharma (9876543211)',
        experience: '15 Years',
        bloodGroup: 'B+'
    };

    return (
        <div className="hr-dashboard">
            <div className="hr-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/school/hr/staff" className="hr-table-btn" style={{ padding: '8px' }}><ArrowLeft size={18} /></Link>
                    <div>
                        <h4 className="hr-page-title">Staff Details</h4>
                        <div className="hr-breadcrumb">Human Resource / Staff / {staff.name}</div>
                    </div>
                </div>
                <div className="hr-header-actions">
                    <Link to={`/school/hr/staff/edit/${id}`} className="hr-action-btn primary">
                        <Edit2 size={16} /> Edit Profile
                    </Link>
                </div>
            </div>

            <div className="hr-row-grid alternate">
                {/* Left Column: Basic Info Card */}
                <div className="hr-card sm-span">
                    <div style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: '#3d5ee115',
                            color: '#3d5ee1',
                            fontSize: '40px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            RS
                        </div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{staff.name}</h4>
                        <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>{staff.role}</p>
                        <span className="hr-status-badge approved" style={{ marginTop: '15px', display: 'inline-block' }}>
                            {staff.status}
                        </span>

                        <div style={{ marginTop: '30px', textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Mail size={16} color="#3d5ee1" />
                                <span style={{ fontSize: '14px' }}>{staff.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Phone size={16} color="#3d5ee1" />
                                <span style={{ fontSize: '14px' }}>{staff.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <MapPin size={16} color="#3d5ee1" />
                                <span style={{ fontSize: '14px' }}>{staff.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Tabs */}
                <div className="hr-card lg-span">
                    <div className="hr-card-header">
                        <h5 className="hr-card-title">Professional Information</h5>
                    </div>
                    <div style={{ padding: '25px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Department</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Building2 size={16} color="#666" />
                                    <span style={{ fontWeight: '600' }}>{staff.dept}</span>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Date of Joining</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} color="#666" />
                                    <span style={{ fontWeight: '600' }}>{staff.joiningDate}</span>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Qualification</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} color="#666" />
                                    <span style={{ fontWeight: '600' }}>{staff.qualification}</span>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Experience</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Briefcase size={16} color="#666" />
                                    <span style={{ fontWeight: '600' }}>{staff.experience}</span>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Date of Birth</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={16} color="#666" />
                                    <span style={{ fontWeight: '600' }}>{staff.dob}</span>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Blood Group</h6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#ea5455', display: 'inline-block' }}></div>
                                    <span style={{ fontWeight: '600' }}>{staff.bloodGroup}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', background: '#f8f9fc', borderRadius: '12px', padding: '20px' }}>
                            <h6 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} color="#ff9f43" />
                                Emergency Contact Information
                            </h6>
                            <p style={{ margin: 0, fontSize: '14px' }}>{staff.emergencyContact}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertCircle = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

export default ViewStaff;
