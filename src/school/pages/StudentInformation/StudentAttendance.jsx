import React, { useEffect, useState } from 'react';
import './StudentAttendance.css';
import { IconPlus, IconCalendar, IconInfoCircle, IconChevronRight } from '@tabler/icons-react';
import StudentPageContainer from './components/StudentPageContainer';

const classesSample = ['Select Class', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];
const sectionsSample = ['Select Section', 'A', 'B', 'C'];

import { useNavigate } from 'react-router-dom';

const StudentAttendance = () => {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('Select Class');
    const [selectedSection, setSelectedSection] = useState('Select Section');
    const [date, setDate] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // set today as default
        const today = new Date().toISOString().slice(0, 10);
        setDate(today);
        // trigger entrance animation
        requestAnimationFrame(() => setIsLoaded(true));
    }, []);

    const handleAttendance = () => {
        // keep existing functionality: trigger attendance fetch / open modal
        console.log('Attendance clicked', { selectedClass, selectedSection, date });
    };

    const handleAddAttendance = () => {
        console.log('Add Student Attendance clicked');
    };

    const isEmptyState = !selectedClass || selectedClass === 'Select Class' || !selectedSection || selectedSection === 'Select Section';

    const addBtn = (
        <button className="btn btn-primary" onClick={() => navigate('/school/student-attendance/add')}>
            <IconPlus className="icon-left" />
            Add Student Attendance
        </button>
    );

    return (
        <StudentPageContainer
            title="Student Attendance"
            breadcrumb={<><span className="crumb">Dashboard</span> <IconChevronRight className="crumb-sep" /> <span className="crumb">Students</span> <IconChevronRight className="crumb-sep" /> <span className="crumb active">Attendance</span></>}
            backTitle="Go back"
            pageClass={"attendance-page " + (isLoaded ? 'loaded' : '')}
            actions={addBtn}
        >

            <main className="attendance-main">
                <section className="filters card">
                    <div className="filters-grid">
                        <div className="field">
                            <label>Class</label>
                            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                {classesSample.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label>Section</label>
                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                                {sectionsSample.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label>Date</label>
                            <div className="input-with-icon">
                                <IconCalendar className="field-icon" />
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="actions-row">
                            <button className="btn attendance-btn" onClick={handleAttendance}>ATTENDANCE</button>
                        </div>
                    </div>
                </section>

                <section className="content-area">
                    <section className="note card info-card">
                        <IconInfoCircle className="info-icon" />
                        <div>
                            <h4>Note</h4>
                            <p>Mark attendance for the selected Class and Section. Use the "Add Student Attendance" button to register new attendance records.</p>
                        </div>
                    </section>

                    <section className="attendance-card card">
                        {!isEmptyState ? (
                            <div className="attendance-list">
                                <h3 className="card-heading">Attendance for {selectedClass} - {selectedSection} on {date}</h3>
                                <p className="muted">(This area would list students and attendance controls.)</p>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-illustration" aria-hidden>
                                    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="8" y="12" width="104" height="56" rx="8" fill="#E9F2FF" />
                                        <circle cx="36" cy="36" r="10" fill="#D0E6FF" />
                                        <rect x="60" y="28" width="40" height="8" rx="4" fill="#D0E6FF" />
                                        <rect x="60" y="44" width="28" height="6" rx="3" fill="#D0E6FF" />
                                    </svg>
                                </div>
                                <div className="empty-text">
                                    <h3>No Class or Section selected</h3>
                                    <p className="muted">Select a class and section to view or mark attendance.</p>
                                    <div className="empty-actions">
                                        <button className="btn btn-ghost" onClick={() => { setSelectedClass('Grade 1'); setSelectedSection('A'); }}>Try demo selection</button>
                                        <button className="btn attendance-btn small" onClick={handleAttendance}>Proceed</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </StudentPageContainer>
    );
};

export default StudentAttendance;
