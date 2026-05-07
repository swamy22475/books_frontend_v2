import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentHomework = () => {
    const [filter, setFilter] = useState('All Subject');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const homeworks = [
        {
            subject: 'Physics',
            subjectColor: '#3d5ee1',
            title: 'Write about Theory of Pendulum',
            teacher: 'Aaron',
            teacherImg: 'https://preskool.developer24.org/html/template/assets/img/teachers/teacher-01.jpg',
            dueDate: '16 Jun 2024',
            status: 'completed',
            progress: 100
        },
        {
            subject: 'Chemistry',
            subjectColor: '#ff9f43',
            title: 'Chemistry - Change of Elements',
            teacher: 'Hellana',
            teacherImg: 'https://preskool.developer24.org/html/template/assets/img/teachers/teacher-02.jpg',
            dueDate: '16 Jun 2024',
            status: 'inprogress',
            progress: 65
        },
        {
            subject: 'Maths',
            subjectColor: '#28c76f',
            title: 'Maths - Problems to Solve Page 21',
            teacher: 'Morgan',
            teacherImg: 'https://preskool.developer24.org/html/template/assets/img/teachers/teacher-03.jpg',
            dueDate: '21 Jun 2024',
            status: 'pending',
            progress: 30
        },
        {
            subject: 'English',
            subjectColor: '#ea5455',
            title: 'English - Vocabulary Introduction',
            teacher: 'Daniel Josua',
            teacherImg: 'https://preskool.developer24.org/html/template/assets/img/teachers/teacher-04.jpg',
            dueDate: '21 Jun 2024',
            status: 'pending',
            progress: 10
        }
    ];

    // Calculate Summary
    const summaryData = [
        { name: 'Completed', value: homeworks.filter(hw => hw.status === 'completed').length, color: '#28c76f' },
        { name: 'In Progress', value: homeworks.filter(hw => hw.status === 'inprogress').length, color: '#ff9f43' },
        { name: 'Pending', value: homeworks.filter(hw => hw.status === 'pending').length, color: '#ea5455' }
    ].filter(d => d.value > 0);

    return (
        <div className="dashboard-card student-homework-card">
            <div className="card-header">
                <h5>Home Works</h5>
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
                            {['All Subject', 'Physics', 'Chemistry', 'Maths', 'English'].map((option) => (
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
                <div className="homework-horizontal-layout">
                    {/* Left: Chart & Stats */}
                    <div className="homework-summary-column">
                        <div className="summary-side-layout">
                            <div className="summary-chart-left">
                                <ResponsiveContainer width={160} height={160}>
                                    <PieChart>
                                        <Pie
                                            data={summaryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {summaryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="summary-info-right">
                                <div className="overall-percent">
                                    <h3>{homeworks.length}</h3>
                                    <span>Total Homeworks</span>
                                </div>
                                <div className="summary-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Assigned:</span>
                                        <span className="stat-value">{homeworks.length}</span>
                                    </div>
                                </div>
                                <div className="summary-legend" style={{ width: 'fit-content' }}>
                                    {summaryData.map((entry, idx) => (
                                        <div key={idx} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                                            <span className="legend-label">{entry.name}:</span>
                                            <span className="legend-value">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed List */}
                    <div className="homework-list-column">
                        <div className="dash-list-container">
                            {homeworks.map((hw, index) => {
                                const statusColor = hw.status === 'completed' ? '#28c76f' : hw.status === 'inprogress' ? '#ff9f43' : '#ea5455';
                                return (
                                    <div key={index} className="dash-list-item">
                                        <div className="dash-list-icon avatar-wrap">
                                            <img src={hw.teacherImg} alt={hw.teacher} />
                                        </div>
                                        <div className="dash-list-details">
                                            <div className="dash-list-header-mini">
                                                <span className="dash-subject-tag" style={{ backgroundColor: `${hw.subjectColor}15`, color: hw.subjectColor }}>
                                                    {hw.subject}
                                                </span>
                                                <div className="dash-status-pill">
                                                    <span className="dash-status-dot" style={{ backgroundColor: statusColor }}></span>
                                                    <span className="dash-status-text" style={{ color: statusColor }}>
                                                        {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <h6 className="dash-list-title">{hw.title}</h6>
                                            <div className="dash-list-footer">
                                                <span className="dash-teacher-name">{hw.teacher}</span>
                                                <span className="dash-meta-divider">|</span>
                                                <span className="dash-due-date">Due : {hw.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHomework;
