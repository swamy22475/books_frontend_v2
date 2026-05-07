import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StudentExamResult = () => {
    const [filter, setFilter] = useState('1st Quarter');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const resultData = [
        { subject: 'Maths', marks: 92, color: '#3d5ee1' },
        { subject: 'Physics', marks: 85, color: '#28c76f' },
        { subject: 'Chemistry', marks: 88, color: '#ff9f43' },
        { subject: 'English', marks: 90, color: '#ea5455' },
        { subject: 'Biology', marks: 78, color: '#00cfe8' }
    ];

    const totalMarks = resultData.reduce((sum, r) => sum + r.marks, 0);
    const totalPossible = resultData.length * 100;
    const percentage = ((totalMarks / totalPossible) * 100).toFixed(0);

    return (
        <div className="dashboard-card student-exam-result-card">
            <div className="card-header">
                <h5>Exam Result</h5>
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
                            {['1st Quarter', '2nd Quarter'].map((option) => (
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
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie
                                    data={resultData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="marks"
                                    nameKey="subject"
                                    stroke="none"
                                >
                                    {resultData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="summary-info-right">
                        <div className="overall-percent">
                            <h3>{percentage}%</h3>
                            <span>Overall Grade</span>
                        </div>
                        <div className="summary-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Marks:</span>
                                <span className="stat-value">{totalMarks} / {totalPossible}</span>
                            </div>
                        </div>
                        <div className="summary-legend">
                            {resultData.map((entry, idx) => (
                                <div key={idx} className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                                    <span className="legend-label">{entry.subject}:</span>
                                    <span className="legend-value">{entry.marks}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentExamResult;
