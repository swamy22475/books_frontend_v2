import React, { useState } from 'react';
import { IconBell, IconChevronDown } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentNoticeBoard = () => {
    const notices = [
        {
            title: 'New Syllabus Instructions',
            date: '11 Mar 2024',
            type: 'Academic',
            color: '#3d5ee1'
        },
        {
            title: 'World Environment Day Program.....!!!',
            date: '21 Apr 2024',
            type: 'Event',
            color: '#28c76f'
        },
        {
            title: 'Exam Preparation Notification!',
            date: '13 Mar 2024',
            type: 'Important',
            color: '#ea5455'
        },
        {
            title: 'Online Classes Preparation',
            date: '24 May 2024',
            type: 'Academic',
            color: '#3d5ee1'
        },
        {
            title: 'Exam Time Table Release',
            date: '24 May 2024',
            type: 'Important',
            color: '#ea5455'
        }
    ];

    // Aggregating for Pie Chart
    const pieData = notices.reduce((acc, curr) => {
        const existing = acc.find(a => a.name === curr.type);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: curr.type, value: 1, color: curr.color });
        }
        return acc;
    }, []);

    return (
        <div className="dashboard-card student-notice-card">
            <div className="card-header">
                <h5>Notice Board</h5>
                <a href="/notice-board" className="view-all">View All</a>
            </div>
            <div className="card-body">
                <div className="summary-side-layout">
                    <div className="summary-chart-left">
                        <ResponsiveContainer width={140} height={140}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={65}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="summary-info-right">
                        <div className="summary-title">
                            <h3>{notices.length}</h3>
                            <span>Total Notices</span>
                        </div>
                        <div className="summary-legend">
                            {pieData.map((entry, idx) => (
                                <div key={idx} className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                                    <span className="legend-label">{entry.name}:</span>
                                    <span className="legend-value">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dash-list-container">
                    {notices.map((notice, index) => (
                        <div key={index} className="dash-list-item">
                            <div
                                className="dash-list-icon"
                                style={{ backgroundColor: `${notice.color}15`, color: notice.color }}
                            >
                                <IconBell size={18} />
                            </div>
                            <div className="dash-list-details">
                                <div className="dash-list-header-mini">
                                    <span className="dash-category-tag" style={{ color: notice.color }}>
                                        {notice.type}
                                    </span>
                                    <span className="dash-time-stamp">{notice.date}</span>
                                </div>
                                <h6 className="dash-list-title">{notice.title}</h6>
                                <div className="dash-list-footer">
                                    <span className="dash-author">Posted by Admin</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentNoticeBoard;
