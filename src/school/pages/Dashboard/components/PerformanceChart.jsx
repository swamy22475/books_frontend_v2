import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PerformanceChart = () => {
    const data = [
        { name: 'Top Performers', value: 45, color: '#3d5ee1' },
        { name: 'Average', value: 33, color: '#ff9f43' },
        { name: 'Below Average', value: 11, color: '#ea5455' },
        { name: 'Needs Help', value: 11, color: '#a855f7' },
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);

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
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)', fontSize: '12px' }}>{item.value} students</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '11px' }}>
                        {((item.value / total) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-card performance-chart-card">
            <div className="card-header">
                <h5>Performance</h5>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This Semester</span>
            </div>

            <div className="pie-chart-body">
                <div style={{ position: 'relative', height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={55}
                                outerRadius={82}
                                paddingAngle={4}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                        <span className="donut-pct">{total}</span>
                        <span className="donut-label">Students</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="perf-legend-grid">
                    {data.map((item, i) => (
                        <div key={i} className="perf-legend-item">
                            <div className="perf-legend-dot" style={{ background: item.color }}></div>
                            <div className="perf-legend-content">
                                <span className="perf-legend-name">{item.name}</span>
                                <span className="perf-legend-count" style={{ color: item.color }}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceChart;
