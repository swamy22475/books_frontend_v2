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
    MessageCircle,
    BookOpen
} from 'lucide-react';

import './SendWhatsapp.css';

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

const SendWhatsapp = () => {
    const { whatsappTemplates } = useCommunication();
    const [activeTab, setActiveTab] = useState('group');

    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        selectedGroups: [],
        individualRecipients: [],
        selectedClass: '',
        selectedSections: [],
        selectedClassRecipients: [],
        selectedTeachers: []
    });

    const [individualType, setIndividualType] = useState('Students');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filtered = DUMMY_USERS.filter(user =>
            (individualType === 'Select' || user.role === individualType || individualType === 'Students') &&
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
            selectedSections: [],
            selectedClassRecipients: []
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

    const handleTemplateChange = (e) => {
        const id = parseInt(e.target.value);
        setSelectedTemplateId(id);

        if (id) {
            const template = whatsappTemplates.find(t => t.id === id);
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

    const handleGroupToggle = (group) => {
        setFormData(prev => {
            const groups = prev.selectedGroups.includes(group)
                ? prev.selectedGroups.filter(g => g !== group)
                : [...prev.selectedGroups, group];
            return { ...prev, selectedGroups: groups };
        });
    };

    const handleTeacherToggle = (teacherId) => {
        setFormData(prev => {
            const teachersList = prev.selectedTeachers || [];
            const updated = teachersList.includes(teacherId)
                ? teachersList.filter(id => id !== teacherId)
                : [...teachersList, teacherId];
            return { ...prev, selectedTeachers: updated };
        });
    };

    const handleSubmit = () => {
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

        // WhatsApp specific messaging
        alert("WhatsApp Message Sent Successfully!");
    };

    return (
        <StudentPageContainer title="Send WhatsApp" description="Compose and send bulk WhatsApp messages to students, staff, and guardians.">
            <div className="wa-container">

                {/* Tabs */}
                <div className="wa-tabs">
                    <button
                        className={`wa-tab ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        <Users className="w-4 h-4" />
                        Group
                    </button>
                    <button
                        className={`wa-tab ${activeTab === 'individual' ? 'active' : ''}`}
                        onClick={() => setActiveTab('individual')}
                    >
                        <User className="w-4 h-4" />
                        Individual
                    </button>
                    <button
                        className={`wa-tab ${activeTab === 'class' ? 'active' : ''}`}
                        onClick={() => setActiveTab('class')}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Class
                    </button>
                    <button
                        className={`wa-tab ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teachers')}
                    >
                        <BookOpen className="w-4 h-4" />
                        Teachers
                    </button>
                    <button
                        className={`wa-tab ${activeTab === 'birthday' ? 'active' : ''}`}
                        onClick={() => setActiveTab('birthday')}
                    >
                        <Cake className="w-4 h-4" />
                        Today's Birthday
                    </button>
                </div>

                {/* Main Card Content */}
                <div className={`wa-card ${!['group', 'individual', 'class', 'teachers'].includes(activeTab) ? 'no-tabs' : ''}`}>
                    <div className="wa-card-body">

                        {['group', 'individual', 'class', 'teachers'].includes(activeTab) ? (
                            <div className="wa-grid">

                                {/* Left Column: Form Fields */}
                                <div className="wa-form-column">
                                    <div className="wa-form-section">
                                        <label className="wa-label">WhatsApp Template</label>
                                        <select
                                            className="wa-select"
                                            value={selectedTemplateId}
                                            onChange={handleTemplateChange}
                                        >
                                            <option value="">Select Template</option>
                                            {whatsappTemplates.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="wa-form-section">
                                        <label className="wa-label required">Title</label>
                                        <input
                                            type="text"
                                            className="wa-input"
                                            placeholder="Enter message title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="wa-form-section">
                                        <label className="wa-label required">Message</label>
                                        <textarea
                                            className="wa-textarea"
                                            placeholder="Type your WhatsApp message here..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            style={{ minHeight: '180px' }}
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-xs text-slate-400">Supports basic formatting (*bold*, _italic_)</div>
                                            <div className="text-xs font-semibold text-slate-500">
                                                {formData.message.length} chars
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Recipient Selection */}
                                <div className="wa-recipient-column">
                                    {activeTab === 'group' && (
                                        <div className="wa-checkbox-group">
                                            <label className="wa-label required" style={{ marginBottom: 16 }}>Message To</label>
                                            {USER_GROUPS.map(group => (
                                                <div key={group} className="wa-checkbox-item">
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
                                        <div className="wa-individual-selection-panel">
                                            <label className="wa-label required">Message To</label>

                                            <div className="wa-individual-selector-group">
                                                <select
                                                    className="wa-select"
                                                    value={individualType}
                                                    onChange={(e) => setIndividualType(e.target.value)}
                                                >
                                                    <option value="Select">Select</option>
                                                    {USER_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                                <button className="btn-wa-add">
                                                    Add
                                                </button>
                                            </div>

                                            <div className="wa-search-container">
                                                <input
                                                    type="text"
                                                    className="wa-search-input"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                />
                                                <button className="wa-search-icon-btn">
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
                                            <div className="wa-individual-list-container">
                                                {formData.individualRecipients.length > 0 ? (
                                                    formData.individualRecipients.map(user => (
                                                        <div key={user.id} className="wa-individual-item">
                                                            <div className="wa-individual-info">
                                                                <span className="font-medium text-slate-700">{user.name}</span>
                                                                <span className="wa-individual-role">{user.role} {user.class ? `(${user.class})` : ''}</span>
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
                                        <div className="wa-class-selection-panel">
                                            <div className="wa-form-section">
                                                <label className="wa-label required">Message To</label>
                                                <select
                                                    className="wa-select"
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
                                                <div className="wa-class-selection-container">
                                                    <div className="wa-class-grid-headers">
                                                        <div className="wa-class-grid-header">Section</div>
                                                        <div className="wa-class-grid-header">Send To</div>
                                                    </div>

                                                    <div className="wa-class-checkbox-grid">
                                                        {/* Sections Column */}
                                                        <div className="wa-class-checkbox-column">
                                                            {DUMMY_SECTIONS.map(section => (
                                                                <div key={section} className="wa-checkbox-item">
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
                                                        <div className="wa-class-checkbox-column">
                                                            {CLASS_RECIPIENT_TYPES.map(type => (
                                                                <div key={type} className="wa-checkbox-item">
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
                                        <div className="wa-checkbox-group">
                                            <label className="wa-label required" style={{ marginBottom: 16 }}>Message To Teachers</label>
                                            {DUMMY_USERS.filter(u => u.role === 'Teacher').map(teacher => (
                                                <div key={teacher.id} className="wa-checkbox-item">
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
                                <div className="col-span-2 wa-footer">
                                    <div className="wa-radio-group" style={{ marginRight: 'auto' }}>
                                        <div className="wa-radio-item">
                                            <input type="radio" name="schedule" id="send_now" defaultChecked />
                                            <label htmlFor="send_now">Send Now</label>
                                        </div>
                                        <div className="wa-radio-item">
                                            <input type="radio" name="schedule" id="send_later" />
                                            <label htmlFor="send_later">Schedule</label>
                                        </div>
                                    </div>

                                    <button className="btn-wa-submit" onClick={handleSubmit}>
                                        <Send className="w-4 h-4" /> Send WhatsApp
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <div className="wa-empty-tab-content">
                                <div className="wa-empty-icon-circle">
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

export default SendWhatsapp;
