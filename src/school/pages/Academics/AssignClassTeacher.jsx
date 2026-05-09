import React, { useContext, useState } from 'react';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconTrash,
    IconHome,
    IconUsers,
    IconSearch,
    IconCopy,
    IconPrinter,
    IconEye,
    IconPencil,
    IconSelector,
    IconFilter,
    IconChevronDown,
    IconStar,
    IconPlus
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import './Academics.css';

const AssignClassTeacher = () => {
    const { classes, sections, assignments, deleteAssignment, updateAssignment, addAssignment } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [viewingAssignment, setViewingAssignment] = useState(null);
    const [formData, setFormData] = useState({ classId: '', sectionId: '', teacherId: '' });

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({ classId: '', sectionId: '', teacherId: '', status: '' });
    const [tempFilters, setTempFilters] = useState({ classId: '', sectionId: '', teacherId: '', status: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        classSection: true,
        teacher: true,
        status: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.classId && formData.sectionId && formData.teacherId) {
            addAssignment(formData);
            setFormData({ classId: '', sectionId: '', teacherId: '' });
        }
    };

    const getClassName = (id) => classes.find(c => c.id === parseInt(id))?.name || 'Unknown';
    const getSectionName = (id) => sections.find(s => s.id === parseInt(id))?.name || 'Unknown';
    const getTeacherName = (id) => teachers.find(t => t.id === id)?.name || 'Unknown';

    const filteredAssignments = assignments.filter(asg => {
        const matchesSearch = getClassName(asg.classId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getTeacherName(asg.teacherId).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = !filters.classId || asg.classId.toString() === filters.classId;
        const matchesSection = !filters.sectionId || asg.sectionId.toString() === filters.sectionId;
        const matchesTeacher = !filters.teacherId || asg.teacherId === filters.teacherId;
        const matchesStatus = !filters.status || (asg.academicStatus || 'Active') === filters.status;

        return matchesSearch && matchesClass && matchesSection && matchesTeacher && matchesStatus;
    });

    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setShowFilterMenu(false);
    };

    const handleResetFilters = () => {
        const reset = { classId: '', sectionId: '', teacherId: '', status: '' };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilterMenu(false);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredAssignments.map(asg => asg.id));
        } else {
            setSelectedRows([]);
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleCopy = () => {
        const dataToExport = selectedRows.length > 0
            ? filteredAssignments.filter(asg => selectedRows.includes(asg.id))
            : filteredAssignments;

        const headers = ['ID', 'Class', 'Section', 'Teacher', 'Status'];
        const textToCopy = headers.join('\t') + '\n' +
            dataToExport.map(asg => `${asg.id}\t${getClassName(asg.classId)}\t${getSectionName(asg.sectionId)}\t${getTeacherName(asg.teacherId)}\t${asg.academicStatus || 'Active'}`).join('\n');

        navigator.clipboard.writeText(textToCopy);
        alert(`Copied ${dataToExport.length} rows to clipboard!`);
    };

    const handleExportCSV = () => {
        const dataToExport = selectedRows.length > 0
            ? filteredAssignments.filter(asg => selectedRows.includes(asg.id))
            : filteredAssignments;

        const headers = ['ID', 'Class', 'Section', 'Teacher', 'Status'];
        const csvContent = headers.join(",") + "\n"
            + dataToExport.map(asg => `${asg.id},"${getClassName(asg.classId)}","${getSectionName(asg.sectionId)}","${getTeacherName(asg.teacherId)}",${asg.academicStatus || 'Active'}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `teacher_assignments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        handleExportCSV();
    };

    const handleExportPDF = () => {
        window.print();
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleStatus = (asg) => {
        const newStatus = asg.academicStatus === 'Inactive' ? 'Active' : 'Inactive';
        updateAssignment(asg.id, { ...asg, academicStatus: newStatus });
    };

    return (
        <div className="academics-page" style={{ padding: '28px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', width: '100%' }}>
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <h4>Assign Class Teacher</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span>Academics</span> / <span className="current">Assign Class Teacher</span>
                        </nav>
                    </div>
                    <div className="page-header-actions">
                        <button
                            onClick={() => navigate('/school/academics')}
                            className="btn btn-primary"
                        >
                            <IconHome size={18} />
                            Back to Academics
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Add Form */}
                    <div className="lg:col-span-4">
                        <div className="academics-layout-header">
                            <div className="academics-header-left">
                                <IconUsers size={18} stroke={2.5} />
                                <h5>Assign Teacher</h5>
                            </div>
                        </div>

                        <div className="academics-form-card" style={{ padding: '32px' }}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="academics-form-field" style={{ maxWidth: '100%', margin: '0 0 24px 0' }}>
                                    <label>Class <span>*</span></label>
                                    <select
                                        className="academics-form-control"
                                        value={formData.classId}
                                        onChange={(e) => setFormData({ ...formData, classId: e.target.value, sectionId: '' })}
                                        required
                                    >
                                        <option value="">Select Academic Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="academics-form-field" style={{ maxWidth: '100%', margin: '0 0 24px 0' }}>
                                    <label>Section <span>*</span></label>
                                    <select
                                        className="academics-form-control"
                                        value={formData.sectionId}
                                        onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                                        required
                                        disabled={!formData.classId}
                                    >
                                        <option value="">Select Class Section</option>
                                        {sections.filter(s => s.classId === parseInt(formData.classId)).map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="academics-form-field" style={{ maxWidth: '100%', margin: '0 0 24px 0' }}>
                                    <label>Teacher <span>*</span></label>
                                    <select
                                        className="academics-form-control"
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

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="academics-submit-btn w-full py-3.5 flex items-center justify-center gap-3 text-base"
                                    >
                                        <IconPlus stroke={4} size={20} />
                                        Save Assignment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Table Card */}
                    <div className="lg:col-span-8">
                        <div className="card soft-card fade-in">
                            {/* Toolbar */}
                            <div className="table-toolbar-wrapper">
                                <div className="toolbar-search">
                                    <IconSearch size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search assignments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input-field"
                                    />
                                </div>
                                <div className="toolbar-actions flex items-center gap-2">
                                    <div className="relative inline-block text-left h-full">
                                        <button
                                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                                            className={`export-mini-btn !flex-row gap-2 h-full ${showFilterMenu ? 'active' : ''}`}
                                        >
                                            <IconFilter size={16} /> Filter <IconChevronDown size={14} className={`transition-transform duration-200 ${showFilterMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showFilterMenu && (
                                            <div className="filter-menu fade-in">
                                                <div className="filter-header">
                                                    <h3>Filter</h3>
                                                </div>
                                                <div className="filter-body">
                                                    <div className="filter-section">
                                                        <span className="filter-section-label">Show Columns</span>
                                                        <div className="column-checkboxes">
                                                            {Object.keys(visibleColumns).map(col => (
                                                                <label key={col} className="checkbox-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={visibleColumns[col]}
                                                                        onChange={() => toggleColumnVisibility(col)}
                                                                    />
                                                                    <span>{col === 'classSection' ? 'Class & Section' : col.charAt(0).toUpperCase() + col.slice(1)}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="filter-group-vertical">
                                                        <label>Class</label>
                                                        <select
                                                            className="filter-select"
                                                            value={tempFilters.classId}
                                                            onChange={(e) => setTempFilters({ ...tempFilters, classId: e.target.value, sectionId: '' })}
                                                        >
                                                            <option value="">Select Class</option>
                                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                    </div>

                                                    <div className="filter-group-vertical">
                                                        <label>Section</label>
                                                        <select
                                                            className="filter-select"
                                                            value={tempFilters.sectionId}
                                                            onChange={(e) => setTempFilters({ ...tempFilters, sectionId: e.target.value })}
                                                            disabled={!tempFilters.classId}
                                                        >
                                                            <option value="">Select Section</option>
                                                            {sections.filter(s => s.classId === parseInt(tempFilters.classId)).map(s => (
                                                                <option key={s.id} value={s.id}>{s.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="filter-group-vertical">
                                                        <label>Teacher</label>
                                                        <select
                                                            className="filter-select"
                                                            value={tempFilters.teacherId}
                                                            onChange={(e) => setTempFilters({ ...tempFilters, teacherId: e.target.value })}
                                                        >
                                                            <option value="">Select Teacher</option>
                                                            {teachers.map(t => (
                                                                <option key={t.id} value={t.id}>{t.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="filter-group-vertical">
                                                        <label>Status</label>
                                                        <select
                                                            className="filter-select"
                                                            value={tempFilters.status}
                                                            onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                                                        >
                                                            <option value="">Select Status</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="filter-footer">
                                                    <button className="btn-reset" onClick={handleResetFilters}>Reset</button>
                                                    <button className="btn-apply" onClick={handleApplyFilters}>Apply</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleCopy} className="export-mini-btn">
                                        Copy
                                    </button>
                                    <button onClick={handleExportCSV} className="export-mini-btn">
                                        CSV
                                    </button>
                                    <button onClick={handleExportExcel} className="export-mini-btn">
                                        Excel
                                    </button>
                                    <button onClick={handleExportPDF} className="export-mini-btn">
                                        PDF
                                    </button>
                                    <button onClick={handlePrint} className="export-mini-btn">
                                        Print
                                    </button>
                                </div>
                            </div>

                            {/* Table Stats */}
                            <div className="table-stats">
                                <span><strong>{filteredAssignments.length}</strong> records {selectedRows.length > 0 && <strong>| {selectedRows.length} selected</strong>}</span>
                            </div>

                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th className="w-12">
                                            <input
                                                type="checkbox"
                                                className="premium-checkbox"
                                                onChange={handleSelectAll}
                                                checked={filteredAssignments.length > 0 && selectedRows.length === filteredAssignments.length}
                                            />
                                        </th>
                                        {visibleColumns.id && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    ID <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.classSection && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    Class & Section <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.teacher && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    Assigned Teacher <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.status && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    Status <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssignments.length > 0 ? (
                                        filteredAssignments.map((asg) => (
                                            <tr key={asg.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="premium-checkbox"
                                                        checked={selectedRows.includes(asg.id)}
                                                        onChange={() => toggleSelectRow(asg.id)}
                                                    />
                                                </td>
                                                {visibleColumns.id && <td>{asg.id}</td>}
                                                {visibleColumns.classSection && (
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                                                <IconMapPin size={16} />
                                                            </div>
                                                            <span className="font-semibold text-gray-800">
                                                                {getClassName(asg.classId)} - {getSectionName(asg.sectionId)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.teacher && (
                                                    <td>
                                                        <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm">
                                                            {getTeacherName(asg.teacherId)}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.status && (
                                                    <td>
                                                        <span
                                                            className={asg.academicStatus === 'Inactive' ? "status-badge-inactive" : "status-badge-active"}
                                                            onClick={() => toggleStatus(asg)}
                                                            style={{ cursor: 'pointer' }}
                                                            title="Click to toggle status"
                                                        >
                                                            {asg.academicStatus || 'Active'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td>
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => setViewingAssignment(asg)}
                                                            className="action-icon-btn btn-action-view"
                                                        >
                                                            <IconEye size={18} stroke={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/school/academics/assign-class-teacher/edit/${asg.id}`)}
                                                            className="action-icon-btn btn-action-edit"
                                                        >
                                                            <IconPencil size={18} stroke={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this assignment?')) {
                                                                    deleteAssignment(asg.id);
                                                                }
                                                            }}
                                                            className="action-icon-btn btn-action-delete"
                                                        >
                                                            <IconTrash size={18} stroke={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={Object.values(visibleColumns).filter(v => v).length + 2} className="p-20 text-center text-gray-400 italic">
                                                <div className="flex flex-col items-center gap-4">
                                                    <IconUsers size={48} className="text-gray-200" />
                                                    No class teacher assignments found.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal - Premium Refactor */}
            {viewingAssignment && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 font-sans" onClick={() => setViewingAssignment(null)}>
                    <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl text-center border border-slate-200 relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setViewingAssignment(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>

                        <div className="mb-8 flex justify-center text-blue-500">
                            <div className="p-5 bg-blue-50 rounded-3xl">
                                <IconStar size={64} stroke={1.5} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-slate-800 mb-2">
                            Assignment Details
                        </h1>
                        <p className="text-slate-500 mb-10 font-medium">
                            Class teacher assignment for <span className="text-blue-600 font-bold">{getClassName(viewingAssignment.classId)} - {getSectionName(viewingAssignment.sectionId)}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID</span>
                                <span className="text-slate-700 font-bold">#{viewingAssignment.id}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Class</span>
                                <span className="text-slate-700 font-bold">{getClassName(viewingAssignment.classId)}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Section</span>
                                <span className="text-slate-700 font-bold">{getSectionName(viewingAssignment.sectionId)}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teacher</span>
                                <span className="text-blue-600 font-bold">{getTeacherName(viewingAssignment.teacherId)}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${viewingAssignment.academicStatus === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {viewingAssignment.academicStatus || 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setViewingAssignment(null);
                                    navigate(`/school/academics/assign-class-teacher/edit/${viewingAssignment.id}`);
                                }}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <IconPencil size={20} stroke={2.5} />
                                Edit Assignment
                            </button>
                            <button
                                onClick={() => setViewingAssignment(null)}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-bold transition-all shadow-sm active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignClassTeacher;
