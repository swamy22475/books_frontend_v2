import React from 'react';
import { Check, Circle } from 'lucide-react';

const SyllabusProgress = () => {
    const completed = 95;
    const pending = 5;
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (completed / 100) * circumference;

    return (
        <div
            className="h-full"
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4">
                <h4 className="text-lg font-semibold mb-5" style={{ color: '#333333' }}>Syllabus</h4>

                <div className="flex items-center gap-6">
                    {/* Clean circular SVG progress */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Track - clean stroke */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="10"
                            />
                            {/* Progress - clean stroke */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold" style={{ color: '#333333' }}>{completed}%</span>
                        </div>
                    </div>

                    {/* Legend - right of circle with colored dots */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-sm" style={{ color: '#888888' }}>Completed : </span>
                            <span className="text-sm font-semibold" style={{ color: '#333333' }}>{completed}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-sm" style={{ color: '#888888' }}>Pending : </span>
                            <span className="text-sm font-semibold" style={{ color: '#333333' }}>{pending}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyllabusProgress;
