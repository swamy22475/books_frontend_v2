import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { AcademicsContext } from '../../../context/AcademicsContext';
import './BookSales.css';

const ClassesSections = () => {
    const { classes, sections, addClass, addSection, updateClass, updateSection, deleteClass, deleteSection } = useContext(AcademicsContext);
    const [className, setClassName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [editingClass, setEditingClass] = useState(null);
    const [editingSection, setEditingSection] = useState(null);

    const activeClasses = useMemo(
        () => classes.filter(c => (c.academicStatus || 'Active') === 'Active'),
        [classes]
    );

    const getClassName = (classId) => classes.find(c => c.id === Number(classId))?.name || 'Unknown';

    const actionBtn = {
        width: 34,
        height: 34,
        border: 0,
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginRight: 8
    };

    const chipBtn = {
        width: 22,
        height: 22,
        border: 0,
        borderRadius: 7,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        marginLeft: 6,
        background: 'rgba(255, 255, 255, 0.75)'
    };

    const handleAddClass = (event) => {
        event.preventDefault();
        const name = className.trim();
        if (!name) return;

        addClass({
            name,
            numeric: name.replace(/\D/g, '') || name,
            teacherId: '',
            note: '',
            academicStatus: 'Active'
        });
        setClassName('');
    };

    const handleAddSection = (event) => {
        event.preventDefault();
        const name = sectionName.trim();
        if (!name || !selectedClassId) return;

        addSection({
            name,
            classId: Number(selectedClassId),
            category: 'Academic',
            capacity: '',
            teacherId: '',
            note: '',
            academicStatus: 'Active'
        });
        setSectionName('');
    };

    const handleSaveClass = (event) => {
        event.preventDefault();
        const name = editingClass?.name?.trim();
        if (!editingClass || !name) return;

        updateClass(editingClass.id, {
            ...editingClass,
            name,
            numeric: editingClass.numeric || name.replace(/\D/g, '') || name
        });
        setEditingClass(null);
    };

    const handleSaveSection = (event) => {
        event.preventDefault();
        const name = editingSection?.name?.trim();
        if (!editingSection || !name || !editingSection.classId) return;

        updateSection(editingSection.id, {
            ...editingSection,
            name,
            classId: Number(editingSection.classId)
        });
        setEditingSection(null);
    };

    return (
        <div className="bs-page">
            <div className="bs-page-header">
                <div>
                    <h4 className="bs-page-title">Classes & Sections</h4>
                    <nav className="bs-breadcrumb">
                        <Link to="..">Dashboard</Link><span>/</span>
                        <Link to="..">Book Sales</Link><span>/</span>
                        <span className="bs-breadcrumb-current">Classes & Sections</span>
                    </nav>
                </div>
            </div>

            <div className="bs-row bs-row-3" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">Add Class</h5>
                    </div>
                    <form className="bs-modal-body" onSubmit={handleAddClass}>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Class Name</label>
                            <input
                                className="bs-form-input"
                                placeholder="e.g. Class 11, Nursery, LKG"
                                value={className}
                                onChange={e => setClassName(e.target.value)}
                            />
                        </div>
                        <button className="bs-btn bs-btn-primary bs-btn-animated" type="submit">Add Class</button>
                    </form>
                </div>

                <div className="bs-card">
                    <div className="bs-card-header">
                        <h5 className="bs-card-title">Add Section</h5>
                    </div>
                    <form className="bs-modal-body" onSubmit={handleAddSection}>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Class</label>
                            <select
                                className="bs-form-select"
                                value={selectedClassId}
                                onChange={e => setSelectedClassId(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {activeClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="bs-form-group">
                            <label className="bs-form-label">Section Name <span style={{ color: 'var(--bs-muted)' }}>(optional for schools)</span></label>
                            <input
                                className="bs-form-input"
                                placeholder="e.g. A, Blue, Morning"
                                value={sectionName}
                                onChange={e => setSectionName(e.target.value)}
                            />
                        </div>
                        <button className="bs-btn bs-btn-primary bs-btn-animated" type="submit" disabled={!selectedClassId || !sectionName.trim()}>
                            Add Section
                        </button>
                    </form>
                </div>
            </div>

            <div className="bs-card">
                <div className="bs-card-header">
                    <h5 className="bs-card-title">Configured Classes</h5>
                </div>
                <div className="bs-table-wrap">
                    <table className="bs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Class</th>
                                <th>Sections</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls, index) => {
                                const classSections = sections.filter(s => Number(s.classId) === Number(cls.id));
                                return (
                                    <tr key={cls.id}>
                                        <td>{index + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{cls.name}</td>
                                        <td>
                                            {classSections.length > 0 ? classSections.map(section => (
                                                <span
                                                    key={section.id}
                                                    className="bs-badge bs-badge-blue"
                                                    style={{ marginRight: 8, marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 2 }}
                                                >
                                                    {section.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingSection(section)}
                                                        style={{ ...chipBtn, color: '#3d5ee1' }}
                                                        title={`Edit section ${section.name}`}
                                                    >
                                                        <IconEdit size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteSection(section.id)}
                                                        style={{ ...chipBtn, color: '#ea5455' }}
                                                        title={`Delete section ${section.name}`}
                                                    >
                                                        <IconTrash size={13} />
                                                    </button>
                                                </span>
                                            )) : <span style={{ color: 'var(--bs-muted)' }}>No sections, sales can continue without section</span>}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => setEditingClass(cls)}
                                                title={`Edit ${getClassName(cls.id)}`}
                                                style={{ ...actionBtn, background: '#eef1fd', color: '#3d5ee1' }}
                                            >
                                                <IconEdit size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteClass(cls.id)}
                                                title={`Delete ${getClassName(cls.id)}`}
                                                style={{ ...actionBtn, background: '#fce8e8', color: '#ea5455' }}
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingClass && (
                <div className="bs-modal-overlay" onClick={() => setEditingClass(null)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">Edit Class</h5>
                            <button className="bs-modal-close" onClick={() => setEditingClass(null)}><IconX size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveClass}>
                            <div className="bs-modal-body">
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Class Name</label>
                                    <input
                                        className="bs-form-input"
                                        value={editingClass.name}
                                        onChange={e => setEditingClass({ ...editingClass, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="bs-modal-footer">
                                <button type="button" className="bs-btn bs-btn-outline" onClick={() => setEditingClass(null)}>Cancel</button>
                                <button type="submit" className="bs-btn bs-btn-primary bs-btn-animated">Update Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingSection && (
                <div className="bs-modal-overlay" onClick={() => setEditingSection(null)}>
                    <div className="bs-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                        <div className="bs-modal-header">
                            <h5 className="bs-modal-title">Edit Section</h5>
                            <button className="bs-modal-close" onClick={() => setEditingSection(null)}><IconX size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveSection}>
                            <div className="bs-modal-body">
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Class</label>
                                    <select
                                        className="bs-form-select"
                                        value={editingSection.classId}
                                        onChange={e => setEditingSection({ ...editingSection, classId: e.target.value })}
                                    >
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="bs-form-group">
                                    <label className="bs-form-label">Section Name</label>
                                    <input
                                        className="bs-form-input"
                                        value={editingSection.name}
                                        onChange={e => setEditingSection({ ...editingSection, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="bs-modal-footer">
                                <button type="button" className="bs-btn bs-btn-outline" onClick={() => setEditingSection(null)}>Cancel</button>
                                <button type="submit" className="bs-btn bs-btn-primary bs-btn-animated">Update Section</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesSections;
