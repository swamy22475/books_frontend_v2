import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ExaminationContext } from '../../../context/ExaminationContext';
import {
    IconArrowLeft,
    IconPlus,
    IconTrash,
    IconEdit,
    IconChevronDown,
    IconChevronUp,
    IconCheck,
    IconX,
    IconAlertCircle,
    IconFileText,
    IconHelp,
    IconDotsVertical
} from '@tabler/icons-react';
import './AddOnlineExamPremium.css';

const ManageQuestions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOnlineExamById, addQuestion, updateQuestion, deleteQuestion } = useContext(ExaminationContext);

    const [exam, setExam] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Form State
    const [questionForm, setQuestionForm] = useState({
        question: '',
        type: 'single', // single, multiple
        options: ['', '', '', ''],
        correctAnswer: '', // For single: string, For multiple: array
        marks: 1
    });

    useEffect(() => {
        const data = getOnlineExamById(id);
        if (data) {
            setExam(data);
        } else {
            navigate('/school/examination/online-exam');
        }
    }, [id, getOnlineExamById, navigate]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isModalOpen) {
            setQuestionForm({
                question: '',
                type: 'single',
                options: ['', '', '', ''],
                correctAnswer: '',
                marks: 1
            });
            setEditingQuestion(null);
        }
    }, [isModalOpen]);

    // Populate form for editing
    const handleEditClick = (q) => {
        setEditingQuestion(q);
        setQuestionForm({
            question: q.question,
            type: q.type,
            options: [...q.options],
            correctAnswer: q.correctAnswer,
            marks: q.marks
        });
        setIsModalOpen(true);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const handleCorrectAnswerChange = (option) => {
        if (questionForm.type === 'single') {
            setQuestionForm({ ...questionForm, correctAnswer: option });
        } else {
            // Multiple choice logic
            let currentAnswers = Array.isArray(questionForm.correctAnswer) ? questionForm.correctAnswer : [];
            if (currentAnswers.includes(option)) {
                currentAnswers = currentAnswers.filter(a => a !== option);
            } else {
                currentAnswers = [...currentAnswers, option];
            }
            setQuestionForm({ ...questionForm, correctAnswer: currentAnswers });
        }
    };

    const handleSaveQuestion = () => {
        if (!questionForm.question || questionForm.options.some(o => !o)) {
            alert("Please fill in all fields.");
            return;
        }

        if (editingQuestion) {
            updateQuestion(id, editingQuestion.id, questionForm);
        } else {
            addQuestion(id, questionForm);
        }
        setIsModalOpen(false);
        // Refresh local state logic would go here if not relying solely on context re-render
        // But since context updates, and we fetch in useEffect... actually we need to listen to context changes
        // Better: re-fetch exam data or let context invoke a re-render.
        // For simplicity, we'll re-fetch in the next render cycle effectively.
        setExam(getOnlineExamById(id));
    };

    const handleDeleteQuestion = (qId) => {
        if (window.confirm("Delete this question?")) {
            deleteQuestion(id, qId);
            setExam(getOnlineExamById(id));
        }
    };

    if (!exam) return <div className="p-10 text-center">Loading...</div>;

    const questionsList = exam.quizQuestions || [];

    return (
        <div className="premium-exam-container fade-in">
            {/* Header */}
            <header className="premium-header">
                <div className="header-left">
                    <button onClick={() => navigate(`/school/examination/online-exam/view/${id}`)} className="back-btn-circle">
                        <IconArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Manage Questions</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-primary-gradient" onClick={() => setIsModalOpen(true)}>
                        <IconPlus size={18} /> Add New Question
                    </button>
                </div>
            </header>

            <div className="view-details-grid pt-0">
                {/* Left: Questions List */}
                <div className="lg:col-span-2 space-y-6">
                    {questionsList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <IconFileText size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-500">No Questions Added Yet</h3>
                            <p className="text-slate-400">Click "Add New Question" to get started.</p>
                        </div>
                    ) : (
                        questionsList.map((q, index) => (
                            <div key={q.id} className="sidebar-card p-8 bg-white hover:border-indigo-200 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <span className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold rounded-lg text-sm">
                                            Q{index + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800 mb-1">{q.question}</h4>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                    {q.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                                                    {q.marks} Mark{q.marks > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(q)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                            <IconEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                            <IconTrash size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                    {q.options.map((opt, i) => {
                                        const isCorrect = Array.isArray(q.correctAnswer)
                                            ? q.correctAnswer.includes(opt)
                                            : q.correctAnswer === opt;
                                        return (
                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-transparent'}`}>
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                                    {isCorrect && <IconCheck size={12} stroke={4} />}
                                                </div>
                                                <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-700' : 'text-slate-600'}`}>{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right: Summary */}
                <div className="space-y-6">
                    <div className="sidebar-card p-8 bg-indigo-600 text-white border-none">
                        <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">Assignment Summary</h3>
                        <div className="space-y-6">
                            <div>
                                <span className="text-xs opacity-60 block mb-1">Assignment Title</span>
                                <strong className="text-lg block leading-snug">{exam.title}</strong>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-xs opacity-60 block mb-1">Total Questions</span>
                                    <strong className="text-2xl">{questionsList.length}</strong>
                                </div>
                                <div>
                                    <span className="text-xs opacity-60 block mb-1">Total Marks</span>
                                    <strong className="text-2xl">
                                        {questionsList.reduce((acc, q) => acc + parseInt(q.marks || 0), 0)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card p-6 bg-amber-50 border-amber-100">
                        <div className="flex gap-3">
                            <IconAlertCircle className="text-amber-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800 mb-1">Pro Tip</h4>
                                <p className="text-xs text-amber-700/80 leading-relaxed">
                                    Ensure that the total marks align with your grading schema. You can drag and drop questions to reorder them soon!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <IconX size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="form-group">
                                <label className="text-sm font-bold text-slate-700 mb-2 block">Question Text</label>
                                <textarea
                                    className="premium-input-field w-full"
                                    rows={3}
                                    placeholder="Enter your question here..."
                                    value={questionForm.question}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Question Type</label>
                                    <select
                                        className="premium-input-field w-full"
                                        value={questionForm.type}
                                        onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                                    >
                                        <option value="single">Single Choice</option>
                                        <option value="multiple">Multiple Choice</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Marks</label>
                                    <input
                                        type="number"
                                        className="premium-input-field w-full"
                                        min="1"
                                        value={questionForm.marks}
                                        onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <label className="text-sm font-bold text-slate-700 block">Options & Correct Answer</label>
                                {questionForm.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <button
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${(questionForm.type === 'single' ? questionForm.correctAnswer === option : (Array.isArray(questionForm.correctAnswer) && questionForm.correctAnswer.includes(option))) && option !== ''
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                                                : 'border-slate-200 text-slate-300 hover:border-slate-300'
                                                }`}
                                            onClick={() => option && handleCorrectAnswerChange(option)}
                                            title="Mark as Correct Answer"
                                        >
                                            <IconCheck size={20} stroke={3} />
                                        </button>
                                        <input
                                            type="text"
                                            className="premium-input-field flex-1"
                                            placeholder={`Option ${idx + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-[2rem]">
                            <button onClick={() => setIsModalOpen(false)} className="btn-secondary-outline border-slate-200">
                                Cancel
                            </button>
                            <button onClick={handleSaveQuestion} className="btn-primary-gradient px-8">
                                Save Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageQuestions;
