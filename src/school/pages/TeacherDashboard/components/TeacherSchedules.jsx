import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const TeacherSchedules = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = startingDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthLastDay - i, currentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                currentMonth: true,
                isToday: i === 1
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ day: i, currentMonth: false });
        }

        return days;
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div style={{ marginTop: 10 }}>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ChevronLeft size={18} style={{ color: '#888888' }} />
                </button>
                <span className="text-sm font-semibold" style={{ color: '#333333' }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ChevronRight size={18} style={{ color: '#888888' }} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Week Header */}
                <div className="grid grid-cols-7 bg-gray-50">
                    {weekDays.map(day => (
                        <div key={day} className="py-2 text-center text-xs font-medium" style={{ color: '#888888' }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7">
                    {getDaysInMonth(currentMonth).map((day, index) => (
                        <div
                            key={index}
                            className="py-2 text-center text-sm cursor-pointer border-t border-gray-100 hover:bg-gray-50"
                            style={{ color: !day.currentMonth ? '#D1D5DB' : '#333333' }}
                        >
                            {day.isToday ? (
                                <span
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white"
                                    style={{ backgroundColor: '#3D5EE1' }}
                                >
                                    {day.day}
                                </span>
                            ) : (
                                day.day
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherSchedules;
