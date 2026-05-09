import React from 'react';
import { Plus } from 'lucide-react';

// Import all components
import TeacherWelcomeBanner from './components/TeacherWelcomeBanner';
import TeacherProfileCard from './components/TeacherProfileCard';
import SyllabusProgress from './components/SyllabusProgress';
import TodaysClasses from './components/TodaysClasses';
import TeacherAttendance from './components/TeacherAttendance';
import BestPerformers from './components/BestPerformers';
import StudentProgress from './components/StudentProgress';
import TeacherSchedules from './components/TeacherSchedules';
import TeacherEvents from './components/TeacherEvents';
import LessonPlans from './components/LessonPlans';
import StudentMarksTable from './components/StudentMarksTable';
import LeaveStatus from './components/LeaveStatus';

const TeacherDashboard = () => {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: '#F7F7FA',
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            {/* Main Container - Responsive padding */}
            <div className="px-4 md:px-6 py-5 md:py-6">
                {/* Breadcrumb */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                    <div className="mb-3 md:mb-0">
                        <h1 className="text-xl font-semibold mb-1" style={{ color: '#333333' }}>Teacher Dashboard</h1>
                        <nav className="flex items-center text-sm">
                            <a href="/" className="hover:underline" style={{ color: '#3D5EE1' }}>Dashboard</a>
                            <span className="mx-2" style={{ color: '#888888' }}>/</span>
                            <span style={{ color: '#888888' }}>Teacher Dashboard</span>
                        </nav>
                    </div>
                </div>

                {/* Row 1: Welcome Banner - Full Width */}
                <div className="mb-5">
                    <TeacherWelcomeBanner />
                </div>

                {/* Row 2: 9-column Main + 3-column Sidebar */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-5">
                    {/* Main Content - 9 columns on XL */}
                    <div className="xl:col-span-9 space-y-5">
                        {/* Profile + Syllabus Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            <div className="lg:col-span-7">
                                <TeacherProfileCard />
                            </div>
                            <div className="lg:col-span-5">
                                <SyllabusProgress />
                            </div>
                        </div>

                        {/* Today's Class */}
                        <div>
                            <TodaysClasses />
                        </div>

                        {/* Attendance + Best Performers */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <TeacherAttendance />
                            <BestPerformers />
                        </div>
                    </div>

                    {/* Sidebar - 3 columns on XL, full on smaller */}
                    <div className="xl:col-span-3">
                        <div
                            className="h-full"
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '10px',
                                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
                            }}
                        >
                            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Schedules</h4>
                                <a href="#" className="text-sm flex items-center gap-1.5" style={{ color: '#3D5EE1' }}>
                                    <Plus size={18} /> Add New
                                </a>
                            </div>
                            <div className="px-5 py-4">
                                <TeacherSchedules />
                                <TeacherEvents />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Student Progress - Full Width */}
                <div className="mb-5">
                    <StudentProgress />
                </div>

                {/* Row 4: Lesson Plans - Full Width */}
                <div className="mb-5">
                    <LessonPlans />
                </div>

                {/* Row 5: Student Marks (9 cols) + Leave Status (3 cols) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 pb-5">
                    <div className="xl:col-span-9">
                        <StudentMarksTable />
                    </div>
                    <div className="xl:col-span-3">
                        <LeaveStatus />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
