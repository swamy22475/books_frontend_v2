import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const FinanceCards = () => {
    const earningsData = [
        { name: 'Tuition Fees', value: 42000, color: '#3d5ee1' },
        { name: 'Transport', value: 12000, color: '#22c55e' },
        { name: 'Library', value: 6500, color: '#06b6d4' },
        { name: 'Other', value: 4022, color: '#a855f7' },
    ];

    const expensesData = [
        { name: 'Salaries', value: 35000, color: '#ef4444' },
        { name: 'Maintenance', value: 12000, color: '#f59e0b' },
        { name: 'Utilities', value: 8522, color: '#ff9f43' },
        { name: 'Supplies', value: 5000, color: '#8b5cf6' },
    ];

    const totalEarnings = earningsData.reduce((s, d) => s + d.value, 0);
    const totalExpenses = expensesData.reduce((s, d) => s + d.value, 0);

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
                    <p style={{ margin: '2px 0 0', color: 'var(--text-primary)' }}>${item.value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    const DonutCard = ({ title, data, total, trend, trendUp, color }) => (
        <div className="dashboard-card finance-card">
            <div className="finance-header">
                <span className="finance-label">{title}</span>
                <span className={`finance-trend ${trendUp ? 'up' : 'down'}`}>
                    {trendUp ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
                    {trend}
                </span>
            </div>
            <h3 className="finance-value">${(total / 1000).toFixed(1)}k</h3>

            <div style={{ position: 'relative', height: 120, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={32}
                            outerRadius={50}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="finance-donut-center">
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL</span>
                </div>
            </div>

            <div className="finance-legend-row">
                {data.map((item, i) => (
                    <div key={i} className="finance-legend-item">
                        <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: item.color, display: 'inline-block', marginRight: 5, flexShrink: 0
                        }}></span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', truncate: true }}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="finance-cards-wrapper">
            <DonutCard
                title="Total Earnings"
                data={earningsData}
                total={totalEarnings}
                trend="1.2%"
                trendUp={true}
                color="#22c55e"
            />
            <DonutCard
                title="Total Expenses"
                data={expensesData}
                total={totalExpenses}
                trend="0.8%"
                trendUp={false}
                color="#ef4444"
            />
        </div>
    );
};

export default FinanceCards;
