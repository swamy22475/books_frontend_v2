import React, { useState } from 'react';
import { IconChevronDown, IconUrgent, IconFirstAidKit } from '@tabler/icons-react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const LeaveStatus = () => {
    const [filter, setFilter] = useState('This Month');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const leaves = [
        {
            type: 'Emergency Leave',
            date: '15 Jun 2024',
            icon: IconUrgent,
            color: '#ea5455',
            value: 1
        },
        {
            type: 'Medical Leave',
            date: '15 Jun 2024',
            icon: IconFirstAidKit,
            color: '#ff9f43',
            value: 2
        },
        {
            type: 'Fever',
            date: '16 Jun 2024',
            icon: IconFirstAidKit,
            color: '#00cfe8',
            value: 1
        }
    ];

    // Aggregating for Pie Chart
    const pieData = leaves.reduce((acc, curr) => {
        const existing = acc.find(a => a.name === curr.type);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: curr.type, value: 1, color: curr.color });
        }
        return acc;
    }, []);

    return (
        <div className="dashboard-card leave-status-card">
            <div className="card-header">
                <h5>Leave Status</h5>
                <div className="dropdown-container">
                    <button
                        className="dropdown-toggle"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {filter}
                        <IconChevronDown size={16} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {['This Month', 'This Year', 'Last Week'].map((option) => (
                                <button
                                    key={option}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setFilter(option);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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
                                    innerRadius={45}
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
                            <h3>{leaves.length}</h3>
                            <span>Total Leave Records</span>
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
                    {leaves.map((leave, index) => (
                        <div key={index} className="dash-list-item">
                            <div
                                className="dash-list-icon"
                                style={{ backgroundColor: `${leave.color}15`, color: leave.color }}
                            >
                                <leave.icon size={18} />
                            </div>
                            <div className="dash-list-details">
                                <div className="dash-list-header-mini">
                                    <span className="dash-category-tag" style={{ color: leave.color }}>
                                        {leave.type}
                                    </span>
                                    <span className="dash-time-stamp">{leave.date}</span>
                                </div>
                                <h6 className="dash-list-title">{leave.type} - Requested</h6>
                                <div className="dash-list-footer">
                                    <span className="dash-meta-label">Date : {leave.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeaveStatus;
