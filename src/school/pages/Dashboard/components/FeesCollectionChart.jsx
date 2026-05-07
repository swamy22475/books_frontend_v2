import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const FeesCollectionChart = () => {
    const [activePeriod, setActivePeriod] = useState('2024');

    const data2024 = [
        { name: 'Collected', value: 167000, color: '#3d5ee1' },
        { name: 'Outstanding', value: 21000, color: '#ea5455' },
        { name: 'Waived', value: 8000, color: '#ff9f43' },
    ];

    const data2023 = [
        { name: 'Collected', value: 187000, color: '#3d5ee1' },
        { name: 'Outstanding', value: 13000, color: '#ea5455' },
        { name: 'Waived', value: 5000, color: '#ff9f43' },
    ];

    const data = activePeriod === '2024' ? data2024 : data2023;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const collected = data.find(d => d.name === 'Collected');
    const collectionRate = ((collected.value / total) * 100).toFixed(1);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }}>
                    <p style={{ margin: 0, fontWeight: 700, color: item.color, fontSize: '14px' }}>{item.name}</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-primary)', fontSize: '13px' }}>
                        ${item.value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-card fees-chart-card">
            <div className="card-header">
                <h5>Fees Collection</h5>
                <div className="period-toggle">
                    {['2023', '2024'].map(p => (
                        <button
                            key={p}
                            className={`period-btn ${activePeriod === p ? 'active' : ''}`}
                            onClick={() => setActivePeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pie-chart-body">
                {/* Summary row */}
                <div className="fees-summary-row">
                    {data.map((item, i) => (
                        <div key={i} className="fees-summary-item">
                            <span className="fees-dot" style={{ background: item.color }}></span>
                            <div>
                                <p className="fees-summary-label">{item.name}</p>
                                <p className="fees-summary-value" style={{ color: item.color }}>
                                    ${(item.value / 1000).toFixed(0)}k
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Donut chart */}
                <div style={{ position: 'relative', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={65}
                                outerRadius={95}
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
                        <span className="donut-pct">{collectionRate}%</span>
                        <span className="donut-label">Collected</span>
                    </div>
                </div>

                {/* Legend chips */}
                <div className="pie-legend-chips">
                    {data.map((item, i) => (
                        <div key={i} className="pie-legend-chip">
                            <span style={{
                                width: 10, height: 10, borderRadius: '50%',
                                backgroundColor: item.color, display: 'inline-block', marginRight: 6
                            }}></span>
                            <span>{item.name}: <strong>${(item.value / 1000).toFixed(0)}k</strong></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeesCollectionChart;
