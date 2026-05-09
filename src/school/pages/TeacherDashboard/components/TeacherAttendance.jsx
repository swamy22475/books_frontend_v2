import React from 'react';
import { Calendar } from 'lucide-react';

const TeacherAttendance = () => {
    const attendanceStats = { present: 25, absent: 2, halfday: 0, late: 1 };
    const weekDays = [
        { day: 'M', value: 85, status: 'present' },
        { day: 'T', value: 70, status: 'present' },
        { day: 'W', value: 90, status: 'present' },
        { day: 'T', value: 60, status: 'present' },
        { day: 'F', value: 45, status: 'absent' },
        { day: 'S', value: 30, status: 'default' },
        { day: 'S', value: 20, status: 'default' },
    ];

    return (
        <div
            className="h-full"
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Attendance</h4>
                <a href="#" className="text-sm flex items-center gap-1.5 hover:text-brand-blue" style={{ color: '#888888' }}>
                    <Calendar size={18} /> This Week
                </a>
            </div>
            <div className="px-5 py-4">
                {/* Bar Chart */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-medium" style={{ color: '#333333' }}>Last 7 Days</h6>
                        <span className="text-xs" style={{ color: '#888888' }}>14 May 2024 - 21 May 2024</span>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-24 pt-2">
                        {weekDays.map((day, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full rounded-t-md transition-all"
                                    style={{
                                        height: `${day.value}%`,
                                        backgroundColor: day.status === 'absent' ? '#EF4444' : day.status === 'default' ? '#E5E7EB' : '#3D5EE1',
                                        minHeight: '12px'
                                    }}
                                />
                                <span className="text-xs mt-2 font-medium" style={{ color: '#888888' }}>{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center text-sm mb-5" style={{ color: '#888888' }}>
                    <span>No of total working days</span>
                    <span className="font-semibold ml-2" style={{ color: '#333333' }}>28 Days</span>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-4 gap-3 p-4 border border-gray-100 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: '#888888' }}>Present</p>
                        <h5 className="text-xl font-bold" style={{ color: '#333333' }}>{attendanceStats.present}</h5>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: '#888888' }}>Absent</p>
                        <h5 className="text-xl font-bold" style={{ color: '#333333' }}>{attendanceStats.absent}</h5>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: '#888888' }}>Halfday</p>
                        <h5 className="text-xl font-bold" style={{ color: '#333333' }}>{attendanceStats.halfday}</h5>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: '#888888' }}>Late</p>
                        <h5 className="text-xl font-bold" style={{ color: '#333333' }}>{attendanceStats.late}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendance;
