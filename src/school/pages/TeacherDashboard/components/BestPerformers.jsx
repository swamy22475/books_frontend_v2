import React from 'react';

const BestPerformers = () => {
    const performers = [
        { name: 'Class IV, C', percentage: 80, color: '#3D5EE1', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-01.jpg' },
        { name: 'Class III, B', percentage: 54, color: '#3D5EE1', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-02.jpg' },
        { name: 'Class V, A', percentage: 76, color: '#3D5EE1', avatar: 'https://preskool.dreamstechnologies.com/html/template/assets/img/students/student-03.jpg' },
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
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Best Performers</h4>
                <a href="#" className="text-sm font-medium" style={{ color: '#3D5EE1' }}>View All</a>
            </div>
            <div className="px-5 py-4">
                {performers.map((performer, index) => (
                    <div key={index} className="flex items-center gap-4 mb-5 last:mb-0">
                        {/* Avatar on left of bar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                            <img
                                src={performer.avatar}
                                alt={performer.name}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                            />
                        </div>

                        {/* Name, Thick Progress & Percentage */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium" style={{ color: '#333333' }}>{performer.name}</span>
                                <span className="text-sm font-bold" style={{ color: '#333333' }}>{performer.percentage}%</span>
                            </div>
                            {/* Thick progress bar h-3 with gray track */}
                            <div className="progress-thick">
                                <div
                                    className="progress-thick-bar"
                                    style={{ width: `${performer.percentage}%`, backgroundColor: performer.color }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestPerformers;
