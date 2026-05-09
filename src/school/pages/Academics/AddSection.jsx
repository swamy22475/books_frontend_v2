import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconHome,
    IconStar,
    IconArrowLeft,
    IconPlus
} from '@tabler/icons-react';
import './Academics.css';

const AddSection = () => {
    const { classes, addSection } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [newSection, setNewSection] = useState({
        name: '',
        classId: '',
        category: '',
        capacity: '',
        teacherId: '',
        note: '',
        academicStatus: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Matching required fields from screenshot (*)
        if (newSection.name && newSection.category && newSection.capacity && newSection.classId && newSection.teacherId) {
            addSection(newSection);
            navigate('/school/academics/sections');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Area matches Add Class */}
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconStar size={18} stroke={2.5} fill="currentColor" />
                        <h5>Section Management</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/sections">Section</Link>
                        <span>/</span>
                        <span className="text-gray-400">Add</span>
                    </div>
                </div>

                {/* Form Card matches Add Class */}
                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Create Academic Section</h4>
                        <p className="text-gray-400 text-sm italic">Define a new section for your academic classes.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Section Name <span>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Section A, Blue House"
                                className="academics-form-control"
                                value={newSection.name}
                                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Category <span>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Academic, Extra-curricular"
                                className="academics-form-control"
                                value={newSection.category}
                                onChange={(e) => setNewSection({ ...newSection, category: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Capacity <span>*</span></label>
                            <input
                                type="number"
                                placeholder="Max students"
                                className="academics-form-control"
                                value={newSection.capacity}
                                onChange={(e) => setNewSection({ ...newSection, capacity: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Class <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={newSection.classId}
                                onChange={(e) => setNewSection({ ...newSection, classId: e.target.value })}
                                required
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Section In-charge <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={newSection.teacherId}
                                onChange={(e) => setNewSection({ ...newSection, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Note</label>
                            <textarea
                                className="academics-form-control min-h-[120px] resize-none"
                                placeholder="Additional details about this section..."
                                value={newSection.note}
                                onChange={(e) => setNewSection({ ...newSection, note: e.target.value })}
                            />
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/academics/sections')}
                                className="px-8 py-4 font-medium text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="academics-submit-btn min-w-[200px]">
                                Create Section
                            </button>
                        </div>
                    </form>
                </div>

                {/* Optional Tip - kept but simplified */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                        <IconStar size={16} className="text-blue-400" fill="currentColor" />
                        <span className="text-xs text-blue-700/60 font-medium italic">
                            Tip: Ensure you have created the Class and Teacher before defining a new Section.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSection;
