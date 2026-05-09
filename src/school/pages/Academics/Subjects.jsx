import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconHome,
    IconClock,
    IconDeviceDesktop,
    IconSearch,
    IconCopy,
    IconFileText,
    IconTable,
    IconFile as IconPdf,
    IconPrinter,
    IconEye,
    IconPencil,
    IconBook,
    IconSelector,
    IconFilter,
    IconChevronDown
} from '@tabler/icons-react';
import './Academics.css';

const Subjects = () => {
    const { subjects, deleteSubject, updateSubject } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [selectedRows, setSelectedRows] = useState([]);
    const [viewingSubject, setViewingSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [recordsPerPage, setRecordsPerPage] = useState(50);

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({ type: '', status: '' });
    const [tempFilters, setTempFilters] = useState({ type: '', status: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        code: true,
        type: true,
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
        const reset = { type: '', status: '' };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilterMenu(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            deleteSubject(id);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredSubjects.map(s => s.id));
        } else {
            setSelectedRows([]);
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const filteredSubjects = useMemo(() => {
        return subjects.filter(sub => {
            const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.code.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = !filters.type || sub.type === filters.type;
            const matchesStatus = !filters.status || (sub.academicStatus || 'Active') === filters.status;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [subjects, searchTerm, filters]);

    const handleCopy = () => {
        const dataToExport = selectedRows.length > 0
            ? filteredSubjects.filter(sub => selectedRows.includes(sub.id))
            : filteredSubjects;

        const headers = ['ID', 'Subject', 'Code', 'Type', 'Status'];
        const textToCopy = headers.join('\t') + '\n' +
            dataToExport.map(sub => `${sub.id}\t${sub.name}\t${sub.code}\t${sub.type}\t${sub.academicStatus || 'Active'}`).join('\n');

        navigator.clipboard.writeText(textToCopy);
        alert(`Copied ${dataToExport.length} rows to clipboard!`);
    };

    const handleExportCSV = () => {
        const dataToExport = selectedRows.length > 0
            ? filteredSubjects.filter(sub => selectedRows.includes(sub.id))
            : filteredSubjects;

        const headers = ['ID', 'Subject', 'Code', 'Type', 'Status'];
        const csvContent = headers.join(",") + "\n"
            + dataToExport.map(sub => `${sub.id},"${sub.name}",${sub.code},${sub.type},${sub.academicStatus || 'Active'}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `academic_subjects_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        handleExportCSV(); // CSV is commonly used for Excel compatibility
    };

    const handleExportPDF = () => {
        window.print();
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleStatus = (sub) => {
        const newStatus = sub.academicStatus === 'Inactive' ? 'Active' : 'Inactive';
        updateSubject(sub.id, { ...sub, academicStatus: newStatus });
    };

    return (
        <div className="academics-page" style={{ padding: '28px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', width: '100%' }}>
                {/* Page Header */}
                <div className="page-header animate-slide-down">
                    <div className="page-title">
                        <h4>Subjects</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span>Academics</span> / <span className="current">Subjects</span>
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
                            onClick={() => navigate('/school/academics/subjects/add')}
                            className="btn btn-primary"
                        >
                            <IconPlus size={18} />
                            Add Subject
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="card soft-card p-0">
                    {/* Toolbar */}
                    <div className="table-toolbar-wrapper border-b border-gray-50 bg-gray-50/5 p-4 animate-slide-up">
                        <div className="toolbar-search !flex-1">
                            <IconSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input-field"
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button onClick={handleCopy} className="toolbar-btn">
                                Copy
                            </button>
                            <button onClick={handleExportCSV} className="toolbar-btn">
                                CSV
                            </button>
                            <button onClick={handleExportExcel} className="toolbar-btn">
                                Excel
                            </button>
                            <button onClick={handleExportPDF} className="toolbar-btn">
                                PDF
                            </button>
                            <button onClick={handlePrint} className="toolbar-btn">
                                Print
                            </button>
                            <div className="filter-dropdown-container ml-2">
                                <button
                                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                                    className={`filter-dropdown ${showFilterMenu ? 'active' : ''}`}
                                >
                                    <IconFilter size={16} /> Filter <IconChevronDown size={14} />
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
                                                            <span>{col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="filter-group-vertical">
                                                <label>Subject Type</label>
                                                <select
                                                    className="filter-select"
                                                    value={tempFilters.type}
                                                    onChange={(e) => setTempFilters({ ...tempFilters, type: e.target.value })}
                                                >
                                                    <option value="">All Types</option>
                                                    <option value="Theory">Theory</option>
                                                    <option value="Practical">Practical</option>
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
                        </div>
                    </div>

                    {/* Table Stats */}
                    <div className="table-stats">
                        <span><strong>{filteredSubjects.length}</strong> subjects {selectedRows.length > 0 && <strong>| {selectedRows.length} selected</strong>}</span>
                    </div>

                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="w-12">
                                    <input
                                        type="checkbox"
                                        className="premium-checkbox"
                                        onChange={handleSelectAll}
                                        checked={filteredSubjects.length > 0 && selectedRows.length === filteredSubjects.length}
                                    />
                                </th>
                                {visibleColumns.id && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            ID <IconSelector size={14} className="opacity-50" />
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.name && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            Subject <IconSelector size={14} className="opacity-50" />
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.code && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            Code <IconSelector size={14} className="opacity-50" />
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.type && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            Type <IconSelector size={14} className="opacity-50" />
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
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map((sub, index) => (
                                    <tr
                                        key={sub.id}
                                        className="hover:bg-gray-50/30 transition-colors animate-slide-up opacity-0"
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                                    >
                                        <td className="p-6">
                                            <input
                                                type="checkbox"
                                                className="premium-checkbox"
                                                checked={selectedRows.includes(sub.id)}
                                                onChange={() => toggleSelectRow(sub.id)}
                                            />
                                        </td>
                                        {visibleColumns.id && <td className="p-6">{sub.id}</td>}
                                        {visibleColumns.name && <td className="p-6 font-medium text-gray-800">{sub.name}</td>}
                                        {visibleColumns.code && <td className="p-6 font-medium text-gray-600">{sub.code}</td>}
                                        {visibleColumns.type && (
                                            <td className="p-6">
                                                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${sub.type === 'Theory' ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'}`}>
                                                    {sub.type}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.status && (
                                            <td className="p-6">
                                                <span
                                                    className={sub.academicStatus === 'Inactive' ? "status-badge-inactive" : "status-badge-active"}
                                                    onClick={() => toggleStatus(sub)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to toggle status"
                                                >
                                                    {sub.academicStatus || 'Active'}
                                                </span>
                                            </td>
                                        )}
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => setViewingSubject(sub)}
                                                    className="action-icon-btn btn-action-view"
                                                >
                                                    <IconEye size={18} stroke={2} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/school/academics/subjects/edit/${sub.id}`)}
                                                    className="action-icon-btn btn-action-edit"
                                                >
                                                    <IconPencil size={18} stroke={2} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub.id)}
                                                    className="action-icon-btn btn-action-delete"
                                                >
                                                    <IconTrash size={18} stroke={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={Object.values(visibleColumns).filter(v => v).length + 2} className="p-20 text-center text-gray-400 italic">
                                        No subjects found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal - Premium Refactor */}
            {viewingSubject && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 font-sans" onClick={() => setViewingSubject(null)}>
                    <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        {/* Premium Header */}
                        <div className="bg-[#3d5ee1] p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                    <IconBook size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-white leading-tight">Subject Details</h2>
                                    <p className="text-blue-100 text-xs font-normal mt-1">Viewing profile for {viewingSubject.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingSubject(null)}
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
                                {/* Info Groups */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="animate-slide-up delay-100 opacity-0">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Subject ID</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingSubject.id}</div>
                                    </div>
                                    <div className="animate-slide-up delay-200 opacity-0">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Subject Code</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingSubject.code}</div>
                                    </div>
                                </div>

                                <div className="animate-slide-up delay-300 opacity-0">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Type</label>
                                    <div className="text-slate-600 font-medium text-lg">{viewingSubject.type}</div>
                                </div>

                                <div className="animate-slide-up delay-400 opacity-0">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${viewingSubject.academicStatus === 'Inactive' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                                        {viewingSubject.academicStatus || 'Active'}
                                    </span>
                                </div>

                                {viewingSubject.description && (
                                    <div className="animate-slide-up delay-500 opacity-0">
                                        <label className="text-xs font-medium text-blue-500 uppercase tracking-wider block mb-2">Description</label>
                                        <p className="text-sm text-slate-500 italic">"{viewingSubject.description}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 animate-slide-up delay-500 opacity-0">
                                <button
                                    onClick={() => {
                                        setViewingSubject(null);
                                        navigate(`/school/academics/subjects/edit/${viewingSubject.id}`);
                                    }}
                                    className="flex-1 py-3 px-4 bg-[#3d5ee1] hover:bg-[#2b4fc4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                                >
                                    <IconPencil size={18} />
                                    Edit Subject
                                </button>
                                <button
                                    onClick={() => setViewingSubject(null)}
                                    className="flex-1 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition-all hover:border-slate-300 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
