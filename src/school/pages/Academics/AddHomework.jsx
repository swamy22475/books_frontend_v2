import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { motion } from 'framer-motion';
import {
    IconBook,
    IconCalendar,
    IconFileText,
    IconIdBadge,
    IconPencil,
    IconUser,
    IconUsers
} from '@tabler/icons-react';
import '../Transport/ManageStudentTransport.css';
import '../FrontOffice/VisitorBook.css';
import './Academics.css';

const AddHomework = () => {
    const { classes, sections, subjects, addHomework } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        homework: '', // Title
        classId: '',
        sectionId: '',
        subjectId: '',
        date: '',
        description: '',
        file: null,
        assignedBy: '', // Added based on UI
        linkedResource: '' // Added based on UI
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedClass = classes.find(c => c.id === parseInt(form.classId))?.name;
        const selectedSection = sections.find(s => s.id === parseInt(form.sectionId))?.name;
        const selectedSubject = subjects.find(s => s.id === parseInt(form.subjectId))?.name;

        addHomework({
            ...form,
            className: selectedClass,
            sectionName: selectedSection,
            subjectName: selectedSubject
        });
        navigate('/school/study/assignments');
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="student-list-page transport-page visitor-book-page w-full min-h-screen font-sans flex items-center justify-center p-6 bg-slate-50/50"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="view-modal relative w-[800px] max-w-full rounded-[24px] overflow-hidden bg-white shadow-2xl"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                }}
            >
                {/* Decorative background element */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

                <div className="view-modal-header relative z-10" style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', padding: '24px 32px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Add Homework</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Fill out the information below</p>
                    </div>
                    <button
                        onClick={() => navigate('/school/study/assignments')}
                        style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                            width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease', backdropFilter: 'blur(4px)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >✕</button>
                </div>
                <form onSubmit={handleSubmit} className="view-modal-body relative z-10 p-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                        className="flex flex-col gap-6"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconPencil size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title *</label>
                                </div>
                                <input
                                    type="text"
                                    name="homework"
                                    value={form.homework}
                                    onChange={(e) => setForm({ ...form, homework: e.target.value })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconUsers size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class *</label>
                                </div>
                                <select
                                    name="classId"
                                    value={form.classId}
                                    onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: '', subjectId: '' })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconIdBadge size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section *</label>
                                </div>
                                <select
                                    name="sectionId"
                                    value={form.sectionId}
                                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer"
                                    required
                                    disabled={!form.classId}
                                >
                                    <option value="" disabled>{form.classId ? "Select Section" : "Select class first"}</option>
                                    {sections.filter(s => s.classId === parseInt(form.classId)).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconBook size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject *</label>
                                </div>
                                <select
                                    name="subjectId"
                                    value={form.subjectId}
                                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer"
                                    required
                                    disabled={!form.classId}
                                >
                                    <option value="" disabled>{form.classId ? "Select Subject" : "Select class first"}</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconCalendar size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date *</label>
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <IconUser size={16} />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned By</label>
                                </div>
                                <select
                                    name="assignedBy"
                                    value={form.assignedBy}
                                    onChange={(e) => setForm({ ...form, assignedBy: e.target.value })}
                                    className="w-full h-11 px-0 bg-transparent border-0 border-b border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-0 transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Select Teacher</option>
                                    <option value="1">Amit Sharma</option>
                                    <option value="2">Priya Gupta</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-2 ml-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attach Document</span>
                            <label className="border border-dashed border-indigo-200 bg-indigo-50/20 rounded-xl p-4 text-center text-indigo-400 transition-colors hover:bg-indigo-50/50 cursor-pointer flex flex-col items-center justify-center gap-2 w-full max-w-[250px]">
                                <IconFileText size={20} />
                                <div className="text-[12px] font-medium">Drag and drop or click</div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-2 mb-4 ml-1 text-amber-500">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <IconFileText size={16} />
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
                            </div>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full min-h-[60px] p-0 bg-transparent text-[14px] font-medium text-slate-700 outline-none border-0 border-b border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all resize-y"
                                placeholder="Add homework details here..."
                                required
                            ></textarea>
                        </div>
                    </motion.div>

                    <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                            }}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div >
    );
};

export default AddHomework;
