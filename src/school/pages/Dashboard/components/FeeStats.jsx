import React from 'react';
import { IconCash, IconAlertCircle, IconUserX, IconClock } from '@tabler/icons-react';

const FeeStats = () => {
    const stats = [
        {
            title: 'Total Fees Collected',
            value: '$45,540',
            icon: IconCash,
            color: '#22c55e',
            bgColor: '#ecfdf5'
        },
        {
            title: 'Fine Collected',
            value: '$1,250',
            icon: IconAlertCircle,
            color: '#f59e0b',
            bgColor: '#fef3c7'
        },
        {
            title: 'Student Not Paid',
            value: '45',
            icon: IconUserX,
            color: '#ef4444',
            bgColor: '#fef2f2'
        },
        {
            title: 'Total Outstanding',
            value: '$8,450',
            icon: IconClock,
            color: '#3b82f6',
            bgColor: '#eff6ff'
        }
    ];

    return (
        <div className="dashboard-card fee-stats-card">
            <div className="card-header">
                <h5>Fee Statistics</h5>
            </div>

            <div className="fee-stats-list">
                {stats.map((stat, index) => (
                    <div key={index} className="fee-stat-item">
                        <div className="fee-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                            <stat.icon size={20} color={stat.color} />
                        </div>
                        <div className="fee-stat-info">
                            <span className="fee-stat-title">{stat.title}</span>
                            <span className="fee-stat-value" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeeStats;
