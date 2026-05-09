import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Good', value: 400 },
    { name: 'Average', value: 300 },
    { name: 'Below Avg', value: 200 },
];

const COLORS = ['#3d5ee1', '#ff9f43', '#ea5455']; // Blue, Orange, Red

const StudentChart = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.02)',
            border: '1px solid #f0f0f0',
            height: '100%'
        }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.2rem' }}>Student Performance</h4>

            <div style={{ height: '350px', width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StudentChart;
