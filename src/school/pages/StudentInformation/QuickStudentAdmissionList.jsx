import React, { useContext, useState } from 'react';
import { StudentContext } from '../../../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import './QuickStudentAdmissionList.css';
import { EditIcon, BanIcon, SortIcon, PlaceholderAvatar, DeleteIcon } from '../../../components/Icons';
import StudentPageContainer from './components/StudentPageContainer';

const QuickStudentAdmissionList = () => {
    const navigate = useNavigate();
    const { quickAdmissionStudents, deleteQuickAdmissionStudent } = useContext(StudentContext);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    // Handle checkbox selection
    const handleRowCheckboxChange = (studentId) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    // Handle select all checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredStudents.map(s => s.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    // Filter students based on search query
    const filteredStudents = quickAdmissionStudents.filter(s => {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
        return (
            fullName.includes(searchLower) ||
            (s.phone || '').toLowerCase().includes(searchLower) ||
            (s.class || s.className || '').toLowerCase().includes(searchLower) ||
            (s.section || '').toLowerCase().includes(searchLower)
        );
    });

    const isAllSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.has(s.id));

    // Export functions
    const handleExportCopy = () => {
        const data = filteredStudents
            .filter(s => selectedIds.has(s.id))
            .map(s => `${`${s.firstName} ${s.lastName}`.trim()}\t${s.class}\t${s.section}\t${s.rollNo}\t${s.phone}`)
            .join('\n');
        navigator.clipboard.writeText(data);
        alert('Copied to clipboard');
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Class', 'Section', 'Roll No', 'Phone', 'Father Name'];
        const rows = filteredStudents
            .filter(s => selectedIds.has(s.id))
            .map(s => [
                `${s.firstName} ${s.lastName}`.trim(),
                s.class || s.className,
                s.section,
                s.rollNo,
                s.phone,
                s.fatherName
            ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        downloadFile(csv, 'quick-admission-students.csv', 'text/csv');
    };

    const handleExportExcel = () => {
        alert('Excel export functionality would be added with a library like xlsx');
    };

    const handleExportPDF = () => {
        alert('PDF export functionality would be added with a library like jspdf');
    };

    const handlePrint = () => {
        window.print();
    };

    const downloadFile = (content, filename, type) => {
        const element = document.createElement('a');
        element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const addStudentBtn = (
        <button
            onClick={() => navigate('/school/quick-admission/add')}
            className="btn btn-primary"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Student Admission
        </button>
    );

    return (
        <StudentPageContainer
            title="Quick Student Admission"
            breadcrumb={<><span>Student Management</span> / <span className="current">Quick Admission</span></>}
            backTitle="Go back to Student Information"
            pageClass="qa-list-page"
            actions={addStudentBtn}
        >

            {/* Empty State or Table */}
            {quickAdmissionStudents.length === 0 ? (
                <div className="empty-state-container">
                    <div className="empty-state-card">
                        <div className="empty-state-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3>No Students Yet</h3>
                        <p>Start by adding your first student through quick admission</p>
                        <button
                            onClick={() => navigate('/school/quick-admission/add')}
                            className="btn btn-primary btn-large"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add First Student
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card soft-card fade-in">
                    {/* Table Toolbar with Search and Export */}
                    <div className="table-toolbar-wrapper">
                        <div className="toolbar-search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, class, section..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input-field"
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button className="toolbar-btn" title="Copy Selected" onClick={handleExportCopy} disabled={selectedIds.size === 0}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                                Copy
                            </button>
                            <button className="toolbar-btn" title="Export as CSV" onClick={handleExportCSV} disabled={selectedIds.size === 0}>
                                CSV
                            </button>
                            <button className="toolbar-btn" title="Export as Excel" onClick={handleExportExcel} disabled={selectedIds.size === 0}>
                                Excel
                            </button>
                            <button className="toolbar-btn" title="Export as PDF" onClick={handleExportPDF} disabled={selectedIds.size === 0}>
                                PDF
                            </button>
                            <button className="toolbar-btn" title="Print" onClick={handlePrint}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                    <rect x="6" y="14" width="12" height="8"></rect>
                                </svg>
                                Print
                            </button>
                        </div>
                    </div>

                    <div className="table-stats">
                        <span><strong>{filteredStudents.length}</strong> students | {selectedIds.size > 0 && <strong>{selectedIds.size} selected</strong>}</span>
                    </div>

                    <div className="table-wrap">
                        <table className="fee-types-table qa-table">
                            <thead>
                                <tr>
                                    <th className="col-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            title="Select all students"
                                        />
                                    </th>
                                    <th className="col-photo">Photo</th>
                                    <th className="col-name">Name <SortIcon /></th>
                                    <th className="col-class">Class <SortIcon /></th>
                                    <th className="col-section">Section</th>
                                    <th className="col-rollno">Roll No</th>
                                    <th className="col-phone">Phone</th>
                                    <th className="col-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--qa-text-muted)' }}>
                                            No students found matching your search
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map(s => (
                                        <tr key={s.id} className="table-row">
                                            <td className="checkbox-td">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(s.id)}
                                                    onChange={() => handleRowCheckboxChange(s.id)}
                                                />
                                            </td>
                                            <td className="photo">
                                                {s.photoPreview || s.image ? (
                                                    <img src={s.photoPreview || s.image} alt={s.name} className="avatar" />
                                                ) : (
                                                    <PlaceholderAvatar gender={s.gender} size={40} />
                                                )}
                                            </td>
                                            <td className="name">{`${s.firstName} ${s.lastName}`.trim() || '—'}</td>
                                            <td className="class">{s.class || s.className || '—'}</td>
                                            <td className="section">{s.section || '—'}</td>
                                            <td className="rollno">{s.rollNo || '—'}</td>
                                            <td className="phone">{s.phone || '—'}</td>
                                            <td className="actions">
                                                <button className="icon-btn icon-edit" title="Edit" onClick={() => navigate(`/school/quick-admission/${s.id}`)}>
                                                    <EditIcon />
                                                </button>
                                                <button className="icon-btn icon-delete" title="Delete" onClick={() => deleteQuickAdmissionStudent(s.id)}>
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </StudentPageContainer>
    );
};

export default QuickStudentAdmissionList;
