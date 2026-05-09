import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AttendanceChart = () => {
    const [activeTab, setActiveTab] = useState('students');

    const dataMap = {
        students: [
            { name: 'Present', value: 988, color: '#3d5ee1' },
            { name: 'Absent', value: 8, color: '#ea5455' },
            { name: 'Late', value: 4, color: '#ff9f43' }
        ],
        teachers: [
            { name: 'Present', value: 965, color: '#3d5ee1' },
            { name: 'Absent', value: 20, color: '#ea5455' },
            { name: 'Late', value: 15, color: '#ff9f43' }
        ],
        staff: [
            { name: 'Present', value: 972, color: '#3d5ee1' },
            { name: 'Absent', value: 18, color: '#ea5455' },
            { name: 'Late', value: 10, color: '#ff9f43' }
        ],
    };

    const stats = {
        students: { emergency: 28, absent: 1, late: 1, present: 98.8 },
        teachers: { emergency: 5, absent: 2, late: 0, present: 96.5 },
        staff: { emergency: 3, absent: 1, late: 2, present: 97.2 },
    };

    const data = dataMap[activeTab];
    const currentStats = stats[activeTab];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    fontSize: '12px'
                }}>
                    <p style={{ margin: 0, fontWeight: 700, color: item.color }}>{item.name}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)' }}>{(item.value / 10).toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-card attendance-card">
            <div className="card-header">
                <h5>Attendance</h5>
            </div>

            <div className="attendance-tabs">
                {['students', 'teachers', 'staff'].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="attendance-chart" style={{ position: 'relative', height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={48}
                            outerRadius={70}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={3}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                    <span className="donut-pct" style={{ fontSize: '1.2rem' }}>{currentStats.present}%</span>
                    <span className="donut-label">Present</span>
                </div>
            </div>

            <div className="attendance-legend">
                <div className="legend-item">
                    <span className="dot emergency"></span>
                    <span>Emergency: <strong>{currentStats.emergency}</strong></span>
                </div>
                <div className="legend-item">
                    <span className="dot absent"></span>
                    <span>Absent: <strong>{String(currentStats.absent).padStart(2, '0')}</strong></span>
                </div>
                <div className="legend-item">
                    <span className="dot late"></span>
                    <span>Late: <strong>{String(currentStats.late).padStart(2, '0')}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;
