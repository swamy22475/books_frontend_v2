import React, { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import {
    IconChartBar, IconUserCheck, IconCalendarEvent, IconCertificate,
    IconActivity, IconReportAnalytics, IconArrowLeft, IconPrinter,
    IconTrendingUp, IconAward, IconChecklist, IconMoodSmile, IconLayoutDashboard
} from '@tabler/icons-react';
import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import './StudentAnalytics.css';

const StudentAnalytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { students } = useContext(StudentContext);
    const [examFilter, setExamFilter] = useState('Overall');

    const student = useMemo(() => students.find(s => s.id === id) || {
        name: 'Aaliyah',
        class: '10',
        rollNo: '1001',
        admissionNo: 'PRE2209',
        image: null
    }, [id, students]);

    const ComparisonData = {
        'Overall': [
            { subject: 'Math', me: 95, topper: 98 },
            { subject: 'Science', me: 88, topper: 94 },
            { subject: 'English', me: 92, topper: 96 },
            { subject: 'Physics', me: 90, topper: 97 },
        ],
        'Exam-1': [
            { subject: 'Math', me: 85, topper: 92 },
            { subject: 'Science', me: 82, topper: 88 },
            { subject: 'English', me: 88, topper: 94 },
            { subject: 'Physics', me: 85, topper: 90 },
        ],
        'Exam-2': [
            { subject: 'Math', me: 92, topper: 96 },
            { subject: 'Science', me: 90, topper: 95 },
            { subject: 'English', me: 94, topper: 98 },
            { subject: 'Physics', me: 94, topper: 97 },
        ],
        'Final Exam': [
            { subject: 'Math', me: 98, topper: 100 },
            { subject: 'Science', me: 94, topper: 98 },
            { subject: 'English', me: 96, topper: 99 },
            { subject: 'Physics', me: 97, topper: 100 },
        ]
    };

    const currentComparison = ComparisonData[examFilter];

    // Sample detailed analytics data per exam
    const PerformanceTrend = [
        { month: 'Jan', score: 78, classAvg: 70 },
        { month: 'Feb', score: 82, classAvg: 72 },
        { month: 'Mar', score: 85, classAvg: 75 },
        { month: 'Apr', score: 80, classAvg: 74 },
        { month: 'May', score: 92, classAvg: 76 },
        { month: 'Jun', score: 88, classAvg: 75 },
    ];

    const ExamSubjectData = {
        'Overall': [
            { subject: 'Math', value: 95, fullMark: 100 },
            { subject: 'Science', value: 88, fullMark: 100 },
            { subject: 'English', value: 92, fullMark: 100 },
            { subject: 'History', value: 80, fullMark: 100 },
            { subject: 'Geography', value: 85, fullMark: 100 },
            { subject: 'Physics', value: 90, fullMark: 100 },
        ],
        'Exam-1': [
            { subject: 'Math', value: 85, fullMark: 100 },
            { subject: 'Science', value: 82, fullMark: 100 },
            { subject: 'English', value: 88, fullMark: 100 },
            { subject: 'History', value: 75, fullMark: 100 },
            { subject: 'Geography', value: 80, fullMark: 100 },
            { subject: 'Physics', value: 85, fullMark: 100 },
        ],
        'Exam-2': [
            { subject: 'Math', value: 92, fullMark: 100 },
            { subject: 'Science', value: 90, fullMark: 100 },
            { subject: 'English', value: 94, fullMark: 100 },
            { subject: 'History', value: 85, fullMark: 100 },
            { subject: 'Geography', value: 88, fullMark: 100 },
            { subject: 'Physics', value: 94, fullMark: 100 },
        ],
        'Final Exam': [
            { subject: 'Math', value: 98, fullMark: 100 },
            { subject: 'Science', value: 94, fullMark: 100 },
            { subject: 'English', value: 96, fullMark: 100 },
            { subject: 'History', value: 88, fullMark: 100 },
            { subject: 'Geography', value: 92, fullMark: 100 },
            { subject: 'Physics', value: 97, fullMark: 100 },
        ]
    };

    const currentSubjectData = ExamSubjectData[examFilter];

    const AttendanceData = [
        { name: 'Present', value: 92, color: '#10b981' },
        { name: 'Absent', value: 5, color: '#ff4d4f' },
        { name: 'Late', value: 3, color: '#ff9f43' },
    ];

    const PermissionData = {
        summary: [
            { period: 'This Week', count: 2, limit: 3, color: '#3d5ee1' },
            { period: 'This Month', count: 6, limit: 12, color: '#7367f0' },
            { period: 'This Year', count: 42, limit: 100, color: '#ff9f43' },
        ],
        reasons: [
            { name: 'Medical', value: 60, color: '#10b981' },
            { name: 'Family', value: 25, color: '#3d5ee1' },
            { name: 'Other', value: 15, color: '#ff9f43' }
        ]
    };

    const ComplaintData = [
        {
            date: '22 Feb 2024',
            category: 'Discipline',
            reason: 'Uniform violation and late arrival during first period.',
            decision: 'Verbal warning issued; parent notified via portal.',
            status: 'Resolved',
            priority: 'Low'
        },
        {
            date: '10 Jan 2024',
            category: 'Academic',
            reason: 'Incomplete assignments for Mathematics for three consecutive days.',
            decision: 'Extra remedial classes assigned; daily progress report required.',
            status: 'Closed',
            priority: 'Medium'
        }
    ];

    const stats = [
        {
            label: 'OVERALL GRADE',
            value: examFilter === 'Overall' ? 'A+' : (examFilter === 'Final Exam' ? 'A++' : 'A'),
            sub: 'Top 5%',
            icon: IconTrendingUp,
            color: '#3d5ee1'
        },
        {
            label: 'ATTENDANCE',
            value: '92%',
            sub: 'Healthy',
            icon: IconUserCheck,
            color: '#10b981'
        },
        {
            label: 'RANK',
            value: examFilter === 'Overall' ? '#04' : '#03',
            sub: 'In Class 10-A',
            icon: IconAward,
            color: '#ff9f43'
        },
        {
            label: 'CREDITS',
            value: '1,240',
            sub: '+120 this month',
            icon: IconActivity,
            color: '#7367f0'
        },
    ];

    return (
        <div className="student-analytics-page">
            <div className="sa-container">
                {/* ── Header ── */}
                <div className="sa-header">
                    <div className="sa-header-left">
                        <button className="sa-back-btn" onClick={() => navigate(-1)}>
                            <IconArrowLeft size={18} />
                        </button>
                        <div>
                            <h4>Reports & Analytics Dashboard</h4>
                            <nav className="sa-breadcrumb">
                                <Link to="/school/students">Student Management</Link> / <span>{student.name}</span> / <span className="current">Analytics</span>
                            </nav>
                        </div>
                    </div>
                    <div className="sa-header-actions">
                        <button className="sa-action-btn print" onClick={() => window.print()}>
                            <IconPrinter size={18} /> Print All Reports
                        </button>
                    </div>
                </div>

                {/* ── Student Quick Info Bar ── */}
                <div className="sa-student-bar">
                    <div className="sa-student-info">
                        <div className="sa-avatar">
                            {student.image ? <img src={student.image} alt="" /> : (student.name ? student.name.charAt(0) : 'S')}
                        </div>
                        <div>
                            <h5>{student.name}</h5>
                            <p>Class {student.class} • Roll No: {student.rollNo} • Adm: {student.admissionNo}</p>
                        </div>
                    </div>
                    <div className="sa-badges">
                        <span className="sa-badge-pill scholar">SCHOLAR BADGE</span>
                        <span className="sa-badge-pill science">SCIENCE CLUB</span>
                    </div>
                </div>

                {/* KPI Stats */}
                <div className="sa-stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="sa-stat-card">
                            <div className="sa-stat-info">
                                <span className="sa-stat-label">{s.label}</span>
                                <h3 className="sa-stat-value">{s.value}</h3>
                                <span className="sa-stat-sub">{s.sub}</span>
                            </div>
                            <div className="sa-stat-icon-wrap" style={{ backgroundColor: `${s.color}10`, color: s.color }}>
                                <s.icon size={26} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Controls Row */}
                <div className="sa-filters-row">
                    <div className="sa-filter-group">
                        <label>Select Report View</label>
                        <select
                            className="sa-main-filter"
                            value={examFilter}
                            onChange={(e) => setExamFilter(e.target.value)}
                        >
                            <option value="Overall">Overall Performance</option>
                            <option value="Exam-1">Unit Test / Exam-1</option>
                            <option value="Exam-2">Mid-Term / Exam-2</option>
                            <option value="Final Exam">Final Examination</option>
                        </select>
                    </div>
                    <div className="sa-filter-info">
                        <p>Showing <strong>{examFilter}</strong> report data for current academic session.</p>
                    </div>
                </div>

                {/* ── Charts Section ── */}
                <div className="sa-charts-grid">
                    {/* Performance Trend */}
                    <div className="sa-chart-card large">
                        <div className="sa-chart-header">
                            <h6><IconReportAnalytics size={18} /> Academic Performance Trend</h6>
                            <select className="sa-chart-filter-sm">
                                <option>Current Session</option>
                                <option>Last Session</option>
                            </select>
                        </div>
                        <div className="sa-chart-body">
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={PerformanceTrend}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3d5ee1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3d5ee1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9b9b9b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9b9b9b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3d5ee1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="My Score" />
                                    <Area type="monotone" dataKey="classAvg" stroke="#b1b1b1" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Class Average" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Comparison with Topper */}
                    <div className="sa-chart-card">
                        <div className="sa-chart-header">
                            <h6><IconChartBar size={18} /> Comparison with Topper</h6>
                            <div className="sa-badge-small">{examFilter}</div>
                        </div>
                        <div className="sa-chart-body">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={currentComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
                                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6e6b7b' }} />
                                    <YAxis hide domain={[0, 110]} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                                    <Bar dataKey="me" fill="#3d5ee1" radius={[4, 4, 0, 0]} name="My Score" barSize={12} />
                                    <Bar dataKey="topper" fill="#10b981" radius={[4, 4, 0, 0]} name="Class Topper" barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subject Distribution */}
                    <div className="sa-chart-card">
                        <div className="sa-chart-header">
                            <h6><IconChartBar size={18} /> Subject-wise Strength</h6>
                        </div>
                        <div className="sa-chart-body">
                            <ResponsiveContainer width="100%" height={320}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentSubjectData}>
                                    <PolarGrid stroke="#f0f2f5" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6e6b7b', fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                                    <Radar name="Performance" dataKey="value" stroke="#7367f0" fill="#7367f0" fillOpacity={0.2} strokeWidth={2} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Attendance Analytics */}
                    <div className="sa-chart-card">
                        <div className="sa-chart-header">
                            <h6><IconUserCheck size={18} /> Attendance Breakdown</h6>
                        </div>
                        <div className="sa-chart-body centered">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={AttendanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {AttendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="sa-pie-legend">
                                {AttendanceData.map((d, i) => (
                                    <div key={i} className="sa-legend-item">
                                        <span className="dot" style={{ backgroundColor: d.color }}></span>
                                        <span className="label text-truncate">{d.name}</span>
                                        <span className="value">{d.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="sa-chart-card medium">
                        <div className="sa-chart-header">
                            <h6><IconCertificate size={18} /> Recent Achievements</h6>
                        </div>
                        <div className="sa-achievement-list">
                            <div className="sa-ach-item">
                                <div className="ach-icon"><IconCertificate /></div>
                                <div className="ach-info">
                                    <p className="ach-title">1st Place - Robotics Competition</p>
                                    <p className="ach-date">12 Feb 2024 • Tech-Fest 2024</p>
                                </div>
                            </div>
                            <div className="sa-ach-item">
                                <div className="ach-icon green"><IconAward size={20} /></div>
                                <div className="ach-info">
                                    <p className="ach-title">Perfect Attendance Award</p>
                                    <p className="ach-date">Jan 2024 • Monthly Recognition</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Behavioural Report */}
                    <div className="sa-chart-card">
                        <div className="sa-chart-header">
                            <h6><IconActivity size={18} /> Behavioural Analytics</h6>
                        </div>
                        <div className="sa-behaviour-content">
                            <div className="behaviour-kpis">
                                <div className="beh-kpi">
                                    <div className="beh-label"><span>Discipline</span> <span>95%</span></div>
                                    <div className="kpi-bar"><div className="fill" style={{ width: '95%' }}></div></div>
                                </div>
                                <div className="beh-kpi">
                                    <div className="beh-label"><span>Participation</span> <span>85%</span></div>
                                    <div className="kpi-bar"><div className="fill" style={{ width: '85%' }}></div></div>
                                </div>
                            </div>
                            <div className="beh-remarks">
                                <div className="remark-item">
                                    <IconMoodSmile size={20} color="#10b981" />
                                    <p>"Very proactive in team activities and shows great discipline."</p>
                                    <span>- Mr. John (Science Teacher)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Permissions Tracking ── */}
                    <div className="sa-chart-card medium">
                        <div className="sa-chart-header">
                            <h6><IconCalendarEvent size={18} /> Permissions & Out-pass Tracking</h6>
                        </div>
                        <div className="sa-permission-body">
                            <div className="sa-perm-stats">
                                {PermissionData.summary.map((p, i) => (
                                    <div key={i} className="sa-perm-box" style={{ borderColor: `${p.color}20` }}>
                                        <span className="p-label" style={{ color: p.color }}>{p.period}</span>
                                        <div className="p-val-row">
                                            <h4 className="p-count">{p.count}</h4>
                                            <span className="p-limit">/ {p.limit} limit</span>
                                        </div>
                                        <div className="p-mini-bar">
                                            <div className="fill" style={{ width: `${(p.count / p.limit) * 100}%`, backgroundColor: p.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="sa-perm-footer">
                                <div className="sa-perm-reasons">
                                    <h6>Reason Breakdown</h6>
                                    <div className="reasons-list">
                                        {PermissionData.reasons.map((r, i) => (
                                            <div key={i} className="reason-chip">
                                                <span className="dot" style={{ backgroundColor: r.color }}></span>
                                                <span>{r.name} ({r.value}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Complaint & Disciplinary Report ── */}
                    <div className="sa-chart-card medium">
                        <div className="sa-chart-header">
                            <h6><IconActivity size={18} /> Complaint & Disciplinary Log</h6>
                        </div>
                        <div className="sa-complaint-list">
                            {ComplaintData.map((c, i) => (
                                <div key={i} className={`sa-complaint-item ${c.priority.toLowerCase()}`}>
                                    <div className="sa-ci-top">
                                        <div className="sa-ci-meta">
                                            <span className="sa-ci-date">{c.date}</span>
                                            <span className="sa-ci-tag">{c.category}</span>
                                        </div>
                                        <span className={`sa-ci-status ${c.status.toLowerCase()}`}>{c.status}</span>
                                    </div>
                                    <div className="sa-ci-body">
                                        <p className="sa-ci-reason"><strong>Reason:</strong> {c.reason}</p>
                                        <div className="sa-ci-decision">
                                            <IconUserCheck size={16} />
                                            <span><strong>Decision:</strong> {c.decision}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {ComplaintData.length === 0 && <p className="sa-empty-text">No complaints recorded for this period.</p>}
                        </div>
                    </div>
                </div>

                {/* ── Table Section ── */}
                <div className="sa-table-section">
                    <div className="sa-table-card">
                        <div className="sa-table-header">
                            <h6>Detailed Test Breakdown ({examFilter})</h6>
                            <button className="sa-export-btn">Download CSV</button>
                        </div>
                        <div className="sa-table-wrap">
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Test / Exam</th>
                                        <th>Obtained</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSubjectData.map((s, i) => (
                                        <tr key={i}>
                                            <td><strong>{s.subject}</strong></td>
                                            <td>{examFilter === 'Overall' ? 'Mid Term Assessment' : `${examFilter} Evaluation`}</td>
                                            <td>{s.value} / 100</td>
                                            <td>
                                                <div className="sa-progress-cell">
                                                    <span>{s.value}%</span>
                                                    <div className="sa-mini-bar"><div className="fill" style={{ width: `${s.value}%` }}></div></div>
                                                </div>
                                            </td>
                                            <td>{s.value >= 90 ? 'A+' : s.value >= 80 ? 'A' : 'B'}</td>
                                            <td><span className="sa-status-badge pass">Pass</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon Star since IconStar wasn't imported from tabler but used
const IconStar = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.46 4.73L5.82 21z" /></svg>
);

export default StudentAnalytics;
