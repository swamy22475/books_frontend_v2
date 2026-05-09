import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ExaminationContext } from '../../../context/ExaminationContext';
import {
    IconArrowLeft,
    IconClipboardList,
    IconClock,
    IconCalendar,
    IconDotsVertical,
    IconLayoutGrid,
    IconChecks,
    IconAlertCircle,
    IconChevronRight,
    IconEdit,
    IconPlus,
    IconFileText,
    IconUsers,
    IconActivity,
    IconEye,
    IconTrash
} from '@tabler/icons-react';
import './AddOnlineExamPremium.css';

const ViewOnlineExamPremium = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOnlineExamById, deleteOnlineExam } = useContext(ExaminationContext);

    const [exam, setExam] = useState(null);

    useEffect(() => {
        const data = getOnlineExamById(id);
        if (data) {
            setExam(data);
        } else {
            navigate('/school/examination/online-exam');
        }
    }, [id, getOnlineExamById, navigate]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            deleteOnlineExam(exam.id);
            navigate('/school/examination/online-exam');
        }
    };

    if (!exam) return (
        <div className="premium-exam-container flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-100 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="premium-exam-container fade-in">
            {/* Header */}
            <header className="premium-header">
                <div className="header-left">
                    <button onClick={() => navigate('/school/examination/online-exam')} className="back-btn-circle">
                        <IconArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Assignment Details</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary-outline" onClick={handleDelete} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <IconTrash size={18} /> Delete
                    </button>
                    <Link to={`/school/examination/online-exam/edit/${exam.id}`} className="btn-primary-gradient">
                        <IconEdit size={18} /> Edit Assignment
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="view-details-grid pt-4">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Main Stats Card */}
                    <div className="sidebar-card p-12 bg-white animate-slide-up stagger-1">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-100/50">
                                <IconClipboardList size={40} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{exam.title}</h2>
                                    <span className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest ${exam.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                        {exam.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className="text-slate-400 font-medium text-lg">#{exam.id} Assignment Overview</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300">
                                        <IconCalendar size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-1">Start Date</span>
                                        <p className="font-bold text-slate-700 text-lg">{new Date(exam.examFrom).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300">
                                        <IconClock size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-1">Duration</span>
                                        <p className="font-bold text-slate-700 text-lg">{exam.duration}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300">
                                        <IconChecks size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-1">Max Attempts</span>
                                        <p className="font-bold text-slate-700 text-lg">{exam.attempt || 'Unlimited'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300">
                                        <IconActivity size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-1">Quiz Mode</span>
                                        <p className="font-bold text-slate-700 text-lg">{exam.quiz ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {exam.description && (
                            <div className="mt-12 bg-indigo-50/20 p-8 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
                                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">Description / Instructions</label>
                                <p className="text-slate-600 leading-relaxed italic text-lg pr-4">{exam.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Questions Preview Section */}
                    <div className="sidebar-card p-12 bg-white animate-slide-up stagger-2">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Questions Management</h3>
                            </div>
                            <button
                                onClick={() => navigate(`/school/examination/online-exam/questions/${exam.id}`)}
                                className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm shadow-indigo-50"
                            >
                                <IconPlus size={20} /> Manage Questions
                            </button>
                        </div>

                        <div className="bg-slate-50/50 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 hover:border-indigo-200 transition-colors duration-500 group">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-md group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-500">
                                <IconFileText size={48} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-400 mb-3 group-hover:text-slate-600 transition-colors">Detailed Questions List</h4>
                            <p className="text-slate-300 font-medium text-lg max-w-sm mx-auto leading-relaxed">
                                Start adding question banks or creating individual sections for this assignment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Stats Sidebar */}
                <div className="space-y-8">
                    <div className="sidebar-card p-10 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-2xl shadow-indigo-200 animate-slide-up stagger-3">
                        <div className="flex items-center justify-between mb-10">
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Live Statistics</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></div>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    <IconUsers size={28} />
                                </div>
                                <div>
                                    <span className="text-xs font-medium opacity-60 block mb-0.5">Total Participants</span>
                                    <strong className="text-3xl font-bold">128 Students</strong>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    <IconClipboardList size={28} />
                                </div>
                                <div>
                                    <span className="text-xs font-medium opacity-60 block mb-0.5">Completion Rate</span>
                                    <strong className="text-3xl font-bold">84%</strong>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-12 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-900/30 hover:scale-[1.03] active:scale-95 transition-all">
                            View Full Performance Report
                        </button>
                    </div>

                    <div className="sidebar-card p-10 bg-white animate-slide-up stagger-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Assignment Configuration</h4>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between py-4 border-b border-slate-50 group">
                                <span className="text-slate-500 text-sm font-medium">Negative Marking</span>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider ${exam.negativeMarking ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                                    {exam.negativeMarking ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-slate-50 group">
                                <span className="text-slate-500 text-sm font-medium">Shuffle Questions</span>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider ${exam.randomOrder ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                                    {exam.randomOrder ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 group">
                                <span className="text-slate-500 text-sm font-medium">Result Published</span>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider ${exam.resultPublished ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                                    {exam.resultPublished ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOnlineExamPremium;
