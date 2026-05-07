import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    IconChevronLeft,
    IconSearch,
    IconCheck,
    IconX,
    IconUserCheck,
    IconUsers,
    IconFilter,
    IconRefresh,
    IconChevronDown
} from '@tabler/icons-react';
import { StudentContext } from '../../../context/StudentContext';
import '../Transport/ManageStudentTransport.css';

const AssignExam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { students } = React.useContext(StudentContext);
    const exam = location.state?.exam || { name: 'Exam' };

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const classesList = ['1st class', '2nd class', '3rd class', '4th class', '5th class', '6th class', '7th class', '8th class', '9th class', '10th class'];

    // Helper: normalize "1st class" -> "1", "10th class" -> "10"
    const getClassDigit = (className) => className.replace(/\D/g, '');

    // Derive available sections from student data for the selected class
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        const classDigit = getClassDigit(selectedClass);
        const sections = students
            .filter(s => s.class === classDigit || s.class === selectedClass)
            .map(s => s.section)
            .filter(Boolean);
        return [...new Set(sections)].sort();
    }, [selectedClass, students]);

    // Filter students when Class and Section are selected
    const filteredStudents = useMemo(() => {
        if (!selectedClass || !selectedSection) return [];
        const classDigit = getClassDigit(selectedClass);
        return students.filter(student => {
            const matchesClass = (student.class === classDigit || student.class === selectedClass);
            const matchesSection = (student.section === selectedSection);
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesClass && matchesSection && matchesSearch;
        });
    }, [selectedClass, selectedSection, students, searchTerm]);

    // Handle Individual Checkbox
    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    // Handle Select All Checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIdsInFilter = new Set(filteredStudents.map(s => s.id));
            setSelectedStudents(allIdsInFilter);
        } else {
            setSelectedStudents(new Set());
        }
    };

    // Actions
    const handleSave = () => {
        if (selectedStudents.size === 0) {
            alert('Please select students to assign.');
            return;
        }
        alert(`Successfully assigned "${exam.name}" to ${selectedStudents.size} students!`);
        navigate('/school/exam/dashboard');
    };

    const handleReset = () => {
        setSelectedClass('');
        setSelectedSection('');
        setSelectedStudents(new Set());
        setSearchTerm('');
    };

    const isAllSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.id));

    return (
        <div className="accounts-page fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">
                    <div className="back-button-wrapper" onClick={() => navigate('/school/exam/dashboard')}>
                        <IconChevronLeft size={20} />
                        <div style={{ marginLeft: '10px' }}>
                            <h4>Assign Exam: <span style={{ color: '#4f46e5' }}>{exam.name}</span></h4>
                            <nav className="breadcrumb">
                                <span>Dashboard</span> / <span>Exam</span> / <span className="current">Assign</span>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="page-header-actions invisible-actions">
                    {/* Actions moved to bottom-right fixed container */}
                </div>
            </div>

            {/* Filter Section - Premium Redesign */}
            <div className="card shadow-soft border-0 overflow-hidden mb-6">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Selection Filters</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="flex gap-4 items-center flex-1">
                        <select
                            className="export-btn"
                            style={{ height: '48px', borderRadius: '24px', paddingLeft: '20px', paddingRight: '40px', appearance: 'none', minWidth: '180px' }}
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSection('');
                                setSelectedStudents(new Set());
                            }}
                        >
                            <option value="">Select Class</option>
                            {classesList.map((cls, idx) => (
                                <option key={idx} value={cls}>{cls}</option>
                            ))}
                        </select>

                        <select
                            className="export-btn"
                            style={{ height: '48px', borderRadius: '24px', paddingLeft: '20px', paddingRight: '40px', appearance: 'none', minWidth: '180px' }}
                            value={selectedSection}
                            disabled={!selectedClass}
                            onChange={(e) => {
                                setSelectedSection(e.target.value);
                                setSelectedStudents(new Set());
                            }}
                        >
                            <option value="">{selectedClass ? 'Select Section' : 'Choose Class...'}</option>
                            {availableSections.map((sec) => (
                                <option key={sec} value={sec}>Section {sec}</option>
                            ))}
                        </select>

                        <div className="search-pill-wrapper flex-1 max-w-md">
                            <IconSearch size={18} className="search-icon-pill" />
                            <input
                                type="text"
                                className="search-input-pill"
                                placeholder="Search by name or admission ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="export-button-group">
                        <button className="export-btn" onClick={handleReset}>
                            <IconRefresh size={16} />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Student Table */}
            <div className="card shadow-soft border-0 overflow-hidden mb-6">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Student List</h4>
                </div>

                <div className="card-body p-0">
                    {!selectedClass || !selectedSection ? (
                        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
                            <div className="flex justify-center mb-4 text-slate-200">
                                <IconFilter size={48} />
                            </div>
                            <h6 className="text-slate-600 font-semibold mb-2">Select a Class and Section to begin</h6>
                            <p className="text-slate-400 text-sm">Fill in the criteria above to filter the student list.</p>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <div className="table-wrap px-0">
                            <table className="premium-table-v2">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: '80px' }}>
                                            <div className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                    id="selectAll"
                                                />
                                                <label htmlFor="selectAll"></label>
                                            </div>
                                        </th>
                                        <th>Adm No.</th>
                                        <th>Student Name</th>
                                        <th>Roll No.</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="table-row-v2">
                                            <td className="text-center">
                                                <div className="custom-checkbox mx-auto">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.has(student.id)}
                                                        onChange={() => handleSelectStudent(student.id)}
                                                        id={`s-${student.id}`}
                                                    />
                                                    <label htmlFor={`s-${student.id}`}></label>
                                                </div>
                                            </td>
                                            <td className="font-semibold text-slate-500">{student.id}</td>
                                            <td>
                                                <div className="font-semibold text-slate-700">{student.name}</div>
                                                <div className="text-xs text-slate-400">{student.gender}</div>
                                            </td>
                                            <td className="text-slate-600">{student.rollNo}</td>
                                            <td className="text-center">
                                                {selectedStudents.has(student.id) ? (
                                                    <span className="text-green-600 font-bold text-xs inline-flex items-center gap-1">
                                                        <IconCheck size={14} /> Assigned
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 font-medium text-xs">
                                                        Not Selected
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '16px', opacity: 0.5 }}>
                                <IconX size={48} />
                            </div>
                            <h6 style={{ color: '#64748b', fontWeight: 500 }}>No students found</h6>
                            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Try adjusting your search or selection filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Bottom-Right Action Corner */}
            <div className="fixed-action-corner">
                <button className="btn-cancel-custom" onClick={handleReset}>
                    Cancel
                </button>
                <button
                    className="btn-assign-custom"
                    onClick={handleSave}
                    disabled={selectedStudents.size === 0}
                >
                    Assign to all ({selectedStudents.size})
                </button>
            </div>

            <style>{`
                .back-button-wrapper {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-button-wrapper:hover {
                    color: #4f46e5;
                }
                .form-select-premium {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #1e293b;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .form-select-premium:focus {
                    border-color: #4f46e5;
                }
                .search-input-wrapper {
                    position: relative;
                }
                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    z-index: 10;
                }
                .search-field {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px 0 44px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s ease;
                    background: #ffffff;
                }
                .search-field:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05);
                }
                .custom-checkbox input {
                    display: none;
                }
                .custom-checkbox label {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #cbd5e1;
                    border-radius: 6px;
                    display: block;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                }
                .custom-checkbox input:checked + label {
                    background: #4f46e5;
                    border-color: #4f46e5;
                }
                .custom-checkbox input:checked + label::after {
                    content: '✓';
                    color: white;
                    font-size: 12px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                .btn-outline {
                    padding: 10px 18px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    color: #475569;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-outline:hover {
                    border-color: #cbd5e1;
                    background: #f8fafc;
                }
                .fixed-action-corner {
                    position: fixed;
                    right: 40px;
                    bottom: 40px;
                    display: flex;
                    gap: 12px;
                    padding: 8px;
                    z-index: 1000;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .btn-cancel-custom {
                    padding: 0 28px;
                    height: 48px;
                    border-radius: 10px;
                    border: none;
                    background: #f1f5f9;
                    color: #2563eb;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-cancel-custom:hover {
                    background: #e2e8f0;
                }
                .btn-assign-custom {
                    padding: 0 32px;
                    height: 48px;
                    border-radius: 10px;
                    border: none;
                    background: #3b82f6;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
                }
                .btn-assign-custom:hover:not(:disabled) {
                    background: #2563eb;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
                }
                .btn-assign-custom:disabled {
                    background: #93c5fd;
                    cursor: not-allowed;
                }
                .invisible-actions {
                    display: none;
                }
                @media (max-width: 640px) {
                    .fixed-action-corner {
                        right: 15px;
                        bottom: 15px;
                        left: 15px;
                        gap: 10px;
                    }
                    .btn-cancel-custom, .btn-assign-custom {
                        flex: 1;
                        padding: 0 10px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AssignExam;
