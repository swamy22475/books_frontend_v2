import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const StudentPerformance = () => {
    const [year, setYear] = useState('2024 - 2025');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const performanceData = [
        { month: 'Jan', quiz: 30, exam: 40 },
        { month: 'Feb', quiz: 45, exam: 55 },
        { month: 'Mar', quiz: 35, exam: 48 },
        { month: 'Apr', quiz: 50, exam: 60 },
        { month: 'May', quiz: 55, exam: 65 },
        { month: 'Jun', quiz: 40, exam: 52 },
        { month: 'Jul', quiz: 60, exam: 70 },
        { month: 'Aug', quiz: 48, exam: 58 },
        { month: 'Sep', quiz: 65, exam: 75 },
        { month: 'Oct', quiz: 55, exam: 68 },
        { month: 'Nov', quiz: 70, exam: 80 },
        { month: 'Dec', quiz: 58, exam: 72 }
    ];

    // Calculate totals for Pie Chart
    const totals = performanceData.reduce((acc, curr) => {
        acc.quiz += curr.quiz;
        acc.exam += curr.exam;
        return acc;
    }, { quiz: 0, exam: 0 });

    const pieData = [
        { name: 'Total Quiz', value: totals.quiz, color: '#3d5ee1' },
        { name: 'Total Exam', value: totals.exam, color: '#28c76f' }
    ];

    return (
        <div className="dashboard-card student-performance-card">
            <div className="card-header">
                <h5>Performance Summary</h5>
                <div className="dropdown-container">
                    <button
                        className="dropdown-toggle"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {year}
                        <IconChevronDown size={16} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {['2024 - 2025', '2023 - 2024', '2022 - 2023'].map((option) => (
                                <button
                                    key={option}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setYear(option);
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
                <div className="performance-summary-inner">
                    <div className="performance-chart-box">
                        <ResponsiveContainer width={200} height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
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
                    <div className="performance-info-box">
                        <div className="perf-title-group">
                            <h3 className="perf-main-title">Performance</h3>
                            <span className="perf-sub-title">Yearly Summary</span>
                        </div>
                        <div className="perf-legend">
                            {pieData.map((entry, idx) => (
                                <div key={idx} className="perf-legend-item">
                                    <span className="perf-dot" style={{ backgroundColor: entry.color }}></span>
                                    <span className="perf-label">{entry.name}:</span>
                                    <span className="perf-value">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformance;
