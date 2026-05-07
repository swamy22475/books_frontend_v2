import React from 'react';
import { IconCheck, IconClock, IconAlertCircle } from '@tabler/icons-react';

const TodoList = () => {
    const tasks = [
        {
            title: 'Send Fees Reminder to Students',
            time: '08:00 AM',
            status: 'completed',
            statusLabel: 'Completed'
        },
        {
            title: 'Prepare Monthly Reports',
            time: '10:30 AM',
            status: 'inprogress',
            statusLabel: 'Inprogress'
        },
        {
            title: 'Review Student Applications',
            time: '02:00 PM',
            status: 'pending',
            statusLabel: 'Yet To Start'
        },
        {
            title: 'Staff Meeting Schedule',
            time: '04:00 PM',
            status: 'pending',
            statusLabel: 'Yet To Start'
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <IconCheck size={14} />;
            case 'inprogress': return <IconClock size={14} />;
            default: return <IconAlertCircle size={14} />;
        }
    };

    return (
        <div className="dashboard-card todo-card">
            <div className="card-header">
                <h5>Todo</h5>
                <a href="/todo" className="view-all">View All</a>
            </div>

            <div className="todo-list">
                {tasks.map((task, index) => (
                    <div key={index} className="todo-item">
                        <div className={`todo-checkbox ${task.status}`}>
                            {task.status === 'completed' && <IconCheck size={12} />}
                        </div>
                        <div className="todo-content">
                            <span className="todo-title">{task.title}</span>
                            <span className="todo-time">{task.time}</span>
                        </div>
                        <span className={`todo-status ${task.status}`}>
                            {getStatusIcon(task.status)}
                            {task.statusLabel}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
