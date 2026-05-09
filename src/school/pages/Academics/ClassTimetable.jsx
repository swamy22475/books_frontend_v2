import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconPlus,
    IconHome,
    IconCalendarStats,
    IconPrinter,
    IconSettings,
    IconCopy,
    IconSelector,
    IconMaximize,
    IconMinimize,
    IconChevronLeft,
    IconChevronRight,
    IconChevronDown,
    IconSearch
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import './Academics.css';
import TimetableCell from './components/TimetableCell';
import AddSubjectModal from './components/AddSubjectModal';

const ClassTimetable = () => {
    const { classes, sections, subjects } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, period: null, day: '', initialData: null });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const TIMETABLE_STRUCTURE = [
        { id: 'p1', name: 'Period 1', startTime: '09:00', endTime: '09:50', type: 'period' },
        { id: 'p2', name: 'Period 2', startTime: '09:50', endTime: '10:40', type: 'period' },
        { id: 'b1', name: 'Morning Break', startTime: '10:40', endTime: '10:55', type: 'break' },
        { id: 'p3', name: 'Period 3', startTime: '10:55', endTime: '11:45', type: 'period' },
        { id: 'p4', name: 'Period 4', startTime: '11:45', endTime: '12:35', type: 'period' },
        { id: 'b2', name: 'Lunch Break', startTime: '12:35', endTime: '12:55', type: 'break' },
        { id: 'p5', name: 'Period 5', startTime: '12:55', endTime: '01:45', type: 'period' },
        { id: 'p6', name: 'Period 6', startTime: '01:45', endTime: '02:35', type: 'period' },
        { id: 'b3', name: 'Evening Break', startTime: '02:35', endTime: '02:45', type: 'break' },
        { id: 'p7', name: 'Period 7', startTime: '02:45', endTime: '04:00', type: 'period' },
    ];

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
            else await document.exitFullscreen();
        } catch (err) { console.error('Error toggling fullscreen:', err); }
    };

    const handleSaveAssignment = (data) => {
        setAssignments(prev => {
            const filtered = prev.filter(a =>
                !(a.classId === selectedClass && a.sectionId === selectedSection && a.day === data.day && a.period === data.period)
            );
            return [...filtered, {
                ...data,
                classId: selectedClass,
                sectionId: selectedSection,
                classroom: data.classroom || (modalConfig.initialData?.classroom || '')
            }];
        });
        setModalConfig({ isOpen: false, period: null, day: '', initialData: null });
    };

    const handleCellAdd = (period, day) => {
        setModalConfig({ isOpen: true, period, day, initialData: null });
    };

    const handleCellEdit = (period, day, assignment) => {
        setModalConfig({ isOpen: true, period, day, initialData: assignment });
    };

    const handleExportCSV = () => {
        if (!selectedClass || !selectedSection) return alert('Please select class and section.');

        const headers = ['Period/Day', ...days].join(',');
        const rows = TIMETABLE_STRUCTURE.map(p => {
            const rowData = days.map(day => {
                const a = assignments.find(x => x.classId === selectedClass && x.sectionId === selectedSection && x.day === day && x.period === p.id);
                return p.type === 'break' ? '[BREAK]' : (a ? `"${a.subject} (${a.teacher})"` : '-');
            });
            return [`"${p.name} (${p.startTime}-${p.endTime})"`, ...rowData].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `timetable_class_${selectedClass}_section_${selectedSection}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    // Ensure we have some subjects to select from if context is empty
    const availableSubjects = subjects.length > 0 ? subjects : [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Science' },
        { id: 3, name: 'English' },
        { id: 4, name: 'History' },
        { id: 5, name: 'Computer Science' }
    ];

    const handleCopy = () => {
        if (!selectedClass || !selectedSection) return alert('Please select class and section.');
        let text = 'Period / Day\t' + days.join('\t') + '\n';
        TIMETABLE_STRUCTURE.forEach(p => {
            text += `${p.name} (${p.startTime}-${p.endTime})`;
            days.forEach(day => {
                const a = assignments.find(x => x.classId === selectedClass && x.sectionId === selectedSection && x.day === day && x.period === p.id);
                text += `\t${p.type === 'break' ? '[BREAK]' : (a ? a.subject : '-')}`;
            });
            text += '\n';
        });
        navigator.clipboard.writeText(text);
        alert('Timetable copied to clipboard!');
    };

    const activeAssignments = assignments.filter(a => a.classId === selectedClass && a.sectionId === selectedSection);

    return (
        <div ref={containerRef} className={`academics-page ${isFullscreen ? 'bg-white' : ''}`} style={{ padding: isFullscreen ? '20px' : '' }}>
            {!isFullscreen && (
                <div className="page-header">
                    <div className="page-title">
                        <h4>Class Timetable</h4>
                        <div className="breadcrumb">
                            <IconHome size={14} />
                            <span onClick={() => navigate('/school/dashboard')} className="cursor-pointer hover:text-blue-500">Dashboard</span>
                            <span className="mx-2">/</span>
                            <span onClick={() => navigate('/school/academics')} className="cursor-pointer hover:text-blue-500">Academics</span>
                            <span className="mx-2">/</span>
                            <span className="text-blue-600 font-semibold">Class Timetable</span>
                        </div>
                    </div>
                    <div className="page-header-actions">
                        <button onClick={() => navigate('/school/academics')} className="btn btn-primary flex items-center gap-2">
                            <IconHome size={18} /> Back to Academics
                        </button>
                    </div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`${isFullscreen ? '' : 'p-8'}`}
            >
                {/* Toolbar */}
                <div className="table-toolbar-wrapper !mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Timetable Actions</h3>
                    </div>
                    <div className="toolbar-actions">
                        <button onClick={handleCopy} className="export-mini-btn flex items-center gap-2">Copy</button>
                        <button onClick={handleExportCSV} className="export-mini-btn flex items-center gap-2">CSV</button>
                        <button onClick={() => window.print()} className="export-mini-btn print-btn flex items-center gap-2">Print</button>
                        <button onClick={toggleFullscreen} className="export-mini-btn flex items-center gap-2" style={{ color: 'var(--sl-primary-color)' }}>
                            {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                    </div>
                </div>

                {/* Parameters Section - Promotion Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="card soft-card !mb-10 hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Select Class & Section</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="academics-form-field !m-0">
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Current Class</label>
                                <select
                                    className="academics-form-control transition-all focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="">-- Select Class --</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="academics-form-field !m-0">
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Current Section</label>
                                <select
                                    className="academics-form-control transition-all focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedClass}
                                >
                                    <option value="">{selectedClass ? '-- Select Section --' : '-- Select Class First --'}</option>
                                    {sections.filter(s => s.classId === parseInt(selectedClass)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Main Timetable Implementation */}
                {selectedClass && selectedSection ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="card soft-card overflow-hidden border-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(61,94,225,0.08)] transition-all duration-500 pb-10"
                    >
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/10">
                            <div className="flex items-center gap-5">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="p-3 bg-blue-50 rounded-2xl text-blue-600"
                                >
                                    <IconCalendarStats size={24} stroke={2.5} />
                                </motion.div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 leading-none mb-1">Weekly Schedule Matrix</h2>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Academic Session</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_5px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                                <motion.table
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                    }}
                                    className="w-full border-collapse"
                                >
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#3d5ee1] to-[#5a76ef] text-white shadow-md">
                                            <th className="py-6 px-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] opacity-90 border-r border-white/10 w-28">
                                                Period
                                            </th>
                                            {days.map(day => (
                                                <th key={day} className="py-6 px-6 text-center text-[14px] font-bold border-r border-white/10 last:border-r-0 tracking-wide">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {day}
                                                        <IconSelector size={14} className="opacity-50" />
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIMETABLE_STRUCTURE.map((period, index) => (
                                            <motion.tr
                                                variants={{
                                                    hidden: { opacity: 0, x: -20 },
                                                    visible: { opacity: 1, x: 0 }
                                                }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                key={period.id}
                                                className="group/row hover:bg-blue-50/10 transition-colors"
                                            >
                                                <td className={`py-8 px-6 border-r border-b border-gray-50 text-[16px] font-black text-[#1f2937] w-28 text-center ${period.type === 'break' ? 'bg-[#fcfdfe]' : 'bg-gray-50/10'} group-hover/row:bg-white transition-colors`}>
                                                    <div className="flex flex-col items-center">
                                                        <span className="leading-none mb-1">{period.endTime}</span>
                                                        {period.type !== 'break' && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60">End Time</span>}
                                                    </div>
                                                </td>
                                                {period.type === 'break' ? (
                                                    <td colSpan={days.length} className="bg-[#fcfdfe] text-center border-b border-gray-50 py-5">
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="flex items-center justify-center gap-4 opacity-70"
                                                        >
                                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-gray-200"></div>
                                                            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                                                                {period.name}
                                                            </span>
                                                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-300 to-gray-200"></div>
                                                        </motion.div>
                                                    </td>
                                                ) : (
                                                    days.map(day => {
                                                        const assignment = activeAssignments.find(a => a.day === day && a.period === period.id);
                                                        return (
                                                            <TimetableCell
                                                                key={`${period.id}-${day}`}
                                                                period={period}
                                                                day={day}
                                                                assignment={assignment}
                                                                onAdd={handleCellAdd}
                                                                onEdit={handleCellEdit}
                                                            />
                                                        );
                                                    })
                                                )}
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </motion.table>
                            </div>
                        </div>

                        <div className="px-8 pb-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-r from-blue-50/80 to-indigo-50/30 rounded-2xl p-5 border border-blue-100 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    <span className="text-sm font-bold text-blue-700">Live Scheduling Matrix Active</span>
                                </div>
                                <p className="text-xs text-blue-500 font-medium bg-white/50 px-3 py-1 rounded-full border border-blue-50 text-center shadow-sm">Click any slot to assign or edit subjects and teachers.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card soft-card p-20 text-center flex flex-col items-center justify-center space-y-6"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-full flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] border border-blue-100/50"
                        >
                            <IconCalendarStats size={48} stroke={1.5} />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Class and Section</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">Please choose a class and section from above to view and manage its weekly timetable.</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <AddSubjectModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, period: null, day: '', initialData: null })}
                onSave={handleSaveAssignment}
                period={modalConfig.period || {}}
                day={modalConfig.day}
                initialData={modalConfig.initialData}
                subjectsList={availableSubjects}
            />
        </div>
    );
};

export default ClassTimetable;
