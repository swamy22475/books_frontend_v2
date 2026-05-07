import React, { createContext, useState } from 'react';

export const ExaminationContext = createContext();

export const ExaminationProvider = ({ children }) => {
    // Updated Mock Data with quizQuestions array
    const [onlineExams, setOnlineExams] = useState([
        {
            id: 1,
            title: 'Final Revision Test',
            quiz: true,
            questions: '8', // Kept for backward compatibility if needed, but logic should prefer quizQuestions.length
            quizQuestions: [
                {
                    id: 101,
                    question: 'What is the capital of France?',
                    type: 'single',
                    options: ['London', 'Berlin', 'Paris', 'Madrid'],
                    correctAnswer: 'Paris',
                    marks: 1
                },
                {
                    id: 102,
                    question: 'Which of the following are prime numbers?',
                    type: 'multiple',
                    options: ['2', '4', '7', '9'],
                    correctAnswer: ['2', '7'],
                    marks: 2
                }
            ],
            attempt: 7,
            examFrom: '2026-02-23T13:33:00',
            examTo: '2026-02-28T13:33:00',
            duration: '01:00:00',
            published: true,
            resultPublished: false,
            description: 'This revision test is conducted online to help students revise important topics before the final examination. Attempt all questions sincerely.',
            status: 'Upcoming'
        },
        {
            id: 2,
            title: 'Class Evaluation Test',
            quiz: true,
            questions: '11',
            quizQuestions: [],
            attempt: 5,
            examFrom: '2026-02-17T13:30:00',
            examTo: '2026-02-23T13:31:00',
            duration: '01:00:00',
            published: true,
            resultPublished: false,
            description: 'This online evaluation test assesses students\' overall performance and concept clarity. Results will help teachers identify areas for improvement.',
            status: 'Upcoming'
        },
        {
            id: 3,
            title: 'Unit Test - Term I',
            quiz: true,
            questions: '8',
            quizQuestions: [],
            attempt: 10,
            examFrom: '2026-01-12T13:27:00',
            examTo: '2026-01-16T13:27:00',
            duration: '01:00:00',
            published: true,
            resultPublished: true,
            description: 'This online unit test covers the prescribed syllabus of Term I. Students are advised to read questions carefully and submit the exam on time.',
            status: 'Closed'
        },
    ]);

    const [examSchedules, setExamSchedules] = useState([
        {
            id: 1,
            exam: 'FA-1',
            subject: 'Mathematics',
            classId: '10th class',
            section: 'A',
            date: '2025-06-08',
            startTime: '09:00',
            endTime: '12:00',
            roomNo: '101'
        },
        {
            id: 2,
            exam: 'FA-1',
            subject: 'Science',
            classId: '10th class',
            section: 'A',
            date: '2025-06-09',
            startTime: '09:00',
            endTime: '12:00',
            roomNo: '102'
        },
        {
            id: 3,
            exam: 'SA-1',
            subject: 'English',
            classId: '9th class',
            section: 'B',
            date: '2025-09-15',
            startTime: '10:00',
            endTime: '01:00',
            roomNo: '201'
        }
    ]);

    // Add new online exam
    const addOnlineExam = (newExam) => {
        setOnlineExams([...onlineExams, { ...newExam, id: Date.now(), status: 'Upcoming', quizQuestions: [] }]);
    };

    // Update online exam
    const updateOnlineExam = (id, updatedData) => {
        setOnlineExams(onlineExams.map(exam =>
            exam.id === parseInt(id) ? { ...exam, ...updatedData } : exam
        ));
    };

    // Delete online exam
    const deleteOnlineExam = (id) => {
        setOnlineExams(onlineExams.filter(exam => exam.id !== id));
    };

    // Get single exam by ID
    const getOnlineExamById = (id) => {
        return onlineExams.find(exam => exam.id === parseInt(id));
    };

    // --- Question Management Functions ---
    const addQuestion = (examId, question) => {
        setOnlineExams(prevExams => prevExams.map(exam => {
            if (exam.id === parseInt(examId)) {
                const updatedQuestions = [...(exam.quizQuestions || []), { ...question, id: Date.now() }];
                return { ...exam, quizQuestions: updatedQuestions, questions: updatedQuestions.length.toString() };
            }
            return exam;
        }));
    };

    const updateQuestion = (examId, questionId, updatedQuestion) => {
        setOnlineExams(prevExams => prevExams.map(exam => {
            if (exam.id === parseInt(examId)) {
                return {
                    ...exam,
                    quizQuestions: exam.quizQuestions.map(q => q.id === questionId ? { ...q, ...updatedQuestion } : q)
                };
            }
            return exam;
        }));
    };

    const deleteQuestion = (examId, questionId) => {
        setOnlineExams(prevExams => prevExams.map(exam => {
            if (exam.id === parseInt(examId)) {
                const updatedQuestions = exam.quizQuestions.filter(q => q.id !== questionId);
                return { ...exam, quizQuestions: updatedQuestions, questions: updatedQuestions.length.toString() };
            }
            return exam;
        }));
    };

    // --- Exam Schedule Functions ---
    const addExamSchedule = (schedule) => {
        setExamSchedules([...examSchedules, { ...schedule, id: Date.now() }]);
    };

    const updateExamSchedule = (id, updatedData) => {
        setExamSchedules(examSchedules.map(sch =>
            sch.id === id ? { ...sch, ...updatedData } : sch
        ));
    };

    const deleteExamSchedule = (id) => {
        setExamSchedules(examSchedules.filter(sch => sch.id !== id));
    };

    return (
        <ExaminationContext.Provider value={{
            onlineExams,
            addOnlineExam,
            updateOnlineExam,
            deleteOnlineExam,
            getOnlineExamById,
            addQuestion,
            updateQuestion,
            deleteQuestion,
            examSchedules,
            addExamSchedule,
            updateExamSchedule,
            deleteExamSchedule
        }}>
            {children}
        </ExaminationContext.Provider>
    );
};

