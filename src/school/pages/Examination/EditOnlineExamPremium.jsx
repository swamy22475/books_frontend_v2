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
    IconDeviceFloppy,
    IconX,
    IconActivity,
    IconEye,
    IconArrowsShuffle,
    IconCheck
} from '@tabler/icons-react';
import './AddOnlineExamPremium.css';

const EditOnlineExamPremium = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOnlineExamById, updateOnlineExam } = useContext(ExaminationContext);

    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    useEffect(() => {
        const existingExam = getOnlineExamById(id);
        if (existingExam) {
            setFormData({
                ...existingExam,
                // Ensure all default keys exist if they are missing in mock data
                passingPercentage: existingExam.passingPercentage || 33,
                negativeMarking: !!existingExam.negativeMarking,
                displayMarks: !!existingExam.displayMarks,
                randomOrder: !!existingExam.randomOrder,
                resultPublished: !!existingExam.resultPublished,
                published: !!existingExam.published,
                quiz: !!existingExam.quiz,
            });
        } else {
            navigate('/school/examination/online-exam');
        }
    }, [id, getOnlineExamById, navigate]);

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
        e.preventDefault();
        if (!formData.title) return;

        setIsSubmitting(true);
        try {
            await updateOnlineExam(id, formData);
            navigate('/school/examination/online-exam');
        } catch (error) {
            console.error("Failed to update assignment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!formData) return (
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
                    <button onClick={() => navigate(-1)} className="back-btn-circle">
                        <IconArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Edit Assignment</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary-outline" onClick={() => navigate(-1)}>
                        <IconX size={18} /> Cancel
                    </button>
                    <button
                        className="btn-primary-gradient"
                        onClick={handleSubmit}
                        disabled={!formData.title || isSubmitting}
                    >
                        <IconDeviceFloppy size={18} /> {isSubmitting ? 'Updating...' : 'Update Assignment'}
                    </button>
                </div>
            </header>

            <div className="premium-content-layout">
                {/* Sidebar Preview */}
                <aside className="preview-sidebar">
                    <div className="preview-sticky">
                        <div className="sidebar-card">
                            <div className="sidebar-header">
                                <span className="preview-tag">Live Preview</span>
                                <IconDotsVertical size={16} className="text-gray-300" />
                            </div>

                            <div className="preview-subject-icon">
                                <div className="icon-inner">
                                    <IconClipboardList size={32} />
                                </div>
                            </div>

                            <div className="preview-info text-center">
                                <h3 className={formData.title ? '' : 'placeholder-text'}>
                                    {formData.title || "Assignment Title"}
                                </h3>
                                <div className="preview-status">
                                    <span className={`status-pill ${formData.published ? 'status-active' : 'status-draft'}`}>
                                        {formData.published ? 'Published' : 'Draft Mode'}
                                    </span>
                                </div>
                            </div>

                            <div className="preview-stats">
                                <div className="stat-item">
                                    <IconClock size={16} />
                                    <div>
                                        <span>Duration</span>
                                        <strong>{formData.duration}</strong>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <IconChecks size={16} />
                                    <div>
                                        <span>Attempts</span>
                                        <strong>{formData.attempt || 1}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="preview-footer-hint">
                                <IconAlertCircle size={14} />
                                <span>Preview updates live in the sidebar as you type</span>
                            </div>
                        </div>

                        {/* Quick Navigation / Progress */}
                        <div className="progress-nav">
                            <button
                                className={`nav-item ${activeSection === 'basic' ? 'active' : ''}`}
                                onClick={() => setActiveSection('basic')}
                            >
                                <span className="nav-num">1</span>
                                <span>Basic Information</span>
                                <IconChevronRight size={16} className="ml-auto" />
                            </button>
                            <button
                                className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveSection('settings')}
                            >
                                <span className="nav-num">2</span>
                                <span>Settings & Configuration</span>
                                <IconChevronRight size={16} className="ml-auto" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Form Area */}
                <main className="form-main-area">
                    <form onSubmit={handleSubmit} className="premium-form">

                        {/* Section 1: Basic Information */}
                        <section className={`form-section-animated ${activeSection === 'basic' ? 'show' : ''}`}>
                            <div className="section-title-group text-indigo-700">
                                <div className="section-icon bg-indigo-50">
                                    <IconLayoutGrid size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Basis Details</h3>
                                    <p className="text-gray-500">Update the core details of your online assignment</p>
                                </div>
                            </div>

                            <div className="form-grid pt-4">
                                <div className="form-group full-width mb-4">
                                    <label className="text-indigo-900/70">Assignment Title <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Weekly Math Quiz - Algebra Basics"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="premium-input-field focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Start From <span className="required">*</span></label>
                                    <div className="input-with-icon">
                                        <IconCalendar size={18} />
                                        <input
                                            type="datetime-local"
                                            name="examFrom"
                                            value={formData.examFrom}
                                            onChange={handleInputChange}
                                            className="premium-input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>End Date <span className="required">*</span></label>
                                    <div className="input-with-icon">
                                        <IconCalendar size={18} />
                                        <input
                                            type="datetime-local"
                                            name="examTo"
                                            value={formData.examTo}
                                            onChange={handleInputChange}
                                            className="premium-input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Duration (HH:MM:SS)</label>
                                    <div className="input-with-icon">
                                        <IconClock size={18} />
                                        <input
                                            type="text"
                                            name="duration"
                                            placeholder="01:30:00"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="premium-input-field"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Maximum Attempts</label>
                                    <input
                                        type="number"
                                        name="attempt"
                                        min="1"
                                        value={formData.attempt}
                                        onChange={handleInputChange}
                                        className="premium-input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Passing Percentage (%)</label>
                                    <input
                                        type="number"
                                        name="passingPercentage"
                                        min="0"
                                        max="100"
                                        value={formData.passingPercentage}
                                        onChange={handleInputChange}
                                        className="premium-input-field"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        placeholder="Add instructions or overview for students..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="premium-input-field"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Settings */}
                        <section className={`form-section-animated ${activeSection === 'settings' ? 'show' : ''}`}>
                            <div className="section-title-group">
                                <div className="section-icon bg-purple-soft">
                                    <IconChecks size={20} />
                                </div>
                                <div>
                                    <h3>Advanced Configuration</h3>
                                    <p>Configure assessment rules and visibility</p>
                                </div>
                            </div>

                            <div className="settings-grid">
                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconEye size={16} className="text-gray-400" />
                                            <h4>Published</h4>
                                        </div>
                                        <p>Immediately visible to students</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.published ? 'active' : ''}`}
                                        onClick={() => handleToggle('published')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconActivity size={16} className="text-gray-400" />
                                            <h4>Quiz Mode</h4>
                                        </div>
                                        <p>Interactive quiz format (Automated)</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.quiz ? 'active' : ''}`}
                                        onClick={() => handleToggle('quiz')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconAlertCircle size={16} className="text-gray-400" />
                                            <h4>Negative Marking</h4>
                                        </div>
                                        <p>Deduct marks for incorrect answers</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.negativeMarking ? 'active' : ''}`}
                                        onClick={() => handleToggle('negativeMarking')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconClipboardList size={16} className="text-gray-400" />
                                            <h4>Result Published</h4>
                                        </div>
                                        <p>Make marks visible to students</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.resultPublished ? 'active' : ''}`}
                                        onClick={() => handleToggle('resultPublished')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconArrowsShuffle size={16} className="text-gray-400" />
                                            <h4>Randomize Order</h4>
                                        </div>
                                        <p>Shuffle question sequence for each student</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.randomOrder ? 'active' : ''}`}
                                        onClick={() => handleToggle('randomOrder')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <div className="setting-info">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconCheck size={16} className="text-gray-400" />
                                            <h4>Show Marks</h4>
                                        </div>
                                        <p>Display individual marks per question</p>
                                    </div>
                                    <div
                                        className={`premium-toggle ${formData.displayMarks ? 'active' : ''}`}
                                        onClick={() => handleToggle('displayMarks')}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Form Navigation Buttons */}
                        <div className="form-footer-nav">
                            {activeSection === 'basic' ? (
                                <button type="button" className="btn-next" onClick={() => setActiveSection('settings')}>
                                    Continue to Settings <IconChevronRight size={18} />
                                </button>
                            ) : (
                                <button type="button" className="btn-back" onClick={() => setActiveSection('basic')}>
                                    Back to Basic Information
                                </button>
                            )}
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditOnlineExamPremium;
