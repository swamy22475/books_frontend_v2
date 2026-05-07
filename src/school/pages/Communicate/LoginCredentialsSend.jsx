import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import {
    Search,
    Send,
    Users,
    Mail,
    Smartphone,
    MessageCircle,
    User,
    AlertCircle,
    Check
} from 'lucide-react';
import './LoginCredentials.css';

const DUMMY_CLASSES = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
    { id: 4, name: "Class 4" },
    { id: 5, name: "Class 5" }
];

const DUMMY_SECTIONS = [
    { id: 'A', name: "Section A" },
    { id: 'B', name: "Section B" },
    { id: 'C', name: "Section C" }
];

const DUMMY_STUDENTS = [
    { id: 1, admissionNo: "120028", name: "Nishant Sindhu", class: "Class 1 (B)", dob: "08/06/2016", gender: "Male", mobile: "890678574" },
    { id: 2, admissionNo: "541200", name: "David Wilson", class: "Class 1 (B)", dob: "05/01/2019", gender: "Male", mobile: "+9162" },
    { id: 3, admissionNo: "5422", name: "Vinay Singh", class: "Class 1 (B)", dob: "12/31/2018", gender: "Male", mobile: "+916266000225" },
    { id: 4, admissionNo: "RKS001", name: "RKS Kumar", class: "Class 1 (B)", dob: "01/01/2019", gender: "Male", mobile: "9876543210" },
    { id: 5, admissionNo: "120030", name: "Anjali Sharma", class: "Class 1 (B)", dob: "11/15/2016", gender: "Female", mobile: "7890123456" },
];

const LoginCredentialsSend = () => {
    // Search Criteria State
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);
    const [validationError, setValidationError] = useState('');

    // Bulk Action State
    const [messageTo, setMessageTo] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Data State
    const [studentList, setStudentList] = useState([]);

    const handleSearch = () => {
        if (!selectedClass) {
            setValidationError('The Class field is required.');
            return;
        }
        setValidationError('');
        // Simulate API fetch
        setStudentList(DUMMY_STUDENTS);
        setIsSearchPerformed(true);
        setSelectAll(false);
        setSelectedStudents([]);
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedStudents(studentList.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents(prev => {
            if (prev.includes(id)) {
                return prev.filter(sid => sid !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSend = () => {
        if (!messageTo) {
            alert("Please select 'Message To' recipient.");
            return;
        }
        if (!notificationType) {
            alert("Please select 'Notification Type'.");
            return;
        }
        if (selectedStudents.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        const typeLabel = notificationType === 'email' ? 'Email' : notificationType === 'sms' ? 'SMS' : 'WhatsApp';
        alert(`Sending ${typeLabel} credentials to ${selectedStudents.length} students (${messageTo}).\n\nSimulated Action Successful!`);
    };

    return (
        <StudentPageContainer title="Send Login Credentials" description="Send bulk login credentials to students and guardians via Email, SMS, or WhatsApp.">
            <div className="credentials-container">

                {/* Criteria Selection Card */}
                <div className="credentials-card">
                    <div className="credentials-header">
                        <h3 className="credentials-title">Select Criteria</h3>
                    </div>
                    <div className="credentials-body">
                        <div className="filter-grid">
                            <div className="filter-group">
                                <label className="filter-label required">Class</label>
                                <select
                                    className={`filter-select ${validationError ? 'border-red-500' : ''}`}
                                    value={selectedClass}
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        setValidationError('');
                                    }}
                                >
                                    <option value="">Select</option>
                                    {DUMMY_CLASSES.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                {validationError && <span className="validation-error">{validationError}</span>}
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">Section</label>
                                <select
                                    className="filter-select"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {DUMMY_SECTIONS.map(sec => (
                                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn-search" onClick={handleSearch}>
                                <Search className="w-4 h-4" /> Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Student List Card (Conditional Render) */}
                {isSearchPerformed && (
                    <div className="credentials-card">
                        <div className="credentials-header flex justify-between items-center">
                            <h3 className="credentials-title flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" /> Student List
                            </h3>
                            <span className="text-sm text-slate-500 font-medium">
                                Showing {studentList.length} records
                            </span>
                        </div>

                        <div className="credentials-body">

                            {/* Bulk Action Actions */}
                            <div className="list-actions-bar">
                                <div className="filter-group select-all-wrapper">
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        className="custom-checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="selectAll" className="filter-label cursor-pointer">Select All</label>
                                </div>

                                <div className="filter-group flex-1">
                                    <label className="filter-label required">Message To</label>
                                    <select
                                        className="filter-select"
                                        value={messageTo}
                                        onChange={(e) => setMessageTo(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="student">Student</option>
                                        <option value="parent">Parent</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>

                                <div className="filter-group flex-1">
                                    <label className="filter-label required">Notification Type</label>
                                    <select
                                        className="filter-select"
                                        value={notificationType}
                                        onChange={(e) => setNotificationType(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="credentials-table-wrapper">
                                <table className="credentials-table w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-center w-12 text-slate-500 font-semibold border-b border-slate-200">
                                                Select
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Admission No
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Student Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Class
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Date Of Birth
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Gender
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                Mobile Number
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {studentList.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={() => handleSelectStudent(student.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                                                    {student.admissionNo}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-slate-800">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {student.class}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {student.dob}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {student.gender}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-mono text-slate-600">
                                                    {student.mobile}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sticky Send Footer Bar */}
                            <div className="send-footer-bar">
                                <div className="send-footer-info">
                                    {selectedStudents.length > 0 ? (
                                        <>
                                            <span className={`send-footer-count ${{ whatsapp: 'wa', email: 'email', sms: 'sms' }[notificationType] || ''}`}>
                                                {selectedStudents.length}
                                            </span>
                                            <span>
                                                student{selectedStudents.length !== 1 ? 's' : ''} selected
                                                {notificationType && (
                                                    <> · via <strong style={{ color: '#334155' }}>
                                                        {notificationType === 'sms' ? 'SMS' : notificationType === 'email' ? 'Email' : 'WhatsApp'}
                                                    </strong></>
                                                )}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-slate-400">Select students to send credentials</span>
                                    )}
                                </div>
                                <button
                                    className={`btn-send ${{ whatsapp: 'wa', email: 'email', sms: 'sms' }[notificationType] || ''}`}
                                    onClick={handleSend}
                                    disabled={selectedStudents.length === 0 || !messageTo || !notificationType}
                                >
                                    <Send className="send-icon" />
                                    Send Credentials
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Initial Empty State Hint (Optional) */}
                {!isSearchPerformed && (
                    <div className="empty-state">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Please select criteria and search to view students.</p>
                    </div>
                )}

            </div>
        </StudentPageContainer >
    );
};

export default LoginCredentialsSend;
