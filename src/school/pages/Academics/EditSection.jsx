import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconHome,
    IconStar,
    IconArrowLeft,
    IconDeviceFloppy
} from '@tabler/icons-react';
import './Academics.css';

const EditSection = () => {
    const { classes, sections, updateSection } = useContext(AcademicsContext);
    const { id } = useParams();
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [section, setSection] = useState({
        name: '',
        classId: '',
        category: '',
        capacity: '',
        teacherId: '',
        note: '',
        academicStatus: 'Active'
    });

    useEffect(() => {
        const found = sections.find(s => s.id === parseInt(id));
        if (found) {
            setSection(found);
        } else {
            console.error('Section not found!');
            navigate('/school/academics/sections');
        }
    }, [id, sections, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (section.name && section.category && section.capacity && section.classId && section.teacherId) {
            updateSection(id, section);
            navigate('/school/academics/sections');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
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
                        <span className="text-gray-400">Edit</span>
                    </div>
                </div>

                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Modify Academic Section</h4>
                        <p className="text-gray-400 text-sm italic">Update the details for this academic section.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Section Name <span>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Section A, Blue House"
                                className="academics-form-control"
                                value={section.name}
                                onChange={(e) => setSection({ ...section, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Category <span>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Academic, Extra-curricular"
                                className="academics-form-control"
                                value={section.category}
                                onChange={(e) => setSection({ ...section, category: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Capacity <span>*</span></label>
                            <input
                                type="number"
                                placeholder="Max students"
                                className="academics-form-control"
                                value={section.capacity}
                                onChange={(e) => setSection({ ...section, capacity: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Class <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={section.classId}
                                onChange={(e) => setSection({ ...section, classId: e.target.value })}
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
                                value={section.teacherId}
                                onChange={(e) => setSection({ ...section, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Academic Status</label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={section.academicStatus || 'Active'}
                                onChange={(e) => setSection({ ...section, academicStatus: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Note</label>
                            <textarea
                                className="academics-form-control min-h-[120px] resize-none"
                                placeholder="Additional details about this section..."
                                value={section.note}
                                onChange={(e) => setSection({ ...section, note: e.target.value })}
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

export default EditSection;
