import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconHome,
    IconLayoutGrid,
    IconArrowLeft,
    IconPlus
} from '@tabler/icons-react';
import './Academics.css';

const AddClass = () => {
    const { addClass } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [newClass, setNewClass] = useState({
        name: '',
        numeric: '',
        teacherId: '',
        note: '',
        academicStatus: 'Active'
    });

    const handleSubmit = (e, addAnother = false) => {
        e.preventDefault();
        if (newClass.name && newClass.numeric && newClass.teacherId) {
            addClass(newClass);
            if (addAnother) {
                setNewClass({
                    name: '',
                    numeric: '',
                    teacherId: '',
                    note: '',
                    academicStatus: 'Active'
                });
                // Simple feedback for add another
                alert('Class added successfully! You can now add another.');
            } else {
                navigate('/school/academics/classes');
            }
        }
    };

    return (
        <div className="academics-page p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Area styled like the 2nd image */}
                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <IconLayoutGrid size={18} stroke={2.5} />
                        <h5>Class</h5>
                    </div>
                    <div className="academics-breadcrumb-right">
                        <Link to="/school/dashboard"><IconHome size={14} /> Dashboard</Link>
                        <span>/</span>
                        <Link to="/school/academics/classes">Class</Link>
                        <span>/</span>
                        <span className="text-gray-400">Add Class</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="academics-form-card">
                    <form onSubmit={handleSubmit}>


                        <div className="academics-form-field">
                            <label>Class <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                placeholder=""
                                value={newClass.name}
                                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Class numeric <span>*</span></label>
                            <input
                                type="text"
                                className="academics-form-control"
                                placeholder=""
                                value={newClass.numeric}
                                onChange={(e) => setNewClass({ ...newClass, numeric: e.target.value })}
                                required
                            />
                        </div>

                        <div className="academics-form-field">
                            <label>Teacher name <span>*</span></label>
                            <select
                                className="academics-form-control"
                                value={newClass.teacherId}
                                onChange={(e) => setNewClass({ ...newClass, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers?.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="academics-form-field">
                            <label>Note</label>
                            <textarea
                                className="academics-form-control min-h-[100px] resize-none"
                                placeholder=""
                                value={newClass.note}
                                onChange={(e) => setNewClass({ ...newClass, note: e.target.value })}
                            />
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button type="submit" className="academics-submit-btn">
                                Add Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddClass;
