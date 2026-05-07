import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
    { name: '2018Q1', Income: 4000, Expense: 2400 },
    { name: '2018Q2', Income: 3000, Expense: 1398 },
    { name: '2018Q3', Income: 2000, Expense: 9800 },
    { name: '2018Q4', Income: 2780, Expense: 3908 },
    { name: '2019Q1', Income: 1890, Expense: 4800 },
    { name: '2019Q2', Income: 2390, Expense: 3800 },
    { name: '2019Q3', Income: 3490, Expense: 4300 },
];

const RevenueChart = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.02)',
            border: '1px solid #f0f0f0',
            height: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Revenue</h4>
            </div>

            <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="Income" fill="#3d5ee1" radius={[3, 3, 0, 0]} name="Income" />
                        <Bar dataKey="Expense" fill="#ff9f43" radius={[3, 3, 0, 0]} name="Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
