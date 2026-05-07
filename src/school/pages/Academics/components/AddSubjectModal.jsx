import React, { useState, useEffect } from 'react';
import { IconX, IconCheck, IconBook, IconUser } from '@tabler/icons-react';

const AddSubjectModal = ({ isOpen, onClose, onSave, period, day, initialData }) => {
    const [formData, setFormData] = useState({
        subject: '',
        teacher: '',
        classroom: ''
    });

    const teachers = [
        'Dr. Sarah Wilson',
        'Prof. James Bond',
        'Mrs. Emily Chen',
        'Mr. David Miller',
        'Ms. Sophia Rodriguez',
        'Mr. Alexander Knight'
    ];

    const subjects = [
        'Mathematics',
        'English Literature',
        'Science',
        'Physics',
        'History & Civics',
        'Computer Science',
        'Art & Design',
        'Physical Education'
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                subject: initialData.subject || '',
                teacher: initialData.teacher || '',
                classroom: initialData.classroom || ''
            });
        } else {
            setFormData({ subject: '', teacher: '', classroom: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            day,
            period: period.id
        });
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
            <style>
                {`
                    select::-ms-expand { display: none; }
                    select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
                `}
            </style>
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
                <form onSubmit={handleSubmit}>
                    <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-[22px] font-bold text-gray-800 tracking-tight leading-none mb-2">
                                {initialData ? 'Update Schedule' : 'Assign Period'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-blue-50 text-[#3d5ee1] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    {day}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-80">
                                    {period.startTime} - {period.endTime}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-all border border-gray-100/50"
                        >
                            <IconX size={20} stroke={2.5} />
                        </button>
                    </div>

                    <div className="p-8 space-y-7">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <IconBook size={14} className="text-[#3d5ee1] opacity-60" />
                                Select Subject
                            </label>
                            <div className="relative group">
                                <select
                                    required
                                    className="w-full h-14 px-5 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:border-[#3d5ee1]/10 focus:bg-white focus:shadow-[0_0_20px_rgba(61,94,225,0.05)] transition-all text-[15px] font-semibold text-gray-700 outline-none appearance-none cursor-pointer"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="" disabled>Choose Subject</option>
                                    {subjects.map((sub) => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <IconUser size={14} className="text-[#3d5ee1] opacity-60" />
                                Assign Faculty
                            </label>
                            <div className="relative group">
                                <select
                                    required
                                    className="w-full h-14 px-5 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:border-[#3d5ee1]/10 focus:bg-white focus:shadow-[0_0_20px_rgba(61,94,225,0.05)] transition-all text-[15px] font-semibold text-gray-700 outline-none appearance-none cursor-pointer"
                                    value={formData.teacher}
                                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                >
                                    <option value="" disabled>Choose Teacher</option>
                                    {teachers.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="bg-blue-50/30 rounded-2xl p-4 flex items-center gap-3 border border-blue-50 group hover:bg-blue-50/50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#3d5ee1] shadow-sm">
                                    <IconCheck size={16} stroke={3} />
                                </div>
                                <p className="text-[12px] font-bold text-blue-600/80 leading-tight uppercase tracking-widest">
                                    Instant Live Sync
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-10 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl text-[14px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-14 bg-[#3d5ee1] rounded-2xl text-[14px] font-bold text-white hover:bg-blue-600 shadow-[0_10px_30px_rgba(61,94,225,0.2)] hover:shadow-[0_15px_35px_rgba(61,94,225,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                        >
                            Save details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubjectModal;
