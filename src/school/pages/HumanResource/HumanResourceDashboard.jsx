import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Users,
    ClipboardCheck,
    CalendarClock,
    Banknote,
    UserPlus,
    Building2,
    Briefcase,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import './HumanResourceDashboard.css';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const hrKpiData = [
    { label: 'Total Staff', value: '124', change: '+2', up: true, color: '#3d5ee1', bg: '#eef1fd', icon: <Users size={20} /> },
    { label: 'Present Today', value: '118', change: '95.2%', up: true, color: '#28c76f', bg: '#e8faf1', icon: <ClipboardCheck size={20} /> },
    { label: 'Leave Requests', value: '5', change: '3 Pending', up: false, color: '#ff9f43', bg: '#fff5e6', icon: <CalendarClock size={20} /> },
    { label: 'Payroll Status', value: 'Processed', change: 'Feb 2025', up: true, color: '#7367f0', bg: '#efedfd', icon: <Banknote size={20} /> },
];

const staffStrengthData = [
    { department: 'Teaching', count: 85 },
    { department: 'Admin', count: 12 },
    { department: 'Accounts', count: 5 },
    { department: 'Transport', count: 14 },
    { department: 'Library', count: 3 },
    { department: 'Maintenance', count: 5 },
];

const attendanceStats = [
    { name: 'Present', value: 118, color: '#28c76f' },
    { name: 'Absent', value: 4, color: '#ea5455' },
    { name: 'On Leave', value: 2, color: '#ff9f43' },
];

const quickLinks = [
    { label: 'Staff Directory', icon: <Users />, path: '/school/hr/staff', color: '#3d5ee1' },
    { label: 'Add Staff', icon: <UserPlus />, path: '/school/hr/staff/add', color: '#28c76f' },
    { label: 'Attendance', icon: <ClipboardCheck />, path: '/school/hr/attendance', color: '#ff9f43' },
    { label: 'Payroll', icon: <Banknote />, path: '/school/hr/payroll', color: '#7367f0' },
    { label: 'Leave Requests', icon: <CalendarClock />, path: '/school/hr/leave', color: '#ea5455' },
    { label: 'Departments', icon: <Building2 />, path: '/school/hr/departments', color: '#00cfe8' },
    { label: 'Designations', icon: <Briefcase />, path: '/school/hr/designations', color: '#6c757d' },
    { label: 'Reports', icon: <FileText />, path: '/school/reports', color: '#3d5ee1' },
];

const COLORS = ['#3d5ee1', '#28c76f', '#ff9f43', '#ea5455', '#7367f0', '#00cfe8'];

const HumanResourceDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="hr-dashboard">
            {/* Page Header */}
            <div className="hr-page-header">
                <div>
                    <h4 className="hr-page-title">Human Resource Management</h4>
                    <nav className="hr-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        <span> / </span>
                        <span className="hr-breadcrumb-current">Human Resource</span>
                    </nav>
                </div>
                <div className="hr-header-actions">
                    <button className="hr-action-btn primary" onClick={() => navigate('/school/hr/staff/add')}>
                        <UserPlus size={16} /> Add New Staff
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="hr-kpi-grid">
                {hrKpiData.map((kpi, i) => (
                    <div key={i} className="hr-kpi-card" onClick={() => navigate(kpi.label === 'Leave Requests' ? '/school/hr/leave' : kpi.label === 'Payroll Status' ? '/school/hr/payroll' : '/school/hr/staff')} style={{ cursor: 'pointer' }}>
                        <div className="hr-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                            {kpi.icon}
                        </div>
                        <div className="hr-kpi-info">
                            <p className="hr-kpi-label">{kpi.label}</p>
                            <h3 className="hr-kpi-value">{kpi.value}</h3>
                            <span className={`hr-kpi-change ${kpi.up ? 'up' : 'down'}`}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links Grid */}
            <div className="hr-card hr-quick-links-card">
                <div className="hr-card-header">
                    <h5 className="hr-card-title">HR Modules</h5>
                </div>
                <div className="hr-quick-links">
                    {quickLinks.map((link, i) => (
                        <Link key={i} to={link.path} className="hr-quick-link">
                            <div className="hr-quick-icon" style={{ background: link.color + '15', color: link.color }}>
                                {link.icon}
                            </div>
                            <span className="hr-quick-label">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="hr-row-grid">
                {/* Staff Strength Chart */}
                <div className="hr-card">
                    <div className="hr-card-header">
                        <h5 className="hr-card-title">Staff Strength by Department</h5>
                    </div>
                    <div className="hr-chart-container">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={staffStrengthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8f9fc' }}
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3d5ee1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Pie Chart */}
                <div className="hr-card">
                    <div className="hr-card-header">
                        <h5 className="hr-card-title">Daily Attendance Overview</h5>
                    </div>
                    <div className="hr-chart-container pie-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={attendanceStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {attendanceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="hr-pie-legend">
                            {attendanceStats.map((item, i) => (
                                <div key={i} className="hr-legend-item">
                                    <span className="hr-dot" style={{ background: item.color }}></span>
                                    <span className="hr-legend-label">{item.name}</span>
                                    <span className="hr-legend-value">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leave Requests & Upcoming Birthdays */}
            <div className="hr-row-grid alternate">
                <div className="hr-card lg-span">
                    <div className="hr-card-header">
                        <h5 className="hr-card-title">Recent Leave Requests</h5>
                        <Link to="/school/hr/leave" className="hr-view-all">View All</Link>
                    </div>
                    <div className="hr-table-wrap">
                        <table className="hr-mini-table">
                            <thead>
                                <tr>
                                    <th>Staff Name</th>
                                    <th>Leave Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="hr-staff-info">
                                            <div className="hr-avatar">RS</div>
                                            <span>Rahul Sharma</span>
                                        </div>
                                    </td>
                                    <td>Sick Leave</td>
                                    <td>24-26 Feb</td>
                                    <td><span className="hr-status-badge pending">Pending</span></td>
                                    <td><button className="hr-table-btn" onClick={() => navigate('/school/hr/leave')}>Review</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="hr-staff-info">
                                            <div className="hr-avatar secondary">AR</div>
                                            <span>Anita Rao</span>
                                        </div>
                                    </td>
                                    <td>Casual Leave</td>
                                    <td>01 Mar</td>
                                    <td><span className="hr-status-badge approved">Approved</span></td>
                                    <td><button className="hr-table-btn" onClick={() => navigate('/school/hr/leave')}>View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="hr-staff-info">
                                            <div className="hr-avatar tertiary">MK</div>
                                            <span>Manish Kumar</span>
                                        </div>
                                    </td>
                                    <td>Medical Leave</td>
                                    <td>28 Feb</td>
                                    <td><span className="hr-status-badge rejected">Rejected</span></td>
                                    <td><button className="hr-table-btn" onClick={() => navigate('/school/hr/leave')}>Details</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="hr-card sm-span">
                    <div className="hr-card-header">
                        <h5 className="hr-card-title">Upcoming Birthdays</h5>
                    </div>
                    <div className="hr-birthday-list">
                        <div className="hr-birthday-item">
                            <div className="hr-bday-icon">🎂</div>
                            <div className="hr-bday-info">
                                <h6>Meena Iyer</h6>
                                <p>Today</p>
                            </div>
                        </div>
                        <div className="hr-birthday-item">
                            <div className="hr-bday-icon">🎈</div>
                            <div className="hr-bday-info">
                                <h6>Suresh Kumar</h6>
                                <p>Tomorrow</p>
                            </div>
                        </div>
                        <div className="hr-birthday-item">
                            <div className="hr-bday-icon">🎁</div>
                            <div className="hr-bday-info">
                                <h6>Jessica Taylor</h6>
                                <p>02 March</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HumanResourceDashboard;
