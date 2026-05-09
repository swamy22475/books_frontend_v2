import React, { useState, useRef, useEffect } from 'react';
import {
    IconCalendarEvent,
    IconReportAnalytics,
    IconCash,
    IconClipboardCheck,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentQuickView = () => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const monthDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);

    const tabs = [
        { id: 'attendance', label: 'Attendance', icon: IconClipboardCheck },
        { id: 'calendar', label: 'Calendar', icon: IconCalendarEvent },
        { id: 'exam', label: 'Exam Result', icon: IconReportAnalytics },
        { id: 'fees', label: 'Fees', icon: IconCash },
    ];

    // Attendance Data
    const attendanceStats = {
        totalDays: 28,
        present: 25,
        absent: 2,
        halfday: 1
    };

    // Exam Results Data
    const examResults = [
        { subject: 'Mathematics', marks: '95/100', grade: 'A+' },
        { subject: 'English', marks: '88/100', grade: 'A' },
        { subject: 'Science', marks: '92/100', grade: 'A+' },
        { subject: 'Hindi', marks: '85/100', grade: 'A' },
    ];

    // Fees Data
    const feesData = [
        { type: 'Tuition Fee', amount: '₹15,000', dueDate: 'Feb 15, 2026', status: 'pending' },
        { type: 'Transport Fee', amount: '₹3,000', dueDate: 'Feb 20, 2026', status: 'pending' },
        { type: 'Lab Fee', amount: '₹2,000', dueDate: 'Jan 30, 2026', status: 'paid' },
    ];

    // Calendar Logic
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const fullMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

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

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

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

    const isToday = (day) => day.isCurrentMonth && day.day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

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

    const formatSelectedDate = () => selectedDate.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    // Calculate attendance percentage
    const total = attendanceStats.present + attendanceStats.absent + attendanceStats.halfday;
    const attendancePercent = Math.round((attendanceStats.present / total) * 100);

    const renderContent = () => {
        switch (activeTab) {
            case 'attendance':
                return (
                    <div className="qv-attendance-content">
                        <div className="qv-attendance-chart">
                            <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie
                                        data={[
                                            { name: 'Present', value: attendanceStats.present, color: '#28c76f' },
                                            { name: 'Absent', value: attendanceStats.absent, color: '#ea5455' },
                                            { name: 'Halfday', value: attendanceStats.halfday, color: '#ff9f43' }
                                        ]}
                                        outerRadius={55}
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
                        <div className="qv-attendance-stats">
                            <div className="qv-stat present"><span className="qv-stat-dot"></span>Present: <strong>{attendanceStats.present}</strong></div>
                            <div className="qv-stat absent"><span className="qv-stat-dot"></span>Absent: <strong>{attendanceStats.absent}</strong></div>
                            <div className="qv-stat halfday"><span className="qv-stat-dot"></span>Halfday: <strong>{attendanceStats.halfday}</strong></div>
                        </div>
                    </div>
                );

            case 'calendar':
                return (
                    <div className="qv-calendar-content">
                        <div className="qv-calendar-header">
                            <button className="qv-nav-btn" onClick={() => navigateMonth(-1)}>
                                <IconChevronLeft size={16} />
                            </button>
                            <div className="qv-calendar-selectors">
                                <div className="qv-select-container" ref={monthDropdownRef}>
                                    <button className="qv-select-btn" onClick={() => { setMonthDropdownOpen(!monthDropdownOpen); setYearDropdownOpen(false); }}>
                                        {months[currentDate.getMonth()]}
                                        <IconChevronDown size={14} className={monthDropdownOpen ? 'open' : ''} />
                                    </button>
                                    {monthDropdownOpen && (
                                        <div className="qv-dropdown month">
                                            {fullMonths.map((month, index) => (
                                                <button key={month} className={`qv-dropdown-item ${currentDate.getMonth() === index ? 'active' : ''}`}
                                                    onClick={() => selectMonth(index)}>{month}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="qv-select-container" ref={yearDropdownRef}>
                                    <button className="qv-select-btn" onClick={() => { setYearDropdownOpen(!yearDropdownOpen); setMonthDropdownOpen(false); }}>
                                        {currentDate.getFullYear()}
                                        <IconChevronDown size={14} className={yearDropdownOpen ? 'open' : ''} />
                                    </button>
                                    {yearDropdownOpen && (
                                        <div className="qv-dropdown year">
                                            {years.map((year) => (
                                                <button key={year} className={`qv-dropdown-item ${currentDate.getFullYear() === year ? 'active' : ''}`}
                                                    onClick={() => selectYear(year)}>{year}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button className="qv-today-btn" onClick={goToToday}>Today</button>
                            </div>
                            <button className="qv-nav-btn" onClick={() => navigateMonth(1)}>
                                <IconChevronRight size={16} />
                            </button>
                        </div>
                        <div className="qv-calendar-weekdays">
                            {weekDays.map((day, idx) => (
                                <div key={day} className={`qv-weekday ${idx === 0 || idx === 6 ? 'weekend' : ''}`}>{day}</div>
                            ))}
                        </div>
                        <div className="qv-calendar-grid">
                            {calendarDays.map((dayObj, index) => (
                                <div key={index} className={`qv-day 
                                    ${!dayObj.isCurrentMonth ? 'other' : ''} 
                                    ${isToday(dayObj) ? 'today' : ''} 
                                    ${isSelected(dayObj, index) ? 'selected' : ''}
                                    ${isWeekend(index) ? 'weekend' : ''}`}
                                    onClick={() => selectDate(dayObj, index)}>
                                    {dayObj.day}
                                </div>
                            ))}
                        </div>
                        <div className="qv-selected-date">{formatSelectedDate()}</div>
                    </div>
                );

            case 'exam':
                return (
                    <div className="qv-exam-content">
                        <div className="qv-exam-summary">
                            <div className="qv-exam-badge">
                                <span>90%</span>
                            </div>
                            <div className="qv-exam-info">
                                <p className="qv-exam-marks">360/400</p>
                                <span>Overall Score</span>
                            </div>
                        </div>
                        <div className="qv-exam-list">
                            {examResults.map((result, index) => (
                                <div key={index} className="qv-exam-item">
                                    <span className="qv-subject">{result.subject}</span>
                                    <span className="qv-marks">{result.marks}</span>
                                    <span className={`qv-grade grade-${result.grade.toLowerCase().replace('+', '-plus')}`}>{result.grade}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'fees':
                return (
                    <div className="qv-fees-content">
                        {feesData.map((fee, index) => (
                            <div key={index} className={`qv-fee-item ${fee.status}`}>
                                <div className="qv-fee-info">
                                    <p className="qv-fee-type">{fee.type}</p>
                                    <span className="qv-fee-due">Due: {fee.dueDate}</span>
                                </div>
                                <div className="qv-fee-right">
                                    <p className="qv-fee-amount">{fee.amount}</p>
                                    <span className={`qv-fee-status ${fee.status}`}>
                                        {fee.status === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="dashboard-card student-quickview-card">
            <div className="qv-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`qv-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="qv-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentQuickView;
