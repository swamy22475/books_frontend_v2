import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconEdit, IconTrash,
    IconCalendar, IconClock, IconMapPin, IconChevronLeft, IconDownload,
    IconChevronDown, IconFileTypePdf, IconFileTypeXls, IconFilter,
    IconCopy, IconFileSpreadsheet, IconFileTypeCsv, IconPrinter, IconCheck
} from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { StudentContext } from '../../../context/StudentContext';
import { ScheduleContext } from '../../../context/ScheduleContext';
import '../Transport/ManageStudentTransport.css';
import './ExamSchedule.css';

const ExamSchedule = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        exam: true,
        classSection: true,
        subject: true,
        dateTime: true,
        roomNo: true,
        action: true
    });

    const [formData, setFormData] = useState({
        exam: '',
        class: '',
        section: '',
        subject: '',
        date: '',
        timeFrom: '',
        timeTo: '',
        roomNo: ''
    });

    const { schedules, addSchedule, updateSchedule, deleteSchedule } = React.useContext(ScheduleContext);

    const classesList = ['1st class', '2nd class', '3rd class', '4th class', '5th class', '6th class', '7th class', '8th class', '9th class', '10th class'];
    const sectionsList = ['A', 'B', 'C'];
    const examsList = ['FA-1', 'FA-2', 'SA-1', 'SA-2'];
    const subjectsList = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi', 'Telugu'];

    const filteredData = schedules.filter(item => {
        const matchesClass = selectedClass ? item.class === selectedClass : true;
        const matchesSection = selectedSection ? item.section === selectedSection : true;
        const matchesSearch = item.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClass && matchesSection && matchesSearch;
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumn = (col) => {
        setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            exam: '',
            class: selectedClass || '',
            section: selectedSection || '',
            subject: '',
            date: '',
            timeFrom: '',
            timeTo: '',
            roomNo: ''
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setFormData({ ...item });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateSchedule(editingId, { id: editingId, ...formData });
        } else {
            addSchedule({
                id: Date.now(), // Use timestamp for unique ID
                ...formData
            });
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            deleteSchedule(id);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const text = filteredData.map((item, index) =>
            `${index + 1}\t${item.exam}\t${item.class}(${item.section})\t${item.subject}\t${item.date} ${item.timeFrom}-${item.timeTo}\t${item.roomNo}`
        ).join('\n');
        navigator.clipboard.writeText(`ID\tExam\tClass(Section)\tSubject\tDate & Time\tRoom No\n${text}`);
        alert('Table data copied to clipboard!');
    };

    const handleExportExcel = () => {
        const headers = ['ID', 'Exam', 'Class(Section)', 'Subject', 'Date & Time', 'Room No'];
        const rows = filteredData.map((item, index) => [
            index + 1,
            item.exam,
            `${item.class}(${item.section})`,
            item.subject,
            `${item.date} ${item.timeFrom}-${item.timeTo}`,
            item.roomNo
        ]);
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
        XLSX.writeFile(wb, 'exam-schedule.xlsx');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Exam Schedule Report', 14, 15);
        autoTable(doc, {
            head: [['ID', 'Exam', 'Class(Section)', 'Subject', 'Date & Time', 'Room No']],
            body: filteredData.map((item, index) => [
                index + 1,
                item.exam,
                `${item.class}(${item.section})`,
                item.subject,
                `${item.date} ${item.timeFrom}-${item.timeTo}`,
                item.roomNo
            ]),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [61, 94, 225] }
        });
        doc.save('exam-schedule.pdf');
    };

    const handleExportCSV = () => {
        const headers = ['#', 'Exam', 'Class(Section)', 'Subject', 'Date & Time', 'Room No'];
        const rows = filteredData.map((item, index) => [
            index + 1,
            item.exam,
            `${item.class}(${item.section})`,
            item.subject,
            `${item.date} ${item.timeFrom}-${item.timeTo}`,
            item.roomNo
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'exam-schedule.csv';
        link.click();
    };

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">
                    <button className="back-btn" onClick={() => navigate('/school/exam/dashboard')}>
                        <IconChevronLeft size={20} />
                    </button>
                    <h4>Exam Schedule</h4>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Exam</span> / <span className="current">Schedule</span>
                    </nav>
                </div>
                <button className="btn-primary" onClick={() => navigate('/school/exam/schedule/add')}>
                    <IconPlus size={18} />
                    Add Schedule
                </button>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', background: 'var(--bg-card)', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap', fontSize: '16px' }}>Exam Schedule List</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '10px', height: '40px', width: '300px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={20} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search schedule..."
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '13px',
                                    outline: 'none',
                                    padding: '0',
                                    height: '100%',
                                    width: '100%',
                                    boxShadow: 'none'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
                        <div className="export-button-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button className="export-btn-minimal" onClick={handleCopy} title="Copy" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', padding: '4px' }}>
                                <IconCopy size={18} color="var(--primary)" />
                                <span>Copy</span>
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportCSV} title="CSV" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', padding: '4px' }}>
                                <IconFileTypeCsv size={18} color="var(--primary)" />
                                <span>CSV</span>
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportExcel} title="Excel" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', padding: '4px' }}>
                                <IconFileSpreadsheet size={18} color="var(--primary)" />
                                <span>Excel</span>
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportPDF} title="PDF" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', padding: '4px' }}>
                                <IconFileTypePdf size={18} color="var(--primary)" />
                                <span>PDF</span>
                            </button>
                            <button className="export-btn-minimal" onClick={handlePrint} title="Print" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', padding: '4px' }}>
                                <IconPrinter size={18} color="var(--primary)" />
                                <span>Print</span>
                            </button>
                        </div>

                        <div className="filter-dropdown-wrapper" ref={filterRef} style={{ position: 'relative' }}>
                            <div
                                className={`filter-btn-pill ${showFilterDropdown ? 'active' : ''}`}
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                style={{
                                    cursor: 'pointer',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    padding: '8px 20px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s',
                                    boxShadow: showFilterDropdown ? '0 0 0 2px var(--primary-light)' : 'none'
                                }}
                            >
                                <IconFilter size={18} color="var(--primary)" />
                                <span>Filter</span>
                                <IconChevronDown size={14} style={{ transform: showFilterDropdown ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </div>

                            {showFilterDropdown && (
                                <div className="column-filter-dropdown" style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    zIndex: 100,
                                    width: '320px',
                                    padding: '20px',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}>
                                    <h5 style={{ margin: '0 0 15px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Advanced Filters</h5>

                                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DATA FILTERS</p>
                                    <div className="filter-grid-premium" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                        <div className="custom-select-container" style={{ position: 'relative' }}>
                                            <select
                                                className="custom-select-premium"
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', appearance: 'none', fontSize: '13px' }}
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                            >
                                                <option value="">All Classes</option>
                                                {classesList.map((cls, idx) => (
                                                    <option key={idx} value={cls}>{cls}</option>
                                                ))}
                                            </select>
                                            <IconChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                                        </div>
                                        <div className="custom-select-container" style={{ position: 'relative' }}>
                                            <select
                                                className="custom-select-premium"
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', appearance: 'none', fontSize: '13px' }}
                                                value={selectedSection}
                                                onChange={(e) => setSelectedSection(e.target.value)}
                                            >
                                                <option value="">All Sections</option>
                                                {sectionsList.map((sec, idx) => (
                                                    <option key={idx} value={sec}>{sec}</option>
                                                ))}
                                            </select>
                                            <IconChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                                        </div>
                                    </div>

                                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SHOW COLUMNS</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {Object.keys(visibleColumns).map(col => (
                                            <div
                                                key={col}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                                onClick={() => toggleColumn(col)}
                                            >
                                                <div style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '4px',
                                                    border: `2px solid ${visibleColumns[col] ? 'var(--primary)' : 'var(--border-color)'}`,
                                                    background: visibleColumns[col] ? 'var(--primary)' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: '0.2s'
                                                }}>
                                                    {visibleColumns[col] && <IconCheck size={12} color="white" />}
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                                    {col === 'id' ? 'ID' : col === 'classSection' ? 'Class' : col === 'dateTime' ? 'Date' : col}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn-link"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--error)',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                setSelectedClass('');
                                                setSelectedSection('');
                                                setSearchTerm('');
                                            }}
                                        >
                                            Reset All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-wrap px-0">
                        <table className="premium-table-v2">
                            <thead>
                                <tr>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.exam && <th>Exam</th>}
                                    {visibleColumns.classSection && <th>Class (Section)</th>}
                                    {visibleColumns.subject && <th>Subject</th>}
                                    {visibleColumns.dateTime && <th>Date & Time</th>}
                                    {visibleColumns.roomNo && <th>Room No</th>}
                                    {visibleColumns.action && <th className="text-center">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id} className="table-row-v2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            {visibleColumns.id && <td style={{ color: 'var(--text-primary)' }}>{index + 1}</td>}
                                            {visibleColumns.exam && <td><div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.exam}</div></td>}
                                            {visibleColumns.classSection && (
                                                <td>
                                                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{item.class} ({item.section})</span>
                                                </td>
                                            )}
                                            {visibleColumns.subject && (
                                                <td>
                                                    <span className="subject-badge">
                                                        {item.subject}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.dateTime && (
                                                <td>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-medium font-center" style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                                            <IconCalendar size={14} />
                                                            {formatDate(item.date)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-center" style={{ justifyContent: 'center', color: 'var(--text-secondary)', opacity: 0.7 }}>
                                                            <IconClock size={14} />
                                                            {item.timeFrom} - {item.timeTo}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.roomNo && (
                                                <td>
                                                    <div className="flex items-center gap-2 font-center" style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                                        <IconMapPin size={14} />
                                                        {item.roomNo}
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.action && (
                                                <td className="text-center">
                                                    <div className="action-button-flex">
                                                        <button className="action-icon-btn edit" title="Edit" onClick={() => handleOpenEditModal(item)}>
                                                            <IconEdit size={16} />
                                                        </button>
                                                        <button className="action-icon-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
                                                            <IconTrash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center p-12 italic" style={{ color: 'var(--text-secondary)' }}>
                                            No exam schedules found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {
                // Added a 20px gap between the card and the modal for better visual separation.
                // The modal is now correctly positioned outside the main table card.
                showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content add-income-modal">
                            <div className="modal-header">
                                <h3>{isEditing ? 'Edit Schedule' : 'Add Schedule'}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>
                                    <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                                </button>
                            </div>
                            <form className="modal-body" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Exam <span style={{ color: '#ea5455' }}>*</span></label>
                                        <div className="custom-select-container" style={{ maxWidth: '100%' }}>
                                            <select
                                                className="custom-select-premium"
                                                required
                                                value={formData.exam}
                                                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                                            >
                                                <option value="">Select Exam</option>
                                                {examsList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                            </select>
                                            <IconChevronDown size={14} className="select-chevron-premium" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Subject <span style={{ color: '#ea5455' }}>*</span></label>
                                        <div className="custom-select-container" style={{ maxWidth: '100%' }}>
                                            <select
                                                className="custom-select-premium"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            >
                                                <option value="">Select Subject</option>
                                                {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            </select>
                                            <IconChevronDown size={14} className="select-chevron-premium" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Class <span style={{ color: '#ea5455' }}>*</span></label>
                                        <div className="custom-select-container" style={{ maxWidth: '100%' }}>
                                            <select
                                                className="custom-select-premium"
                                                required
                                                value={formData.class}
                                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                            >
                                                <option value="">Select Class</option>
                                                {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                            </select>
                                            <IconChevronDown size={14} className="select-chevron-premium" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Section <span style={{ color: '#ea5455' }}>*</span></label>
                                        <div className="custom-select-container" style={{ maxWidth: '100%' }}>
                                            <select
                                                className="custom-select-premium"
                                                required
                                                value={formData.section}
                                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            >
                                                <option value="">Select Section</option>
                                                {sectionsList.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                            </select>
                                            <IconChevronDown size={14} className="select-chevron-premium" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Date <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Time <span style={{ color: '#ea5455' }}>*</span></label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.timeFrom}
                                            onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Time <span style={{ color: '#ea5455' }}>*</span></label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.timeTo}
                                            onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Room No <span style={{ color: '#ea5455' }}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 101"
                                        required
                                        value={formData.roomNo}
                                        onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit">
                                        {isEditing ? 'Save Changes' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ExamSchedule;
