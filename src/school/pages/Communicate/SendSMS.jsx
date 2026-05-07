import React, { useState } from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';
import { useCommunication } from '../../../context/CommunicationContext';
import {
    Send,
    Users,
    User,
    Clock,
    Search,
    X,
    GraduationCap,
    Cake,
    BookOpen
} from 'lucide-react';

import './SendSMS.css';

const USER_GROUPS = [
    "Students", "Guardians", "Admin", "Teacher", "Accountant", "Librarian", "Receptionist"
];

const DUMMY_USERS = [
    { id: 1, name: "John Doe", role: "Student", class: "Class 10-A" },
    { id: 2, name: "Jane Smith", role: "Student", class: "Class 10-B" },
    { id: 3, name: "Robert Brown", role: "Guardian", phone: "+1234567890" },
    { id: 4, name: "Emily White", role: "Teacher", department: "Science" },
    { id: 5, name: "Michael Green", role: "Admin", department: "Management" },
    { id: 6, name: "Sarah Black", role: "Librarian", department: "Library" },
    { id: 7, name: "David Wilson", role: "Accountant", department: "Finance" },
    { id: 8, name: "Lisa Ray", role: "Student", class: "Class 9-A" },
    { id: 9, name: "William Davis", role: "Teacher", department: "Mathematics" },
    { id: 10, name: "Jessica Taylor", role: "Teacher", department: "English" }
];

const DUMMY_CLASSES = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
    { id: 4, name: "Class 4" },
    { id: 5, name: "Class 5" },
    { id: 6, name: "Class 6" },
];

const DUMMY_SECTIONS = ["A", "B", "C", "D"];
const CLASS_RECIPIENT_TYPES = ["Students", "Guardians"];

const SendSMS = () => {
    const { smsTemplates } = useCommunication();

    // Tab State
    const [activeTab, setActiveTab] = useState('group');

    // Form State
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        sendThrough: {
            sms: true,
            app: false
        },
        templateId: '',
        message: '',
        selectedGroups: [],
        individualRecipients: [],

        // Class Tab Data
        selectedClass: '',
        selectedSections: [],
        selectedClassRecipients: [],

        // Teachers Tab Data
        selectedTeachers: []
    });

    // Individual Tab State
    const [individualType, setIndividualType] = useState('Students');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Search Logic
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filtered = DUMMY_USERS.filter(user =>
            (individualType === 'Select' || user.role === individualType || individualType === 'Students') && // Simple filter logic
            user.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const handleAddRecipient = (user) => {
        if (!formData.individualRecipients.find(u => u.id === user.id)) {
            setFormData(prev => ({
                ...prev,
                individualRecipients: [...prev.individualRecipients, user]
            }));
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveRecipient = (userId) => {
        setFormData(prev => ({
            ...prev,
            individualRecipients: prev.individualRecipients.filter(u => u.id !== userId)
        }));
    };

    // Class Tab Logic
    const handleClassChange = (e) => {
        setFormData(prev => ({
            ...prev,
            selectedClass: e.target.value,
            selectedSections: [], // Reset sections on class change
            selectedClassRecipients: [] // Reset recipients on class change
        }));
    };

    const handleSectionToggle = (section) => {
        setFormData(prev => {
            const sections = prev.selectedSections.includes(section)
                ? prev.selectedSections.filter(s => s !== section)
                : [...prev.selectedSections, section];
            return { ...prev, selectedSections: sections };
        });
    };

    const handleClassRecipientToggle = (type) => {
        setFormData(prev => {
            const types = prev.selectedClassRecipients.includes(type)
                ? prev.selectedClassRecipients.filter(t => t !== type)
                : [...prev.selectedClassRecipients, type];
            return { ...prev, selectedClassRecipients: types };
        });
    };

    // Handle Template Change
    const handleTemplateChange = (e) => {
        const id = parseInt(e.target.value);
        setSelectedTemplateId(id);

        if (id) {
            const template = smsTemplates.find(t => t.id === id); // Updated to use context
            if (template) {
                setFormData(prev => ({
                    ...prev,
                    title: template.title,
                    message: template.message
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, message: '' }));
        }
    };

    // Handle Group Checkbox
    const handleGroupToggle = (group) => {
        setFormData(prev => {
            const groups = prev.selectedGroups.includes(group)
                ? prev.selectedGroups.filter(g => g !== group)
                : [...prev.selectedGroups, group];
            return { ...prev, selectedGroups: groups };
        });
    };

    // Handle Teacher Checkbox
    const handleTeacherToggle = (teacherId) => {
        setFormData(prev => {
            const teachersList = prev.selectedTeachers || [];
            const updated = teachersList.includes(teacherId)
                ? teachersList.filter(id => id !== teacherId)
                : [...teachersList, teacherId];
            return { ...prev, selectedTeachers: updated };
        });
    };

    // Handle Submit
    const handleSubmit = () => {
        // Validation logic
        if (!formData.message) {
            alert("Please enter a message.");
            return;
        }

        if (activeTab === 'group' && formData.selectedGroups.length === 0) {
            alert("Please select at least one recipient group.");
            return;
        }

        if (activeTab === 'individual' && formData.individualRecipients.length === 0) {
            alert("Please select at least one individual recipient.");
            return;
        }

        if (activeTab === 'class' && (!formData.selectedClass || formData.selectedSections.length === 0 || formData.selectedClassRecipients.length === 0)) {
            alert("Please select a class, at least one section, and one recipient type.");
            return;
        }

        if (activeTab === 'teachers' && (!formData.selectedTeachers || formData.selectedTeachers.length === 0)) {
            alert("Please select at least one teacher.");
            return;
        }

        alert("SMS Sent Successfully!");
        // Reset or redirect logic
    };

    return (
        <StudentPageContainer title="Send SMS" description="Compose and send bulk messages to students, staff, and guardians.">
            <div className="sms-container">

                {/* Tabs */}
                <div className="sms-tabs">
                    <button
                        className={`sms-tab ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        <Users className="w-4 h-4" />
                        Group
                    </button>
                    <button
                        className={`sms-tab ${activeTab === 'individual' ? 'active' : ''}`}
                        onClick={() => setActiveTab('individual')}
                    >
                        <User className="w-4 h-4" />
                        Individual
                    </button>
                    <button
                        className={`sms-tab ${activeTab === 'class' ? 'active' : ''}`}
                        onClick={() => setActiveTab('class')}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Class
                    </button>
                    <button
                        className={`sms-tab ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teachers')}
                    >
                        <BookOpen className="w-4 h-4" />
                        Teachers
                    </button>
                    <button
                        className={`sms-tab ${activeTab === 'birthday' ? 'active' : ''}`}
                        onClick={() => setActiveTab('birthday')}
                    >
                        <Cake className="w-4 h-4" />
                        Today's Birthday
                    </button>
                </div>

                {/* Main Card Content */}
                <div className={`sms-card ${!['group', 'individual', 'class', 'teachers'].includes(activeTab) ? 'no-tabs' : ''}`}>
                    <div className="sms-card-body">

                        {['group', 'individual', 'class', 'teachers'].includes(activeTab) ? (
                            <div className="sms-grid">

                                {/* Left Column: Form Fields */}
                                <div className="sms-form-column">
                                    <div className="sms-form-section">
                                        <label className="sms-label">SMS Template</label>
                                        <select
                                            className="sms-select"
                                            value={selectedTemplateId}
                                            onChange={handleTemplateChange}
                                        >
                                            <option value="">Select Template</option>
                                            {smsTemplates.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sms-form-section">
                                        <label className="sms-label required">Title</label>
                                        <input
                                            type="text"
                                            className="sms-input"
                                            placeholder="Enter message title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="sms-form-section">
                                        <label className="sms-label required">Send Through</label>
                                        <div className="inline-checkbox-group">
                                            <div className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id="check_sms"
                                                    checked={formData.sendThrough.sms}
                                                    onChange={(e) => setFormData({ ...formData, sendThrough: { ...formData.sendThrough, sms: e.target.checked } })}
                                                />
                                                <label htmlFor="check_sms">SMS</label>
                                            </div>
                                            <div className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id="check_app"
                                                    checked={formData.sendThrough.app}
                                                    onChange={(e) => setFormData({ ...formData, sendThrough: { ...formData.sendThrough, app: e.target.checked } })}
                                                />
                                                <label htmlFor="check_app">Mobile App</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sms-form-section">
                                        <label className="sms-label">SMS Template ID (For Indian SMS Gateway)</label>
                                        <input
                                            type="text"
                                            className="sms-input"
                                            placeholder="Enter Template ID"
                                            value={formData.templateId}
                                            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                                        />
                                    </div>

                                    <div className="sms-form-section">
                                        <label className="sms-label required">Message</label>
                                        <textarea
                                            className="sms-textarea"
                                            placeholder="Type your message here..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                        <div className="char-count">Character Count: {formData.message.length}</div>
                                    </div>
                                </div>

                                {/* Right Column: Recipient Selection */}
                                <div className="sms-recipient-column">
                                    {activeTab === 'group' && (
                                        <div className="checkbox-group">
                                            <label className="sms-label required" style={{ marginBottom: 16 }}>Message To</label>
                                            {USER_GROUPS.map(group => (
                                                <div key={group} className="checkbox-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`group_${group}`}
                                                        checked={formData.selectedGroups.includes(group)}
                                                        onChange={() => handleGroupToggle(group)}
                                                    />
                                                    <label htmlFor={`group_${group}`}>{group}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'individual' && (
                                        <div className="individual-selection-panel">
                                            <label className="sms-label required">Message To</label>

                                            <div className="individual-selector-group">
                                                <select
                                                    className="sms-select"
                                                    value={individualType}
                                                    onChange={(e) => setIndividualType(e.target.value)}
                                                >
                                                    <option value="Select">Select</option>
                                                    {USER_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                                <button className="btn-sms-add">
                                                    Add
                                                </button>
                                            </div>

                                            <div className="search-container">
                                                <input
                                                    type="text"
                                                    className="search-input"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                />
                                                <button className="search-icon-btn">
                                                    <Search className="w-4 h-4" />
                                                </button>

                                                {/* Search Results Dropdown */}
                                                {searchResults.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {searchResults.map(user => (
                                                            <div
                                                                key={user.id}
                                                                className="p-2 hover:bg-slate-50 cursor-pointer text-sm"
                                                                onClick={() => handleAddRecipient(user)}
                                                            >
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-xs text-slate-500">{user.role} {user.class ? `- ${user.class}` : ''}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selected Recipients List */}
                                            <div className="individual-list-container">
                                                {formData.individualRecipients.length > 0 ? (
                                                    formData.individualRecipients.map(user => (
                                                        <div key={user.id} className="individual-item">
                                                            <div className="individual-info">
                                                                <span className="font-medium text-slate-700">{user.name}</span>
                                                                <span className="individual-role">{user.role} {user.class ? `(${user.class})` : ''}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveRecipient(user.id)}
                                                                className="text-slate-400 hover:text-red-500"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-slate-400 text-sm">
                                                        No recipients selected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'class' && (
                                        <div className="class-selection-panel">
                                            <div className="sms-form-section">
                                                <label className="sms-label required">Message To</label>
                                                <select
                                                    className="sms-select"
                                                    value={formData.selectedClass}
                                                    onChange={handleClassChange}
                                                >
                                                    <option value="">Select</option>
                                                    {DUMMY_CLASSES.map(cls => (
                                                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {formData.selectedClass && (
                                                <div className="class-selection-container">
                                                    <div className="class-grid-headers">
                                                        <div className="class-grid-header">Section</div>
                                                        <div className="class-grid-header">Send To</div>
                                                    </div>

                                                    <div className="class-checkbox-grid">
                                                        {/* Sections Column */}
                                                        <div className="class-checkbox-column">
                                                            {DUMMY_SECTIONS.map(section => (
                                                                <div key={section} className="checkbox-item">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`section_${section}`}
                                                                        checked={formData.selectedSections.includes(section)}
                                                                        onChange={() => handleSectionToggle(section)}
                                                                    />
                                                                    <label htmlFor={`section_${section}`}>{section}</label>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Recipient Types Column */}
                                                        <div className="class-checkbox-column">
                                                            {CLASS_RECIPIENT_TYPES.map(type => (
                                                                <div key={type} className="checkbox-item">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`type_${type}`}
                                                                        checked={formData.selectedClassRecipients.includes(type)}
                                                                        onChange={() => handleClassRecipientToggle(type)}
                                                                    />
                                                                    <label htmlFor={`type_${type}`}>{type}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'teachers' && (
                                        <div className="checkbox-group">
                                            <label className="sms-label required" style={{ marginBottom: 16 }}>Message To Teachers</label>
                                            {DUMMY_USERS.filter(u => u.role === 'Teacher').map(teacher => (
                                                <div key={teacher.id} className="checkbox-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`teacher_${teacher.id}`}
                                                        checked={(formData.selectedTeachers || []).includes(teacher.id)}
                                                        onChange={() => handleTeacherToggle(teacher.id)}
                                                    />
                                                    <label htmlFor={`teacher_${teacher.id}`}>{teacher.name} ({teacher.department})</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Full Width Footer */}
                                <div className="col-span-2 sms-footer">
                                    <div className="radio-group" style={{ marginRight: 'auto' }}>
                                        <div className="radio-item">
                                            <input type="radio" name="schedule" id="send_now" defaultChecked />
                                            <label htmlFor="send_now">Send Now</label>
                                        </div>
                                        <div className="radio-item">
                                            <input type="radio" name="schedule" id="send_later" />
                                            <label htmlFor="send_later">Schedule</label>
                                        </div>
                                    </div>

                                    <button className="btn-sms-submit" onClick={handleSubmit}>
                                        <Send className="w-4 h-4" /> Submit
                                    </button>
                                </div>

                            </div>
                        ) : (
                            // Placeholder for other tabs
                            <div className="empty-tab-content">
                                <div className="empty-icon-circle">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h3>Coming Soon</h3>
                                <p>The {activeTab} messaging module is under development.</p>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </StudentPageContainer>
    );
};

export default SendSMS;
