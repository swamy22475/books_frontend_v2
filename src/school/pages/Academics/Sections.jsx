import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconHome,
    IconSearch,
    IconTable,
    IconEye,
    IconPencil,
    IconFilter,
    IconChevronDown,
    IconLayoutGrid
} from '@tabler/icons-react';
import './Academics.css';

const Sections = () => {
    const { sections, classes, deleteSection, updateSection } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();

    const [viewingSection, setViewingSection] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        classId: '',
        selectedSections: []
    });

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({ classId: '', teacherId: '', status: '' });
    const [tempFilters, setTempFilters] = useState({ classId: '', teacherId: '', status: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        class: true,
        capacity: true,
        teacher: true,
        status: true
    });

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-dropdown-container')) {
                setShowFilterMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setShowFilterMenu(false);
    };

    const handleResetFilters = () => {
        const reset = { classId: '', teacherId: '', status: '' };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilterMenu(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            deleteSection(id);
        }
    };

    const getClassName = (classId) => {
        const cls = classes.find(c => c.id === parseInt(classId));
        return cls ? cls.name : 'Unknown';
    };

    const getTeacherName = (teacherId) => {
        if (!teacherId) return 'N/A';
        const teacher = teachers.find(t => t.id === parseInt(teacherId));
        return teacher ? teacher.name : 'N/A';
    };

    // Flattened sections with Class Name for easier searching/display
    const flatSections = useMemo(() => {
        return sections.map(section => ({
            ...section,
            className: getClassName(section.classId),
            teacherName: getTeacherName(section.teacherId)
        }));
    }, [sections, classes, teachers]);

    const filteredSections = useMemo(() => {
        return flatSections.filter(section => {
            const matchesSearch =
                section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.className.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesClass = !filters.classId || section.classId === parseInt(filters.classId);
            const matchesStatus = !filters.status || (section.academicStatus || 'Active') === filters.status;

            return matchesSearch && matchesClass && matchesStatus;
        });
    }, [flatSections, searchTerm, filters]);

    const handleCopy = () => {
        const headers = ['ID', 'Section', 'Class', 'Capacity', 'Teacher', 'Status'];
        const textToCopy = headers.join('\t') + '\n' +
            filteredSections.map(s => `${s.id}\t${s.name}\t${s.className}\t${s.capacity || 'N/A'}\t${s.teacherName}\t${s.academicStatus || 'Active'}`).join('\n');

        navigator.clipboard.writeText(textToCopy);
        alert(`Copied ${filteredSections.length} rows to clipboard!`);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Section', 'Class', 'Capacity', 'Teacher', 'Status'];
        const csvContent = headers.join(",") + "\n"
            + filteredSections.map(s => `${s.id},"${s.name}","${s.className}",${s.capacity || 'N/A'},"${s.teacherName}",${s.academicStatus || 'Active'}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `academic_sections_${new Date().toISOString().split('T')[0]}.csv`);
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

    const handleSave = () => {
        if (!formData.classId || formData.selectedSections.length === 0) {
            alert('Please select a class and at least one section.');
            return;
        }
        alert('Sections saved successfully!');
        setFormData({ classId: '', selectedSections: [] });
    };

    const toggleSectionCheckbox = (sectionName) => {
        setFormData(prev => ({
            ...prev,
            selectedSections: prev.selectedSections.includes(sectionName)
                ? prev.selectedSections.filter(s => s !== sectionName)
                : [...prev.selectedSections, sectionName]
        }));
    };

    const toggleStatus = (section) => {
        const newStatus = section.academicStatus === 'Inactive' ? 'Active' : 'Inactive';
        updateSection(section.id, { ...section, academicStatus: newStatus });
    };

    return (
        <div className="academics-page" style={{ padding: '28px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', width: '100%' }}>
                {/* Page Header */}
                <div className="page-header animate-slide-down">
                    <div className="page-title">
                        <h4>Sections</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span>Academics</span> / <span className="current">Sections</span>
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
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn btn-primary"
                        >
                            <IconPlus size={18} />
                            Add Section
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="card soft-card p-0">
                        {/* Toolbar */}
                        <div className="table-toolbar-wrapper border-b border-gray-50 bg-gray-50/5 p-4 animate-slide-up">
                            <div className="toolbar-search !flex-1">
                                <IconSearch size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by section or class..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input-field"
                                />
                            </div>
                            <div className="toolbar-actions ml-4 flex items-center gap-2">
                                <button onClick={handleCopy} className="export-mini-btn">Copy</button>
                                <button onClick={handleExportCSV} className="export-mini-btn">CSV</button>
                                <button onClick={handleExportExcel} className="export-mini-btn">Excel</button>
                                <button onClick={handleExportPDF} className="export-mini-btn">PDF</button>
                                <button onClick={handlePrint} className="export-mini-btn">Print</button>
                                <div className="filter-dropdown-container">
                                    <button
                                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                                        className="export-mini-btn !flex-row gap-2 h-full"
                                    >
                                        <IconFilter size={16} /> Filter <IconChevronDown size={14} />
                                    </button>

                                    {showFilterMenu && (
                                        <div className="filter-menu fade-in !right-0 !left-auto">
                                            <div className="filter-header">
                                                <h3 className="font-medium">Filter</h3>
                                            </div>
                                            <div className="filter-body">
                                                <div className="filter-group-vertical">
                                                    <label className="font-medium">Class</label>
                                                    <select
                                                        className="filter-select"
                                                        value={tempFilters.classId}
                                                        onChange={(e) => setTempFilters({ ...tempFilters, classId: e.target.value })}
                                                    >
                                                        <option value="">All Classes</option>
                                                        {classes.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
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
                            </div>
                        </div>

                        <table className="premium-table">
                            <thead>
                                <tr>
                                    {visibleColumns.id && <th className="font-medium">ID</th>}
                                    {visibleColumns.name && <th className="font-medium">Section Name</th>}
                                    {visibleColumns.class && <th className="font-medium">Class</th>}
                                    {visibleColumns.capacity && <th className="font-medium">Capacity</th>}
                                    {visibleColumns.teacher && <th className="font-medium">Teacher</th>}
                                    {visibleColumns.status && <th className="!text-center font-medium">Status</th>}
                                    <th className="!text-center font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSections.length > 0 ? (
                                    filteredSections.map((section, index) => (
                                        <tr
                                            key={section.id}
                                            className="hover:bg-gray-50/30 transition-colors animate-slide-up opacity-0"
                                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                                        >
                                            {visibleColumns.id && <td className="p-6">{section.id}</td>}
                                            {visibleColumns.name && <td className="p-6 font-medium text-gray-800">{section.name}</td>}
                                            {visibleColumns.class && <td className="p-6 text-gray-600">{section.className}</td>}
                                            {visibleColumns.capacity && <td className="p-6 text-gray-600">{section.capacity || 'N/A'}</td>}
                                            {visibleColumns.teacher && <td className="p-6 text-gray-600">{section.teacherName}</td>}
                                            {visibleColumns.status && (
                                                <td className="p-6 text-center">
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${section.academicStatus === 'Inactive'
                                                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                            }`}
                                                        onClick={() => toggleStatus(section)}
                                                        title="Click to toggle status"
                                                    >
                                                        {section.academicStatus || 'Active'}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setViewingSection(section)}
                                                        className="action-icon-btn btn-action-view !w-8 !h-8"
                                                    >
                                                        <IconEye size={16} />
                                                    </button>
                                                    <button className="action-icon-btn btn-action-edit !w-8 !h-8">
                                                        <IconPencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(section.id)}
                                                        className="action-icon-btn btn-action-delete !w-8 !h-8"
                                                    >
                                                        <IconTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={Object.values(visibleColumns).filter(v => v).length + 2} className="p-20 text-center text-gray-400 italic">
                                            No sections found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Modal - Premium Style */}
            {viewingSection && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 font-sans" onClick={() => setViewingSection(null)}>
                    <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        {/* Premium Header */}
                        <div className="bg-[#3d5ee1] p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                    <IconLayoutGrid size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-white leading-tight">Section Details</h2>
                                    <p className="text-blue-100 text-xs font-normal mt-1">Viewing profile for {viewingSection.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingSection(null)}
                                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                            >
                                ✕
                            </button>
                            {/* Decorative Circles */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="animate-slide-up delay-100 opacity-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Section ID</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingSection.id}</div>
                                    </div>
                                    <div className="animate-slide-up delay-200 opacity-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Class</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingSection.className}</div>
                                    </div>
                                </div>

                                <div className="animate-slide-up delay-300 opacity-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Assigned Teacher</label>
                                    <div className="text-slate-600 font-medium text-lg">{viewingSection.teacherName}</div>
                                </div>

                                <div className="animate-slide-up delay-400 opacity-0 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Status</label>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium inline-block ${viewingSection.academicStatus === 'Inactive' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                                        {viewingSection.academicStatus || 'Active'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 animate-slide-up delay-500 opacity-0">
                                <button
                                    onClick={() => setViewingSection(null)}
                                    className="flex-1 py-3 px-4 bg-[#3d5ee1] hover:bg-[#2b4fc4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 text-sm flex items-center justify-center gap-2"
                                >
                                    <IconPencil size={18} />
                                    Edit Section
                                </button>
                                <button
                                    onClick={() => setViewingSection(null)}
                                    className="flex-1 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition-all hover:border-slate-300 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Section Modal - Premium Style */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={() => setIsAddModalOpen(false)}>
                    <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-[#3d5ee1] p-6 flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-white">Add Section</h2>
                                <p className="text-white/80 text-xs mt-1">Create new academic sections</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="relative z-10 p-2 text-white/80 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                            {/* Decorative Circles */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Sections <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['A', 'B', 'C', 'D', 'E', 'F'].map(section => (
                                        <label key={section} className={`
                                            flex items-center justify-center py-2.5 rounded-xl border cursor-pointer transition-all select-none font-medium
                                            ${formData.selectedSections.includes(section)
                                                ? 'bg-[#3d5ee1] border-[#3d5ee1] text-white shadow-md shadow-blue-200'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
                                            }
                                        `}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.selectedSections.includes(section)}
                                                onChange={() => toggleSectionCheckbox(section)}
                                            />
                                            <span>{section}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-[#3d5ee1] hover:bg-[#2b4fc4] text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                            >
                                Save Sections
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sections;
