import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import './Reports.css';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const kpiData = [
    { label: 'Total Students', value: '1,248', change: '+4.2%', up: true, color: '#3d5ee1', bg: '#eef1fd', icon: '👨‍🎓' },
    { label: 'Student Attendance', value: '92.4%', change: '+1.8%', up: true, color: '#28c76f', bg: '#e8faf1', icon: '✅' },
    { label: 'Income This Month', value: '₹4,82,300', change: '+11.5%', up: true, color: '#ff9f43', bg: '#fff5e6', icon: '💰' },
    { label: 'Expense This Month', value: '₹1,23,450', change: '-3.2%', up: false, color: '#ea5455', bg: '#fce8e8', icon: '📉' },
    { label: 'Total Fees Due', value: '₹8,62,978', change: '-5.1%', up: false, color: '#7367f0', bg: '#efedfd', icon: '🏦' },
    { label: 'Fee Collection Today', value: '₹34,200', change: '+22%', up: true, color: '#00cfe8', bg: '#e0f9fc', icon: '💳' },
    { label: 'Total Staff', value: '87', change: '+2', up: true, color: '#ff6b6b', bg: '#fff0f0', icon: '👩‍🏫' },
    { label: 'Staff On Leave', value: '3', change: '-1', up: true, color: '#6c757d', bg: '#f0f0f0', icon: '🏖️' },
];

const monthlyFeeData = [
    { month: 'Apr', collected: 320000, due: 410000 },
    { month: 'May', collected: 380000, due: 420000 },
    { month: 'Jun', collected: 290000, due: 395000 },
    { month: 'Jul', collected: 420000, due: 450000 },
    { month: 'Aug', collected: 460000, due: 480000 },
    { month: 'Sep', collected: 390000, due: 430000 },
    { month: 'Oct', collected: 480000, due: 510000 },
    { month: 'Nov', collected: 350000, due: 400000 },
    { month: 'Dec', collected: 310000, due: 375000 },
    { month: 'Jan', collected: 440000, due: 470000 },
    { month: 'Feb', collected: 482300, due: 505000 },
    { month: 'Mar', collected: 510000, due: 530000 },
];

const attendanceData = [
    { name: 'Mon', students: 1180, staff: 82 },
    { name: 'Tue', students: 1205, staff: 85 },
    { name: 'Wed', students: 1120, staff: 80 },
    { name: 'Thu', students: 1190, staff: 84 },
    { name: 'Fri', students: 1150, staff: 79 },
    { name: 'Sat', students: 1080, staff: 70 },
];

const genderData = [
    { name: 'Male', value: 672, color: '#3d5ee1' },
    { name: 'Female', value: 576, color: '#ff6b9d' },
];

const classStrengthData = [
    { class: 'I', students: 120 },
    { class: 'II', students: 115 },
    { class: 'III', students: 108 },
    { class: 'IV', students: 130 },
    { class: 'V', students: 125 },
    { class: 'VI', students: 98 },
    { class: 'VII', students: 110 },
    { class: 'VIII', students: 105 },
    { class: 'IX', students: 95 },
    { class: 'X', students: 145 },
    { class: 'XI', students: 70 },
    { class: 'XII', students: 65 },
];

const incomeExpenseData = [
    { month: 'Apr', income: 410000, expense: 95000 },
    { month: 'May', income: 420000, expense: 102000 },
    { month: 'Jun', income: 395000, expense: 110000 },
    { month: 'Jul', income: 450000, expense: 98000 },
    { month: 'Aug', income: 480000, expense: 115000 },
    { month: 'Sep', income: 430000, expense: 108000 },
    { month: 'Oct', income: 510000, expense: 130000 },
    { month: 'Nov', income: 400000, expense: 120000 },
    { month: 'Dec', income: 375000, expense: 140000 },
    { month: 'Jan', income: 470000, expense: 112000 },
    { month: 'Feb', income: 505000, expense: 123450 },
    { month: 'Mar', income: 530000, expense: 128000 },
];

const examResultData = [
    { name: 'A+ (90-100)', value: 220, color: '#28c76f' },
    { name: 'A (80-89)', value: 340, color: '#3d5ee1' },
    { name: 'B (70-79)', value: 280, color: '#ff9f43' },
    { name: 'C (60-69)', value: 180, color: '#00cfe8' },
    { name: 'D (50-59)', value: 130, color: '#7367f0' },
    { name: 'F (<50)', value: 98, color: '#ea5455' },
];

const topSubjectsData = [
    { subject: 'Mathematics', avgScore: 82, students: 1248 },
    { subject: 'Science', avgScore: 78, students: 1248 },
    { subject: 'English', avgScore: 85, students: 1248 },
    { subject: 'Social Studies', avgScore: 75, students: 1248 },
    { subject: 'Computer', avgScore: 88, students: 1248 },
];

const classPassRateData = [
    { class: 'I', pass: 98, fail: 2 },
    { class: 'II', pass: 95, fail: 5 },
    { class: 'III', pass: 92, fail: 8 },
    { class: 'IV', pass: 94, fail: 6 },
    { class: 'V', pass: 91, fail: 9 },
    { class: 'VI', pass: 88, fail: 12 },
    { class: 'VII', pass: 85, fail: 15 },
    { class: 'VIII', pass: 82, fail: 18 },
    { class: 'IX', pass: 78, fail: 22 },
    { class: 'X', pass: 75, fail: 25 },
    { class: 'XI', pass: 80, fail: 20 },
    { class: 'XII', pass: 82, fail: 18 },
];

const bookSalesData = [
    { month: 'Apr', sales: 15000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 45000 },
    { month: 'Jul', sales: 38000 },
    { month: 'Aug', sales: 50000 },
    { month: 'Sep', sales: 29000 },
    { month: 'Oct', sales: 18000 },
    { month: 'Nov', sales: 25000 },
    { month: 'Dec', sales: 40000 },
    { month: 'Jan', sales: 30000 },
    { month: 'Feb', sales: 42000 },
    { month: 'Mar', sales: 55000 },
];

const bookInventoryData = [
    { name: 'Textbooks', value: 4500, color: '#3d5ee1' },
    { name: 'Reference', value: 1200, color: '#28c76f' },
    { name: 'Fiction', value: 850, color: '#ff9f43' },
    { name: 'Journals', value: 300, color: '#00cfe8' },
    { name: 'Stationery', value: 2100, color: '#ea5455' },
];

const quickReportLinks = {
    'Academics': [
        { label: 'Student Report', icon: '👨‍🎓', path: '/school/reports/student', color: '#3d5ee1' },
        { label: 'Progress Report', icon: '📈', path: '/school/reports/progress-report', color: '#7367f0' },
        { label: 'Class Report', icon: '🏫', path: '/school/reports/class', color: '#28c76f' },
        { label: 'Merit Report', icon: '🏆', path: '/school/reports/merit', color: '#ff9f43' },
        { label: 'Terminal Report', icon: '🖥️', path: '/school/reports/terminal', color: '#00cfe8' },
        { label: 'Attendance Report', icon: '✅', path: '/school/reports/attendance', color: '#7367f0' },
        { label: 'Timetable Report', icon: '📅', path: '/school/reports/timetable', color: '#ea5455' },
        { label: 'Exam Schedule', icon: '📝', path: '/school/reports/exam-schedule', color: '#3d5ee1' },
        { label: 'Hall Ticket', icon: '🎫', path: '/school/reports/hall-ticket', color: '#28c76f' },
        { label: 'Online Exam', icon: '🌐', path: '/school/reports/online-exam', color: '#ff9f43' },
        { label: 'Certificate Report', icon: '🎓', path: '/school/reports/certificate', color: '#00cfe8' },
    ],
    'Fees & Accounts': [
        { label: 'Fees Report', icon: '💵', path: '/school/reports/fees', color: '#ff9f43' },
        { label: 'Due Fees Report', icon: '⚠️', path: '/school/reports/due-fees', color: '#ea5455' },
        { label: 'Balance Fees', icon: '⚖️', path: '/school/reports/balance-fees', color: '#7367f0' },
        { label: 'Transaction Report', icon: '🔄', path: '/school/reports/transactions', color: '#00cfe8' },
        { label: 'Account Ledger', icon: '📒', path: '/school/reports/ledger', color: '#3d5ee1' },
        { label: 'Audit Report', icon: '🛡️', path: '/school/reports/audit', color: '#28c76f' },
    ],
    'Inventory & Sales': [
        { label: 'Purchase Report', icon: '📦', path: '/school/reports/purchase', color: '#3d5ee1' },
        { label: 'Sale Report', icon: '💰', path: '/school/reports/sales', color: '#28c76f' },
    ],
    'Staff Management': [
        { label: 'Overtime Report', icon: '⏰', path: '/school/reports/overtime', color: '#ea5455' },
        { label: 'Salary Report', icon: '💼', path: '/school/reports/salary', color: '#3d5ee1' },
        { label: 'Leave Report', icon: '🏖️', path: '/school/reports/leave', color: '#ff9f43' },
        { label: 'Birthday Report', icon: '🎂', path: '/school/reports/staff-birthday', color: '#ff6b6b' },
    ],
    'Student Services': [
        { label: 'ID Card Report', icon: '🪪', path: '/school/reports/id-card', color: '#7367f0' },
        { label: 'Library Books', icon: '📚', path: '/school/reports/library', color: '#00cfe8' },
        { label: 'Hostel Report', icon: '🏨', path: '/school/reports/hostel', color: '#ff9f43' },
        { label: 'Transport Report', icon: '🚌', path: '/school/reports/transport', color: '#28c76f' },
        { label: 'Fine Report', icon: '🚫', path: '/school/reports/fines', color: '#ea5455' },
        { label: 'Birthday Report', icon: '🎂', path: '/school/reports/student-birthday', color: '#ff6b6b' },
    ],
};

const COLORS_BAR = ['#3d5ee1', '#28c76f', '#ff9f43', '#ea5455', '#7367f0', '#00cfe8'];

const incomeExpensePieData = [
    { name: 'Income', value: 5410000, color: '#28c76f' },
    { name: 'Expense', value: 1381450, color: '#ea5455' }
];

const feeCollectionPieData = [
    { name: 'Collected', value: 4792300, color: '#3d5ee1' },
    { name: 'Due', value: 5315000, color: '#ff9f43' }
];

const studentStrengthPieData = classStrengthData.map((c, i) => ({
    name: `Class ${c.class}`,
    value: c.students,
    color: COLORS_BAR[i % COLORS_BAR.length]
}));

const attendancePieData = [
    { name: 'Students', value: 6925, color: '#3d5ee1' },
    { name: 'Staff', value: 480, color: '#ff9f43' }
];

const subjectPerformancePieData = topSubjectsData.map((s, i) => ({
    name: s.subject,
    value: s.avgScore,
    color: COLORS_BAR[i % COLORS_BAR.length]
}));

const bookSalesPieData = [
    { name: 'Q1 Sales', value: 82000, color: '#3d5ee1' },
    { name: 'Q2 Sales', value: 117000, color: '#28c76f' },
    { name: 'Q3 Sales', value: 83000, color: '#ff9f43' },
    { name: 'Q4 Sales', value: 127000, color: '#00cfe8' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rpt-tooltip">
                <p className="rpt-tooltip-label">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, margin: '2px 0', fontSize: 13 }}>
                        {p.name}: <strong>{typeof p.value === 'number' && p.value > 10000
                            ? `₹${p.value.toLocaleString()}`
                            : p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Component ─────────────────────────────────────────────────────────────────
const ReportsDashboard = () => {
    const [activeTab, setActiveTab] = useState('Academics');
    const [activePeriod, setActivePeriod] = useState('This Year');

    const tabs = Object.keys(quickReportLinks);
    const periods = ['This Week', 'This Month', 'This Year'];

    return (
        <div className="rpt-page">
            {/* Page Header */}
            <div className="rpt-page-header">
                <div>
                    <h4 className="rpt-page-title">Reports &amp; Analytics</h4>
                    <nav className="rpt-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link>
                        <span> / </span>
                        <span className="rpt-breadcrumb-current">Reports &amp; Analytics</span>
                    </nav>
                </div>
                <div className="rpt-header-actions">
                    {periods.map(p => (
                        <button
                            key={p}
                            className={`rpt-period-btn ${activePeriod === p ? 'active' : ''}`}
                            onClick={() => setActivePeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="rpt-export-btn">
                        <span>⬇️</span> Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="rpt-kpi-grid">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="rpt-kpi-card">
                        <div className="rpt-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                            <span>{kpi.icon}</span>
                        </div>
                        <div className="rpt-kpi-info">
                            <p className="rpt-kpi-label">{kpi.label}</p>
                            <h3 className="rpt-kpi-value">{kpi.value}</h3>
                            <span className={`rpt-kpi-change ${kpi.up ? 'up' : 'down'}`}>
                                {kpi.up ? '▲' : '▼'} {kpi.change}
                                <span className="rpt-kpi-vs"> vs last month</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Report Links */}
            <div className="rpt-card rpt-quick-card">
                <div className="rpt-card-header">
                    <h5 className="rpt-card-title">Quick Report Links</h5>
                    <div className="rpt-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className={`rpt-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="rpt-quick-links">
                    {quickReportLinks[activeTab].map((link, i) => (
                        <Link key={i} to={link.path} className="rpt-quick-link">
                            <div className="rpt-quick-icon" style={{ background: link.color + '22', color: link.color }}>
                                <span>{link.icon}</span>
                            </div>
                            <span className="rpt-quick-label">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Row: Yearly Income vs Expense + Gender Ratio */}
            <div className="rpt-row rpt-row-2">
                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Yearly Income vs Expense</h5>
                        <select className="rpt-select">
                            <option>2024-25</option>
                            <option>2023-24</option>
                        </select>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={incomeExpensePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                                    {incomeExpensePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend">
                            {incomeExpensePieData.map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span>{item.name}</span>
                                    <strong>₹{item.value.toLocaleString()}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Student Gender Ratio</h5>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    isAnimationActive={false}
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [v + ' students', '']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend">
                            {genderData.map((g, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: g.color }}></span>
                                    <span className="rpt-pie-name">{g.name}</span>
                                    <strong className="rpt-pie-val">{g.value}</strong>
                                    <span className="rpt-pie-pct">({Math.round(g.value / 1248 * 100)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row: Fee Collection + Class Strength */}
            <div className="rpt-row rpt-row-2">
                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Monthly Fee Collection</h5>
                        <select className="rpt-select">
                            <option>2024-25</option>
                            <option>2023-24</option>
                        </select>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={feeCollectionPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                                    {feeCollectionPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend">
                            {feeCollectionPieData.map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span>{item.name}</span>
                                    <strong>₹{item.value.toLocaleString()}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Class-wise Student Strength</h5>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center" style={{ paddingTop: '20px' }}>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={studentStrengthPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                                    {studentStrengthPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [v + ' students', '']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend" style={{ marginTop: '0px' }}>
                            {studentStrengthPieData.map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item" style={{ flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                    <span className="rpt-pie-dot" style={{ background: item.color, margin: 0 }}></span>
                                    <strong style={{ fontSize: '11px' }}>{item.name.replace('Class ', '')}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row: Class-wise Pass Rate Analytics */}
            <div className="rpt-card">
                <div className="rpt-card-header">
                    <h5 className="rpt-card-title">Class-wise Pass vs Fail Rate (%)</h5>
                    <div className="rpt-legend-row" style={{ marginTop: 0 }}>
                        <div className="rpt-lgnd"><span style={{ background: '#28c76f' }}></span> Pass %</div>
                        <div className="rpt-lgnd"><span style={{ background: '#ea5455' }}></span> Fail %</div>
                    </div>
                </div>
                <div className="rpt-chart-body">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={classPassRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{ fill: '#6e6b7b', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6e6b7b', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
                            <Bar dataKey="pass" fill="#28c76f" radius={[4, 4, 0, 0]} barSize={24} name="Pass Rate" />
                            <Bar dataKey="fail" fill="#ea5455" radius={[4, 4, 0, 0]} barSize={24} name="Fail Rate" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row: Attendance + Exam Results + Subject Performance */}
            <div className="rpt-row rpt-row-3">
                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Weekly Attendance</h5>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={attendancePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none" paddingAngle={2}>
                                    {attendancePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [v + ' present', '']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend" style={{ gap: '8px 12px' }}>
                            {attendancePieData.map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span style={{ fontSize: '12px' }}>{item.name}</span>
                                    <strong style={{ fontSize: '13px' }}>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Exam Results</h5>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={examResultData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {examResultData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v + ' students', n]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-exam-legend" style={{ padding: '8px', gap: '4px 8px' }}>
                            {examResultData.map((item, i) => (
                                <div key={i} className="rpt-exam-legend-item" style={{ fontSize: '11px' }}>
                                    <span className="rpt-pie-dot" style={{ background: item.color, width: '8px', height: '8px' }}></span>
                                    <span>{item.name.split(' ')[0]}</span>
                                    <strong>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Subject Performance</h5>
                        <Link to="/school/reports/exam-schedule" className="rpt-view-all" style={{ fontSize: '12px' }}>→</Link>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={subjectPerformancePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                                    {subjectPerformancePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [v + '% Avg Score', '']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend" style={{ gap: '6px 10px' }}>
                            {subjectPerformancePieData.slice(0, 3).map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span style={{ fontSize: '11px' }}>{item.name}</span>
                                    <strong style={{ fontSize: '12px' }}>{item.value}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row: Book Sales + Book Inventory */}
            <div className="rpt-row rpt-row-2">
                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Monthly Book Sales</h5>
                        <select className="rpt-select">
                            <option>2024-25</option>
                            <option>2023-24</option>
                        </select>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={bookSalesPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                                    {bookSalesPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-pie-legend">
                            {bookSalesPieData.map((item, i) => (
                                <div key={i} className="rpt-pie-legend-item">
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span>{item.name}</span>
                                    <strong>₹{item.value.toLocaleString()}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rpt-card">
                    <div className="rpt-card-header">
                        <h5 className="rpt-card-title">Library / Book Inventory</h5>
                    </div>
                    <div className="rpt-chart-body rpt-chart-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie isAnimationActive={false} data={bookInventoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {bookInventoryData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v + ' items', n]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="rpt-exam-legend">
                            {bookInventoryData.map((item, i) => (
                                <div key={i} className="rpt-exam-legend-item" style={{ minWidth: '40%' }}>
                                    <span className="rpt-pie-dot" style={{ background: item.color }}></span>
                                    <span>{item.name}</span>
                                    <strong>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="rpt-footer">
                <p>© 2025 MindWhile School ERP. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ReportsDashboard;
