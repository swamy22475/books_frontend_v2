import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconPlus, IconChevronLeft, IconChevronDown, IconTrash,
    IconLayoutDashboard, IconSchool, IconCalendarPlus
} from '@tabler/icons-react';
import { ScheduleContext } from '../../../context/ScheduleContext';
import './ExamSchedule.css';

const AddExamSchedule = () => {
    const navigate = useNavigate();

    // Default settings state
    const [defaultSettings, setDefaultSettings] = useState({
        passMarks: '',
        maxMarks: '',
        startTime: '02:30 AM',
        endTime: '02:30 AM'
    });

    // Top form state
    const [headerData, setHeaderData] = useState({
        examName: ''
    });

    // Dynamic subject rows state
    const [rows, setRows] = useState([
        { id: Date.now(), subject: '', passMarks: '', maxMarks: '', date: '', startTime: '02:30 AM', endTime: '02:30 AM' }
    ]);

    const classesList = ['1st class', '2nd class', '3rd class', '4th class', '5th class', '6th class', '7th class', '8th class', '9th class', '10th class'];
    const sectionsList = ['A', 'B', 'C'];
    const examsList = ['FA-1', 'FA-2', 'SA-1', 'SA-2'];
    const subjectsList = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi', 'Telugu'];

    const handleAddRow = () => {
        setRows([...rows, {
            id: Date.now(),
            subject: '',
            passMarks: defaultSettings.passMarks,
            maxMarks: defaultSettings.maxMarks,
            date: '',
            startTime: defaultSettings.startTime,
            endTime: defaultSettings.endTime
        }]);
    };

    const handleRemoveRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const handleRowChange = (id, field, value) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleAssignToAll = () => {
        setRows(rows.map(row => ({
            ...row,
            passMarks: defaultSettings.passMarks,
            maxMarks: defaultSettings.maxMarks,
            startTime: defaultSettings.startTime,
            endTime: defaultSettings.endTime
        })));
    };

    const { addScheduleTemplate } = React.useContext(ScheduleContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save as schedule template (without class/section)
        const templateId = addScheduleTemplate({
            exam: headerData.examName,
            rows: rows.map(row => ({
                subject: row.subject,
                passMarks: row.passMarks,
                maxMarks: row.maxMarks,
                date: row.date,
                startTime: row.startTime,
                endTime: row.endTime
            }))
        });

        // Redirect to assign page
        navigate(`/school/exam/schedule/${templateId}/assign`);
    };

    return (
        <div className="page-wrapper add-exam-schedule-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate('/school/exam/schedule')}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Add Exam Schedule</h4>
                    </div>
                    <nav className="breadcrumb">
                        <div className="d-flex align-items-center gap-1">
                            <IconLayoutDashboard size={14} />
                            <span>Dashboard</span> /
                            <IconSchool size={14} />
                            <span>Exam Schedule</span> /
                            <span className="current">Add Exam Schedule</span>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="add-exam-schedule-container">
                {/* Default Settings Bar (Blue Theme) */}
                <div className="default-settings-bar">
                    <div className="default-field-group">
                        <label>Default Pass Marks</label>
                        <input
                            type="text"
                            placeholder="e.g. 35"
                            value={defaultSettings.passMarks}
                            onChange={(e) => setDefaultSettings({ ...defaultSettings, passMarks: e.target.value })}
                        />
                    </div>
                    <div className="default-field-group">
                        <label>Default Max Marks</label>
                        <input
                            type="text"
                            placeholder="e.g. 100"
                            value={defaultSettings.maxMarks}
                            onChange={(e) => setDefaultSettings({ ...defaultSettings, maxMarks: e.target.value })}
                        />
                    </div>
                    <div className="default-field-group">
                        <label>Default Start Time</label>
                        <input
                            type="text"
                            value={defaultSettings.startTime}
                            onChange={(e) => setDefaultSettings({ ...defaultSettings, startTime: e.target.value })}
                        />
                    </div>
                    <div className="default-field-group">
                        <label>Default End Time</label>
                        <input
                            type="text"
                            value={defaultSettings.endTime}
                            onChange={(e) => setDefaultSettings({ ...defaultSettings, endTime: e.target.value })}
                        />
                    </div>
                    <button type="button" className="btn-assign-all" onClick={handleAssignToAll}>
                        ASSIGN TO ALL
                    </button>
                </div>

                {/* Main Form Content */}
                <form className="schedule-form-content" onSubmit={handleSubmit}>
                    {/* Top Selectors */}
                    <div className="form-grid-top" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="input-group">
                            <label>Exam Name <span className="required">*</span></label>
                            <div className="select-wrapper">
                                <select
                                    className="custom-select"
                                    required
                                    value={headerData.examName}
                                    onChange={(e) => setHeaderData({ ...headerData, examName: e.target.value })}
                                >
                                    <option value="">Select Exam</option>
                                    {examsList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                </select>
                                <IconChevronDown size={18} className="chevron-icon" />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Subject Rows */}
                    <div className="subject-rows-container">
                        {rows.map((row) => (
                            <div key={row.id} className="form-grid-row">
                                <div className="input-group">
                                    <label>Subject <span className="required">*</span></label>
                                    <div className="select-wrapper">
                                        <select
                                            className="custom-select"
                                            required
                                            value={row.subject}
                                            onChange={(e) => handleRowChange(row.id, 'subject', e.target.value)}
                                        >
                                            <option value="">Select Subject</option>
                                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                        <IconChevronDown size={18} className="chevron-icon" />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Pass marks</label>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder="Pass Marks"
                                        value={row.passMarks}
                                        onChange={(e) => handleRowChange(row.id, 'passMarks', e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Max marks</label>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder="Max Marks"
                                        value={row.maxMarks}
                                        onChange={(e) => handleRowChange(row.id, 'maxMarks', e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Date <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        className="custom-input"
                                        required
                                        value={row.date}
                                        onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Start time <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        required
                                        value={row.startTime}
                                        onChange={(e) => handleRowChange(row.id, 'startTime', e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>End time <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        required
                                        value={row.endTime}
                                        onChange={(e) => handleRowChange(row.id, 'endTime', e.target.value)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="btn-remove-row"
                                    title="Remove Row"
                                    onClick={() => handleRemoveRow(row.id)}
                                >
                                    <IconTrash size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="form-actions-bottom">
                        <button type="button" className="btn-add-row" onClick={handleAddRow}>
                            <IconPlus size={18} />
                            Add Row
                        </button>
                        <button type="submit" className="btn-submit-schedule">
                            Save & Assign Classes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExamSchedule;
