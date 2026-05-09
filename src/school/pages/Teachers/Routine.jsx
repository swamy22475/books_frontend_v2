import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { IconCalendar, IconChevronDown, IconSettings, IconClock, IconChevronLeft } from '@tabler/icons-react';
import './Teachers.css';

const Routine = () => {
    const navigate = useNavigate();
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('This Year');

    return (
        <div className="teachers-container">
            <div className="page-header-row">
                <div className="breadcrumb">
                    <h2>Teacher Routine</h2>
                    <span>Dashboard / Teachers / Teacher Routine</span>
                </div>
            </div>

            <div className="content-card p-4">
                <div className="section-header-row mb-4">
                    <div className="section-title">Time Table</div>
                    <div className="header-actions-row">
                        <div className="year-selector-container" style={{ position: 'relative' }}>
                            <div className="year-selector" onClick={() => setShowYearDropdown(!showYearDropdown)}>
                                <IconCalendar size={16} />
                                <span>{selectedTimeRange}</span>
                                <IconChevronDown size={16} />
                            </div>
                            {showYearDropdown && (
                                <div className="year-dropdown-menu">
                                    {['This Year', 'This Month', 'This Week'].map(option => (
                                        <div
                                            key={option}
                                            className="dropdown-item"
                                            onClick={() => {
                                                setSelectedTimeRange(option);
                                                setShowYearDropdown(false);
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="btn-icon-settings"><IconSettings size={20} /></button>
                    </div>
                </div>

                <div className="timetable-grid">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                        <div key={day} className="day-column">
                            <div className="day-header">{day}</div>
                            <div className="day-schedule">
                                {[1, 2, 3].map((slot) => (
                                    <div key={slot} className="schedule-card">
                                        <div className="room-badge">Room No:10{4 + index}</div>
                                        <div className="schedule-info">
                                            <span className="class-name">Class : {['III, A', 'V, A', 'IV, B'][slot - 1]}</span>
                                            <span className="subject-name">Subject : {['Spanish', 'English', 'Maths'][index % 3]}</span>
                                            <div className="schedule-time">
                                                <IconClock size={14} />
                                                <span>09:45 - 10:30 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="break-blocks-row mt-4">
                    <div className="break-block blue">
                        <span className="break-label">Morning Break</span>
                        <div className="break-time">
                            <IconClock size={14} />
                            <span>10:30 to 10:45 AM</span>
                        </div>
                    </div>
                    <div className="break-block yellow">
                        <span className="break-label">Lunch</span>
                        <div className="break-time">
                            <IconClock size={14} />
                            <span>10:30 to 12:45 PM</span>
                        </div>
                    </div>
                    <div className="break-block light-blue">
                        <span className="break-label">Evening Break</span>
                        <div className="break-time">
                            <IconClock size={14} />
                            <span>03:30 PM to 03:45 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Routine;
