import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const students = [
    { name: 'Tenesa', class: 'XII, A', score: '99.1%', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Michael', class: 'XI, B', score: '97.5%', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
];

const StarStudents = () => {
    const [idx, setIdx] = useState(0);
    const s = students[idx];

    return (
        <div className="dashboard-card compact-profile-card">
            <div className="card-header">
                <h5>⭐ Star Student</h5>
                <div className="nav-arrows">
                    <button className="nav-arrow-btn" onClick={() => setIdx((idx - 1 + students.length) % students.length)}>
                        <IconChevronLeft size={16} />
                    </button>
                    <button className="nav-arrow-btn" onClick={() => setIdx((idx + 1) % students.length)}>
                        <IconChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div className="compact-profile-body">
                <img src={s.img} alt={s.name} className="compact-avatar" />
                <div className="compact-profile-info">
                    <span className="compact-name">{s.name}</span>
                    <span className="compact-sub">Class {s.class}</span>
                    <div className="compact-score-badge star">
                        <span>⭐</span>
                        <span>{s.score}</span>
                    </div>
                </div>
                <span className="compact-rank">#{idx + 1}</span>
            </div>
        </div>
    );
};

export default StarStudents;
