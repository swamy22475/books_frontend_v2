import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconHome,
    IconBook,
    IconArrowLeft,
    IconDeviceFloppy
} from '@tabler/icons-react';
import './Academics.css';

const EditSubject = () => {
    const { subjects, masterSubjects, updateSubject } = useContext(AcademicsContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [editSubject, setEditSubject] = useState({
        name: '',
        code: '',
        type: 'Theory',
        academicStatus: 'Active'
    });

    useEffect(() => {
        const found = subjects.find(s => s.id === parseInt(id));
        if (found) {
            setEditSubject(found);
        } else {
            console.error('Subject not found!');
            navigate('/school/academics/subjects');
        }
    }, [id, subjects, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editSubject.name && editSubject.code) {
            updateSubject(id, editSubject);
            navigate('/school/academics/subjects');
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconBook size={18} stroke={2.5} fill="currentColor" />
                        <h5>Subject Management</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/subjects">Subject</Link>
                        <span>/</span>
                        <span className="text-gray-400">Edit</span>
                    </div>
                </div>

                <div className="academics-form-card">
                    <div className="mb-8 text-center">
                        <h4 className="text-2xl text-blue-900/80 mb-2">Modify Academic Subject</h4>
                        <p className="text-gray-400 text-sm italic">Update the details for subject ID: {id}.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="academics-form-field">
                            <label>Subject Name <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={editSubject.name}
                                onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                                required
                            >
                                <option value="">Select Official Subject</option>
                                {masterSubjects.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Subject Code <span>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. MATH101"
                                className="academics-form-control"
                                value={editSubject.code}
                                onChange={(e) => setEditSubject({ ...editSubject, code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Subject Type <span>*</span></label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={editSubject.type}
                                onChange={(e) => setEditSubject({ ...editSubject, type: e.target.value })}
                                required
                            >
                                <option value="Theory">Theory Only</option>
                                <option value="Practical">Practical / Lab</option>
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Academic Status</label>
                            <select
                                className="academics-form-control text-gray-700"
                                value={editSubject.academicStatus || 'Active'}
                                onChange={(e) => setEditSubject({ ...editSubject, academicStatus: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/school/academics/subjects')}
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

export default EditSubject;
