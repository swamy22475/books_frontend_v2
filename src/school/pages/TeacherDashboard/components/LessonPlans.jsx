import React from 'react';
import { Edit, Share2 } from 'lucide-react';

const LessonPlans = () => {
    const lessons = [
        { class: 'Class V, B', title: 'Introduction Note to Physics on Tech', progress: 80, bgColor: '#E1F3E9', textColor: '#1AB394', barColor: '#10B981', borderColor: '#10B981' },
        { class: 'Class V, A', title: 'Biometric & their Working Functionality', progress: 80, bgColor: 'rgba(245, 158, 11, 0.1)', textColor: '#F59E0B', barColor: '#F59E0B', borderColor: '#F59E0B' },
        { class: 'Class IV, C', title: 'Analyze and interpret literary texts skills', progress: 80, bgColor: 'rgba(14, 165, 233, 0.1)', textColor: '#0EA5E9', barColor: '#0EA5E9', borderColor: '#0EA5E9' },
        { class: 'Class V, A', title: 'Enhance vocabulary and grammar skills', progress: 30, bgColor: 'rgba(239, 68, 68, 0.1)', textColor: '#EF4444', barColor: '#EF4444', borderColor: '#EF4444' },
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
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Syllabus / Lesson Plan</h4>
                <a href="#" className="text-sm font-medium" style={{ color: '#3D5EE1' }}>View All</a>
            </div>
            <div className="px-5 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {lessons.map((lesson, index) => (
                        <div
                            key={index}
                            className="border border-gray-100 rounded-lg overflow-hidden"
                        >
                            {/* Colored top border */}
                            <div style={{ height: '4px', backgroundColor: lesson.borderColor }} />

                            <div className="p-5">
                                <span
                                    className="inline-block px-3 py-1.5 text-xs font-semibold rounded-lg mb-3"
                                    style={{ backgroundColor: lesson.bgColor, color: lesson.textColor }}
                                >
                                    {lesson.class}
                                </span>
                                <h5 className="text-sm font-semibold leading-relaxed mb-4" style={{ color: '#333333', minHeight: '44px' }}>
                                    {lesson.title}
                                </h5>
                                {/* Thick progress bar */}
                                <div className="progress-thick mb-4">
                                    <div
                                        className="progress-thick-bar"
                                        style={{ width: `${lesson.progress}%`, backgroundColor: lesson.barColor }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-4">
                                    <a href="#" className="flex items-center gap-1.5" style={{ color: '#888888' }}>
                                        <Edit size={14} />Reschedule
                                    </a>
                                    <a href="#" className="flex items-center gap-1.5" style={{ color: '#3D5EE1' }}>
                                        <Share2 size={14} />Share
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LessonPlans;
