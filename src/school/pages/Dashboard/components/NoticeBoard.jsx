import React from 'react';
import { IconBell } from '@tabler/icons-react';

const NoticeBoard = () => {
    const notices = [
        {
            title: 'New Syllabus Instructions',
            date: 'Added on 10 Jul 2024',
            daysAgo: '25 Days'
        },
        {
            title: 'Exam Schedule Released',
            date: 'Added on 08 Jul 2024',
            daysAgo: '27 Days'
        },
        {
            title: 'Holiday Announcement',
            date: 'Added on 05 Jul 2024',
            daysAgo: '30 Days'
        },
        {
            title: 'Sports Day Registration',
            date: 'Added on 01 Jul 2024',
            daysAgo: '34 Days'
        }
    ];

    return (
        <div className="dashboard-card notice-board-card">
            <div className="card-header">
                <h5>Notice Board</h5>
                <a href="/announcements" className="view-all">View All</a>
            </div>

            <div className="notices-list">
                {notices.map((notice, index) => (
                    <div key={index} className="notice-item">
                        <div className="notice-icon">
                            <IconBell size={18} />
                        </div>
                        <div className="notice-content">
                            <h6>{notice.title}</h6>
                            <p>{notice.date}</p>
                        </div>
                        <span className="notice-badge">{notice.daysAgo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
