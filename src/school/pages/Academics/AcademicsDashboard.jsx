import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconHome,
    IconLayoutGrid,
    IconUsers,
    IconLayersIntersect,
    IconBook,
    IconCalendarStats,
    IconClock,
    IconArrowUpCircle,
    IconClipboardList,
    IconDeviceDesktop
} from '@tabler/icons-react';
import './Academics.css';

const AcademicsDashboard = () => {
    const { classes, sections, subjects } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const stats = [
        { title: 'Total Classes', count: classes.length, icon: <IconUsers size={20} />, color: '#3d5ee1', link: '/school/academics/classes' },
        { title: 'Total Sections', count: sections.length, icon: <IconLayersIntersect size={20} />, color: '#8b5cf6', link: '/school/academics/sections' },
        { title: 'Total Subjects', count: subjects.length, icon: <IconBook size={20} />, color: '#f59e0b', link: '/school/academics/subjects' },
    ];

    const modules = [
        { title: 'Class Timetable', desc: 'Manage weekly schedules', icon: <IconCalendarStats size={28} />, link: '/school/academics/class-timetable' },
        { title: 'Manage Periods', desc: 'Define period slots', icon: <IconClock size={28} />, link: '/school/academics/manage-periods' },
        { title: 'Promote Students', desc: 'Graduation & Promotion', icon: <IconArrowUpCircle size={28} />, link: '/school/academics/promote-students' },
        { title: 'Homework', desc: 'Assignments & Tasks', icon: <IconClipboardList size={28} />, link: '/school/academics/homework' },
        { title: 'Class Teacher', desc: 'Assign class teachers', icon: <IconUsers size={28} />, link: '/school/academics/assign-class-teacher' },
    ];

    return (
        <div className="academics-page" style={{ padding: '28px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', width: '100%' }}>
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <h4>Academics Dashboard</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span className="current">Academics</span>
                        </nav>
                    </div>
                    <div className="page-header-actions">
                        <button
                            onClick={() => navigate('/school/dashboard')}
                            className="btn btn-primary"
                        >
                            <IconHome size={18} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(stat.link)}
                            className="stats-card-clean"
                        >
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-title">{stat.title}</div>
                            <div className="stat-value">{stat.count}</div>
                        </div>
                    ))}
                </div>

                {/* Modules Section */}
                <div className="mb-6">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--sl-text-color)', marginBottom: '24px' }}>
                        Academic Modules
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
                    {modules.map((mod, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(mod.link)}
                            className="module-card-clean"
                        >
                            <div className="module-icon">
                                {mod.icon}
                            </div>
                            <h3 className="module-title">{mod.title}</h3>
                            <p className="module-desc">{mod.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer style={{ marginTop: '80px', padding: '32px 0', textAlign: 'center', borderTop: '1px solid var(--sl-border-color)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--sl-text-muted)' }}>
                        Copyright © 2024 <span style={{ color: 'var(--sl-primary-color)', fontWeight: '500' }}>MindWhile</span>. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AcademicsDashboard;
