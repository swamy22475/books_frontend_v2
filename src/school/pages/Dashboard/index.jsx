import React from 'react';
import StatCard, { statsData } from './components/StatCard';
import WelcomeBanner from './components/WelcomeBanner';
import ScheduleCalendar from './components/ScheduleCalendar';
import AttendanceChart from './components/AttendanceChart';
import QuickLinks from './components/QuickLinks';
import BestPerformer from './components/BestPerformer';
import StarStudents from './components/StarStudents';
import FeesCollectionChart from './components/FeesCollectionChart';
import PerformanceChart from './components/PerformanceChart';
import FinanceCards from './components/FinanceCards';
import NoticeBoard from './components/NoticeBoard';
import FeeStats from './components/FeeStats';
import TopSubjects from './components/TopSubjects';
import StudentActivity from './components/StudentActivity';
import TodoList from './components/TodoList';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">
                    <h4>Admin Dashboard</h4>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span className="current">Admin Dashboard</span>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Add New Student
                    </button>
                    <button className="btn btn-outline">
                        Fees Details
                    </button>
                </div>
            </div>

            {/* Row 1: Welcome Banner + Birthdays (built inside WelcomeBanner) */}
            <div className="dashboard-row">
                <WelcomeBanner />
            </div>

            {/* Row 2: Stat Cards */}
            <div className="dashboard-row stats-row">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Row 3: Schedule | Attendance | Quick Links */}
            <div className="dashboard-row three-col-row">
                <div className="dash-cell"><ScheduleCalendar /></div>
                <div className="dash-cell"><AttendanceChart /></div>
                <div className="dash-cell"><QuickLinks /></div>
            </div>

            {/* Row 4: Fees Collection | Performance | Top Subjects */}
            <div className="dashboard-row pie-row-three">
                <div className="dash-cell"><FeesCollectionChart /></div>
                <div className="dash-cell"><PerformanceChart /></div>
                <div className="dash-cell"><TopSubjects /></div>
            </div>

            {/* Row 5: Finance | Notice Board | Fee Stats */}
            <div className="dashboard-row pie-row-three">
                <div className="dash-cell"><FinanceCards /></div>
                <div className="dash-cell"><NoticeBoard /></div>
                <div className="dash-cell"><FeeStats /></div>
            </div>

            {/* Row 6: Best Performer | Star Student | Student Activity | Todo */}
            <div className="dashboard-row bottom-row">
                <div className="dash-cell"><BestPerformer /></div>
                <div className="dash-cell"><StarStudents /></div>
                <div className="dash-cell"><StudentActivity /></div>
                <div className="dash-cell"><TodoList /></div>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>Copyright © 2024 MindWhile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
