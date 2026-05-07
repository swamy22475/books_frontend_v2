import React from 'react';
import { Calendar, Medal } from 'lucide-react';

const StudentProgress = () => {
    const students = [
        { name: 'Susan Boswell', class: 'III, B', percentage: 98, medal: 'gold', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-01.jpg' },
        { name: 'Richard Mayes', class: 'V, A', percentage: 98, medal: 'silver', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-02.jpg' },
        { name: 'Veronica Randle', class: 'V, B', percentage: 78, medal: null, avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-03.jpg' },
    ];

    const getMedalColor = (type) => {
        switch (type) {
            case 'gold': return '#F59E0B';
            case 'silver': return '#9CA3AF';
            default: return '#CD7F32';
        }
    };

    return (
        <div
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Student Progress</h4>
                <a href="#" className="text-sm flex items-center gap-1.5" style={{ color: '#888888' }}>
                    <Calendar size={18} /> This Month
                </a>
            </div>
            <div className="px-5 py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {students.map((student, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 flex-1 border border-gray-100 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                                    />
                                </div>
                                <div>
                                    <h6 className="text-sm font-semibold" style={{ color: '#333333' }}>{student.name}</h6>
                                    <p className="text-xs" style={{ color: '#888888' }}>{student.class}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {student.medal && (
                                    <Medal size={20} style={{ color: getMedalColor(student.medal) }} />
                                )}
                                <span
                                    className="px-3 py-1.5 text-sm font-semibold rounded-full"
                                    style={{
                                        backgroundColor: student.percentage >= 90 ? '#E1F3E9' : 'rgba(14, 165, 233, 0.1)',
                                        color: student.percentage >= 90 ? '#1AB394' : '#0EA5E9'
                                    }}
                                >
                                    {student.percentage}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
