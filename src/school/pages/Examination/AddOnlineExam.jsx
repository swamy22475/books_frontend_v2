import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExaminationContext } from '../../../context/ExaminationContext';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import '../Academics/Academics.css'; // Import the shared styling

const AddOnlineExam = () => {
    const { addOnlineExam } = useContext(ExaminationContext);
    const navigate = useNavigate();
    const [newExam, setNewExam] = useState({
        title: '',
        examFrom: '',
        examTo: '',
        autoPublishResult: '',
        duration: '01:00:00',
        attempt: '1',
        passingPercentage: '33',
        wordLimit: '500',
        description: '',
        published: true,
        resultPublished: false,
        negativeMarking: false,
        displayMarks: true,
        randomOrder: false,
        quiz: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newExam.title && newExam.examFrom && newExam.examTo) {
            const status = new Date(newExam.examTo) < new Date() ? 'Closed' : 'Upcoming';
            addOnlineExam({ ...newExam, status });
            navigate('/school/examination/online-exam');
        } else {
            alert('Please provide a Title and set the Exam Dates.');
        }
    };

    return (
        <div className="student-list-page">
            <div className="container">
                {/* Page Header - Standardized */}
                <div className="page-header">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <div>
                                <h4>Create Online Examination</h4>
                                <nav className="breadcrumb">
                                    <span className="text-gray-500">Examinations</span> / <span onClick={() => navigate('/school/examination/online-exam')} className="cursor-pointer hover:text-blue-600 transition-colors text-gray-500">Online Exam</span> / <span className="current">Add Exam</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card soft-card fade-in">
                    {/* Card Title Section - Removed as it's now in the main header, or kept minimal if needed. 
                        User wanted "Image UI" match, so standard header is best. 
                        I will keep the form inside this card. 
                    */}

                    <form onSubmit={handleSubmit} className="p-10 bg-white">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                            {/* Column 1: Core Details */}
                            <div className="xl:col-span-2 space-y-8">
                                <label className="block text-xs font-medium text-blue-300/80 uppercase tracking-[0.15em] mb-6 ml-1 border-b border-gray-50 pb-2">Examination Details</label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    {/* EXAM TITLE - Full Width */}
                                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Exam Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Science Mid-Term 2024"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.title}
                                            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                        />
                                    </div>

                                    {/* STARTS FROM */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Starts From <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.examFrom}
                                            onChange={(e) => setNewExam({ ...newExam, examFrom: e.target.value })}
                                        />
                                    </div>

                                    {/* ENDS AT */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Ends At <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.examTo}
                                            onChange={(e) => setNewExam({ ...newExam, examTo: e.target.value })}
                                        />
                                    </div>

                                    {/* DURATION */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="01:00:00"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.duration}
                                            onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                                        />
                                    </div>

                                    {/* MAX ATTEMPTS */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Max Attempts <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.attempt}
                                            onChange={(e) => setNewExam({ ...newExam, attempt: e.target.value })}
                                        />
                                    </div>

                                    {/* Instructions - Full Width */}
                                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-4">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Instructions</label>
                                        <textarea
                                            placeholder="Enter detailed instructions for students..."
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white min-h-[120px] resize-none"
                                            value={newExam.description}
                                            onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Configuration & Settings */}
                            <div className="space-y-8">
                                <label className="block text-xs font-medium text-blue-300/80 uppercase tracking-[0.15em] mb-6 ml-1 border-b border-gray-50 pb-2">Configuration</label>

                                <div className="space-y-6">
                                    {/* PASSING % */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1">Passing Percentage</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-gray-700 bg-white"
                                            value={newExam.passingPercentage}
                                            onChange={(e) => setNewExam({ ...newExam, passingPercentage: e.target.value })}
                                        />
                                    </div>

                                    {/* Toggles */}
                                    <div className="space-y-3 pt-4">
                                        {[
                                            { key: 'published', label: 'Publish Exam' },
                                            { key: 'resultPublished', label: 'Publish Result' },
                                            { key: 'negativeMarking', label: 'Negative Marking' },
                                            { key: 'displayMarks', label: 'Show Marks to Student' },
                                            { key: 'randomOrder', label: 'Randomize Question Order' },
                                            { key: 'quiz', label: 'Quiz Mode' }
                                        ].map(item => (
                                            <label key={item.key} className="flex items-center justify-between cursor-pointer p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-all group bg-gray-50/30">
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">{item.label}</span>
                                                <div className="relative inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={!!newExam[item.key]}
                                                        onChange={(e) => setNewExam({ ...newExam, [item.key]: e.target.checked })}
                                                    />
                                                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/examination/online-exam')}
                                className="px-8 py-3 rounded-sm font-medium text-gray-400 hover:text-gray-600 transition-all text-sm uppercase tracking-wider"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-3 rounded-sm bg-[#3D5EE1] text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm flex items-center gap-2 uppercase tracking-wide"
                            >
                                <IconPlus size={18} stroke={2} />
                                Create Examination
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOnlineExam;
