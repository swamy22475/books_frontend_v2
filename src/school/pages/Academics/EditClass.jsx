import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconHome,
    IconLayoutGrid,
    IconArrowLeft,
    IconDeviceFloppy
} from '@tabler/icons-react';
import './Academics.css';

const EditClass = () => {
    const { classes, updateClass } = useContext(AcademicsContext);
    const { id } = useParams();
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [editClass, setEditClass] = useState({ name: '', numeric: '', teacherId: '', note: '', academicStatus: 'Active' });

    useEffect(() => {
        const found = classes.find(c => c.id === parseInt(id));
        if (found) {
            setEditClass(found);
        } else {
            alert('Class not found!');
            navigate('/school/academics/classes');
        }
    }, [id, classes, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editClass.name && editClass.numeric && editClass.teacherId) {
            updateClass(id, editClass);
            alert('Class updated successfully!');
            navigate('/school/academics/classes');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Area matches Add Class */}
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconLayoutGrid size={18} stroke={2.5} />
                        <h5>Class Management</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/classes">Class</Link>
                        <span>/</span>
                        <span className="text-gray-400">Edit</span>
                    </div>
                </div>

                {/* Form Card matches Add Class */}
                <div className="academics-form-card">
                    <div className="mb-8">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Edit Academic Class</h4>
                        <p className="text-gray-400 text-sm">Modify the details of class ID: {id} and maintain record consistency.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Class Name <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                value={editClass.name}
                                onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Numerical Value <span>*</span></label>
                            <input
                                type="number"
                                className="academics-form-control"
                                value={editClass.numeric}
                                onChange={(e) => setEditClass({ ...editClass, numeric: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Class Teacher <span>*</span></label>
                            <select
                                className="academics-form-control"
                                value={editClass.teacherId}
                                onChange={(e) => setEditClass({ ...editClass, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Primary Teacher</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Status</label>
                            <select
                                className="academics-form-control"
                                value={editClass.academicStatus || 'Active'}
                                onChange={(e) => setEditClass({ ...editClass, academicStatus: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Internal Note</label>
                            <textarea
                                className="academics-form-control min-h-[150px] resize-none"
                                placeholder="Add any administrative notes regarding this class here..."
                                value={editClass.note}
                                onChange={(e) => setEditClass({ ...editClass, note: e.target.value })}
                            />
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/academics/classes')}
                                className="px-8 py-4 font-medium text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="academics-submit-btn">
                                Update Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditClass;
