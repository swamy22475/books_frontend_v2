import React from 'react';
import { Trash2, Users, Calendar, Clock } from 'lucide-react';

const TeacherEvents = () => {
    const events = [
        { title: 'Vacation Meeting', date: '07 July 2024 - 07 July 2024', time: '09:10 AM - 10:50 PM', borderColor: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.06)', icon: Trash2, iconColor: '#EF4444' },
        { title: 'Parents, Teacher Meet', date: '15 July 2024', time: '09:10 AM - 10:50 PM', borderColor: '#F97316', bgColor: 'rgba(249, 115, 22, 0.06)', icon: Users, iconColor: '#F97316' },
        { title: 'Staff Meeting', date: '10 July 2024', time: '09:10 AM - 10:50 PM', borderColor: '#3D5EE1', bgColor: 'rgba(61, 94, 225, 0.06)', icon: Users, iconColor: '#3D5EE1' },
    ];

    return (
        <div>
            <h5 className="text-base font-semibold mb-4" style={{ color: '#333333' }}>Upcoming Events</h5>
            <div className="space-y-4">
                {events.map((event, index) => {
                    const IconComponent = event.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-lg p-4"
                            style={{
                                backgroundColor: event.bgColor,
                                borderLeft: `4px solid ${event.borderColor}`
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <IconComponent size={18} style={{ color: event.iconColor }} />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h6 className="text-sm font-semibold mb-1 truncate" style={{ color: '#333333' }}>{event.title}</h6>
                                    <p className="text-xs mb-1 flex items-center gap-1" style={{ color: '#888888' }}>
                                        <Calendar size={12} />{event.date}
                                    </p>
                                    <p className="text-xs flex items-center gap-1" style={{ color: '#888888' }}>
                                        <Clock size={12} />{event.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeacherEvents;
