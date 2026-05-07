import React, { useState } from 'react';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StudentSyllabus = () => {
    const subjects = [
        { name: 'Mathematics', color: '#3d5ee1', completed: 85 },
        { name: 'Physics', color: '#28c76f', completed: 72 },
        { name: 'Chemistry', color: '#ff9f43', completed: 68 },
        { name: 'Biology', color: '#ea5455', completed: 90 },
        { name: 'English', color: '#00cfe8', completed: 95 }
    ];

    // Calculate overall completion
    const totalCompleted = subjects.reduce((acc, s) => acc + s.completed, 0) / subjects.length;

    const summaryData = [
        { name: 'Completed', value: Math.round(totalCompleted), color: '#3d5ee1' },
        { name: 'Remaining', value: Math.round(100 - totalCompleted), color: '#f0f4ff' }
    ];

    return (
        <div className="dashboard-card student-syllabus-card">
            <div className="card-header">
                <h5>Syllabus Completion</h5>
            </div>
            <div className="card-body">
                <div className="summary-side-layout">
                    <div className="summary-chart-left">
                        <ResponsiveContainer width={140} height={140}>
                            <PieChart>
                                <Pie
                                    data={summaryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={65}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
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
                            <h3>{Math.round(totalCompleted)}%</h3>
                            <span>Overall Completion</span>
                        </div>
                        <div className="summary-stats">
                            <div className="stat-item">
                                <span className="stat-dot" style={{ backgroundColor: '#3d5ee1' }}></span>
                                <span className="stat-label">Total Subjects:</span>
                                <span className="stat-value">{subjects.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dash-list-container">
                    {subjects.map((subject, index) => (
                        <div key={index} className="syllabus-mini-item dash-list-item">
                            <div className="dash-list-details">
                                <div className="dash-list-header-mini">
                                    <span className="mini-name">{subject.name}</span>
                                    <span className="mini-percent">{subject.completed}%</span>
                                </div>
                                <div className="mini-progress-bar">
                                    <div
                                        className="mini-progress-fill" style={{ width: `${subject.completed}%`, backgroundColor: subject.color }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentSyllabus;

