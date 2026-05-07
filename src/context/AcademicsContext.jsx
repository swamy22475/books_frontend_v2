import React, { createContext, useState } from 'react';

export const AcademicsContext = createContext();

export const AcademicsProvider = ({ children }) => {
    // Master list for subject selection
    const masterSubjects = [
        'Mathematics', 'Science', 'English', 'History', 'Geography',
        'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'Physical Education', 'Art', 'Music'
    ];

    // Initial Mock Data for Classes
    const [classes, setClasses] = useState([
        { id: 1, name: 'Class 1', numeric: 1, academicStatus: 'Active' },
        { id: 2, name: 'Class 2', numeric: 2, academicStatus: 'Active' },
        { id: 3, name: 'Class 3', numeric: 3, academicStatus: 'Active' },
        { id: 4, name: 'Class 4', numeric: 4, academicStatus: 'Active' },
        { id: 5, name: 'Class 5', numeric: 5, academicStatus: 'Active' },
        { id: 6, name: 'Class 6', numeric: 6, academicStatus: 'Active' },
        { id: 7, name: 'Class 7', numeric: 7, academicStatus: 'Active' },
        { id: 8, name: 'Class 8', numeric: 8, academicStatus: 'Active' },
        { id: 9, name: 'Class 9', numeric: 9, academicStatus: 'Active' },
        { id: 10, name: 'Class 10', numeric: 10, academicStatus: 'Active' },
    ]);

    // Initial Mock Data for Sections
    const [sections, setSections] = useState([
        { id: 1, name: 'A', classId: 1, category: 'General', capacity: 40, teacherId: 1, note: 'Primary section', academicStatus: 'Active' },
        { id: 2, name: 'B', classId: 1, category: 'General', capacity: 35, teacherId: 2, note: '', academicStatus: 'Active' },
        { id: 3, name: 'C', classId: 2, category: 'Special', capacity: 30, teacherId: 3, note: 'Evening shift', academicStatus: 'Active' },
    ]);

    // Initial Mock Data for Subjects
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Mathematics', code: 'MATH101', type: 'Theory', academicStatus: 'Active' },
        { id: 2, name: 'Science', code: 'SCI101', type: 'Theory', academicStatus: 'Active' },
    ]);

    // Assignments: { id, classId, sectionId, teacherId }
    const [assignments, setAssignments] = useState([]);

    // New State for expanded sub-modules
    const [periods, setPeriods] = useState([
        { id: 1, name: '1st Period', startTime: '08:00', endTime: '09:00' },
        { id: 2, name: '2nd Period', startTime: '09:00', endTime: '10:00' },
    ]);

    // Initial Mock Data for Students (for promotion)
    const [students, setStudents] = useState([
        { id: 101, name: 'Alice Johnson', classId: 1, sectionId: 1, roll: '01', status: 'Eligible' },
        { id: 102, name: 'Bob Smith', classId: 1, sectionId: 1, roll: '02', status: 'Eligible' },
        { id: 103, name: 'Charlie Brown', classId: 2, sectionId: 3, roll: '01', status: 'Not Eligible' },
    ]);

    const [timetable, setTimetable] = useState([
        { id: 1, classId: 1, sectionId: 1, periodId: 1, day: 'Monday', subjectId: 1 },
        { id: 2, classId: 1, sectionId: 1, periodId: 2, day: 'Tuesday', subjectId: 2 },
    ]);
    const [homework, setHomework] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const addClass = (newClass) => {
        setClasses([...classes, { ...newClass, id: Date.now(), academicStatus: newClass.academicStatus || 'Active' }]);
    };

    const addSection = (newSection) => {
        setSections([...sections, { ...newSection, id: Date.now(), academicStatus: newSection.academicStatus || 'Active' }]);
    };

    const addSubject = (newSubject) => {
        setSubjects([...subjects, { ...newSubject, id: Date.now(), academicStatus: newSubject.academicStatus || 'Active' }]);
    };

    const addAssignment = (assignment) => {
        setAssignments([...assignments, { ...assignment, id: Date.now() }]);
    };

    const addPeriod = (period) => {
        setPeriods([...periods, { ...period, id: Date.now() }]);
    };

    const addTimetableEntry = (entry) => {
        setTimetable([...timetable, { ...entry, id: Date.now() }]);
    };

    const removeTimetableEntry = (id) => {
        setTimetable(timetable.filter(t => t.id !== id));
    };

    const promoteStudents = (sourceClassId, sourceSectionId, targetClassId, targetSectionId, studentIds) => {
        const promoRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            sourceClassId,
            sourceSectionId,
            targetClassId,
            targetSectionId,
            studentCount: studentIds.length
        };
        setPromotions([...promotions, promoRecord]);

        // Update students class/section
        setStudents(prev => prev.map(s => {
            if (studentIds.includes(s.id)) {
                return { ...s, classId: parseInt(targetClassId), sectionId: parseInt(targetSectionId), status: 'Promoted' };
            }
            return s;
        }));
    };

    const updateStudent = (id, updatedData) => {
        setStudents(students.map(s => s.id === parseInt(id) ? { ...s, ...updatedData } : s));
    };

    const addHomework = (hw) => {
        setHomework([...homework, { ...hw, id: Date.now() }]);
    };

    const deleteHomework = (id) => {
        setHomework(homework.filter(h => h.id !== id));
    };

    const updateHomework = (id, updatedData) => {
        setHomework(homework.map(h => h.id === parseInt(id) ? { ...h, ...updatedData } : h));
    };

    const deleteClass = (id) => {
        setClasses(classes.filter(c => c.id !== id));
    };

    const updateClass = (id, updatedData) => {
        setClasses(classes.map(c => c.id === parseInt(id) ? { ...c, ...updatedData } : c));
    };

    const deleteSection = (id) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const updateSubject = (id, updatedData) => {
        setSubjects(subjects.map(s => s.id === parseInt(id) ? { ...s, ...updatedData } : s));
    };

    const deleteAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const updateAssignment = (id, updatedData) => {
        setAssignments(assignments.map(a => a.id === parseInt(id) ? { ...a, ...updatedData } : a));
    };

    const updateSection = (id, updatedData) => {
        setSections(sections.map(s => s.id === parseInt(id) ? { ...s, ...updatedData } : s));
    };

    const deletePeriod = (id) => {
        setPeriods(periods.filter(p => p.id !== id));
    };

    const updatePeriod = (id, updatedData) => {
        setPeriods(periods.map(p => p.id === parseInt(id) ? { ...p, ...updatedData } : p));
    };

    return (
        <AcademicsContext.Provider value={{
            classes, sections, subjects, masterSubjects, assignments,
            periods, timetable, homework, promotions, students,
            addClass, addSection, addSubject, addAssignment, addPeriod, addTimetableEntry, removeTimetableEntry, addHomework, promoteStudents, updateStudent,
            updateClass, updateSubject, updateSection, updateAssignment, updateHomework, updatePeriod,
            deleteClass, deleteSection, deleteSubject, deleteAssignment, deletePeriod, deleteHomework
        }}>
            {children}
        </AcademicsContext.Provider>
    );
};
