import React, { useState } from 'react';

// All birthday dummy data
const ALL_BIRTHDAYS = [
    // Students — Today (Feb 24)
    { id: 1, name: 'Ananya Sharma', category: 'Students', role: 'Class X-A', img: 'https://randomuser.me/api/portraits/women/68.jpg', age: 16, month: 2, day: 24 },
    { id: 2, name: 'Priya Reddy', category: 'Students', role: 'Class XII-B', img: 'https://randomuser.me/api/portraits/women/55.jpg', age: 18, month: 2, day: 24 },
    // Students — This Week
    { id: 3, name: 'Arjun Mehta', category: 'Students', role: 'Class IX-C', img: 'https://randomuser.me/api/portraits/men/22.jpg', age: 15, month: 2, day: 26 },
    { id: 4, name: 'Sneha Pillai', category: 'Students', role: 'Class XI-A', img: 'https://randomuser.me/api/portraits/women/33.jpg', age: 17, month: 2, day: 27 },
    // Students — This Month
    { id: 5, name: 'Karan Verma', category: 'Students', role: 'Class VIII-B', img: 'https://randomuser.me/api/portraits/men/36.jpg', age: 14, month: 2, day: 10 },
    { id: 6, name: 'Divya Nair', category: 'Students', role: 'Class VII-A', img: 'https://randomuser.me/api/portraits/women/90.jpg', age: 13, month: 2, day: 5 },

    // Teachers — Today
    { id: 7, name: 'Raj Kumar', category: 'Teachers', role: 'Physics Dept.', img: 'https://randomuser.me/api/portraits/men/41.jpg', age: 34, month: 2, day: 24 },
    // Teachers — This Week
    { id: 8, name: 'Meera Joshi', category: 'Teachers', role: 'Mathematics', img: 'https://randomuser.me/api/portraits/women/44.jpg', age: 41, month: 2, day: 25 },
    { id: 9, name: 'Suresh Patil', category: 'Teachers', role: 'Chemistry', img: 'https://randomuser.me/api/portraits/men/57.jpg', age: 38, month: 2, day: 28 },
    // Teachers — This Month
    { id: 10, name: 'Lakshmi Iyer', category: 'Teachers', role: 'English Dept.', img: 'https://randomuser.me/api/portraits/women/71.jpg', age: 45, month: 2, day: 8 },

    // Staff — Today
    { id: 11, name: 'Deepak Singh', category: 'Staff', role: 'Accountant', img: 'https://randomuser.me/api/portraits/men/66.jpg', age: 29, month: 2, day: 24 },
    // Staff — This Week
    { id: 12, name: 'Kavita Rajan', category: 'Staff', role: 'Receptionist', img: 'https://randomuser.me/api/portraits/women/82.jpg', age: 27, month: 2, day: 26 },
    // Staff — This Month
    { id: 13, name: 'Mohan Das', category: 'Staff', role: 'Librarian', img: 'https://randomuser.me/api/portraits/men/79.jpg', age: 52, month: 2, day: 3 },
    { id: 14, name: 'Rita Sharma', category: 'Staff', role: 'Lab Assistant', img: 'https://randomuser.me/api/portraits/women/61.jpg', age: 31, month: 2, day: 18 },
];

const CATEGORIES = ['Students', 'Teachers', 'Staff'];
const PERIODS = ['Today', 'This Week', 'This Month'];

// Today's date info
const NOW = new Date();
const TODAY = { month: NOW.getMonth() + 1, day: NOW.getDate() };

// Get start of current week (Monday)
const getWeekStart = () => {
    const d = new Date(NOW);
    const day = d.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    return d;
};
const WEEK_START = getWeekStart();
const WEEK_END = new Date(WEEK_START);
WEEK_END.setDate(WEEK_START.getDate() + 6);

const matchesPeriod = (person, period) => {
    const bDate = new Date(NOW.getFullYear(), person.month - 1, person.day);
    if (period === 'Today') return person.month === TODAY.month && person.day === TODAY.day;
    if (period === 'This Week') return bDate >= WEEK_START && bDate <= WEEK_END;
    if (period === 'This Month') return person.month === TODAY.month;
    return true;
};

const categoryColors = {
    Students: { bg: '#eef3ff', color: '#3d5ee1', dot: '#3d5ee1' },
    Teachers: { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' },
    Staff: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
};

const WelcomeBanner = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const [activeCategory, setActiveCategory] = useState('Students');
    const [activePeriod, setActivePeriod] = useState('Today');

    const filtered = ALL_BIRTHDAYS.filter(
        p => p.category === activeCategory && matchesPeriod(p, activePeriod)
    );

    const todayTotal = ALL_BIRTHDAYS.filter(p => matchesPeriod(p, 'Today')).length;
    const colors = categoryColors[activeCategory];

    return (
        <div className="hero-row">
            {/* Welcome Card */}
            <div className="welcome-banner">
                <div className="welcome-content">
                    <div className="welcome-badge">🎓 Academic Year 2024–25</div>
                    <h2>Welcome Back, Mr. Herald</h2>
                    <p>📅 {dateStr}</p>
                    <div className="welcome-stats-row">
                        <div className="welcome-stat-chip">
                            <span className="ws-num">3,654</span>
                            <span className="ws-lbl">Students</span>
                        </div>
                        <div className="welcome-stat-chip">
                            <span className="ws-num">284</span>
                            <span className="ws-lbl">Teachers</span>
                        </div>
                        <div className="welcome-stat-chip">
                            <span className="ws-num">98.8%</span>
                            <span className="ws-lbl">Attendance</span>
                        </div>
                    </div>
                </div>
                <div className="welcome-image">
                    <img
                        src="https://preskool.dreamstechnologies.com/html/template/assets/img/bg/bg-01.png"
                        alt="Welcome"
                    />
                </div>
                <div className="welcome-glow"></div>
            </div>

            {/* Enhanced Birthday Card */}
            <div className="dashboard-card birthday-card">
                {/* Header */}
                <div className="bday-header">
                    <div className="bday-title-row">
                        <span className="bday-icon">🎂</span>
                        <span className="bday-title">Birthdays</span>
                        {todayTotal > 0 && (
                            <span className="bday-today-badge">{todayTotal} today</span>
                        )}
                    </div>

                    {/* Period Toggle */}
                    <div className="bday-period-toggle">
                        {PERIODS.map(p => (
                            <button
                                key={p}
                                className={`bday-period-btn ${activePeriod === p ? 'active' : ''}`}
                                onClick={() => setActivePeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="bday-category-tabs">
                    {CATEGORIES.map(cat => {
                        const catCount = ALL_BIRTHDAYS.filter(
                            p => p.category === cat && matchesPeriod(p, activePeriod)
                        ).length;
                        const c = categoryColors[cat];
                        return (
                            <button
                                key={cat}
                                className={`bday-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                                style={activeCategory === cat
                                    ? { background: c.bg, color: c.color, borderColor: c.color }
                                    : {}}
                                onClick={() => setActiveCategory(cat)}
                            >
                                <span
                                    className="bday-cat-dot"
                                    style={{ background: c.dot }}
                                ></span>
                                {cat}
                                {catCount > 0 && (
                                    <span
                                        className="bday-cat-count"
                                        style={activeCategory === cat
                                            ? { background: c.color, color: '#fff' }
                                            : { background: '#e9ecef', color: '#6e6b7b' }}
                                    >
                                        {catCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                <div className="birthday-list">
                    {filtered.length > 0 ? (
                        filtered.map((person, i) => (
                            <div key={person.id} className="birthday-item">
                                <div className="birthday-avatar-wrap">
                                    <img src={person.img} alt={person.name} className="birthday-avatar" />
                                    <span className="birthday-candle">🎂</span>
                                </div>
                                <div className="birthday-info">
                                    <span className="birthday-name">{person.name}</span>
                                    <span className="birthday-role">{person.role}</span>
                                </div>
                                <div
                                    className="birthday-age-badge"
                                    style={{ background: `linear-gradient(135deg, ${colors.color}, ${colors.dot})` }}
                                >
                                    {person.age}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bday-empty">
                            <span className="bday-empty-icon">🎈</span>
                            <p>No {activeCategory.toLowerCase()} birthdays {activePeriod.toLowerCase()}</p>
                        </div>
                    )}
                </div>

                <div className="birthday-footer">
                    <span>🎉 Don't forget to wish them!</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
