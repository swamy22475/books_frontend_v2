import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './components/BackButton';
import { StudentContext } from '../../../context/StudentContext';
import {
    IconChartBar, IconChevronDown, IconPrinter, IconArrowRight
} from '@tabler/icons-react';
import './StudentProfile.css';

/* ─── Inline SVG Icons (to avoid react-feather if not available) ─── */
const UserIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
);
const AwardIcon = () => (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
);
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
);
const MailIcon = () => (
    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
);
const MapPinIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
);
const CreditCardIcon = () => (
    <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /></svg>
);
const BookIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
);
const PrinterIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
);
const EditIcon = () => (
    <svg viewBox="0 0 24 24"><path d="M3 21v-3.75L17.81 2.44a2 2 0 0 1 2.82 0l0 0a2 2 0 0 1 0 2.82L5.82 20.07 3 21z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
);

/* ─── Tab definitions ─── */
const TABS = [
    { id: 'personal', label: 'Personal', icon: UserIcon },
    { id: 'academic', label: 'Academic', icon: AwardIcon },
    { id: 'contact', label: 'Contact', icon: PhoneIcon },
    { id: 'address', label: 'Address', icon: MapPinIcon },
    { id: 'bank', label: 'Bank', icon: CreditCardIcon },
];

/* ─── Reusable detail row ─── */
const DetailRow = ({ label, value }) => (
    <div className="sp-detail-row">
        <div className="sp-detail-label">{label}</div>
        <div className={`sp-detail-value${!value ? ' empty' : ''}`}>{value || '—'}</div>
    </div>
);

/* ─── Main component ─── */
const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { students } = useContext(StudentContext);
    const [activeTab, setActiveTab] = useState('personal');

    const student = useMemo(() => students.find(s => s.id === id) || null, [id, students]);

    if (!student) {
        return (
            <div className="student-profile-page">
                <div className="sp-container">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, color: 'var(--ft-text-muted)' }}>
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        <p style={{ fontSize: 16, fontWeight: 500 }}>Student not found</p>
                        <button className="sp-action-btn primary" onClick={() => navigate('/school/student-list')}>
                            ← Back to Student List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const genderClass = student.gender === 'Male' ? 'male' : student.gender === 'Female' ? 'female' : 'other';

    /* ─── Tab content renderers ─── */
    const renderPersonal = () => (
        <div className="sp-section">
            <div className="sp-section-title"><UserIcon /> Personal Details</div>
            <div className="sp-detail-grid">
                <DetailRow label="Full Name" value={student.name} />
                <DetailRow label="Date of Birth" value={student.dob} />
                <DetailRow label="Gender" value={student.gender} />
                <DetailRow label="Blood Group" value={student.bloodGroup} />
                <DetailRow label="Mother Tongue" value={student.motherTongue} />
                <DetailRow label="Religion" value={student.religion} />
                <DetailRow label="Caste" value={student.caste} />
                <DetailRow label="Nationality" value={student.nationality} />
                <DetailRow label="Father Name" value={student.fatherName} />
                <DetailRow label="Mother Name" value={student.motherName} />
                <DetailRow label="Guardian Name" value={student.guardianName} />
                <DetailRow label="Guardian Relation" value={student.guardianRelation} />
            </div>
        </div>
    );

    const renderAcademic = () => (
        <div className="sp-section">
            <div className="sp-section-title"><BookIcon /> Academic Information</div>
            <div className="sp-detail-grid">
                <DetailRow label="Admission No" value={student.admissionNo || student.id} />
                <DetailRow label="Admission Date" value={student.admissionDate} />
                <DetailRow label="Class" value={student.class || student.className} />
                <DetailRow label="Section" value={student.section} />
                <DetailRow label="Roll Number" value={student.rollNo} />
                <DetailRow label="Joined Class" value={student.joinedClass} />
                <DetailRow label="Category" value={student.category || 'General'} />
                <DetailRow label="Medium" value={student.medium} />
                <DetailRow label="Previous School" value={student.previousSchool} />
                <DetailRow label="TC Number" value={student.tcNumber} />
            </div>
        </div>
    );

    const renderContact = () => (
        <div className="sp-section">
            <div className="sp-section-title"><PhoneIcon /> Contact Information</div>
            <div className="sp-detail-grid">
                <DetailRow label="Student Phone" value={student.phone} />
                <DetailRow label="Student Email" value={student.email} />
                <DetailRow label="Father Phone" value={student.fatherPhone} />
                <DetailRow label="Father Email" value={student.fatherEmail} />
                <DetailRow label="Mother Phone" value={student.motherPhone} />
                <DetailRow label="Mother Email" value={student.motherEmail} />
                <DetailRow label="Guardian Phone" value={student.guardianPhone} />
                <DetailRow label="Guardian Email" value={student.guardianEmail} />
            </div>
        </div>
    );

    const renderAddress = () => (
        <div className="sp-section">
            <div className="sp-section-title"><MapPinIcon /> Address Details</div>
            <div className="sp-detail-grid full-width">
                <DetailRow label="Current Address" value={student.address || student.currentAddress} />
                <DetailRow label="Permanent Address" value={student.permanentAddress} />
            </div>
            <div className="sp-detail-grid" style={{ marginTop: 8 }}>
                <DetailRow label="City / Village" value={student.village || student.city} />
                <DetailRow label="District" value={student.district} />
                <DetailRow label="State" value={student.state} />
                <DetailRow label="Pin Code" value={student.pinCode || student.pincode} />
            </div>
        </div>
    );

    const renderBank = () => (
        <div className="sp-section">
            <div className="sp-section-title"><CreditCardIcon /> Bank Details</div>
            <div className="sp-detail-grid">
                <DetailRow label="Account Holder" value={student.accountHolder || student.name} />
                <DetailRow label="Account No." value={student.accountNo} />
                <DetailRow label="Bank Name" value={student.bankName} />
                <DetailRow label="Branch" value={student.branch} />
                <DetailRow label="IFSC Code" value={student.ifscCode} />
                <DetailRow label="Aadhaar No." value={student.aadhaarNo || student.aadharNumber} />
            </div>
        </div>
    );

    const tabRenderers = { personal: renderPersonal, academic: renderAcademic, contact: renderContact, address: renderAddress, bank: renderBank };


    return (
        <div className="student-profile-page">
            <div className="sp-container">

                {/* ── Page Header ── */}
                <div className="sp-header">
                    <div className="sp-header-left">
                        <BackButton title="Go back to Student List" />
                        <div>
                            <h4>Student Profile</h4>
                            <nav className="sp-breadcrumb">
                                <span>Student Management</span> / <span>Students</span> / <span className="current">{student.name}</span>
                            </nav>
                        </div>
                    </div>
                    <div className="sp-header-actions">
                        <button className="sp-action-btn success" onClick={() => navigate(`/school/student-analytics/${student.id}`)}>
                            <IconChartBar size={18} /> Analytics Dashboard
                        </button>
                        <button className="sp-action-btn" onClick={() => window.print()}>
                            <PrinterIcon /> Print
                        </button>
                        <button className="sp-action-btn primary" onClick={() => navigate('/school/student-list/add', { state: { editId: student.id } })}>
                            <EditIcon /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Main Layout ── */}
                <div className="sp-layout">

                    {/* Left: Profile Card */}
                    <div>
                        <div className="sp-profile-card">
                            <div className="sp-profile-banner" />
                            <div className="sp-profile-body">
                                <div className="sp-avatar-ring">
                                    {student.image ? (
                                        <img src={student.image} alt={student.name} />
                                    ) : (
                                        <div className={`sp-avatar-placeholder ${genderClass}`}>
                                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                </div>
                                <h2 className="sp-student-name">{student.name}</h2>
                                <span className="sp-admission-badge">{student.admissionNo || student.id}</span>
                                <div className="sp-quick-stats">
                                    <div className="sp-stat-item">
                                        <span className="sp-stat-label">Class</span>
                                        <span className="sp-stat-value">{student.class || student.className || '—'}</span>
                                    </div>
                                    <div className="sp-stat-item">
                                        <span className="sp-stat-label">Section</span>
                                        <span className="sp-stat-value">{student.section || '—'}</span>
                                    </div>
                                    <div className="sp-stat-item">
                                        <span className="sp-stat-label">Roll No</span>
                                        <span className="sp-stat-value">{student.rollNo || '—'}</span>
                                    </div>
                                    <div className="sp-stat-item">
                                        <span className="sp-stat-label">Gender</span>
                                        <span className="sp-stat-value">{student.gender || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact info mini card */}
                        <div className="sp-contact-card">
                            <h3 className="sp-contact-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                Quick Contact
                            </h3>
                            <div className="sp-contact-row">
                                <div className="sp-contact-icon"><PhoneIcon /></div>
                                <div className="sp-contact-info">
                                    <div className="sp-contact-info-label">Phone</div>
                                    <div className="sp-contact-info-value">{student.phone || student.fatherPhone || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="sp-contact-row">
                                <div className="sp-contact-icon"><MailIcon /></div>
                                <div className="sp-contact-info">
                                    <div className="sp-contact-info-label">Email</div>
                                    <div className="sp-contact-info-value">{student.email || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="sp-contact-row">
                                <div className="sp-contact-icon"><MapPinIcon /></div>
                                <div className="sp-contact-info">
                                    <div className="sp-contact-info-label">Address</div>
                                    <div className="sp-contact-info-value">{student.address || student.currentAddress || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Tabbed Details */}
                    <div className="sp-details-panel">
                        <div className="sp-tabs" role="tablist">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        className={`sp-tab${activeTab === tab.id ? ' active' : ''}`}
                                        onClick={() => setActiveTab(tab.id)}
                                        role="tab"
                                        aria-selected={activeTab === tab.id}
                                        id={`sp-tab-${tab.id}`}
                                    >
                                        <Icon />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="sp-tab-content" key={activeTab}>
                            {tabRenderers[activeTab]()}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentProfile;
