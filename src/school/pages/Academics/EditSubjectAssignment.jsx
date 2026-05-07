import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconDeviceDesktop,
    IconStar,
    IconHome
} from '@tabler/icons-react';
import './Academics.css';

const EditSubjectAssignment = () => {
    const { id } = useParams();
    const { classes, sections, subjects, assignments, updateAssignment } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ classId: '', sectionId: '', subjectId: '' });

    useEffect(() => {
        const found = assignments.find(a => a.id === parseInt(id));
        if (found) {
            setFormData(found);
        } else {
            console.error('Assignment not found!');
            navigate('/school/academics/assign-subjects');
        }
    }, [id, assignments, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.classId && formData.sectionId && formData.subjectId) {
            updateAssignment(id, formData);
            navigate('/school/academics/assign-subjects');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconStar size={18} stroke={2.5} fill="currentColor" />
                        <h5>Assign Subject</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/assign-subjects">Assign Subjects</Link>
                        <span>/</span>
                        <span className="text-gray-400">Edit Mapping</span>
                    </div>
                </div>

                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Modify Subject Mapping</h4>
                        <p className="text-gray-400 text-sm italic">Update the assignment for mapping ID: {id}.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Class <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                required
                            >
                                <option value="">Select Academic Class</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Section <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
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

                        <div className="academics-form-field">
                            <label>Subject <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={formData.subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                required
                            >
                                <option value="">Select Subject to Assign</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                            </select>
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/academics/assign-subjects')}
                                className="px-8 py-4 font-medium text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="academics-submit-btn min-w-[200px]">
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

export default EditSubjectAssignment;
