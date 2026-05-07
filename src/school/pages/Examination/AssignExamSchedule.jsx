import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IconChevronLeft, IconLayoutDashboard, IconSchool,
    IconCheck, IconChecks
} from '@tabler/icons-react';
import { ScheduleContext } from '../../../context/ScheduleContext';
import './ExamSchedule.css';

const AssignExamSchedule = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const { scheduleTemplates, addAssignment, addSchedule } = React.useContext(ScheduleContext);

    // Find the template
    const template = scheduleTemplates.find(t => String(t.id) === String(scheduleId));

    const classesList = ['1st class', '2nd class', '3rd class', '4th class', '5th class', '6th class', '7th class', '8th class', '9th class', '10th class'];
    const sectionsList = ['A', 'B', 'C'];

    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [assigned, setAssigned] = useState(false);

    const toggleClass = (cls) => {
        setSelectedClasses(prev =>
            prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
        );
    };

    const toggleSection = (sec) => {
        setSelectedSections(prev =>
            prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
        );
    };

    const selectAllClasses = () => {
        setSelectedClasses(prev => prev.length === classesList.length ? [] : [...classesList]);
    };

    const selectAllSections = () => {
        setSelectedSections(prev => prev.length === sectionsList.length ? [] : [...sectionsList]);
    };

    const handleAssign = () => {
        if (selectedClasses.length === 0 || selectedSections.length === 0) {
            alert('Please select at least one class and one section.');
            return;
        }

        // Create mapping records for each class × section combination
        selectedClasses.forEach(cls => {
            selectedSections.forEach(sec => {
                addAssignment({
                    scheduleId: Number(scheduleId),
                    class_id: cls,
                    section_id: sec
                });

                // Also create schedule entries for the list view
                if (template) {
                    template.rows.forEach(row => {
                        addSchedule({
                            id: Date.now() + Math.random(),
                            exam: template.exam,
                            class: cls,
                            section: sec,
                            subject: row.subject,
                            date: row.date,
                            timeFrom: row.startTime,
                            timeTo: row.endTime,
                            roomNo: 'TBD'
                        });
                    });
                }
            });
        });

        setAssigned(true);
        setTimeout(() => {
            navigate('/school/exam/schedule');
        }, 1500);
    };

    if (!template) {
        return (
            <div className="page-wrapper assign-schedule-page">
                <div className="page-header">
                    <div className="page-title">
                        <div className="d-flex align-items-center gap-2">
                            <button className="action-btn" onClick={() => navigate('/school/exam/schedule')}>
                                <IconChevronLeft size={20} />
                            </button>
                            <h4>Assign Exam Schedule</h4>
                        </div>
                    </div>
                </div>
                <div className="assign-empty-state">
                    <p>Schedule template not found. Please create a schedule first.</p>
                    <button className="btn-submit-schedule" onClick={() => navigate('/school/exam/schedule/add')}>
                        Create Schedule
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper assign-schedule-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate('/school/exam/schedule')}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Assign Exam Schedule</h4>
                    </div>
                    <nav className="breadcrumb">
                        <div className="d-flex align-items-center gap-1">
                            <IconLayoutDashboard size={14} />
                            <span>Dashboard</span> /
                            <IconSchool size={14} />
                            <span>Exam Schedule</span> /
                            <span className="current">Assign</span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Exam Info Header */}
            <div className="assign-exam-header">
                <div className="assign-exam-badge">
                    <span className="assign-exam-label">Exam Type</span>
                    <span className="assign-exam-name">{template.exam}</span>
                </div>
                <div className="assign-exam-badge">
                    <span className="assign-exam-label">Subjects</span>
                    <span className="assign-exam-name">{template.rows.length}</span>
                </div>
            </div>

            {/* Success Banner */}
            {assigned && (
                <div className="assign-success-banner">
                    <IconChecks size={20} />
                    Schedule assigned successfully! Redirecting...
                </div>
            )}

            {/* Assignment Grid */}
            <div className="assign-grid-container">
                {/* Classes Column */}
                <div className="assign-checklist-card">
                    <div className="checklist-header">
                        <h5>Select Classes</h5>
                        <button className="btn-select-all" onClick={selectAllClasses}>
                            {selectedClasses.length === classesList.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="checklist-body">
                        {classesList.map((cls) => (
                            <label key={cls} className={`checklist-item${selectedClasses.includes(cls) ? ' checked' : ''}`}>
                                <div className={`custom-checkbox${selectedClasses.includes(cls) ? ' active' : ''}`}>
                                    {selectedClasses.includes(cls) && <IconCheck size={14} />}
                                </div>
                                <span>{cls}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedClasses.includes(cls)}
                                    onChange={() => toggleClass(cls)}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sections Column */}
                <div className="assign-checklist-card">
                    <div className="checklist-header">
                        <h5>Select Sections</h5>
                        <button className="btn-select-all" onClick={selectAllSections}>
                            {selectedSections.length === sectionsList.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="checklist-body">
                        {sectionsList.map((sec) => (
                            <label key={sec} className={`checklist-item${selectedSections.includes(sec) ? ' checked' : ''}`}>
                                <div className={`custom-checkbox${selectedSections.includes(sec) ? ' active' : ''}`}>
                                    {selectedSections.includes(sec) && <IconCheck size={14} />}
                                </div>
                                <span>{sec}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedSections.includes(sec)}
                                    onChange={() => toggleSection(sec)}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary & Assign Button */}
            <div className="assign-footer">
                <div className="assign-summary">
                    {selectedClasses.length > 0 && selectedSections.length > 0 ? (
                        <span>
                            <strong>{selectedClasses.length * selectedSections.length}</strong> assignment(s) will be created
                            ({selectedClasses.length} class(es) × {selectedSections.length} section(s))
                        </span>
                    ) : (
                        <span className="text-muted">Select classes and sections to assign</span>
                    )}
                </div>
                <button
                    className="btn-assign-selected"
                    onClick={handleAssign}
                    disabled={assigned || selectedClasses.length === 0 || selectedSections.length === 0}
                >
                    <IconChecks size={18} />
                    Assign to Selected
                </button>
            </div>
        </div>
    );
};

export default AssignExamSchedule;
