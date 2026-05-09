import React, { useContext, useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExaminationContext } from '../../../context/ExaminationContext';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconDeviceDesktop,
    IconSearch,
    IconCopy,
    IconPrinter,
    IconX,
    IconClipboardList,
    IconEye,
    IconHelp,
    IconFileText,
    IconTable,
    IconFile as IconPdf,
    IconPencil,
    IconSelector,
    IconClock,
    IconAlertCircle
} from '@tabler/icons-react';
import { EyeIcon, EditIcon, DeleteIcon } from '../../../components/Icons';
import '../Academics/Academics.css';

const OnlineExam = () => {
    const { onlineExams, deleteOnlineExam, updateOnlineExam } = useContext(ExaminationContext);
    const navigate = useNavigate();

    // State definitions
    const [selectedExams, setSelectedExams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recordsPerPage, setRecordsPerPage] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusOpenId, setStatusOpenId] = useState(null);
    const [activeTab, setActiveTab] = useState('Upcoming');

    // Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedExamForView, setSelectedExamForView] = useState(null);

    // Helpers
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredExams = useMemo(() => {
        if (!Array.isArray(onlineExams)) return [];
        return onlineExams.filter(exam =>
            exam.status === activeTab &&
            (exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [onlineExams, activeTab, searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedExams(filteredExams.map(exam => exam.id));
        } else {
            setSelectedExams([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedExams(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleStatusUpdate = (id, newStatus) => {
        updateOnlineExam(id, { status: newStatus });
        setStatusOpenId(null);
    };

    const toggleStatusDropdown = (id, e) => {
        e.stopPropagation();
        setStatusOpenId(statusOpenId === id ? null : id);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setStatusOpenId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleAddClick = () => {
        navigate('/school/examination/online-exam/add');
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
            deleteOnlineExam(id);
        }
    };

    const handleEditClick = (exam) => {
        navigate(`/school/examination/online-exam/edit/${exam.id}`);
    };

    const handleViewClick = (exam) => {
        setSelectedExamForView(exam);
        setViewModalOpen(true);
    };

    const closeViewModal = () => {
        setViewModalOpen(false);
        setTimeout(() => setSelectedExamForView(null), 300); // Clear after animation
    };

    const HEADERS = ['Assignment Title', 'Description', 'Questions', 'Attempts', 'Duration', 'Exam From', 'Exam To', 'Published', 'Result'];

    const getRowData = (exam) => [
        exam.title,
        exam.description || '',
        exam.quizQuestions && exam.quizQuestions.length > 0 ? exam.quizQuestions.length : (exam.questions ? exam.questions.toString().replace('Qs', '') : '0'),
        exam.attempt,
        exam.duration,
        formatDate(exam.examFrom),
        formatDate(exam.examTo),
        exam.published ? 'Published' : 'Draft',
        exam.resultPublished ? 'Released' : 'Pending',
    ];

    const handleCopy = () => {
        const lines = [
            HEADERS.join('\t'),
            ...filteredExams.map(exam => getRowData(exam).join('\t')),
        ].join('\n');
        navigator.clipboard.writeText(lines).then(() => {
            alert(`${filteredExams.length} record(s) copied to clipboard!`);
        });
    };

    const handleCSV = () => {
        const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
        const csvContent = [
            HEADERS.map(escape).join(','),
            ...filteredExams.map(exam => getRowData(exam).map(escape).join(',')),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `online-assignments-${activeTab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExcel = () => {
        const headerRow = HEADERS.map(h => `<th style="background:#dbeafe;font-weight:bold;border:1px solid #93c5fd;padding:6px 10px;">${h}</th>`).join('');
        const dataRows = filteredExams.map((exam, i) => {
            const cells = getRowData(exam).map(val => `<td style="border:1px solid #e2e8f0;padding:6px 10px;">${val}</td>`).join('');
            const bg = i % 2 === 0 ? '#ffffff' : '#f8faff';
            return `<tr style="background:${bg};">${cells}</tr>`;
        }).join('');
        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head><meta charset="UTF-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;}</style></head>
            <body><table><thead><tr>${headerRow}</tr></thead><tbody>${dataRows}</tbody></table></body></html>`;
        const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `online-assignments-${activeTab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xls`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const tableRef = useRef(null);

    const handlePrint = () => {
        const rows = filteredExams.map((exam, i) => {
            const qCount = exam.quizQuestions && exam.quizQuestions.length > 0
                ? exam.quizQuestions.length
                : (exam.questions ? exam.questions.toString().replace('Qs', '') : '0');
            const publishedBadge = exam.published
                ? `<span style="background:#f0fdf4;color:#16a34a;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;">Published</span>`
                : `<span style="background:#fef2f2;color:#ef4444;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;">Draft</span>`;
            const resultBadge = exam.resultPublished
                ? `<span style="background:#f0fdf4;color:#16a34a;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;">Released</span>`
                : `<span style="background:#fff7ed;color:#f59e0b;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;">Pending</span>`;
            const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
            return `
                <tr style="background:${rowBg};">
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">
                        <div style="font-weight:600;color:#1e3a5f;">${exam.title}</div>
                        <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${exam.description || ''}</div>
                    </td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#6366f1;font-weight:600;">${qCount}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;color:#475569;">${exam.attempt}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#475569;">${exam.duration}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;">
                        <div>From: ${formatDate(exam.examFrom)}</div>
                        <div style="margin-top:3px;">To: ${formatDate(exam.examTo)}</div>
                    </td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;">${publishedBadge}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;">${resultBadge}</td>
                </tr>`;
        }).join('');

        const printWindow = window.open('', '_blank', 'width=1100,height=750');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Online Assignments</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; padding: 28px; }
                    h2 { font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
                    .meta { font-size: 11.5px; color: #94a3b8; margin-bottom: 18px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
                    thead tr { background: #f1f5f9; }
                    th { padding: 10px 14px; text-align: left; font-weight: 700; color: #64748b; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
                    th.center, td.center { text-align: center; }
                    @media print { body { padding: 0; } button { display: none; } }
                </style>
            </head>
            <body>
                <h2>Online Assignments &mdash; ${activeTab}</h2>
                <div class="meta">Printed on ${new Date().toLocaleString()} &nbsp;|&nbsp; ${filteredExams.length} record(s)</div>
                <table>
                    <thead>
                        <tr>
                            <th>Assignment Title</th>
                            <th>Questions</th>
                            <th class="center">Attempts</th>
                            <th>Duration</th>
                            <th>Schedule</th>
                            <th class="center">Published</th>
                            <th class="center">Result</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:30px;color:#94a3b8;">No records found</td></tr>'}</tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    };

    return (
        <div className="student-list-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <div>
                                <h4>Online Assignment</h4>
                            </div>
                        </div>
                    </div>
                    <div className="page-header-actions">
                        <Link to="/school/examination/online-exam/add" className="btn btn-primary">
                            <IconPlus size={18} stroke={2} />
                            Create New Assignment
                        </Link>
                    </div>
                </div>

                <div className="card soft-card fade-in">
                    {/* Tabs */}
                    <div style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(249,250,251,0.4)', borderBottom: '1px solid #f1f5f9' }}>
                        <button
                            onClick={() => setActiveTab('Upcoming')}
                            style={{
                                padding: '10px 28px',
                                borderRadius: '12px',
                                fontSize: '13.5px',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: activeTab === 'Upcoming' ? '#4f46e5' : 'transparent',
                                color: activeTab === 'Upcoming' ? '#fff' : '#6b7280',
                                boxShadow: activeTab === 'Upcoming' ? '0 4px 12px rgba(79,70,229,0.25)' : 'none',
                            }}
                        >
                            Upcoming Assignment
                        </button>
                        <div style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
                        <button
                            onClick={() => setActiveTab('Closed')}
                            style={{
                                padding: '10px 28px',
                                borderRadius: '12px',
                                fontSize: '13.5px',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: activeTab === 'Closed' ? '#4f46e5' : 'transparent',
                                color: activeTab === 'Closed' ? '#fff' : '#6b7280',
                                boxShadow: activeTab === 'Closed' ? '0 4px 12px rgba(79,70,229,0.25)' : 'none',
                            }}
                        >
                            Closed Assignment
                        </button>
                    </div>

                    <div className="premium-table-wrapper">
                        {/* Table Header with Search and Records Per Page */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold text-gray-600">Show</label>
                                <select
                                    className="px-4 py-2 border-2 border-gray-100 rounded-lg outline-none focus:border-blue-400 text-sm font-medium"
                                    value={recordsPerPage}
                                    onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <label className="text-sm font-bold text-gray-600">records per page</label>
                            </div>
                            <div className="toolbar-actions">
                                <div className="relative group mr-4">
                                    <label className="text-sm font-bold text-gray-600 mr-3">Search:</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="pl-4 pr-4 py-2 border-2 border-gray-100 rounded-lg outline-none text-sm w-64 focus:border-blue-400 transition-all font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleCopy} className="toolbar-btn">Copy</button>
                                <button onClick={handleCSV} className="toolbar-btn">CSV</button>
                                <button onClick={handleExcel} className="toolbar-btn">Excel</button>
                                <button onClick={handlePrint} className="toolbar-btn">Print</button>
                            </div>
                        </div>

                        <div className="table-stats mt-4 px-8">
                            <span><strong>{filteredExams.length}</strong> assignments found</span>
                        </div>

                        <div className="table-wrap px-8 pb-8" ref={tableRef}>
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th className="col-checkbox">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={filteredExams.length > 0 && selectedExams.length === filteredExams.length}
                                            />
                                        </th>
                                        <th>Assignment Title</th>
                                        <th>Questions</th>
                                        <th className="text-center">Attempts</th>
                                        <th>Exam Duration</th>
                                        <th>Schedule</th>
                                        <th className="text-center">Published</th>
                                        <th className="text-center">Result</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredExams.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--sl-text-muted)' }}>
                                                <div className="flex flex-col items-center gap-3">
                                                    <IconAlertCircle size={40} className="opacity-20" />
                                                    <h3 className="text-lg font-semibold">No Examinations Found</h3>
                                                    <p className="text-sm opacity-70">Try adjusting your search or filters to find what you're looking for.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredExams.map((exam) => (
                                            <tr key={exam.id} className="table-row">
                                                <td className="checkbox-td">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExams.includes(exam.id)}
                                                        onChange={() => handleSelectOne(exam.id)}
                                                    />
                                                </td>
                                                <td className="name">
                                                    <div className="font-semibold text-blue-900/80">{exam.title}</div>
                                                    <div className="text-[11px] text-gray-400 mt-1 line-clamp-1 max-w-[250px]">
                                                        {exam.description || 'Electronic revision and assessment test.'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-sm font-medium text-indigo-600/90 whitespace-nowrap">
                                                        {exam.quizQuestions && exam.quizQuestions.length > 0
                                                            ? exam.quizQuestions.length
                                                            : (exam.questions ? exam.questions.toString().replace('Qs', '') : '0')}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className="text-sm font-medium text-gray-600">{exam.attempt}</span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <IconClock size={14} className="opacity-50" />
                                                        <span className="text-sm">{exam.duration}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-[12px] text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                            <span>{formatDate(exam.examFrom)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                                            <span>{formatDate(exam.examTo)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {exam.published ? (
                                                        <span className="badge badge-success">Published</span>
                                                    ) : (
                                                        <span className="badge badge-danger" style={{ background: '#fef2f2', color: '#ef4444' }}>Draft</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {exam.resultPublished ? (
                                                        <span className="badge badge-success">Released</span>
                                                    ) : (
                                                        <span className="badge badge-danger" style={{ background: '#fff7ed', color: '#f59e0b' }}>Pending</span>
                                                    )}
                                                </td>
                                                <td className="actions">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(exam)}
                                                            className="icon-btn icon-edit"
                                                            title="Edit Assignment"
                                                        >
                                                            <EditIcon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewClick(exam)}
                                                            className="icon-btn icon-view"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(exam.id)}
                                                            className="icon-btn"
                                                            style={{ background: 'rgba(239, 68, 68, 0.06)', color: '#ef4444' }}
                                                            title="Delete Assignment"
                                                        >
                                                            <DeleteIcon size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #f1f5f9' }}>
                            <span>Showing 1 to {filteredExams.length} of {filteredExams.length} entries</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                    disabled
                                    style={{ padding: '7px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', color: '#9ca3af', fontSize: '13px', cursor: 'not-allowed', opacity: 0.6 }}
                                >Previous</button>
                                <button
                                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: '#4f46e5', color: '#fff', fontWeight: 500, fontSize: '13px', border: 'none', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}
                                >1</button>
                                <button
                                    disabled
                                    style={{ padding: '7px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', color: '#9ca3af', fontSize: '13px', cursor: 'not-allowed', opacity: 0.6 }}
                                >Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Details Modal */}
                {viewModalOpen && selectedExamForView && (
                    <div
                        onClick={closeViewModal}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '16px',
                            backgroundColor: 'rgba(15,23,42,0.55)',
                            backdropFilter: 'blur(6px)',
                            animation: 'oe-backdrop 0.22s ease both',
                        }}
                    >
                        {/* Modal Background Styles */}
                        <style>{`
                            @keyframes oe-backdrop { from { opacity: 0; } to { opacity: 1; } }
                            @keyframes oe-modal-in { 
                                0% { opacity: 0; transform: scale(0.9) translateY(20px); } 
                                100% { opacity: 1; transform: scale(1) translateY(0); } 
                            }
                            .oe-modal-content {
                                background: #fff;
                                width: 100%;
                                max-width: 680px;
                                border-radius: 24px;
                                overflow: hidden;
                                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                                animation: oe-modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                            }
                            .oe-modal-header {
                                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                                padding: 24px 32px;
                                color: #fff;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }
                            .oe-detail-grid {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 24px;
                                padding: 32px;
                            }
                            .oe-info-card {
                                background: #f8fafc;
                                padding: 16px 20px;
                                border-radius: 16px;
                                border: 1px solid #f1f5f9;
                            }
                            .oe-label {
                                font-size: 11px;
                                font-weight: 700;
                                color: #94a3b8;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                                margin-bottom: 6px;
                            }
                            .oe-value {
                                font-size: 14px;
                                font-weight: 600;
                                color: #1e293b;
                            }
                        `}</style>
                        <div className="oe-modal-content" onClick={e => e.stopPropagation()}>
                            <div className="oe-modal-header">
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Exam Details</h3>
                                    <p style={{ fontSize: '12px', opacity: 0.8, margin: '4px 0 0 0' }}>Ref: {selectedExamForView.id}</p>
                                </div>
                                <button onClick={closeViewModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconX size={18} stroke={2.5} />
                                </button>
                            </div>
                            <div className="oe-detail-grid">
                                <div className="oe-info-card" style={{ gridColumn: 'span 2' }}>
                                    <div className="oe-label">Assignment Title</div>
                                    <div className="oe-value" style={{ fontSize: '16px', color: '#4f46e5' }}>{selectedExamForView.title}</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">Questions</div>
                                    <div className="oe-value">{selectedExamForView.quizQuestions?.length || selectedExamForView.questions || 0} Questions</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">Duration</div>
                                    <div className="oe-value">{selectedExamForView.duration}</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">Start Date</div>
                                    <div className="oe-value">{formatDate(selectedExamForView.examFrom)}</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">End Date</div>
                                    <div className="oe-value">{formatDate(selectedExamForView.examTo)}</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">Attempts Allowed</div>
                                    <div className="oe-value">{selectedExamForView.attempt}</div>
                                </div>
                                <div className="oe-info-card">
                                    <div className="oe-label">Passing Marks (%)</div>
                                    <div className="oe-value">{selectedExamForView.passingMarks || '33'}%</div>
                                </div>
                            </div>
                            <div style={{ padding: '0 32px 32px 32px', display: 'flex', gap: '12px' }}>
                                <button onClick={closeViewModal} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Close Preview</button>
                                <button onClick={() => navigate(`/school/examination/online-exam/edit/${selectedExamForView.id}`)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>Edit Assignment</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnlineExam;
