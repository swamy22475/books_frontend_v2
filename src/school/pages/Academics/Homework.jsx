import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicsContext } from '../../../context/AcademicsContext';
import {
    IconSearch,
    IconPlus,
    IconFilter,
    IconChevronDown,
    IconEye,
    IconPencil,
    IconTrash
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import '../Transport/ManageStudentTransport.css';
import '../FrontOffice/VisitorBook.css';
import './Academics.css';

const Homework = () => {
    const { homework, deleteHomework } = useContext(AcademicsContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [entries, setEntries] = useState(10);

    const filteredHomework = homework.filter(h => {
        const title = h.homework || '';
        const subject = h.subjectName || '';
        const className = h.className || '';
        const search = searchTerm.toLowerCase();

        return title.toLowerCase().includes(search) ||
            subject.toLowerCase().includes(search) ||
            className.toLowerCase().includes(search);
    });

    const displayHomework = filteredHomework.slice(0, entries);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
    };

    return (
        <div className="student-list-page transport-page visitor-book-page w-full">
            <div className="page-header">
                <div className="page-title">
                    <h4>Homework & Assignments</h4>
                    <nav className="breadcrumb">
                        <span className="breadcrumb-link">Study Center</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="current">Homework & Assignments</span>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button
                        className="btn btn-primary flex items-center gap-2"
                        style={{
                            background: 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(61, 94, 225, 0.2)'
                        }}
                        onClick={() => navigate('/school/study/assignments/add')}
                    >
                        <IconPlus size={18} /> Add Homework
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Assignments List</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            className="search-input-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="export-button-group">
                        <button className="export-btn">Copy</button>
                        <button className="export-btn">CSV</button>
                        <button className="export-btn">Excel</button>
                        <button className="export-btn">PDF</button>
                        <button className="export-btn">Print</button>
                        <div className="filter-dropdown-btn">
                            <IconFilter size={16} />
                            <span>Filter</span>
                            <IconChevronDown size={14} />
                        </div>
                    </div>
                </div>
                {/* Header Area */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
                    <div>
                        <h5 className="text-xl font-bold text-slate-800 m-0">All Assignments</h5>
                        <p className="text-sm text-slate-500 mt-1">Manage and view all deployed homework</p>
                    </div>
                </div>



                {/* Table */}
                <div className="table-wrap px-0">
                    <table className="premium-table-v2">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Class & Section</th>
                                <th>Subject</th>
                                <th>Due Date</th>
                                <th>Assigned By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayHomework.length > 0 ? (
                                displayHomework.map((hw, index) => (
                                    <tr key={hw.id} className="table-row-v2">
                                        <td>
                                            <div className="font-medium text-slate-700">{hw.homework}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-600 text-xs font-semibold">
                                                {hw.className} - {hw.sectionName}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-bold text-slate-700">{hw.subjectName}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-600 text-xs font-medium">{hw.date}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-500 text-sm">Amit Sharma</div>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none' }}
                                                    title="View Submissions"
                                                >
                                                    <IconEye size={18} stroke={2} />
                                                </button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none' }}
                                                    title="Edit"
                                                    onClick={() => navigate(`/school/study/assignments/edit/${hw.id}`)}
                                                >
                                                    <IconPencil size={18} stroke={2} />
                                                </button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none' }}
                                                    title="Delete"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this homework?')) {
                                                            deleteHomework(hw.id);
                                                        }
                                                    }}
                                                >
                                                    <IconTrash size={18} stroke={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <IconSearch size={40} className="text-slate-300" />
                                            <p className="text-[15px] font-medium">No homework assignments found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex items-center justify-between text-[13px] text-gray-500 border-t border-slate-100 bg-slate-50/30">
                    <span>Showing 1 to {filteredHomework.length} of {filteredHomework.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homework;
