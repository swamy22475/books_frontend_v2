import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconDeviceDesktop,
    IconStar
} from '@tabler/icons-react';
import './Academics.css';

const EditClassTeacherAssignment = () => {
    const { id } = useParams();
    const { classes, sections, assignments, updateAssignment } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ classId: '', sectionId: '', teacherId: '' });

    useEffect(() => {
        const found = assignments.find(a => a.id === parseInt(id));
        if (found) {
            setFormData(found);
        } else {
            alert('Assignment not found!');
            navigate('/school/academics/assign-class-teacher');
        }
    }, [id, assignments, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.classId && formData.sectionId && formData.teacherId) {
            updateAssignment(id, formData);
            alert('Assignment updated successfully!');
            navigate('/school/academics/assign-class-teacher');
        }
    };

    return (
        <div className="academics-page">
            <header className="ref-header-bar">
                <div className="ref-header-left">
                    <IconStar size={18} className="text-yellow-500 fill-yellow-500" />
                    <span>Assign Class Teacher</span>
                </div>
                <div className="ref-header-right">
                    <IconDeviceDesktop size={14} />
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/school/dashboard'); }}>Dashboard</a>
                    <span className="mx-1">/</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/school/academics/assign-class-teacher'); }}>Assign Class Teacher</a>
                    <span className="mx-1">/</span>
                    <span>Edit Assignment</span>
                </div>
            </header>

            <div className="p-8 max-w-2xl mx-auto">
                <div className="premium-form-card overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <button
                            onClick={() => navigate('/school/academics/assign-class-teacher')}
                            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all font-bold group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50">
                                <IconArrowLeft size={16} />
                            </div>
                            Back to List
                        </button>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">Modify Teacher Assignment</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Class *</label>
                            <select
                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 appearance-none bg-[right_1.5rem_center]"
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                required
                            >
                                <option value="">Select Academic Class</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Section *</label>
                            <select
                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 appearance-none bg-[right_1.5rem_center]"
                                value={formData.sectionId}
                                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                                required
                            >
                                <option value="">Select Class Section</option>
                                {sections.filter(s => s.classId === parseInt(formData.classId)).map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Teacher *</label>
                            <select
                                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 appearance-none bg-[right_1.5rem_center]"
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Class Teacher</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg"
                            >
                                <IconDeviceFloppy stroke={2} size={22} />
                                Update Assignment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditClassTeacherAssignment;
