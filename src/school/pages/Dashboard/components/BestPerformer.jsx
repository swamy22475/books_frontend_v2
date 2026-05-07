import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconStar } from '@tabler/icons-react';

const performers = [
    { name: 'Rubell', subject: 'Physics Teacher', score: '98.4%', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sarah Ahmed', subject: 'Math Teacher', score: '96.8%', img: 'https://randomuser.me/api/portraits/women/28.jpg' },
];

const BestPerformer = () => {
    const [idx, setIdx] = useState(0);
    const p = performers[idx];

    return (
        <div className="dashboard-card compact-profile-card">
            <div className="card-header">
                <h5>🏆 Best Performer</h5>
                <div className="nav-arrows">
                    <button className="nav-arrow-btn" onClick={() => setIdx((idx - 1 + performers.length) % performers.length)}>
                        <IconChevronLeft size={16} />
                    </button>
                    <button className="nav-arrow-btn" onClick={() => setIdx((idx + 1) % performers.length)}>
                        <IconChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div className="compact-profile-body">
                <img src={p.img} alt={p.name} className="compact-avatar" />
                <div className="compact-profile-info">
                    <span className="compact-name">{p.name}</span>
                    <span className="compact-sub">{p.subject}</span>
                    <div className="compact-score-badge">
                        <IconStar size={12} style={{ color: '#f59e0b' }} />
                        <span>{p.score}</span>
                    </div>
                </div>
                <span className="compact-trophy">🏆</span>
            </div>
        </div>
    );
};

export default BestPerformer;
