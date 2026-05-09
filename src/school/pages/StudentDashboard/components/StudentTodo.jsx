import React, { useState } from 'react';
import { IconChevronDown, IconCircleCheck, IconClock, IconCircleDashed } from '@tabler/icons-react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentTodo = () => {
    const [filter, setFilter] = useState('Today');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const todos = [
        {
            title: 'Send Reminder to Students',
            time: '01:00 PM',
            status: 'completed',
            statusLabel: 'Completed'
        },
        {
            title: 'Create Routine to new staff',
            time: '04:50 PM',
            status: 'inprogress',
            statusLabel: 'Inprogress'
        },
        {
            title: 'Extra Class Info to Students',
            time: '04:55 PM',
            status: 'pending',
            statusLabel: 'Yet to Start'
        },
        {
            title: 'Fees for Upcoming Academics',
            time: '04:55 PM',
            status: 'pending',
            statusLabel: 'Yet to Start'
        },
        {
            title: 'English - Essay on Visit',
            time: '05:55 PM',
            status: 'pending',
            statusLabel: 'Yet to Start'
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <IconCircleCheck size={18} />;
            case 'inprogress':
                return <IconClock size={18} />;
            default:
                return <IconCircleDashed size={18} />;
        }
    };

    const statusColors = {
        completed: '#28c76f',
        inprogress: '#ff9f43',
        pending: '#ea5455'
    };

    const pieData = Object.keys(statusColors).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: todos.filter(t => t.status === status).length,
        color: statusColors[status]
    })).filter(d => d.value > 0);

    return (
        <div className="dashboard-card student-todo-card">
            <div className="card-header">
                <h5>Todo</h5>
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
                            {['Today', 'This Month', 'This Year', 'Last Week'].map((option) => (
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
                        <ResponsiveContainer width={140} height={140}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
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
                    <div className="summary-info-right">
                        <div className="summary-title">
                            <h3>{todos.length}</h3>
                            <span>Total Todo Tasks</span>
                        </div>
                        <div className="summary-legend">
                            {pieData.map((entry, idx) => (
                                <div key={idx} className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                                    <span className="legend-label">{entry.name}:</span>
                                    <span className="legend-value">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="dash-list-container">
                    {todos.map((todo, index) => (
                        <div key={index} className="dash-list-item">
                            <div
                                className="dash-list-icon"
                                style={{ backgroundColor: `${statusColors[todo.status]}15`, color: statusColors[todo.status] }}
                            >
                                {getStatusIcon(todo.status)}
                            </div>
                            <div className="dash-list-details">
                                <div className="dash-list-header-mini">
                                    <span className="dash-category-tag" style={{ color: statusColors[todo.status] }}>
                                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                    </span>
                                    <span className="dash-time-stamp">{todo.time}</span>
                                </div>
                                <h6 className="dash-list-title">{todo.title}</h6>
                                <div className="dash-list-footer">
                                    <span className="dash-status-pill">
                                        <span className="dash-status-dot" style={{ backgroundColor: statusColors[todo.status] }}></span>
                                        <span className="dash-status-text" style={{ color: statusColors[todo.status] }}>{todo.statusLabel}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentTodo;
