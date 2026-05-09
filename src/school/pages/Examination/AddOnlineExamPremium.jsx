import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    IconDeviceFloppy,
    IconX,
    IconPercentage,
    IconSum,
    IconSettings,
    IconInfoCircle
} from '@tabler/icons-react';
import './AddOnlineExamPremium.css';

const AddOnlineExamPremium = () => {
    const navigate = useNavigate();
    const { addOnlineExam } = useContext(ExaminationContext);

    const [formData, setFormData] = useState({
        title: '',
        examFrom: '',
        examTo: '',
        duration: '01:00:00',
        attempt: 1,
        description: '',
        published: true,
        quiz: true,
        isNegativeMarking: false,
        marksType: 'percentage'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleToggle = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        try {
            await addOnlineExam({
                ...formData,
                questions: 0
            });
            navigate('/school/examination/online-exam');
        } catch (error) {
            console.error("Failed to add exam:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="premium-exam-container fade-in">
            {/* ── Luxury Header ── */}
            <header className="premium-header">
                <div className="header-left">
                    <button onClick={() => navigate(-1)} className="back-btn-circle">
                        <IconArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Create Assignment</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary-outline" onClick={() => navigate(-1)}>
                        <IconX size={16} /> Cancel
                    </button>
                    <button
                        className="btn-primary-gradient"
                        onClick={handleSubmit}
                        disabled={!formData.title || isSubmitting}
                    >
                        <IconDeviceFloppy size={16} /> {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </header>

            <div className="premium-content-layout">
                {/* ── Visual Preview Sidebar ── */}
                <aside className="preview-sidebar">
                    <div className="sidebar-card">
                        <div className="sidebar-header">
                            <span className="status-pill status-active">Live Preview</span>
                            <IconDotsVertical size={18} className="text-slate-300" />
                        </div>

                        <div className="preview-subject-icon">
                            <IconClipboardList size={40} stroke={1.5} />
                        </div>

                        <div className="preview-info text-center">
                            <h3 className={formData.title ? 'text-slate-800' : 'text-slate-300 italic'}>
                                {formData.title || "Untitled Assignment"}
                            </h3>
                            <div className="flex justify-center mb-6">
                                <span className={`status-pill ${formData.published ? 'status-active' : 'status-draft'}`}>
                                    {formData.published ? 'Publicly Visible' : 'Restricted Draft'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                            <div className="stat-item text-center">
                                <IconClock size={18} className="mx-auto mb-2 text-indigo-500" />
                                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Duration</span>
                                <strong className="text-sm">{formData.duration}</strong>
                            </div>
                            <div className="stat-item text-center">
                                <IconChecks size={18} className="mx-auto mb-2 text-indigo-500" />
                                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Attempts</span>
                                <strong className="text-sm">{formData.attempt}</strong>
                            </div>
                        </div>

                    </div>

                    {/* Progress Navigation */}
                    <nav className="progress-nav mt-6 space-y-3">
                        <button
                            className={`nav-item w-full flex items-center justify-between transition-all ${activeSection === 'basic' ? 'active' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setActiveSection('basic')}
                        >
                            <div className="flex items-center gap-4">
                                <span className="nav-num">01</span>
                                <span className="font-semibold text-sm">Basic Info</span>
                            </div>
                            <IconChevronRight size={16} />
                        </button>
                        <button
                            className={`nav-item w-full flex items-center justify-between transition-all ${activeSection === 'settings' ? 'active' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setActiveSection('settings')}
                        >
                            <div className="flex items-center gap-4">
                                <span className="nav-num">02</span>
                                <span className="font-semibold text-sm">Advanced Configuration</span>
                            </div>
                            <IconChevronRight size={16} />
                        </button>
                    </nav>
                </aside>

                {/* ── Main Interactive Form ── */}
                <main className="form-main-area">
                    <form className="space-y-12">
                        {/* Section 1: Core Details */}
                        {activeSection === 'basic' && (
                            <section className="fade-in">
                                <div className="section-title-group">
                                    <div className="section-icon">
                                        <IconLayoutGrid size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight">Core Assignment Details</h3>
                                        <p className="text-slate-500 mt-1">Set the fundamental parameters for your online assessment</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Assignment Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="e.g. Mid-Term Mathematics Assessment"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="premium-input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available From <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            name="examFrom"
                                            value={formData.examFrom}
                                            onChange={handleInputChange}
                                            className="premium-input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Deadline <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            name="examTo"
                                            value={formData.examTo}
                                            onChange={handleInputChange}
                                            className="premium-input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Time Limit (HH:MM:SS)</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            placeholder="01:00:00"
                                            className="premium-input-field w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Max Retention Attempts</label>
                                        <input
                                            type="number"
                                            name="attempt"
                                            min="1"
                                            value={formData.attempt}
                                            onChange={handleInputChange}
                                            className="premium-input-field w-full"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Instructions</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            placeholder="Write important notes or instructions for the students here..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="premium-input-field w-full resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Section 2: Advanced Logic */}
                        {activeSection === 'settings' && (
                            <section className="fade-in">
                                <div className="section-title-group">
                                    <div className="section-icon">
                                        <IconSettings size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight">Advanced Configuration</h3>
                                        <p className="text-slate-500 mt-1">Fine-tune the behavior and grading system of the exam</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {/* Marks Type Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Grading Architecture</label>
                                        <div className="marks-type-group">
                                            <label className="marks-type-option">
                                                <input
                                                    type="radio"
                                                    name="marksType"
                                                    value="percentage"
                                                    checked={formData.marksType === 'percentage'}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="marks-type-content">
                                                    <IconPercentage size={20} />
                                                    <span>Percentage Based</span>
                                                </div>
                                            </label>
                                            <label className="marks-type-option">
                                                <input
                                                    type="radio"
                                                    name="marksType"
                                                    value="nominal"
                                                    checked={formData.marksType === 'nominal'}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="marks-type-content">
                                                    <IconSum size={20} />
                                                    <span>Raw Marks (Nominal)</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="setting-card group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                                    <IconDeviceFloppy size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Direct Publication</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Instantly available to assigned student batches</p>
                                                </div>
                                            </div>
                                            <div
                                                className={`premium-toggle ${formData.published ? 'active' : ''}`}
                                                onClick={() => handleToggle('published')}
                                            >
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>

                                        <div className="setting-card group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                                    <IconChecks size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Quiz Workflow</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Automatic evaluation with instant feedback</p>
                                                </div>
                                            </div>
                                            <div
                                                className={`premium-toggle ${formData.quiz ? 'active' : ''}`}
                                                onClick={() => handleToggle('quiz')}
                                            >
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>

                                        <div className="setting-card group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                                    <IconAlertCircle size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Negative Penalty</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Deduct points for incorrect submissions</p>
                                                </div>
                                            </div>
                                            <div
                                                className={`premium-toggle ${formData.isNegativeMarking ? 'active' : ''}`}
                                                onClick={() => handleToggle('isNegativeMarking')}
                                            >
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Dynamic Footer Actions */}
                        <footer className="pt-8 border-t border-slate-100 flex justify-between items-center">
                            {activeSection === 'settings' ? (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                                    onClick={() => setActiveSection('basic')}
                                >
                                    <IconArrowLeft size={18} /> Return to Core Details
                                </button>
                            ) : <div></div>}

                            {activeSection === 'basic' ? (
                                <button
                                    type="button"
                                    className="btn-primary-gradient flex items-center gap-3"
                                    onClick={() => setActiveSection('settings')}
                                >
                                    Proceed to Logic <IconChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn-primary-gradient flex items-center gap-3"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Finalizing...' : 'Finalize & Deploy'} <IconDeviceFloppy size={18} />
                                </button>
                            )}
                        </footer>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AddOnlineExamPremium;
