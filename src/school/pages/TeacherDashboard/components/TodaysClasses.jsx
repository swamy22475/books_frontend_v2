import React from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const TodaysClasses = () => {
    const classes = [
        { time: '09:00 - 09:45', class: 'Class V, B', color: '#EF4444' },
        { time: '09:00 - 09:45', class: 'Class IV, C', color: '#F97316' },
        { time: '11:30 - 12:15', class: 'Class V, B', color: '#8B5CF6' },
        { time: '01:30 - 02:15', class: 'Class V, B', color: '#0EA5E9' },
    ];

    return (
        <div
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Today's Class</h4>
                <div className="flex items-center gap-3">
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <ChevronLeft size={18} className="text-gray-500" />
                    </button>
                    <span className="text-sm" style={{ color: '#888888' }}>16 May 2024</span>
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <ChevronRight size={18} className="text-gray-500" />
                    </button>
                </div>
            </div>
            <div className="px-5 py-4">
                {/* Flex container with gap-4 */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                    {classes.map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-50"
                            style={{ minWidth: '150px' }}
                        >
                            {/* Colored tag at top */}
                            <div
                                className="px-3 py-2.5 text-xs font-medium text-white text-center flex items-center justify-center gap-1.5"
                                style={{ backgroundColor: item.color }}
                            >
                                <Clock size={14} />
                                {item.time}
                            </div>
                            {/* Darker gray text for class */}
                            <div className="px-4 py-3 text-center">
                                <p className="text-sm font-medium" style={{ color: '#555555' }}>{item.class}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodaysClasses;
