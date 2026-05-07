import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const StudentMarksTable = () => {
    const students = [
        { id: '35013', name: 'Janet', class: 'III', section: 'A', marks: '89%', cgpa: '4.2', status: 'Pass', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-01.jpg' },
        { id: '35013', name: 'Joann', class: 'IV', section: 'B', marks: '88%', cgpa: '3.2', status: 'Pass', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-02.jpg' },
        { id: '35011', name: 'Kathleen', class: 'II', section: 'A', marks: '69%', cgpa: '4.5', status: 'Pass', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-03.jpg' },
        { id: '35010', name: 'Gifford', class: 'I', section: 'B', marks: '21%', cgpa: '4.5', status: 'Pass', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-04.jpg' },
        { id: '35009', name: 'Lisa', class: 'II', section: 'B', marks: '31%', cgpa: '3.9', status: 'Fail', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-05.jpg' },
    ];

    return (
        <div
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Student Marks</h4>
                <div className="flex items-center gap-4">
                    <button className="text-sm flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50" style={{ color: '#888888' }}>
                        All Classes <ChevronDown size={16} />
                    </button>
                    <button className="text-sm flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50" style={{ color: '#888888' }}>
                        All Sections <ChevronDown size={16} />
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>Class</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>Section</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>Marks %</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>CGPA</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm" style={{ color: '#888888' }}>{student.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold" style={{ color: '#333333' }}>{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#888888' }}>{student.class}</td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#888888' }}>{student.section}</td>
                                <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#333333' }}>{student.marks}</td>
                                <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#333333' }}>{student.cgpa}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={student.status === 'Pass' ? 'pill-success' : 'pill-danger'}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentMarksTable;
