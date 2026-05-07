import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import {
    IconPhone, IconMail, IconMapPin, IconEdit,
    IconFileText, IconCalendar, IconUser, IconHash,
    IconCurrencyDollar, IconBuilding, IconBus, IconEye,
    IconDownload, IconPlus, IconX, IconClock, IconSettings, IconChevronDown, IconCheck, IconRefresh, IconUserX, IconChevronLeft
} from '@tabler/icons-react';
import { getTeachers } from './teachersData';
import './Teachers.css';

const TeacherDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'details';

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    const [activeSubTab, setActiveSubTab] = useState('attendance');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);

    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('This Year');
    const [selectedYear, setSelectedYear] = useState('2024 / 2025');
    const [activeWidgetTab, setActiveWidgetTab] = useState('hostel');

    const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
    const [itemsPerPageAttendance, setItemsPerPageAttendance] = useState(10);

    const teachers = getTeachers();
    const teacher = teachers.find(t => t.id === id) || teachers[0];
    console.log('TeacherDetails id:', id, 'Teacher found:', teacher);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.year-selector-container') &&
                !event.target.closest('.action-dropdown-container') &&
                !event.target.closest('.custom-select-box-ref')) {
                setShowYearDropdown(false);
                setShowTimeRangeDropdown(false);
                setShowExportDropdown(false);
                setShowEntriesDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!teacher) return <div>Teacher not found</div>;

    const ApplyLeaveModal = () => (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px' }}>
                <div className="modal-header">
                    <h3>Apply Leave</h3>
                    <button className="close-btn" onClick={() => setShowApplyLeaveModal(false)}><IconX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Leave Date</label>
                        <input type="date" className="form-control" defaultValue="2024-05-15" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select className="form-control">
                            <option>Select</option>
                            <option>Casual Leave</option>
                            <option>Medical Leave</option>
                            <option>Maternity Leave</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Leave From date</label>
                            <input type="date" className="form-control" defaultValue="2024-05-15" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Leave to Date</label>
                            <input type="date" className="form-control" defaultValue="2024-05-15" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Leave Days</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="leaveday" /> Full Day
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="leaveday" /> First Half
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="leaveday" /> Second Half
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">No of Days</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <input type="text" className="form-control" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setShowApplyLeaveModal(false)}>Cancel</button>
                    <button className="btn-submit">Apply Leave</button>
                </div>
            </div>
        </div>
    );

    const LoginDetailsModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Login Details</h3>
                    <button className="close-btn" onClick={() => setShowLoginModal(false)}><IconX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="modal-profile-header">
                        <img src={teacher.avatar} alt={teacher.name} className="modal-avatar" />
                        <div>
                            <h4>{teacher.name}</h4>
                            <span>{teacher.class}</span>
                        </div>
                    </div>
                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>User Type</th>
                                <th>User Name</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Parent</td>
                                <td>parent53</td>
                                <td>parent@53</td>
                            </tr>
                            <tr>
                                <td>Teacher</td>
                                <td>teacher20</td>
                                <td>teacher@53</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setShowLoginModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="teacher-details-page">
            <div className="page-header-row">
                <div className="breadcrumb">
                    <h2>Teacher Details</h2>
                    <span>Dashboard / Teachers / Teacher Details</span>
                </div>
                <div className="header-actions">
                    <button className="btn-login-details" onClick={() => setShowLoginModal(true)}>
                        Login Details
                    </button>
                    <button className="btn-edit-teacher" onClick={() => navigate(`/school/teachers/edit/${teacher.id}`)}>
                        Edit Teacher
                    </button>
                </div>
            </div>

            <div className="profile-layout">
                {/* Left Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-header-widget">
                        <div className="profile-image-container">
                            <img src={teacher.avatar} alt={teacher.name} />
                        </div>
                        <div className="profile-basic-info">
                            <h3>{teacher.name}</h3>
                            <span className="profile-id">{teacher.id}</span>
                            <span className="join-date">Joined : {teacher.joinDate}</span>
                        </div>
                    </div>

                    <div className="widget-card">
                        <h4>Basic Information</h4>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="label">Class & Section</span>
                                <span className="value">{teacher.class}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Subject</span>
                                <span className="value">{teacher.subject}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Gender</span>
                                <span className="value">Female</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Blood Group</span>
                                <span className="value">O+ve</span>
                            </div>
                        </div>
                    </div>

                    <div className="widget-card">
                        <h4>Primary Contact Info</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="icon-box"><IconPhone size={18} /></div>
                                <div>
                                    <span className="label">Phone Number</span>
                                    <span className="value">{teacher.phone}</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="icon-box"><IconMail size={18} /></div>
                                <div>
                                    <span className="label">Email Address</span>
                                    <span className="value">{teacher.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="widget-card">
                        <h4>PAN Number / ID Number</h4>
                        <div className="id-info">
                            <IconHash size={18} />
                            <span>343445954908</span>
                        </div>
                    </div>

                </div>

                {/* Right Content */}
                <div className="profile-content">
                    <div className="content-tabs">
                        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>
                            <IconUser size={18} /> Teacher Details
                        </button>
                        <button className={activeTab === 'leave' ? 'active' : ''} onClick={() => setActiveTab('leave')}>
                            <IconFileText size={18} /> Leave & Attendance
                        </button>
                        <button className={activeTab === 'salary' ? 'active' : ''} onClick={() => setActiveTab('salary')}>
                            <IconCurrencyDollar size={18} /> Salary
                        </button>
                        <button className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>
                            <IconFileText size={18} /> Library
                        </button>
                    </div>

                    <div className="tab-content-area">
                        {activeTab === 'details' && (
                            <div className="about-tab">
                                <div className="card-section">
                                    <div className="section-header-row">
                                        <div className="section-title">Profile Details</div>
                                        <button className="btn-icon"><IconEdit size={16} /></button>
                                    </div>
                                    <div className="details-grid-3">
                                        <div className="grid-item">
                                            <span className="label">Father's Name</span>
                                            <span className="value">{teacher.fatherName || 'Francis Saviour'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Mother Name</span>
                                            <span className="value">{teacher.motherName || 'Stella Bruce'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">DOB</span>
                                            <span className="value">{teacher.dob || '25 Jan 1992'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Marital Status</span>
                                            <span className="value">{teacher.maritalStatus || 'Single'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Qualification</span>
                                            <span className="value">{teacher.qualification || 'MBA'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Experience</span>
                                            <span className="value">{teacher.experience || '2 Years'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="two-col-layout">
                                    <div className="card-section">
                                        <div className="section-title">Documents</div>
                                        <div className="documents-list">
                                            <div className="doc-item">
                                                <div className="doc-icon-pdf">PDF</div>
                                                <span className="doc-name">Resume.pdf</span>
                                                <button className="btn-download"><IconDownload size={16} /></button>
                                            </div>
                                            <div className="doc-item">
                                                <div className="doc-icon-pdf">PDF</div>
                                                <span className="doc-name">Joining Letter.pdf</span>
                                                <button className="btn-download"><IconDownload size={16} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-section">
                                        <div className="section-title">Address</div>
                                        <div className="address-list">
                                            <div className="address-item">
                                                <span className="addr-label">Current Address</span>
                                                <span className="addr-value">{teacher.address || '3495 Red Hawk Road, Buffalo Lake, MN 55314'}</span>
                                            </div>
                                            <div className="address-item">
                                                <span className="addr-label">Permanent Address</span>
                                                <span className="addr-value">{teacher.permanentAddress || '3495 Red Hawk Road, Buffalo Lake, MN 55314'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-section">
                                    <div className="section-header-row">
                                        <div className="section-title">Previous School Details</div>
                                        <button className="btn-icon"><IconEdit size={16} /></button>
                                    </div>
                                    <div className="details-grid-3">
                                        <div className="grid-item">
                                            <span className="label">Previous School Name</span>
                                            <span className="value">Oxford Matriculation, USA</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">School Address</span>
                                            <span className="value">1852 Barnes Avenue, Cincinnati, OH 45202</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Phone Number</span>
                                            <span className="value">+1 35676 45556</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="two-col-layout">
                                    <div className="card-section">
                                        <div className="section-title">Bank Details</div>
                                        <div className="details-grid-3">
                                            <div className="grid-item">
                                                <span className="label">Bank Name</span>
                                                <span className="value">{teacher.bankName || 'Bank of America'}</span>
                                            </div>
                                            <div className="grid-item">
                                                <span className="label">Branch</span>
                                                <span className="value">{teacher.branch || 'Cincinnati'}</span>
                                            </div>
                                            <div className="grid-item">
                                                <span className="label">IFSC</span>
                                                <span className="value">{teacher.ifsc || 'BOA83209832'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-section">
                                        <div className="section-title">Work Details</div>
                                        <div className="details-grid-3">
                                            <div className="grid-item">
                                                <span className="label">Contract Type</span>
                                                <span className="value">{teacher.contractType || 'Permanent'}</span>
                                            </div>
                                            <div className="grid-item">
                                                <span className="label">Shift</span>
                                                <span className="value">{teacher.shift || 'Morning'}</span>
                                            </div>
                                            <div className="grid-item">
                                                <span className="label">Work Location</span>
                                                <span className="value">{teacher.workLocation || '2nd Floor'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-section">
                                    <div className="section-title">Social Media</div>
                                    <div className="details-grid-5">
                                        <div className="grid-item">
                                            <span className="label">Facebook</span>
                                            <span className="value">{teacher.facebook || 'www.facebook.com'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Twitter</span>
                                            <span className="value">{teacher.twitter || 'www.twitter.com'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Linkedin</span>
                                            <span className="value">{teacher.linkedin || 'www.linkedin.com'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Youtube</span>
                                            <span className="value">{teacher.youtube || 'www.youtube.com'}</span>
                                        </div>
                                        <div className="grid-item">
                                            <span className="label">Instagram</span>
                                            <span className="value">{teacher.instagram || 'www.instagram.com'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-section">
                                    <div className="section-title">Other Info</div>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', marginTop: '12px' }}>
                                        {teacher.otherInfo || "Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information."}
                                    </p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'salary' && (
                            <div className="salary-tab">
                                <div className="stats-row">
                                    <div className="stat-card blue">
                                        <div className="stat-icon"><IconCurrencyDollar size={24} /></div>
                                        <div>
                                            <span className="stat-label">Total Net Salary</span>
                                            <span className="stat-value">$5,55,410</span>
                                        </div>
                                    </div>
                                    <div className="stat-card green">
                                        <div className="stat-icon"><IconCurrencyDollar size={24} /></div>
                                        <div>
                                            <span className="stat-label">Total Gross Salary</span>
                                            <span className="stat-value">$5,58,380</span>
                                        </div>
                                    </div>
                                    <div className="stat-card yellow">
                                        <div className="stat-icon"><IconCurrencyDollar size={24} /></div>
                                        <div>
                                            <span className="stat-label">Total Deduction</span>
                                            <span className="stat-value">$2,500</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="section-title">Salary</div>
                                <div className="table-controls">
                                    <div className="entries-selector">
                                        Row Per Page
                                        <select><option>10</option></select>
                                        Entries
                                    </div>
                                </div>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Salary For</th>
                                            <th>Date</th>
                                            <th>Payment Method</th>
                                            <th>Net Salary</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <tr key={i}>
                                                <td><span className="id-link">8198</span></td>
                                                <td>Apr - 2024</td>
                                                <td>04 May 2024</td>
                                                <td>Cash</td>
                                                <td>$20,000</td>
                                                <td><button className="btn-payslip">View Payslip</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'leave' && (
                            <div className="leave-tab">
                                <div className="sub-tabs-row">
                                    <button
                                        className={`sub-tab-btn ${activeSubTab === 'leaves' ? 'active' : ''}`}
                                        onClick={() => setActiveSubTab('leaves')}
                                    >
                                        Leaves
                                    </button>
                                    <button
                                        className={`sub-tab-btn ${activeSubTab === 'attendance' ? 'active' : ''}`}
                                        onClick={() => setActiveSubTab('attendance')}
                                    >
                                        Attendance
                                    </button>
                                </div>

                                {activeSubTab === 'leaves' ? (
                                    <>
                                        <div className="stats-row four-col">
                                            <div className="stat-card simple">
                                                <h4>Medical Leave (10)</h4>
                                                <div className="usage">Used : 5 | Available : 5</div>
                                            </div>
                                            <div className="stat-card simple">
                                                <h4>Casual Leave (12)</h4>
                                                <div className="usage">Used : 1 | Available : 11</div>
                                            </div>
                                            <div className="stat-card simple">
                                                <h4>Maternity Leave (10)</h4>
                                                <div className="usage">Used : 0 | Available : 10</div>
                                            </div>
                                            <div className="stat-card simple">
                                                <h4>Paternity Leave (0)</h4>
                                                <div className="usage">Used : 0 | Available : 0</div>
                                            </div>
                                        </div>

                                        <div className="section-header-row">
                                            <div className="section-title">Leaves</div>
                                            <button className="btn-apply-leave" onClick={() => setShowApplyLeaveModal(true)}><IconPlus size={16} /> Apply Leave</button>
                                        </div>

                                        <div className="table-controls">
                                            <div className="entries-selector">
                                                Row Per Page
                                                <select><option>10</option></select>
                                                Entries
                                            </div>
                                            <div className="search-box">
                                                <input type="text" placeholder="Search" />
                                            </div>
                                        </div>

                                        <table className="details-table">
                                            <thead>
                                                <tr>
                                                    <th>Leave Type</th>
                                                    <th>Leave Date</th>
                                                    <th>No of Days</th>
                                                    <th>Applied On</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Casual Leave</td>
                                                    <td>07 May 2024 - 07 May 2024</td>
                                                    <td>1</td>
                                                    <td>07 May 2024</td>
                                                    <td><span className="status-pill active">Approved</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Casual Leave</td>
                                                    <td>08 May 2024 - 08 May 2024</td>
                                                    <td>1</td>
                                                    <td>04 May 2024</td>
                                                    <td><span className="status-pill active">Approved</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Casual Leave</td>
                                                    <td>20 May 2024 - 20 May 2024</td>
                                                    <td>1</td>
                                                    <td>19 May 2024</td>
                                                    <td><span className="status-pill pending">Pending</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Medical Leave</td>
                                                    <td>05 May 2024 - 09 May 2024</td>
                                                    <td>5</td>
                                                    <td>05 May 2024</td>
                                                    <td><span className="status-pill active">Approved</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Medical Leave</td>
                                                    <td>08 May 2024 - 11 May 2024</td>
                                                    <td>4</td>
                                                    <td>08 May 2024</td>
                                                    <td><span className="status-pill pending">Pending</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Special Leave</td>
                                                    <td>09 May 2024 - 09 May 2024</td>
                                                    <td>1</td>
                                                    <td>09 May 2024</td>
                                                    <td><span className="status-pill pending">Pending</span></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="pagination-controls">
                                            <span className="prev disabled">Prev</span>
                                            <span className="page-number active">1</span>
                                            <span className="next">Next</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="attendance-content">
                                        <div className="card-section px-0 pb-0">
                                            <div className="section-header-row px-4 pt-4 mb-2">
                                                <div className="section-title">Leave & Attendance</div>
                                                <div className="header-actions-row">
                                                    <div className="year-selector-container">
                                                        <div className="year-selector" onClick={() => setShowYearDropdown(!showYearDropdown)}>
                                                            <span>Year : {selectedYear}</span>
                                                            <IconChevronDown size={16} />
                                                        </div>
                                                        {showYearDropdown && (
                                                            <div className="dropdown-menu-ref">
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedYear('2024 / 2025'); setShowYearDropdown(false); }}>2024 / 2025</div>
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedYear('2023 / 2024'); setShowYearDropdown(false); }}>2023 / 2024</div>
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedYear('2022 / 2023'); setShowYearDropdown(false); }}>2022 / 2023</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="action-dropdown-container">
                                                        <button
                                                            className="action-dropdown-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowTimeRangeDropdown(!showTimeRangeDropdown);
                                                            }}
                                                        >
                                                            <IconCalendar size={16} />
                                                            <span>{selectedTimeRange}</span>
                                                            <IconChevronDown size={16} />
                                                        </button>
                                                        {showTimeRangeDropdown && (
                                                            <div className="dropdown-menu-ref">
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedTimeRange('This Year'); setShowTimeRangeDropdown(false); }}>This Year</div>
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedTimeRange('This Month'); setShowTimeRangeDropdown(false); }}>This Month</div>
                                                                <div className="dropdown-item-ref" onClick={() => { setSelectedTimeRange('This Week'); setShowTimeRangeDropdown(false); }}>This Week</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="action-dropdown-container">
                                                        <button
                                                            className="action-dropdown-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowExportDropdown(!showExportDropdown);
                                                            }}
                                                        >
                                                            <IconDownload size={16} />
                                                            <span>Export</span>
                                                            <IconChevronDown size={16} />
                                                        </button>
                                                        {showExportDropdown && (
                                                            <div className="dropdown-menu-ref">
                                                                <button className="dropdown-item-ref" onClick={() => { window.print(); setShowExportDropdown(false); }}>
                                                                    <IconFileText size={16} />
                                                                    <span>Export as PDF</span>
                                                                </button>
                                                                <button className="dropdown-item-ref" onClick={() => setShowExportDropdown(false)}>
                                                                    <IconFileText size={16} />
                                                                    <span>Export as Excel</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="actions-section-row wrap-row px-4">
                                                <div className="attendance-legend-btn-group">
                                                    <button className="legend-btn present">
                                                        <div className="legend-icon-box"><IconCheck size={14} /></div>
                                                        <span>Present</span>
                                                    </button>
                                                    <button className="legend-btn absent">
                                                        <div className="legend-icon-box"><IconX size={14} /></div>
                                                        <span>Absent</span>
                                                    </button>
                                                    <button className="legend-btn late">
                                                        <div className="legend-icon-box"><IconClock size={14} /></div>
                                                        <span>Late</span>
                                                    </button>
                                                    <button className="legend-btn halfday">
                                                        <div className="legend-icon-box"><IconUser size={14} /></div>
                                                        <span>Halfday</span>
                                                    </button>
                                                    <button className="legend-btn holiday">
                                                        <div className="legend-icon-box"><IconCalendar size={14} /></div>
                                                        <span>Holiday</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="table-controls compact no-border px-4 py-3">
                                                <div className="entries-selector">
                                                    Row Per Page
                                                    <div className="custom-select-box-ref" onClick={() => setShowEntriesDropdown(!showEntriesDropdown)}>
                                                        <span>{itemsPerPageAttendance}</span>
                                                        <IconChevronDown size={14} />
                                                        {showEntriesDropdown && (
                                                            <div className="dropdown-menu-ref" style={{ minWidth: '80px' }}>
                                                                {[10, 25, 50].map(val => (
                                                                    <div
                                                                        key={val}
                                                                        className="dropdown-item-ref"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setItemsPerPageAttendance(val);
                                                                            setCurrentPageAttendance(1);
                                                                            setShowEntriesDropdown(false);
                                                                        }}
                                                                    >
                                                                        {val}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    Entries
                                                </div>
                                                <div className="search-box-ref">
                                                    <input type="text" placeholder="Search" />
                                                </div>
                                            </div>

                                            <div className="attendance-grid-container fluid">
                                                <table className="attendance-grid-table responsive-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="sticky-col">
                                                                <div className="th-content-ref">
                                                                    Date | Month
                                                                    <div className="sort-icons-ref">
                                                                        <IconChevronDown size={10} className="up" />
                                                                        <IconChevronDown size={10} className="down" />
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map(m => (
                                                                <th key={m}>
                                                                    <div className="th-content-ref">
                                                                        {m}
                                                                        <div className="sort-icons-ref">
                                                                            <IconChevronDown size={10} className="up" />
                                                                            <IconChevronDown size={10} className="down" />
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: 31 }, (_, i) => i + 1)
                                                            .slice((currentPageAttendance - 1) * itemsPerPageAttendance, currentPageAttendance * itemsPerPageAttendance)
                                                            .map(date => (
                                                                <tr key={date}>
                                                                    <td className="date-cell sticky-col">{date.toString().padStart(2, '0')}</td>
                                                                    {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m) => {
                                                                        const statuses = ['present', 'present', 'present', 'absent', 'late', 'halfday', 'holiday', 'empty'];
                                                                        // For consistent rendering during demo, use hash of date+month
                                                                        const hash = (date * 31 + m.charCodeAt(0) + m.charCodeAt(1)) % statuses.length;
                                                                        const status = statuses[hash];
                                                                        return (
                                                                            <td key={m} className="status-cell">
                                                                                {status !== 'empty' && <div className={`status-marker-ref ${status}`}></div>}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="pagination-controls px-4 pb-4">
                                                <span
                                                    className={`prev ${currentPageAttendance === 1 ? 'disabled' : ''}`}
                                                    onClick={() => currentPageAttendance > 1 && setCurrentPageAttendance(currentPageAttendance - 1)}
                                                >
                                                    Prev
                                                </span>
                                                {Array.from({ length: Math.ceil(31 / itemsPerPageAttendance) }, (_, i) => i + 1).map(num => (
                                                    <span
                                                        key={num}
                                                        className={`page-number ${currentPageAttendance === num ? 'active' : ''}`}
                                                        onClick={() => setCurrentPageAttendance(num)}
                                                    >
                                                        {num}
                                                    </span>
                                                ))}
                                                <span
                                                    className={`next ${currentPageAttendance === Math.ceil(31 / itemsPerPageAttendance) ? 'disabled' : ''}`}
                                                    onClick={() => currentPageAttendance < Math.ceil(31 / itemsPerPageAttendance) && setCurrentPageAttendance(currentPageAttendance + 1)}
                                                >
                                                    Next
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'library' && (
                            <div className="library-tab">
                                <div className="section-title">Library</div>
                                <div className="books-grid">
                                    {[1, 2, 3, 4].map(i => (
                                        <div className="book-card" key={i}>
                                            <div className="book-info">
                                                <div className="book-img-placeholder">BOOK</div>
                                                <div className="book-details">
                                                    <h4>The Small-Town Library</h4>
                                                    <div className="book-dates">
                                                        <div><span>Book taken on</span><br /><b>25 Jan 2024</b></div>
                                                        <div><span>Last Date</span><br /><b>25 Jan 2024</b></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showLoginModal && <LoginDetailsModal />}
            {showApplyLeaveModal && <ApplyLeaveModal />}
        </div>
    );
};

export default TeacherDetails;
