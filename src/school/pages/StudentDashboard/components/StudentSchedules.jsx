import React, { useState, useRef, useEffect } from 'react';
import { IconPlus, IconClock, IconCalendarEvent, IconDoor, IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';

const StudentSchedules = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('Exams');
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const monthDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);

    const exams = [
        {
            quarter: '1st Quarterly',
            subject: 'Mathematics',
            time: '01:30 - 02:15 PM',
            date: '06 May 2024',
            room: '15'
        },
        {
            quarter: '2nd Quarterly',
            subject: 'Physics',
            time: '01:30 - 02:15 PM',
            date: '07 May 2024',
            room: '15'
        }
    ];

    // Months array
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate years array (current year -10 to +10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setMonthDropdownOpen(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
                setYearDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const selectMonth = (monthIndex) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(monthIndex);
        setCurrentDate(newDate);
        setMonthDropdownOpen(false);
    };

    const selectYear = (year) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
        setYearDropdownOpen(false);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
        setMonthDropdownOpen(false);
        setYearDropdownOpen(false);
    };

    const selectDate = (dayObj, index) => {
        let newDate;
        if (dayObj.isCurrentMonth) {
            newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day);
        } else {
            if (index < 7 && dayObj.day > 15) {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, dayObj.day);
            } else {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, dayObj.day);
            }
            setCurrentDate(newDate);
        }
        setSelectedDate(newDate);
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, isCurrentMonth: true });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }

        return days;
    };

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const calendarDays = generateCalendarDays();
    const today = new Date();

    const isToday = (day) => {
        return day.isCurrentMonth &&
            day.day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (dayObj, index) => {
        if (!dayObj.isCurrentMonth) return false;
        return dayObj.day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    const isWeekend = (dayIndex) => {
        const colIndex = dayIndex % 7;
        return colIndex === 0 || colIndex === 6;
    };

    const formatSelectedDate = () => {
        return selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-card student-schedules-card">
            <div className="card-header">
                <h5>Schedules</h5>
                <button className="add-btn-sm">
                    <IconPlus size={16} />
                    Add New
                </button>
            </div>
            <div className="card-body">
                <div className="schedules-layout">
                    {/* Left - Calendar */}
                    <div className="schedules-calendar">
                        <div className="calendar-header">
                            <button
                                className="calendar-nav-btn"
                                onClick={() => navigateMonth(-1)}
                                title="Previous Month"
                            >
                                <IconChevronLeft size={20} />
                            </button>

                            <div className="calendar-selectors">
                                {/* Month Selector */}
                                <div className="calendar-select-container" ref={monthDropdownRef}>
                                    <button
                                        className="calendar-select-btn"
                                        onClick={() => {
                                            setMonthDropdownOpen(!monthDropdownOpen);
                                            setYearDropdownOpen(false);
                                        }}
                                    >
                                        {getMonthName(currentDate)}
                                        <IconChevronDown size={16} className={`select-arrow ${monthDropdownOpen ? 'open' : ''}`} />
                                    </button>
                                    {monthDropdownOpen && (
                                        <div className="calendar-dropdown month-dropdown">
                                            {months.map((month, index) => (
                                                <button
                                                    key={month}
                                                    className={`calendar-dropdown-item ${currentDate.getMonth() === index ? 'active' : ''}`}
                                                    onClick={() => selectMonth(index)}
                                                >
                                                    {month}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Year Selector */}
                                <div className="calendar-select-container" ref={yearDropdownRef}>
                                    <button
                                        className="calendar-select-btn"
                                        onClick={() => {
                                            setYearDropdownOpen(!yearDropdownOpen);
                                            setMonthDropdownOpen(false);
                                        }}
                                    >
                                        {currentDate.getFullYear()}
                                        <IconChevronDown size={16} className={`select-arrow ${yearDropdownOpen ? 'open' : ''}`} />
                                    </button>
                                    {yearDropdownOpen && (
                                        <div className="calendar-dropdown year-dropdown">
                                            {years.map((year) => (
                                                <button
                                                    key={year}
                                                    className={`calendar-dropdown-item ${currentDate.getFullYear() === year ? 'active' : ''}`}
                                                    onClick={() => selectYear(year)}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Today Button */}
                                <button
                                    className="calendar-today-btn"
                                    onClick={goToToday}
                                    title="Go to Today"
                                >
                                    Today
                                </button>
                            </div>

                            <button
                                className="calendar-nav-btn"
                                onClick={() => navigateMonth(1)}
                                title="Next Month"
                            >
                                <IconChevronRight size={20} />
                            </button>
                        </div>

                        <div className="calendar-weekdays">
                            {weekDays.map((day, index) => (
                                <div
                                    key={day}
                                    className={`weekday-cell ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="calendar-grid">
                            {calendarDays.map((dayObj, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day-cell 
                                        ${!dayObj.isCurrentMonth ? 'other-month' : ''} 
                                        ${isToday(dayObj) ? 'today' : ''}
                                        ${isSelected(dayObj, index) ? 'selected' : ''}
                                        ${isWeekend(index) ? 'weekend' : ''}
                                    `}
                                    onClick={() => selectDate(dayObj, index)}
                                >
                                    <span className="day-number">{dayObj.day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Selected Date Display */}
                        <div className="selected-date-display">
                            <IconCalendarEvent size={18} />
                            <span>{formatSelectedDate()}</span>
                        </div>
                    </div>

                    {/* Right - Exams */}
                    <div className="schedules-exams">
                        <div className="schedule-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'Exams' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Exams')}
                            >
                                Exams
                            </button>
                        </div>

                        <div className="exam-list">
                            {exams.map((exam, index) => (
                                <div key={index} className="exam-card">
                                    <div className="exam-quarter">{exam.quarter}</div>
                                    <h6 className="exam-subject">{exam.subject}</h6>
                                    <div className="exam-details">
                                        <div className="exam-detail">
                                            <IconClock size={14} />
                                            <span>{exam.time}</span>
                                        </div>
                                        <div className="exam-detail">
                                            <IconCalendarEvent size={14} />
                                            <span>{exam.date}</span>
                                        </div>
                                        <div className="exam-detail">
                                            <IconDoor size={14} />
                                            <span>Room No : {exam.room}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSchedules;

