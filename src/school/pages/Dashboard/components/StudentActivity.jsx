import React from 'react';

const StudentActivity = () => {
    const activities = [
        {
            title: '1st place in "Chess"',
            name: 'John Doe won',
            time: '1 Day ago',
            color: '#22c55e'
        },
        {
            title: 'Participated in "Carrom"',
            name: 'Justin Lee',
            time: '2 hours ago',
            color: '#3d5ee1'
        },
        {
            title: 'International conference',
            name: 'Justin Lee attended',
            time: '2 Days ago',
            color: '#f59e0b'
        },
        {
            title: 'Won 1st place in "Chess"',
            name: 'John Doe',
            time: '3 Days ago',
            color: '#22c55e'
        }
    ];

    return (
        <div className="dashboard-card student-activity-card">
            <div className="card-header">
                <h5>Student Activity</h5>
                <a href="/activities" className="view-all">View All</a>
            </div>

            <div className="activity-timeline">
                {activities.map((activity, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-dot" style={{ backgroundColor: activity.color }}></div>
                        <div className="timeline-content">
                            <h6>{activity.title}</h6>
                            <p>{activity.name} <span>• {activity.time}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentActivity;
