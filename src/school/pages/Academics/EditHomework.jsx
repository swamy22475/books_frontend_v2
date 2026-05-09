import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconArrowLeft,
    IconHome,
    IconClipboardList,
    IconDeviceDesktop,
    IconStar,
    IconCloudUpload,
    IconDeviceFloppy
} from '@tabler/icons-react';
import './Academics.css';

const EditHomework = () => {
    const { id } = useParams();
    const { classes, sections, subjects, homework, updateHomework } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        classId: '',
        sectionId: '',
        subjectId: '',
        date: '',
        homework: '',
        description: '',
        file: null
    });

    useEffect(() => {
        const found = homework.find(hw => hw.id === parseInt(id));
        if (found) {
            setForm(found);
        } else {
            console.error('Homework not found!');
            navigate('/school/study/assignments');
        }
    }, [id, homework, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedClass = classes.find(c => c.id === parseInt(form.classId))?.name;
        const selectedSection = sections.find(s => s.id === parseInt(form.sectionId))?.name;
        const selectedSubject = subjects.find(s => s.id === parseInt(form.subjectId))?.name;

        updateHomework(id, {
            ...form,
            className: selectedClass,
            sectionName: selectedSection,
            subjectName: selectedSubject
        });
        navigate('/school/study/assignments');
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconClipboardList size={18} stroke={2.5} fill="currentColor" />
                        <h5>Homework Management</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/study/assignments">Assignments</Link>
                        <span>/</span>
                        <span className="text-gray-400">Edit Homework</span>
                    </div>
                </div>

                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Modify Homework Details</h4>
                        <p className="text-gray-400 text-sm italic">Update assignment ID: {id} for your students.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Class <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={form.classId}
                                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                                required
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Section <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={form.sectionId}
                                onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                                required
                            >
                                <option value="">Select Section</option>
                                {sections.filter(s => s.classId === parseInt(form.classId)).map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Date <span>*</span></label>
                            <input
                                type="date"
                                className="academics-form-control text-gray-700"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Subject <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={form.subjectId}
                                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Homework <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                placeholder="Assignment Title or Short Topic"
                                value={form.homework}
                                onChange={(e) => setForm({ ...form, homework: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Description <span>*</span></label>
                            <textarea
                                className="academics-form-control min-h-[120px]"
                                placeholder="Detailed instructions for students..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Update Attachment</label>
                            <div className="relative">
                                <label className="flex items-center gap-4 px-6 py-4 border-2 border-dashed border-blue-50/50 rounded-2xl cursor-pointer hover:bg-blue-50/20 transition-all bg-blue-50/10 group">
                                    <IconCloudUpload size={24} className="text-blue-400" />
                                    <span className="text-gray-400 font-medium">{form.file ? (form.file.name || 'Stored File') : 'Choose replacement file...'}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/study/assignments')}
                                className="px-8 py-4 font-medium text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="academics-submit-btn min-w-[220px]">
                                <IconDeviceFloppy size={20} className="mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHomework;
