import React from 'react';
import { IconCalendar, IconClipboardCheck, IconCash, IconBook } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
    const links = [
        { title: 'Calendar', path: '/calendar', icon: IconCalendar, color: '#22c55e', bgColor: '#ecfdf5' },
        { title: 'Exam Result', path: '/exam/results', icon: IconClipboardCheck, color: '#3b82f6', bgColor: '#e8f4ff' },
        { title: 'Fees', path: '/fees', icon: IconCash, color: '#06b6d4', bgColor: '#e0f7fa' },
        { title: 'Home Works', path: '/homework', icon: IconBook, color: '#ef4444', bgColor: '#fef2f2' }
    ];

    return (
        <div className="dashboard-card quick-links-card">
            <div className="card-header">
                <h5>Quick Links</h5>
            </div>
            <div className="quick-links-grid">
                {links.map((link, index) => (
                    <Link key={index} to={link.path} className="quick-link-item" style={{ backgroundColor: link.bgColor }}>
                        <link.icon size={24} color={link.color} stroke={1.5} />
                        <span style={{ color: link.color }}>{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickLinks;
