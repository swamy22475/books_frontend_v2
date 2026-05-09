import React from 'react';
import { Award, Calendar } from 'react-feather';

const ActivityFeed = () => {
    const activities = [
        { title: '1st place in "Chess”', time: '1 Day ago', type: 'award', name: 'John Doe won' },
        { title: 'Participated in "Carrom"', time: '2 hours ago', type: 'event', name: 'Justin Lee' },
        { title: 'International conference', time: '2 Days ago', type: 'meeting', name: 'Justin Lee attended' },
        { title: 'Won 1st place in "Chess"', time: '3 Days ago', type: 'award', name: 'John Doe' },
    ];

    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.02)',
            border: '1px solid #f0f0f0',
            height: '100%'
        }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.2rem' }}>Student Activity</h4>

            <div className="activity-list">
                {activities.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '20px',
                        position: 'relative',
                        paddingLeft: '20px',
                        borderLeft: '2px solid #f0f0f0'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: '-9px',
                            top: '0',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#3d5ee1',
                            border: '2px solid white'
                        }}></div>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontWeight: '600', fontSize: '0.95rem' }}>{item.title}</p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{item.name} <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>• {item.time}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
