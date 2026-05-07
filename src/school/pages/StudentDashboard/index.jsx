import React from 'react';
import StudentProfileCard from './components/StudentProfileCard';
import StudentAttendance from './components/StudentAttendance';
import StudentQuickLinks from './components/StudentQuickLinks';
import StudentSchedules from './components/StudentSchedules';
import StudentPerformance from './components/StudentPerformance';
import StudentHomework from './components/StudentHomework';
import ClassFaculties from './components/ClassFaculties';
import LeaveStatus from './components/LeaveStatus';
import StudentExamResult from './components/StudentExamResult';
import StudentFeesReminder from './components/StudentFeesReminder';
import StudentNoticeBoard from './components/StudentNoticeBoard';
import StudentSyllabus from './components/StudentSyllabus';
import StudentTodo from './components/StudentTodo';
import './StudentDashboard.css';

const StudentDashboard = () => {
    return (
        <div className="student-dashboard-page">
            <div className="dashboard-main-container">
                {/* Page Header */}
                <header className="page-header">
                    <div className="page-title">
                        <h4>Student Dashboard</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span className="current">Student Dashboard</span>
                        </nav>
                    </div>
                </header>

                <div className="dashboard-content-layout">
                    {/* TOP SECTION: 2-column layout (1fr 2fr) */}
                    <section className="top-grid-layout">
                        <div className="profile-section">
                            <StudentProfileCard />
                        </div>
                        <div className="attendance-section">
                            <StudentAttendance />
                        </div>
                    </section>

                    {/* ACTION BUTTON SECTION: horizontal 4 equal cards */}
                    <section className="quicklinks-layout">
                        <StudentQuickLinks />
                    </section>

                    {/* SCHEDULE SECTION: Full width card (Calendar + Exams) */}
                    <section className="schedule-layout">
                        <StudentSchedules />
                    </section>

                    {/* PERFORMANCE SECTION: Full width chart */}
                    <section className="performance-layout">
                        <StudentPerformance />
                    </section>

                    {/* HOMEWORK SECTION: Full width */}
                    <section className="homework-layout">
                        <StudentHomework />
                    </section>

                    {/* FACULTY SECTION: Full width */}
                    <section className="faculty-layout">
                        <ClassFaculties />
                    </section>

                    {/* LEAVE + EXAM RESULT: 2-column (1fr 1fr) */}
                    <section className="leave-exam-layout">
                        <LeaveStatus />
                        <StudentExamResult />
                    </section>

                    {/* BOTTOM SECTION: 3-column (Notice | Syllabus | Todo) */}
                    <section className="bottom-grid-layout">
                        <StudentNoticeBoard />
                        <StudentSyllabus />
                        <StudentTodo />
                    </section>
                </div>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>Copyright © 2024 MindWhile. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default StudentDashboard;

