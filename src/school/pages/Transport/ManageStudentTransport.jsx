import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TransportContext } from '../../../context/TransportContext';
import { StudentContext } from '../../../context/StudentContext';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconPlus, IconSearch, IconBus, IconUsers, IconRoute, IconTrash, IconEdit,
    IconPrinter, IconFileSpreadsheet, IconFileText, IconLayoutGrid, IconList,
    IconX, IconSettings, IconFileDescription, IconCopy, IconFilter,
    IconChevronDown, IconEye, IconPencil
} from '@tabler/icons-react';
import './ManageStudentTransport.css';

const ManageStudentTransport = () => {
    const { vehicles, routes, studentTransports, addStudentTransport, updateStudentTransport, deleteStudentTransport } = useContext(TransportContext);
    const { students } = useContext(StudentContext);
    const { classes, sections } = useContext(AcademicsContext);

    const [activeTab, setActiveTab] = useState('list-bus'); // 'add', 'list-bus', 'list-class'
    const [searchTerm, setSearchTerm] = useState('');
    const [busFilter, setBusFilter] = useState('All');
    const [classFilter, setClassFilter] = useState('All');
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [showStudentResults, setShowStudentResults] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        studentId: '',
        admissionNo: '',
        classId: '',
        sectionId: '',
        vehicleId: '',
        routeId: '',
        pickupPoint: '',
        driverName: '',
        transportFee: '',
        status: 'Active',
        photoBase64: ''
    });

    const [editingId, setEditingId] = useState(null);

    // Auto-fill logic
    const handleVehicleChange = (vehicleId) => {
        const selectedVehicle = vehicles.find(v => v.id === parseInt(vehicleId));
        const matchingRoute = routes.find(r => r.vehicle === selectedVehicle?.vehicleNo);

        setFormData(prev => ({
            ...prev,
            vehicleId,
            routeId: matchingRoute ? matchingRoute.id : '',
            driverName: selectedVehicle ? selectedVehicle.driver : ''
        }));
    };

    const handleStudentChange = (student) => {
        setFormData(prev => ({
            ...prev,
            studentId: student.id,
            admissionNo: student.id,
            classId: student.class,
            sectionId: student.section
        }));
        setStudentSearchQuery(student.name);
        setShowStudentResults(false);
    };

    const filteredStudents = useMemo(() => {
        if (!studentSearchQuery || formData.studentId) return [];
        return students.filter(s =>
            s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(studentSearchQuery.toLowerCase())
        ).slice(0, 5);
    }, [students, studentSearchQuery, formData.studentId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateStudentTransport(editingId, formData);
            alert('Transport details updated successfully!');
        } else {
            addStudentTransport(formData);
            alert('Student added to transport successfully!');
        }
        resetForm();
        setActiveTab('list-bus');
    };

    const resetForm = () => {
        setFormData({
            studentId: '',
            admissionNo: '',
            classId: '',
            sectionId: '',
            vehicleId: '',
            routeId: '',
            pickupPoint: '',
            driverName: '',
            transportFee: '',
            status: 'Active',
            photoBase64: ''
        });
        setEditingId(null);
        setStudentSearchQuery('');
        setShowStudentResults(false);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photoBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (assignment) => {
        const student = students.find(s => s.id === assignment.studentId);
        setFormData(assignment);
        setEditingId(assignment.id);
        setStudentSearchQuery(student?.name || '');
        setActiveTab('add');
    };

    // Filtered / Grouped Data logic
    const enrichedAssignments = useMemo(() => {
        return studentTransports.map(st => {
            const student = students.find(s => s.id === st.studentId);
            const vehicle = vehicles.find(v => v.id === parseInt(st.vehicleId));
            const route = routes.find(r => r.id === parseInt(st.routeId));
            return {
                ...st,
                studentName: student?.name || 'Unknown',
                vehicleNo: vehicle?.vehicleNo || 'N/A',
                routeName: route?.routeName || 'N/A'
            };
        });
    }, [studentTransports, students, vehicles, routes]);

    // Derived options for filters
    const busOptions = useMemo(() => {
        const uniqueBuses = [...new Set(enrichedAssignments.map(a => a.vehicleNo))];
        return uniqueBuses.sort();
    }, [enrichedAssignments]);

    const classOptions = useMemo(() => {
        const uniqueClasses = [...new Set(enrichedAssignments.map(a => a.classId.toString()))];
        return uniqueClasses.sort((a, b) => parseInt(a) - parseInt(b));
    }, [enrichedAssignments]);

    const filteredAssignments = useMemo(() => {
        const availableClassIds = classes.filter(c => c.numeric >= 1 && c.numeric <= 10).map(c => c.numeric.toString());
        return enrichedAssignments.filter(a => {
            const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBus = busFilter === 'All' || a.vehicleNo === busFilter;
            const matchesClass = (classFilter === 'All'
                ? availableClassIds.includes(a.classId?.toString())
                : a.classId?.toString() === classFilter?.toString());
            return matchesSearch && matchesBus && matchesClass;
        });
    }, [enrichedAssignments, searchTerm, busFilter, classFilter, classes]);

    // Grouping
    const groupedByBus = useMemo(() => {
        const groups = {};
        filteredAssignments.forEach(a => {
            if (!groups[a.vehicleNo]) groups[a.vehicleNo] = [];
            groups[a.vehicleNo].push(a);
        });
        return groups;
    }, [filteredAssignments]);

    const groupedByClass = useMemo(() => {
        const groups = {};
        filteredAssignments.forEach(a => {
            if (!groups[a.classId]) groups[a.classId] = [];
            groups[a.classId].push(a);
        });
        return groups;
    }, [filteredAssignments]);

    // Export CSV Logic
    const handleCsvExport = () => {
        if (filteredAssignments.length === 0) return;

        const headers = ['Student Name', 'Admission No', 'Class', 'Section', 'Bus Number', 'Route', 'Pickup Point', 'Transport Fee'];
        const csvRows = [headers.join(',')];

        filteredAssignments.forEach(attr => {
            const values = [
                `"${attr.studentName || ''}"`,
                `"${attr.admissionNo || ''}"`,
                `"${attr.classId || ''}"`,
                `"${attr.sectionId || ''}"`,
                `"${attr.vehicleNo || ''}"`,
                `"${attr.routeName || ''}"`,
                `"${attr.pickupPoint || ''}"`,
                `"${attr.transportFee || ''}"`
            ];
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `transport_data_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Copy to Clipboard Logic
    const handleCopyData = () => {
        if (filteredAssignments.length === 0) return;

        const headers = ['Student Name', 'Admission No', 'Class', 'Section', 'Bus Number', 'Route', 'Pickup Point', 'Transport Fee'];
        const rows = [headers.join('\t')];

        filteredAssignments.forEach(attr => {
            const values = [
                attr.studentName || '',
                attr.admissionNo || '',
                attr.classId || '',
                attr.sectionId || '',
                attr.vehicleNo || '',
                attr.routeName || '',
                attr.pickupPoint || '',
                attr.transportFee || ''
            ];
            rows.push(values.join('\t'));
        });

        const copyText = rows.join('\n');
        navigator.clipboard.writeText(copyText)
            .then(() => {
                alert('Table data copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="student-list-page transport-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Manage Student Transport</h4>
                    <nav className="breadcrumb">
                        <Link to="/school/transport" className="breadcrumb-link">Transport</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="current">Student Transport</span>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button
                        className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{
                            background: activeTab === 'add' ? 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)' : 'transparent',
                            color: activeTab === 'add' ? 'white' : '#3d5ee1',
                            border: activeTab === 'add' ? 'none' : '1px solid #3d5ee1',
                            boxShadow: activeTab === 'add' ? '0 4px 12px rgba(61, 94, 225, 0.2)' : 'none'
                        }}
                        onClick={() => { resetForm(); setActiveTab('add'); }}
                    >
                        <IconPlus size={18} /> Add Student
                    </button>
                </div>
            </div>

            <div className="tabs-navigation">
                <button
                    className={`tab-btn ${activeTab === 'list-bus' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list-bus')}
                >
                    <IconBus size={18} /> Bus-wise List
                </button>
                <button
                    className={`tab-btn ${activeTab === 'list-class' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list-class')}
                >
                    <IconUsers size={18} /> Class-wise List
                </button>
            </div>

            {activeTab === 'add' && (
                <div className="card soft-card">
                    <div className="card-header">
                        <h3 className="text-lg font-bold" style={{ color: '#3d5ee1' }}>{editingId ? 'Edit Assignment' : 'Add New Student'}</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="form-group student-search-group">
                                <label className="form-label-premium">Student Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        className="form-control-premium"
                                        placeholder="Search student name..."
                                        value={studentSearchQuery}
                                        onChange={(e) => {
                                            setStudentSearchQuery(e.target.value);
                                            setShowStudentResults(true);
                                            if (formData.studentId) {
                                                setFormData(prev => ({ ...prev, studentId: '', admissionNo: '', classId: '', sectionId: '' }));
                                            }
                                        }}
                                        onFocus={() => setShowStudentResults(true)}
                                    />
                                    {showStudentResults && filteredStudents.length > 0 && (
                                        <div className="search-results-dropdown-premium">
                                            {filteredStudents.map(s => (
                                                <div
                                                    key={s.id}
                                                    className="search-result-item-premium"
                                                    onClick={() => handleStudentChange(s)}
                                                >
                                                    <div className="student-name-result">{s.name}</div>
                                                    <div className="student-meta-result">ID: {s.id} | Class {s.class}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Admission Number</label>
                                <input
                                    type="text"
                                    className="form-control-premium"
                                    value={formData.admissionNo}
                                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                                    placeholder="Enter admission no."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Class</label>
                                <input
                                    type="text"
                                    className="form-control-premium"
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    placeholder="Enter class"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Section</label>
                                <input
                                    type="text"
                                    className="form-control-premium"
                                    value={formData.sectionId}
                                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                                    placeholder="Enter section"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Bus Number</label>
                                <select
                                    required
                                    className="form-control-premium"
                                    value={formData.vehicleId}
                                    onChange={(e) => handleVehicleChange(e.target.value)}
                                >
                                    <option value="">Select Bus</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.vehicleNo} - {v.model}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Pickup Point</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control-premium"
                                    value={formData.pickupPoint}
                                    onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                                    placeholder="Enter pickup point"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Route</label>
                                <input
                                    type="text"
                                    className="form-control-premium read-only"
                                    value={routes.find(r => r.id === parseInt(formData.routeId))?.routeName || 'N/A'}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Driver Name</label>
                                <input
                                    type="text"
                                    className="form-control-premium read-only"
                                    value={formData.driverName}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Transport Fee</label>
                                <input
                                    type="number"
                                    required
                                    className="form-control-premium"
                                    value={formData.transportFee}
                                    onChange={(e) => setFormData({ ...formData, transportFee: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-premium">Status</label>
                                <select
                                    className="form-control-premium"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                className="export-btn"
                                style={{ height: '48px', padding: '0 32px', borderRadius: '24px' }}
                                onClick={() => { resetForm(); setActiveTab('list-bus'); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{
                                    height: '48px',
                                    padding: '0 40px',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)',
                                    border: 'none',
                                    fontWeight: '700',
                                    boxShadow: '0 10px 15px -3px rgba(61, 94, 225, 0.3)'
                                }}
                            >
                                {editingId ? 'Update Assignment' : 'Save Assignment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {(activeTab === 'list-bus' || activeTab === 'list-class') && (
                <div className="card shadow-soft border-0 overflow-hidden">
                    <div className="premium-header-banner">
                        <h4 className="mb-0">Student Transport List</h4>
                    </div>

                    <div className="table-toolbar-premium">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="search-pill-wrapper flex-1 max-w-sm">
                                <IconSearch size={18} className="search-icon-pill" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="search-input-pill"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="export-btn"
                                style={{ height: '48px', borderRadius: '24px', paddingLeft: '20px', paddingRight: '40px', appearance: 'none', minWidth: '150px' }}
                                value={busFilter}
                                onChange={(e) => setBusFilter(e.target.value)}
                            >
                                <option value="All">All Buses</option>
                                {busOptions.map(bus => (
                                    <option key={bus} value={bus}>{bus}</option>
                                ))}
                            </select>

                            <select
                                className="export-btn"
                                style={{ height: '48px', borderRadius: '24px', paddingLeft: '20px', paddingRight: '40px', appearance: 'none', minWidth: '150px' }}
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                            >
                                <option value="All">All Classes</option>
                                {classOptions.map(cls => (
                                    <option key={cls} value={cls}>Class {cls}</option>
                                ))}
                            </select>
                        </div>

                        <div className="export-button-group">
                            <button className="export-btn" onClick={handleCopyData}>Copy</button>
                            <button className="export-btn" onClick={handleCsvExport}>CSV</button>
                            <button className="export-btn">Excel</button>
                            <button className="export-btn">PDF</button>
                            <button className="export-btn" onClick={() => window.print()}>Print</button>
                            <div className="filter-dropdown-btn">
                                <IconFilter size={16} />
                                <span>Filter</span>
                                <IconChevronDown size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="table-wrap px-0">
                        <table className="premium-table-v2">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Class & Section</th>
                                    <th>Bus Detail</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((a, index) => {
                                    const student = students.find(s => s.id === a.studentId);
                                    return (
                                        <tr key={a.id} className="table-row-v2">
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="avatar-v2">
                                                        {student?.image ? (
                                                            <img src={student.image} alt="" />
                                                        ) : (
                                                            <div className="avatar-placeholder-v2">
                                                                {a.studentName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="font-semibold text-slate-700">{a.studentName}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-slate-600 font-medium">Class {a.classId} - {a.sectionId}</span>
                                            </td>
                                            <td>
                                                <div className="text-slate-600 font-medium">{a.vehicleNo}</div>
                                                <div className="text-xs text-slate-400">{a.routeName}</div>
                                            </td>
                                            <td>
                                                <span className={`status-text ${a.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                                                    {a.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="action-button-flex">
                                                    <button
                                                        className="action-icon-btn view"
                                                        onClick={() => { setSelectedPass(a); setModalShow(true); }}
                                                        title="View Pass"
                                                    >
                                                        <IconEye size={16} />
                                                    </button>
                                                    <button
                                                        className="action-icon-btn edit"
                                                        onClick={() => handleEdit(a)}
                                                        title="Edit"
                                                    >
                                                        <IconPencil size={16} />
                                                    </button>
                                                    <button
                                                        className="action-icon-btn delete"
                                                        onClick={() => { if (window.confirm('Delete assignment?')) deleteStudentTransport(a.id); }}
                                                        title="Delete"
                                                    >
                                                        <IconTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredAssignments.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="empty-state-icon">
                                    <IconBus size={48} />
                                </div>
                                <h5 className="mt-4 text-slate-600 font-bold">No transport records found</h5>
                                <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudentTransport;
