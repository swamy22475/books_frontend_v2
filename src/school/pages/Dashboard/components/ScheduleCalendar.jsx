import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendar, IconClock, IconMapPin } from '@tabler/icons-react';

const ScheduleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Events data
    const events = [
        {
            title: 'Parents, Teacher Meet',
            date: '15 July 2024',
            time: '09:10AM - 10:50PM',
            color: '#3d5ee1',
            attendees: [
                'https://randomuser.me/api/portraits/women/1.jpg',
                'https://randomuser.me/api/portraits/men/2.jpg',
                'https://randomuser.me/api/portraits/women/3.jpg'
            ]
        },
        {
            title: 'Parents, Teacher Meet',
            date: '15 July 2024',
            time: '09:10AM - 10:50PM',
            color: '#3d5ee1',
            attendees: [
                'https://randomuser.me/api/portraits/men/4.jpg',
                'https://randomuser.me/api/portraits/women/5.jpg',
                'https://randomuser.me/api/portraits/men/6.jpg'
            ]
        },
        {
            title: 'Vacation Meeting',
            date: '07 July 2024 - 07 July 2024',
            time: '09:10 AM - 10:50 PM',
            color: '#ea5455',
            attendees: [
                'https://randomuser.me/api/portraits/women/7.jpg'
            ]
        }
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, isCurrentMonth: true });
        }

        // Next month days to fill the grid
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }

        return days;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentDate);
    const today = new Date().getDate();
    const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

    return (
        <div className="dashboard-card schedule-calendar combined">
            <div className="card-header">
                <h5>Schedules</h5>
                <button className="add-btn">
                    <IconPlus size={14} /> Add New
                </button>
            </div>

            <div className="card-body">
                {/* Calendar Section */}
                <div className="calendar-section">
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={prevMonth}>
                            <IconChevronLeft size={18} />
                        </button>
                        <span className="month-year">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button className="nav-btn" onClick={nextMonth}>
                            <IconChevronRight size={18} />
                        </button>
                    </div>

                    <div className="calendar-grid">
                        <div className="calendar-weekdays">
                            {daysOfWeek.map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>
                        <div className="calendar-days">
                            {days.map((dayObj, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${dayObj.day === today && dayObj.isCurrentMonth && isCurrentMonth ? 'today' : ''}`}
                                >
                                    {dayObj.day}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="upcoming-events-section">
                    <h6 className="section-title">Upcoming Events</h6>

                    <div className="events-list">
                        {events.map((event, index) => (
                            <div key={index} className="event-item" style={{ borderLeftColor: event.color }}>
                                <div className="event-icon" style={{ backgroundColor: `${event.color}15`, color: event.color }}>
                                    <IconMapPin size={20} />
                                </div>
                                <div className="event-info">
                                    <h6 className="event-title">{event.title}</h6>
                                    <p className="event-date">
                                        <IconCalendar size={14} />
                                        {event.date}
                                    </p>
                                </div>
                                <div className="event-footer">
                                    <span className="event-time">
                                        <IconClock size={14} />
                                        {event.time}
                                    </span>
                                    <div className="event-attendees">
                                        {event.attendees.map((avatar, i) => (
                                            <img key={i} src={avatar} alt="attendee" className="attendee-avatar" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCalendar;
