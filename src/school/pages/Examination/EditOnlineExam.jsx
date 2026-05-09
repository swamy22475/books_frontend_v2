import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ExaminationContext } from '../../../context/ExaminationContext';
import {
    IconHome,
    IconArrowLeft,
    IconPencil,
    IconFileDescription,
    IconCheck,
    IconClock,
    IconSettings,
    IconListDetails,
    IconClipboardList
} from '@tabler/icons-react';

const EditOnlineExam = () => {
    const { getOnlineExamById, updateOnlineExam } = useContext(ExaminationContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);

    useEffect(() => {
        const existingExam = getOnlineExamById(id);
        if (existingExam) {
            setExam(existingExam);
        } else {
            navigate('/school/examination/online-exam');
        }
    }, [id, getOnlineExamById, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (exam.title && exam.examFrom && exam.examTo) {
            updateOnlineExam(id, exam);
            navigate('/school/examination/online-exam');
        } else {
            alert('Please provide a Title and set the Exam Dates.');
        }
    };

    if (!exam) return <div className="p-20 text-center text-black font-black uppercase tracking-[0.5em] text-xs">Loading...</div>;

    return (
        <div className="student-list-page">
            <div className="container">
                {/* Header Bar */}
                <div className="page-header !mb-6">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <button
                                onClick={() => navigate('/school/examination/online-exam')}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                            >
                                <IconArrowLeft size={20} />
                            </button>
                            <div>
                                <h4>Edit Online Examination</h4>
                                <nav className="breadcrumb">
                                    <span>Examinations</span> / <span>Online Exam</span> / <span className="current">Edit</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card soft-card fade-in p-8 bg-white shadow-sm border border-gray-100 rounded-xl">

                    {/* Header Section */}
                    <div className="mb-8 pb-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">Examination Form</h2>
                        <p className="text-sm text-gray-400">Update examination details and configuration</p>
                    </div>

                    {/* Main Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">

                        {/* Row 1 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Exam Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Mid-Term Science Assessment"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white placeholder:text-gray-300 text-sm"
                                value={exam.title}
                                onChange={(e) => setExam({ ...exam, title: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Starts From <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white text-sm"
                                value={exam.examFrom}
                                onChange={(e) => setExam({ ...exam, examFrom: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Ends At <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white text-sm"
                                value={exam.examTo}
                                onChange={(e) => setExam({ ...exam, examTo: e.target.value })}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Duration (HH:MM:SS)</label>
                            <input
                                type="text"
                                placeholder="01:00:00"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white placeholder:text-gray-300 text-sm"
                                value={exam.duration}
                                onChange={(e) => setExam({ ...exam, duration: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Max Attempts</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white text-sm"
                                value={exam.attempt}
                                onChange={(e) => setExam({ ...exam, attempt: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Passing %</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white text-sm"
                                value={exam.passingPercentage || '33'}
                                onChange={(e) => setExam({ ...exam, passingPercentage: e.target.value })}
                            />
                        </div>

                        {/* Row 3 - Settings Toggles */}
                        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-4 border-t border-gray-50">
                            {[
                                { key: 'published', label: 'Publish Exam' },
                                { key: 'resultPublished', label: 'Publish Result' },
                                { key: 'negativeMarking', label: 'Negative Mark' },
                                { key: 'displayMarks', label: 'Show Marks' },
                                { key: 'randomOrder', label: 'Randomize' },
                                { key: 'quiz', label: 'Enable Quiz' }
                            ].map(item => (
                                <label key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 cursor-pointer hover:border-[#4F46E5]/30 hover:bg-white transition-all group">
                                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#4F46E5] uppercase tracking-wider transition-colors">{item.label}</span>
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={!!exam[item.key]}
                                            onChange={(e) => setExam({ ...exam, [item.key]: e.target.checked })}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="col-span-1 md:col-span-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Instructions</label>
                                <textarea
                                    placeholder="Enter instructions for students..."
                                    className="w-full min-h-[120px] px-4 py-4 border border-gray-200 rounded-lg focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all font-medium text-gray-700 bg-white resize-none leading-relaxed placeholder:text-gray-300 text-sm"
                                    value={exam.description}
                                    onChange={(e) => setExam({ ...exam, description: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end items-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/school/examination/online-exam')}
                            className="px-6 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 uppercase tracking-wide"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2 bg-[#4F46E5] text-white rounded-lg text-xs font-bold hover:bg-[#4338ca] transition-all shadow-md shadow-indigo-200 active:scale-[0.98] uppercase tracking-wide"
                        >
                            <IconCheck size={16} stroke={2.5} />
                            Save Examination
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOnlineExam;
