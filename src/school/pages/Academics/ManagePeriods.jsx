import React, { useContext, useState } from 'react';
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
    IconSelector,
    IconFilter,
    IconChevronDown,
    IconStar,
    IconUsers
} from '@tabler/icons-react';
import './Academics.css';

const ManagePeriods = () => {
    const { periods, deletePeriod } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [viewingPeriod, setViewingPeriod] = useState(null);

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({ status: '' });
    const [tempFilters, setTempFilters] = useState({ status: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        startTime: true,
        endTime: true,
        status: true
    });

    const filteredPeriods = periods.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.endTime.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !filters.status || (p.academicStatus || 'Active') === filters.status;

        return matchesSearch && matchesStatus;
    });

    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setShowFilterMenu(false);
    };

    const handleResetFilters = () => {
        const reset = { status: '' };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilterMenu(false);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredPeriods.map(p => p.id));
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
        const text = filteredPeriods.map(p => `${p.id}\t${p.name}\t${p.startTime}\t${p.endTime}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Table data copied to clipboard!');
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Period Name', 'Start Time', 'End Time', 'Status'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + filteredPeriods.map(p => `${p.id},"${p.name}",${p.startTime},${p.endTime},Active`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "academic_periods.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleExportExcel = () => {
        alert('Export to Excel functionality not yet implemented.');
    };

    const handleExportPDF = () => {
        alert('Export to PDF functionality not yet implemented.');
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleStatus = (period) => {
        const newStatus = period.academicStatus === 'Inactive' ? 'Active' : 'Inactive';
        if (window.confirm(`Are you sure you want to change the status of period "${period.name}" to "${newStatus}"?`)) {
            updatePeriod(period.id, { ...period, academicStatus: newStatus });
        }
    };

    return (
        <div className="academics-page">
            <div style={{ maxWidth: 'none', width: '100%', padding: '28px 20px' }}>
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <h4>Academic Period Slots</h4>
                        <nav className="breadcrumb">
                            <span>Dashboard</span> / <span>Academics</span> / <span className="current">Manage Periods</span>
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
                            onClick={() => navigate('/school/academics/manage-periods/add')}
                            className="btn btn-primary"
                        >
                            <IconPlus size={18} />
                            Add Period
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="card soft-card fade-in">
                    {/* Toolbar */}
                    <div className="table-toolbar-wrapper">
                        <div className="toolbar-search">
                            <IconSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search periods..."
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
                                                            <span>{col === 'startTime' ? 'Start Time' : col === 'endTime' ? 'End Time' : col.charAt(0).toUpperCase() + col.slice(1)}</span>
                                                        </label>
                                                    ))}
                                                </div>
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
                        <span><strong>{filteredPeriods.length}</strong> records {selectedRows.length > 0 && <strong>| {selectedRows.length} selected</strong>}</span>
                    </div>

                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="w-12">
                                    <input
                                        type="checkbox"
                                        className="premium-checkbox"
                                        onChange={handleSelectAll}
                                        checked={filteredPeriods.length > 0 && selectedRows.length === filteredPeriods.length}
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
                                            Period Name <IconSelector size={14} className="opacity-50" />
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.startTime && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            Start Time <IconSelector size={14} className="opacity-50" />
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.endTime && (
                                    <th>
                                        <div className="flex items-center gap-2">
                                            End Time <IconSelector size={14} className="opacity-50" />
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
                            {filteredPeriods.length > 0 ? (
                                filteredPeriods.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="premium-checkbox"
                                                checked={selectedRows.includes(p.id)}
                                                onChange={() => toggleSelectRow(p.id)}
                                            />
                                        </td>
                                        {visibleColumns.id && <td>{p.id}</td>}
                                        {visibleColumns.name && (
                                            <td>
                                                <span className="font-semibold text-gray-800">{p.name}</span>
                                            </td>
                                        )}
                                        {visibleColumns.startTime && <td>{p.startTime}</td>}
                                        {visibleColumns.endTime && <td>{p.endTime}</td>}
                                        {visibleColumns.status && (
                                            <td>
                                                <span
                                                    className={p.academicStatus === 'Inactive' ? "status-badge-inactive" : "status-badge-active"}
                                                    onClick={() => toggleStatus(p)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to toggle status"
                                                >
                                                    {p.academicStatus || 'Active'}
                                                </span>
                                            </td>
                                        )}
                                        <td>
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => setViewingPeriod(p)}
                                                    className="action-icon-btn btn-action-view"
                                                >
                                                    <IconEye size={18} stroke={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/school/academics/manage-periods/edit/${p.id}`)}
                                                    className="action-icon-btn btn-action-edit"
                                                >
                                                    <IconPencil size={18} stroke={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this period?')) {
                                                            deletePeriod(p.id);
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
                                            No periods found matching your search.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="px-6 py-8 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
                        <span className="text-sm font-bold text-gray-400">Showing {filteredPeriods.length} records</span>
                        <div className="flex items-center gap-2">
                            <button className="px-5 py-2 border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-gray-300" disabled>Previous</button>
                            <button className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20">1</button>
                            <button className="px-5 py-2 border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-gray-300" disabled>Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal - Premium Refactor */}
            {viewingPeriod && (
                <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 font-sans" onClick={() => setViewingPeriod(null)}>
                    <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl text-center border border-slate-200 relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setViewingPeriod(null)}
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
                            Period Details
                        </h1>
                        <p className="text-slate-500 mb-10 font-medium">
                            Details for period slot <span className="text-blue-600 font-bold">{viewingPeriod.name}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID</span>
                                <span className="text-slate-700 font-bold">#{viewingPeriod.id}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Period Name</span>
                                <span className="text-slate-700 font-bold">{viewingPeriod.name}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</span>
                                <span className="text-slate-700 font-bold">{viewingPeriod.startTime}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</span>
                                <span className="text-slate-700 font-bold">{viewingPeriod.endTime}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${viewingPeriod.academicStatus === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {viewingPeriod.academicStatus || 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setViewingPeriod(null);
                                    navigate(`/school/academics/manage-periods/edit/${viewingPeriod.id}`);
                                }}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <IconPencil size={20} stroke={2.5} />
                                Edit Period
                            </button>
                            <button
                                onClick={() => setViewingPeriod(null)}
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

export default ManagePeriods;
