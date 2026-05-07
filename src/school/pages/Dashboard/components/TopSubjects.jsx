import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TopSubjects = () => {
    const subjects = [
        { name: 'Mathematics', value: 95, color: '#3d5ee1' },
        { name: 'Physics', value: 88, color: '#22c55e' },
        { name: 'Chemistry', value: 82, color: '#f59e0b' },
        { name: 'Biology', value: 78, color: '#06b6d4' },
        { name: 'English', value: 75, color: '#a855f7' }
    ];

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
                }}>
                    <p style={{ margin: 0, fontWeight: 700, color: item.color, fontSize: '13px' }}>{item.name}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontSize: '12px' }}>Score: {item.value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-card top-subjects-card">
            <div className="card-header">
                <h5>Top Subjects</h5>
                <span style={{ fontSize: '12px', color: '#3d5ee1', fontWeight: 600 }}>Avg Score</span>
            </div>

            <div className="pie-chart-body">
                {/* Donut chart */}
                <div style={{ position: 'relative', height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={subjects}
                                innerRadius={52}
                                outerRadius={78}
                                paddingAngle={4}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {subjects.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                        <span className="donut-pct" style={{ fontSize: '1.1rem' }}>
                            {Math.round(subjects.reduce((a, s) => a + s.value, 0) / subjects.length)}%
                        </span>
                        <span className="donut-label">Avg</span>
                    </div>
                </div>

                {/* Subject legend with mini progress */}
                <div className="subjects-pie-legend">
                    {subjects.map((s, i) => (
                        <div key={i} className="subject-legend-row">
                            <span className="subject-legend-dot" style={{ background: s.color }}></span>
                            <span className="subject-legend-name">{s.name}</span>
                            <div className="subject-mini-bar">
                                <div style={{ width: `${s.value}%`, background: s.color, height: '100%', borderRadius: 3 }}></div>
                            </div>
                            <span className="subject-legend-pct" style={{ color: s.color }}>{s.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopSubjects;
