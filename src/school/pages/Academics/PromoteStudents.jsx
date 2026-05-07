import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconHome,
    IconArrowUpCircle,
    IconDeviceDesktop,
    IconSearch,
    IconUserCheck,
    IconAlertCircle,
    IconCopy,
    IconFileText,
    IconTable,
    IconFile,
    IconPrinter,
    IconSelector,
    IconEye,
    IconPencil,
    IconFilter,
    IconChevronDown,
    IconStar
} from '@tabler/icons-react';
import './Academics.css';

const PromoteStudents = () => {
    const { classes, sections, students, periods, promoteStudents, updateStudent } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [filter, setFilter] = useState({
        currentClass: '',
        currentSection: '',
        currentPeriodId: '',
        promoteClass: '',
        promoteSection: '',
        promotePeriodId: ''
    });
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openStatusId, setOpenStatusId] = useState(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setOpenStatusId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleStatusUpdate = (id, newStatus) => {
        updateStudent(id, { status: newStatus });
        setOpenStatusId(null);
    };

    // Filter States
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        admissionNo: true,
        rollNo: true,
        name: true,
        academicStatus: true
    });

    // Filter students based on current selection
    const cohort = students.filter(s =>
        s.classId === parseInt(filter.currentClass) &&
        s.sectionId === parseInt(filter.currentSection)
    ).filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleCopy = () => {
        const text = cohort.map(s => `${s.roll}\t${s.name}\t${classes.find(c => c.id === s.classId)?.name}\t${sections.find(sec => sec.id === s.sectionId)?.name}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Cohort data copied to clipboard!');
    };

    const handleExportCSV = () => {
        const headers = ['Roll No', 'Student Name', 'Current Class', 'Current Section', 'Status'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + cohort.map(s => `${s.roll},"${s.name}","${classes.find(c => c.id === s.classId)?.name}","${sections.find(sec => sec.id === s.sectionId)?.name}",Eligible`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "promotion_cohort.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleExportExcel = () => {
        alert('Export to Excel not implemented yet.');
    };

    const handleExportPDF = () => {
        alert('Export to PDF not implemented yet.');
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handlePromote = () => {
        if (selectedStudents.length === 0) {
            alert('Please select at least one student to promote.');
            return;
        }
        if (!filter.promoteClass || !filter.promoteSection) {
            alert('Please select target class and section.');
            return;
        }

        promoteStudents(
            filter.currentClass,
            filter.currentSection,
            filter.promoteClass,
            filter.promoteSection,
            selectedStudents
        );

        alert(`Successfully promoted ${selectedStudents.length} students!`);
        setSelectedStudents([]);
    };

    return (
        <div className="academics-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Promote Students</h4>
                    <div className="breadcrumb">
                        <IconDeviceDesktop size={14} />
                        <span onClick={() => navigate('/school/dashboard')} className="cursor-pointer hover:text-blue-500">Dashboard</span>
                        <span className="mx-2">/</span>
                        <span onClick={() => navigate('/school/academics')} className="cursor-pointer hover:text-blue-500">Academics</span>
                        <span className="mx-2">/</span>
                        <span className="text-blue-600 font-semibold">Promote Students</span>
                    </div>
                </div>
                <div className="page-header-actions">
                    <button
                        onClick={handlePromote}
                        className="btn btn-primary flex items-center gap-2"
                        disabled={selectedStudents.length === 0}
                    >
                        <IconUserCheck size={18} />
                        {selectedStudents.length > 0 ? `Promote ${selectedStudents.length} Students` : 'Initialize Promotion Wizard'}
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="table-toolbar-wrapper !mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Promotion Actions</h3>
                    </div>
                    <div className="toolbar-actions">
                        <button onClick={handleCopy} className="export-mini-btn flex items-center gap-2">Copy</button>
                        <button onClick={handleExportCSV} className="export-mini-btn flex items-center gap-2">CSV</button>
                        <button onClick={handleExportExcel} className="export-mini-btn flex items-center gap-2">Excel</button>
                        <button onClick={handleExportPDF} className="export-mini-btn flex items-center gap-2">PDF</button>
                        <button onClick={handlePrint} className="export-mini-btn print-btn flex items-center gap-2">Print</button>
                    </div>
                </div>


                <div className="card soft-card !mb-10">
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Select Class to Promote From</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="academics-form-field !m-0">
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Current Class</label>
                                <select
                                    className="academics-form-control"
                                    value={filter.currentClass}
                                    onChange={(e) => setFilter({ ...filter, currentClass: e.target.value })}
                                >
                                    <option value="">-- Select Class --</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="academics-form-field !m-0">
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Current Section</label>
                                <select
                                    className="academics-form-control"
                                    value={filter.currentSection}
                                    onChange={(e) => setFilter({ ...filter, currentSection: e.target.value })}
                                >
                                    <option value="">{filter.currentClass ? '-- Select Section --' : '-- Select Class First --'}</option>
                                    {sections.filter(s => s.classId === parseInt(filter.currentClass)).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Cohort List */}
                {filter.currentClass && filter.currentSection && (
                    <div className="card soft-card fade-in overflow-hidden !p-0">
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h2 className="text-lg font-bold text-gray-800">{cohort.length} Students Detected</h2>
                            <div className="toolbar-actions">
                                <div className="relative toolbar-search">
                                    <IconSearch size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="search-input-field"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th className="w-16">
                                            <input
                                                type="checkbox"
                                                className="premium-checkbox"
                                                checked={selectedStudents.length === cohort.length && cohort.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedStudents(cohort.map(s => s.id));
                                                    else setSelectedStudents([]);
                                                }}
                                            />
                                        </th>
                                        {visibleColumns.rollNo && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    Roll No <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.name && (
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    Student Name <IconSelector size={14} className="opacity-50" />
                                                </div>
                                            </th>
                                        )}
                                        <th>Current Class</th>
                                        <th>Current Section</th>
                                        {visibleColumns.academicStatus && <th className="text-center">Status</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cohort.map(student => (
                                        <tr key={student.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="premium-checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => toggleStudent(student.id)}
                                                />
                                            </td>
                                            {visibleColumns.rollNo && <td className="font-semibold text-gray-500 italic">#{student.roll}</td>}
                                            {visibleColumns.name && (
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-gray-800">{student.name}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td>{classes.find(c => c.id === student.classId)?.name}</td>
                                            <td>{sections.find(s => s.id === student.sectionId)?.name}</td>
                                            <td className="text-center">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenStatusId(openStatusId === student.id ? null : student.id);
                                                        }}
                                                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all hover:opacity-80 mx-auto ${student.status === 'Eligible' ? 'text-green-600 bg-green-50' :
                                                            student.status === 'Not Eligible' ? 'text-red-600 bg-red-50' :
                                                                'text-blue-600 bg-blue-50'
                                                            }`}
                                                    >
                                                        {student.status || 'Eligible'}
                                                        <IconChevronDown size={12} className={`transition-transform duration-200 ${openStatusId === student.id ? 'rotate-180' : ''}`} />
                                                    </button>

                                                    {openStatusId === student.id && (
                                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                                            {['Eligible', 'Not Eligible', 'Promoted'].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusUpdate(student.id, status);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-between ${status === 'Eligible' ? 'text-green-600' :
                                                                        status === 'Not Eligible' ? 'text-red-600' :
                                                                            'text-blue-600'
                                                                        } ${student.status === status ? 'bg-gray-50' : ''}`}
                                                                >
                                                                    {status}
                                                                    {student.status === status && <IconUserCheck size={14} />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromoteStudents;
