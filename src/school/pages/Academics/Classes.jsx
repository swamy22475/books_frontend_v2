import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import { getTeachers } from '../Teachers/teachersData';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconHome,
    IconLayoutGrid,
    IconSearch,
    IconDotsVertical,
    IconCopy,
    IconFileText,
    IconTable,
    IconPdf,
    IconPrinter,
    IconEye,
    IconPencil,
    IconSelector,
    IconFilter,
    IconChevronDown
} from '@tabler/icons-react';
import './Academics.css';

const Classes = () => {
    const { classes, deleteClass, assignments, updateClass } = useContext(AcademicsContext);
    const teachers = getTeachers();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [viewingClass, setViewingClass] = useState(null);

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({ name: '', teacher: '', status: '' });
    const [tempFilters, setTempFilters] = useState({ name: '', teacher: '', status: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        numeric: true,
        teacher: true,
        status: true
    });
    const [openStatusId, setOpenStatusId] = useState(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-dropdown-container') && !event.target.closest('.status-dropdown-container')) {
                setShowFilterMenu(false);
                setOpenStatusId(null);
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
        const reset = { name: '', teacher: '', status: '' };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilterMenu(false);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredClasses.map(cls => cls.id));
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
            ? filteredClasses.filter(cls => selectedRows.includes(cls.id))
            : filteredClasses;

        const headers = ['ID', 'Class Name', 'Numeric', 'Teacher', 'Status'];
        const textToCopy = headers.join('\t') + '\n' +
            dataToExport.map(cls => `${cls.id}\t${cls.name}\t${cls.numeric}\t${getAssignedTeacher(cls.id)}\t${cls.academicStatus || 'Active'}`).join('\n');

        navigator.clipboard.writeText(textToCopy);
        alert(`Copied ${dataToExport.length} rows to clipboard!`);
    };

    const handleExportCSV = () => {
        const dataToExport = selectedRows.length > 0
            ? filteredClasses.filter(cls => selectedRows.includes(cls.id))
            : filteredClasses;

        const headers = ['ID', 'Class Name', 'Numeric', 'Teacher', 'Status'];
        const csvContent = headers.join(",") + "\n"
            + dataToExport.map(cls => `${cls.id},${cls.name},${cls.numeric},"${getAssignedTeacher(cls.id)}",${cls.academicStatus || 'Active'}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `academic_classes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        handleExportCSV(); // CSV is commonly used for Excel compatibility
    };

    const handleExportPDF = () => {
        window.print(); // Browser print dialog allows saving as PDF
    };

    const handlePrint = () => {
        window.print();
    };

    const handleStatusUpdate = (id, newStatus) => {
        const cls = classes.find(c => c.id === id);
        updateClass(id, { ...cls, academicStatus: newStatus });
        setOpenStatusId(null);
    };

    const toggleStatus = (cls) => {
        const newStatus = cls.academicStatus === 'Active' ? 'Inactive' : 'Active';
        updateClass(cls.id, { ...cls, academicStatus: newStatus });
    };

    const getAssignedTeacher = (classId) => {
        const cls = classes.find(c => c.id === classId);
        if (cls && cls.teacherId) {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            return teacher ? teacher.name : 'Unknown';
        }
        const assignment = assignments.find(a => parseInt(a.classId) === classId);
        if (assignment) {
            const teacher = teachers.find(t => t.id === assignment.teacherId);
            return teacher ? teacher.name : 'Unknown';
        }
        return 'Not Assigned';
    };

    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.numeric.toString().includes(searchTerm);

        const matchesName = !filters.name || cls.name === filters.name;
        const matchesTeacher = !filters.teacher || getAssignedTeacher(cls.id) === filters.teacher;
        const matchesStatus = !filters.status || (cls.academicStatus || 'Active') === filters.status;

        return matchesSearch && matchesName && matchesTeacher && matchesStatus;
    });

    return (
        <div className="academics-page" style={{ padding: '28px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', width: '100%' }}>
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <h4>Classes</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span>Academics</span> / <span className="current">Classes</span>
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
                            onClick={() => navigate('/school/academics/classes/add')}
                            className="btn btn-primary"
                        >
                            <IconPlus size={18} />
                            Add Class
                        </button>
                    </div>
                </div>

                <div className="academics-layout-header">
                    <div className="academics-header-left">
                        <h5 className="font-medium">Class List</h5>
                    </div>
                </div>

                <div className="card soft-card p-0">
                    {/* Toolbar */}
                    <div className="table-toolbar-wrapper border-b border-gray-50 bg-gray-50/5 p-4">
                        <div className="toolbar-search !flex-1">
                            <IconSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
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
                                                <label className="font-medium">Class Name</label>
                                                <select
                                                    className="filter-select"
                                                    value={tempFilters.name}
                                                    onChange={(e) => setTempFilters({ ...tempFilters, name: e.target.value })}
                                                >
                                                    <option value="">Select Class</option>
                                                    {[...new Set(classes.map(c => c.name))].map(name => (
                                                        <option key={name} value={name}>{name}</option>
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
                                <th className="font-medium">ID</th>
                                <th className="font-medium">Class Name</th>
                                <th className="font-medium">Numeric</th>
                                <th className="font-medium">Teacher</th>
                                <th className="!text-center font-medium">Status</th>
                                <th className="!text-center font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((cls, index) => (
                                <tr
                                    key={cls.id}
                                    className="hover:bg-gray-50/30 transition-colors"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="p-6">{cls.id}</td>
                                    <td className="p-6 font-medium text-gray-800">{cls.name}</td>
                                    <td className="p-6 text-gray-500 italic">{cls.numeric}</td>
                                    <td className="p-6">{teachers.find(t => t.id === parseInt(cls.teacherId))?.name || 'N/A'}</td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => toggleStatus(cls)}
                                            className={`text-xs px-3 py-1 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 border-none cursor-pointer ${cls.academicStatus === 'Inactive' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}
                                            title="Click to toggle status"
                                        >
                                            {cls.academicStatus || 'Active'}
                                        </button>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => setViewingClass(cls)} className="action-icon-btn btn-action-view !w-8 !h-8" title="View Details">
                                                <IconEye size={16} />
                                            </button>
                                            <button onClick={() => navigate(`/school/academics/classes/edit/${cls.id}`)} className="action-icon-btn btn-action-edit !w-8 !h-8" title="Edit Class">
                                                <IconPencil size={16} />
                                            </button>
                                            <button onClick={() => deleteClass(cls.id)} className="action-icon-btn btn-action-delete !w-8 !h-8" title="Delete Class">
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal - Premium Refactor */}
            {viewingClass && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 font-sans" onClick={() => setViewingClass(null)}>
                    <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>

                        {/* Premium Header */}
                        <div className="bg-[#3d5ee1] p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                    <IconLayoutGrid size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-white leading-tight">Class Details</h2>
                                    <p className="text-blue-100 text-xs font-normal mt-1">Viewing profile for {viewingClass.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingClass(null)}
                                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                            >
                                <IconTrash size={20} className="hidden" /> {/* Placeholder to keep layout if needed, or just X */}
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
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Class ID</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingClass.id}</div>
                                    </div>
                                    <div className="animate-slide-up delay-200 opacity-0">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Numeric</label>
                                        <div className="text-slate-600 font-medium text-lg">{viewingClass.numeric}</div>
                                    </div>
                                </div>

                                <div className="animate-slide-up delay-300 opacity-0">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Assigned Teacher</label>
                                    <div className="text-slate-600 font-medium text-lg">{getAssignedTeacher(viewingClass.id)}</div>
                                </div>

                                <div className="animate-slide-up delay-400 opacity-0">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${viewingClass.academicStatus === 'Inactive' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                                        {viewingClass.academicStatus || 'Active'}
                                    </span>
                                </div>

                                {viewingClass.note && (
                                    <div className="animate-slide-up delay-500 opacity-0">
                                        <label className="text-xs font-medium text-blue-500 uppercase tracking-wider block mb-2">Note</label>
                                        <p className="text-sm text-slate-500 italic">"{viewingClass.note}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 animate-slide-up delay-500 opacity-0">
                                <button
                                    onClick={() => {
                                        setViewingClass(null);
                                        navigate(`/school/academics/classes/edit/${viewingClass.id}`);
                                    }}
                                    className="flex-1 py-3 px-4 bg-[#3d5ee1] hover:bg-[#2b4fc4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                                >
                                    <IconPencil size={18} />
                                    Edit Class
                                </button>
                                <button
                                    onClick={() => setViewingClass(null)}
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

export default Classes;
