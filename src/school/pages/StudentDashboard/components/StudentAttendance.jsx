import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCalendarEvent } from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentAttendance = () => {
    const [filter, setFilter] = useState('This Week');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const monthDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);

    const attendanceStats = {
        totalDays: 28,
        present: 25,
        absent: 2,
        halfday: 1
    };

    // Calculate percentages for donut chart
    const total = attendanceStats.present + attendanceStats.absent + attendanceStats.halfday;
    const presentPercent = (attendanceStats.present / total) * 100;
    const absentPercent = (attendanceStats.absent / total) * 100;

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
            // Calculate if it's previous or next month
            if (index < 7 && dayObj.day > 15) {
                // Previous month
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, dayObj.day);
            } else {
                // Next month
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

    const isWeekend = (dayIndex) => {
        const colIndex = dayIndex % 7;
        return colIndex === 0 || colIndex === 6;
    };

    const isSelected = (dayObj, index) => {
        if (!dayObj.isCurrentMonth) {
            // Check for previous month days
            if (index < 7 && dayObj.day > 15) {
                const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, dayObj.day);
                return prevMonth.getDate() === selectedDate.getDate() &&
                    prevMonth.getMonth() === selectedDate.getMonth() &&
                    prevMonth.getFullYear() === selectedDate.getFullYear();
            }
            // Check for next month days
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, dayObj.day);
            return nextMonth.getDate() === selectedDate.getDate() &&
                nextMonth.getMonth() === selectedDate.getMonth() &&
                nextMonth.getFullYear() === selectedDate.getFullYear();
        }
        return dayObj.isCurrentMonth &&
            dayObj.day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    // Format selected date for display
    const formatSelectedDate = () => {
        return selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-card student-attendance-card">
            <div className="card-header">
                <h5>Attendance</h5>
                <div className="dropdown-container">
                    <button
                        className="dropdown-toggle"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {filter}
                        <IconChevronDown size={16} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {['This Week', 'Last Week', 'Last Month'].map((option) => (
                                <button
                                    key={option}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setFilter(option);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="card-body">
                <div className="attendance-content">
                    {/* Stats at top */}
                    <div className="attendance-stats-horizontal">
                        <div className="stat-box present">
                            <span className="stat-label">Present</span>
                            <span className="stat-value">{attendanceStats.present}</span>
                        </div>
                        <div className="stat-box absent">
                            <span className="stat-label">Absent</span>
                            <span className="stat-value">{attendanceStats.absent}</span>
                        </div>
                        <div className="stat-box halfday">
                            <span className="stat-label">Halfday</span>
                            <span className="stat-value">{attendanceStats.halfday}</span>
                        </div>
                    </div>

                    {/* Centered Donut Chart */}
                    <div className="attendance-chart-container">
                        <div className="donut-chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip />
                                    <Pie
                                        data={[
                                            { name: 'Present', value: attendanceStats.present, color: '#28c76f' },
                                            { name: 'Absent', value: attendanceStats.absent, color: '#ea5455' },
                                            { name: 'Halfday', value: attendanceStats.halfday, color: '#ff9f43' }
                                        ]}
                                        innerRadius={70}
                                        outerRadius={100}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {[
                                            { name: 'Present', value: attendanceStats.present, color: '#28c76f' },
                                            { name: 'Absent', value: attendanceStats.absent, color: '#ea5455' },
                                            { name: 'Halfday', value: attendanceStats.halfday, color: '#ff9f43' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Full Calendar */}
                <div className="attendance-calendar">
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
                                <IconCalendarEvent size={16} />
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
                        <span>Selected: <strong>{formatSelectedDate()}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
