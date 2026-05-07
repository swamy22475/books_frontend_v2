import React from 'react';
import { IconCalendar } from '@tabler/icons-react';

const UpcomingEvents = () => {
    const events = [
        {
            title: 'Parents, Teacher Meet',
            date: '18 Jul 2024',
            time: '09:10 - 10:00 AM',
            attendees: [
                'https://randomuser.me/api/portraits/men/1.jpg',
                'https://randomuser.me/api/portraits/women/2.jpg',
                'https://randomuser.me/api/portraits/men/3.jpg',
                'https://randomuser.me/api/portraits/women/4.jpg'
            ],
            moreCount: 24
        },
        {
            title: 'Vacation Meeting',
            date: '22 Jul 2024',
            time: '10:00 - 11:00 AM',
            attendees: [
                'https://randomuser.me/api/portraits/men/5.jpg',
                'https://randomuser.me/api/portraits/women/6.jpg'
            ],
            moreCount: 10
        },
        {
            title: 'Annual Sports Day',
            date: '25 Jul 2024',
            time: '08:00 AM - 05:00 PM',
            attendees: [
                'https://randomuser.me/api/portraits/men/7.jpg',
                'https://randomuser.me/api/portraits/women/8.jpg',
                'https://randomuser.me/api/portraits/men/9.jpg'
            ],
            moreCount: 150
        }
    ];

    return (
        <div className="dashboard-card upcoming-events">
            <div className="card-header">
                <h5>Upcoming Events</h5>
                <a href="/events" className="view-all">View All</a>
            </div>

            <div className="events-list">
                {events.map((event, index) => (
                    <div key={index} className="event-item">
                        <div className="event-icon">
                            <IconCalendar size={20} color="#3d5ee1" />
                        </div>
                        <div className="event-details">
                            <h6>{event.title}</h6>
                            <p>{event.date} | {event.time}</p>
                            <div className="event-attendees">
                                {event.attendees.slice(0, 3).map((avatar, i) => (
                                    <img key={i} src={avatar} alt="attendee" className="attendee-avatar" />
                                ))}
                                {event.moreCount > 0 && (
                                    <span className="more-attendees">+{event.moreCount}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingEvents;
