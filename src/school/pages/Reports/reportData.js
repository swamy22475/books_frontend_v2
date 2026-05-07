/* ─────────────────────────────────────────────────────────────────
   Dummy data for every report page
   ──────────────────────────────────────────────────────────────── */

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const names = ['Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Reddy', 'Karan Mehta',
    'Divya Singh', 'Arjun Nair', 'Pooja Iyer', 'Raj Verma', 'Ananya Das',
    'Vikram Joshi', 'Meera Pillai', 'Saurabh Gupta', 'Nisha Rao', 'Arun Bose',
    'Kavya Reddy', 'Suresh Babu', 'Lakshmi Devi', 'Ravi Teja', 'Chitra Ram'];
const staffNames = ['Rajesh Kumar', 'Seetha Lakshmi', 'Anil Verma', 'Priya Nair',
    'Suresh Babu', 'Meena Kumari', 'Venkat Rao', 'Geetha Devi', 'Mohan Das', 'Radha Krishna'];
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sections = ['A', 'B', 'C'];
const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Hindi', 'Telugu', 'Physics', 'Chemistry', 'Biology'];
const feeTypes = ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Sports Fee', 'Library Fee', 'Lab Fee'];
const books = ['Wings of Fire', 'Discovery of India', 'The Alchemist', 'Harry Potter', 'Rich Dad Poor Dad',
    'Think and Grow Rich', 'The 7 Habits', 'Atomic Habits', 'Sapiens', 'Zero to One'];
const authors = ['A.P.J. Abdul Kalam', 'Jawaharlal Nehru', 'Paulo Coelho', 'J.K. Rowling', 'Robert Kiyosaki',
    'Napoleon Hill', 'Stephen Covey', 'James Clear', 'Yuval Harari', 'Peter Thiel'];
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

// helpers
const admNo = (i) => `2024/${String(1001 + i).padStart(4, '0')}`;
const date = (d, m, y = 2025) => `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
const cls = (i) => classes[i % 12];
const sec = (i) => sections[i % 3];
const name = (i) => names[i % names.length];
const staff = (i) => staffNames[i % staffNames.length];
const grade = (pct) => pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
const badge = (s) => s === 'Paid' || s === 'Present' || s === 'Issued' || s === 'Active' || s === 'Approved' || s === 'Pass' ? 'green'
    : s === 'Pending' || s === 'Late' ? 'orange'
        : s === 'Absent' || s === 'Overdue' || s === 'Fail' || s === 'Rejected' ? 'red' : 'blue';

export const REPORT_CONFIG = {

    /* 1 ─ Class Report */
    'class': {
        title: 'Class Report',
        icon: '🏫',
        filters: ['class', 'section'],
        columns: ['#', 'Class', 'Section', 'Total Students', 'Boys', 'Girls', 'Class Teacher', 'Room No', 'Status'],
        rows: Array.from({ length: 24 }, (_, i) => ({
            sno: i + 1, class: cls(i), section: sec(i),
            total: 40 + rnd(0, 15), boys: 20 + rnd(0, 8), girls: 18 + rnd(0, 8),
            teacher: staff(i), room: `R-${101 + i}`, status: 'Active',
        })),
        rowKeys: ['sno', 'class', 'section', 'total', 'boys', 'girls', 'teacher', 'room', 'status'],
        badgeKey: 'status',
    },

    /* 2 ─ Sponsorship Report */
    'sponsorship': {
        title: 'Sponsorship Report',
        icon: '🤝',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Sponsor Name', 'Type', 'Amount (₹)', 'Period', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
            sponsor: ['Rotary Club', 'Lions Club', 'Gov. Scholarship', 'Trust Fund', 'NGO Aid'][i % 5],
            type: ['Full', 'Partial'][i % 2],
            amount: (5000 + rnd(0, 5) * 1000).toLocaleString(),
            period: '2024-25',
            status: ['Active', 'Pending'][i % 3 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'sponsor', 'type', 'amount', 'period', 'status'],
        badgeKey: 'status',
    },

    /* 3 ─ ID Card Report */
    'id-card': {
        title: 'ID Card Report',
        icon: '🪪',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Section', 'DOB', 'Blood Group', 'Mobile', 'ID Status'],
        rows: Array.from({ length: 30 }, (_, i) => ({
            sno: i + 1, admNo: admNo(i), name: name(i), class: cls(i), section: sec(i),
            dob: date(rnd(1, 28), rnd(1, 12), 2010 + i % 8),
            blood: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'][i % 7],
            mobile: `+91 9${String(800000000 + i).padStart(9, '0')}`,
            status: ['Printed', 'Pending'][i % 4 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'section', 'dob', 'blood', 'mobile', 'status'],
        badgeKey: 'status',
    },

    /* 4 ─ Hall Ticket Report */
    'hall-ticket': {
        title: 'Hall Ticket Report',
        icon: '🎫',
        filters: ['class', 'section'],
        columns: ['#', 'Roll No', 'Student Name', 'Class', 'Section', 'Exam', 'Exam Date', 'Center', 'Status'],
        rows: Array.from({ length: 30 }, (_, i) => ({
            sno: i + 1, roll: `${cls(i)}${sec(i)}${String(i + 1).padStart(3, '0')}`,
            name: name(i), class: cls(i), section: sec(i),
            exam: ['Unit Test 1', 'Mid-Term', 'Final Exam'][i % 3],
            date: date(rnd(1, 28), rnd(3, 5), 2025),
            center: 'Main Hall',
            status: ['Generated', 'Pending'][i % 5 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'roll', 'name', 'class', 'section', 'exam', 'date', 'center', 'status'],
        badgeKey: 'status',
    },

    /* 5 ─ Timetable Report */
    'timetable': {
        title: 'Timetable Report',
        icon: '📅',
        filters: ['class', 'section'],
        columns: ['#', 'Day', 'Period', 'Time', 'Subject', 'Teacher', 'Class', 'Section', 'Room'],
        rows: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].flatMap((day, di) =>
            Array.from({ length: 6 }, (_, pi) => ({
                sno: di * 6 + pi + 1, day, period: `P${pi + 1}`,
                time: `${8 + pi}:00 - ${9 + pi}:00`,
                subject: subjects[(di + pi) % subjects.length],
                teacher: staff(di + pi),
                class: classes[(di + pi) % 12], section: sections[di % 3], room: `R-${101 + di + pi}`,
            }))
        ).slice(0, 36),
        rowKeys: ['sno', 'day', 'period', 'time', 'subject', 'teacher', 'class', 'section', 'room'],
        badgeKey: null,
    },

    /* 6 ─ Exam Schedule Report */
    'exam-schedule': {
        title: 'Exam Schedule Report',
        icon: '📝',
        filters: ['class'],
        columns: ['#', 'Exam Name', 'Subject', 'Class', 'Date', 'Start Time', 'End Time', 'Duration', 'Max Marks'],
        rows: Array.from({ length: 30 }, (_, i) => ({
            sno: i + 1,
            exam: ['Unit Test 1', 'Unit Test 2', 'Mid-Term', 'Annual Exam', 'Pre-Board'][i % 5],
            subject: subjects[i % subjects.length],
            class: cls(i),
            date: date(rnd(1, 28), rnd(3, 5), 2025),
            start: '9:00 AM', end: '12:00 PM', duration: '3 hrs',
            maxMarks: [50, 100][i % 2],
        })),
        rowKeys: ['sno', 'exam', 'subject', 'class', 'date', 'start', 'end', 'duration', 'maxMarks'],
        badgeKey: null,
    },

    /* 7 ─ Library Books Report */
    'library': {
        title: 'Library Books Report',
        icon: '📚',
        filters: ['class', 'section'],
        columns: ['#', 'Book Title', 'Author', 'Student Name', 'Class', 'Issue Date', 'Return Date', 'Fine (₹)', 'Status'],
        rows: Array.from({ length: 25 }, (_, i) => ({
            sno: i + 1, book: books[i % books.length], author: authors[i % authors.length],
            name: name(i), class: `${cls(i)}-${sec(i)}`,
            issue: date(rnd(1, 15), 1, 2025),
            'return': i % 4 === 0 ? '—' : date(rnd(16, 28), 2, 2025),
            fine: i % 4 === 0 ? (rnd(1, 5) * 10) : 0,
            status: i % 4 === 0 ? 'Overdue' : 'Returned',
        })),
        rowKeys: ['sno', 'book', 'author', 'name', 'class', 'issue', 'return', 'fine', 'status'],
        badgeKey: 'status',
    },

    /* 8 ─ Terminal Report */
    'terminal': {
        title: 'Terminal Report',
        icon: '🖥️',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Term 1', 'Term 2', 'Term 3', 'Total', 'Pct %', 'Grade'],
        rows: Array.from({ length: 30 }, (_, i) => {
            const t1 = rnd(40, 100), t2 = rnd(40, 100), t3 = rnd(40, 100);
            const tot = t1 + t2 + t3; const pct = Math.round(tot / 3);
            return {
                sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
                t1, t2, t3, total: tot, pct, grade: grade(pct)
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 't1', 't2', 't3', 'total', 'pct', 'grade'],
        badgeKey: 'grade',
    },

    /* 9 ─ Merit Stage Report */
    'merit': {
        title: 'Merit Stage Report',
        icon: '🏆',
        filters: ['class', 'section'],
        columns: ['#', 'Rank', 'Student Name', 'Class', 'Section', 'Total Marks', 'Percentage', 'Grade', 'Award'],
        rows: Array.from({ length: 20 }, (_, i) => {
            const pct = rnd(60, 100);
            return {
                sno: i + 1, rank: i + 1, name: name(i), class: cls(i), section: sec(i),
                total: Math.round(pct * 5), pct, grade: grade(pct),
                award: pct >= 90 ? 'Gold' : pct >= 80 ? 'Silver' : pct >= 70 ? 'Bronze' : '—'
            };
        }).sort((a, b) => b.pct - a.pct).map((r, i) => ({ ...r, sno: i + 1, rank: i + 1 })),
        rowKeys: ['sno', 'rank', 'name', 'class', 'section', 'total', 'pct', 'grade', 'award'],
        badgeKey: 'grade',
    },

    /* 10 ─ Online Exam */
    'online-exam': {
        title: 'Online Exam Report',
        icon: '💻',
        filters: ['class', 'section'],
        columns: ['#', 'Student Name', 'Class', 'Exam Title', 'Score', 'Max Score', 'Pct %', 'Time Taken', 'Status'],
        rows: Array.from({ length: 25 }, (_, i) => {
            const score = rnd(20, 100), max = 100, pct = score;
            return {
                sno: i + 1, name: name(i), class: `${cls(i)}-${sec(i)}`,
                exam: ['Science Quiz', 'Maths Test', 'English MCQ', 'GK Quiz', 'Computer Test'][i % 5],
                score, max, pct, time: `${rnd(20, 60)} min`,
                status: pct >= 40 ? 'Pass' : 'Fail'
            };
        }),
        rowKeys: ['sno', 'name', 'class', 'exam', 'score', 'max', 'pct', 'time', 'status'],
        badgeKey: 'status',
    },

    /* 11 ─ Certificate Report */
    'certificate': {
        title: 'Certificate Report',
        icon: '📜',
        filters: ['class'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Certificate Type', 'Issue Date', 'Issued By', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
            type: ['TC', 'Bonafide', 'Character', 'Study', 'Migration'][i % 5],
            date: date(rnd(1, 28), rnd(1, 2), 2025),
            by: 'Principal', status: ['Issued', 'Pending'][i % 4 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'type', 'date', 'by', 'status'],
        badgeKey: 'status',
    },

    /* 12 ─ Leave Application Report */
    'leave': {
        title: 'Leave Application Report',
        icon: '🏖️',
        filters: [],
        columns: ['#', 'Emp ID', 'Staff Name', 'Designation', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, empId: `EMP${String(100 + i).padStart(4, '0')}`,
            name: staff(i), desig: ['Teacher', 'HOD', 'Lab Asst', 'Clerk', 'PT Teacher'][i % 5],
            type: ['CL', 'EL', 'SL', 'ML', 'PL'][i % 5],
            from: date(rnd(1, 15), rnd(1, 3), 2025),
            to: date(rnd(16, 28), rnd(1, 3), 2025),
            days: rnd(1, 15), reason: 'Personal work',
            status: ['Approved', 'Pending', 'Rejected'][i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'empId', 'name', 'desig', 'type', 'from', 'to', 'days', 'reason', 'status'],
        badgeKey: 'status',
    },

    /* 13 ─ Product Purchase Report */
    'purchase': {
        title: 'Product Purchase Report',
        icon: '🛒',
        filters: [],
        columns: ['#', 'Purchase ID', 'Item Name', 'Category', 'Quantity', 'Unit Price (₹)', 'Total (₹)', 'Supplier', 'Date', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, id: `PUR-${String(1001 + i).padStart(5, '0')}`,
            item: ['A4 Paper', 'Chalk Box', 'Marker Set', 'Lab Chemicals', 'Sports Kit', 'Projector', 'Books-Set', 'Printer Ink'][i % 8],
            cat: ['Stationery', 'Lab', 'Sports', 'Electronics', 'Library'][i % 5],
            qty: rnd(5, 100), price: rnd(50, 2000),
            total: (rnd(5, 100) * rnd(50, 2000)).toLocaleString(),
            supplier: ['ABC Traders', 'XYZ Stores', 'Best Supply'][i % 3],
            date: date(rnd(1, 28), rnd(10, 2), 2025),
            status: ['Received', 'Pending', 'Partial'][i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'id', 'item', 'cat', 'qty', 'price', 'total', 'supplier', 'date', 'status'],
        badgeKey: 'status',
    },

    /* 14 ─ Product Sale Report */
    'sales': {
        title: 'Product Sale Report',
        icon: '🏪',
        filters: [],
        columns: ['#', 'Sale ID', 'Item Name', 'Student Name', 'Class', 'Quantity', 'Unit Price (₹)', 'Total (₹)', 'Date', 'Payment'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, id: `SAL-${String(2001 + i).padStart(5, '0')}`,
            item: ['Uniform', 'School Bag', 'Text Books', 'Note Books', 'Sports Kit', 'Lab Kit'][i % 6],
            name: name(i), class: `${cls(i)}-${sec(i)}`,
            qty: rnd(1, 5), price: rnd(100, 1500),
            total: `₹${(rnd(1, 5) * rnd(100, 1500)).toLocaleString()}`,
            date: date(rnd(1, 28), rnd(1, 3), 2025),
            payment: ['Cash', 'UPI', 'Card'][i % 3],
        })),
        rowKeys: ['sno', 'id', 'item', 'name', 'class', 'qty', 'price', 'total', 'date', 'payment'],
        badgeKey: null,
    },

    /* 15 ─ Due Fees Report */
    'due-fees': {
        title: 'Due Fees Report',
        icon: '⚠️',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Fee Type', 'Total Fee (₹)', 'Paid (₹)', 'Due (₹)', 'Due Date', 'Days Overdue'],
        rows: Array.from({ length: 25 }, (_, i) => {
            const total = (8000 + rnd(0, 4) * 2000);
            const paid = Math.round(total * rnd(0, 70) / 100);
            const due = total - paid;
            return {
                sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
                feeType: feeTypes[i % feeTypes.length],
                total: total.toLocaleString(), paid: paid.toLocaleString(), due: due.toLocaleString(),
                dueDate: date(15, rnd(1, 3), 2025), overdue: rnd(1, 60)
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'feeType', 'total', 'paid', 'due', 'dueDate', 'overdue'],
        badgeKey: null,
    },

    /* 16 ─ Balance Fees Report */
    'balance-fees': {
        title: 'Balance Fees Report',
        icon: '⚖️',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Annual Fee (₹)', 'Paid (₹)', 'Balance (₹)', 'Last Paid', 'Status'],
        rows: Array.from({ length: 25 }, (_, i) => {
            const total = rnd(20, 60) * 1000;
            const paid = Math.round(total * rnd(40, 100) / 100);
            const bal = total - paid;
            return {
                sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
                total: total.toLocaleString(), paid: paid.toLocaleString(), bal: bal.toLocaleString(),
                lastPaid: date(rnd(1, 28), rnd(1, 2), 2025),
                status: bal === 0 ? 'Cleared' : bal < 5000 ? 'Low Due' : 'High Due'
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'total', 'paid', 'bal', 'lastPaid', 'status'],
        badgeKey: null,
    },

    /* 17 ─ Transaction Report */
    'transactions': {
        title: 'Transaction Report',
        icon: '🔄',
        filters: [],
        columns: ['#', 'Txn ID', 'Student Name', 'Class', 'Amount (₹)', 'Fee Type', 'Date', 'Mode', 'Reference', 'Status'],
        rows: Array.from({ length: 30 }, (_, i) => ({
            sno: i + 1, txnId: `TXN${String(100000 + i).padStart(7, '0')}`,
            name: name(i), class: `${cls(i)}-${sec(i)}`,
            amount: `₹${(rnd(1, 20) * 1000).toLocaleString()}`,
            feeType: feeTypes[i % feeTypes.length],
            date: date(rnd(1, 28), rnd(1, 2), 2025),
            mode: ['Cash', 'UPI', 'NEFT', 'Card', 'Cheque'][i % 5],
            ref: `REF${rnd(100000, 999999)}`,
            status: ['Success', 'Pending', 'Failed'][i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'txnId', 'name', 'class', 'amount', 'feeType', 'date', 'mode', 'ref', 'status'],
        badgeKey: 'status',
    },

    /* 18 ─ Student Fine Report */
    'fines': {
        title: 'Student Fine Report',
        icon: '🚫',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Reason', 'Fine (₹)', 'Date Issued', 'Due Date', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => ({
            sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
            reason: ['Late Submission', 'Damaged Book', 'Uniform Violation', 'Absent Without Notice', 'Library Late Return'][i % 5],
            fine: rnd(1, 10) * 50,
            issued: date(rnd(1, 15), rnd(1, 2), 2025),
            due: date(rnd(16, 28), rnd(1, 2), 2025),
            status: ['Paid', 'Pending'][i % 3 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'reason', 'fine', 'issued', 'due', 'status'],
        badgeKey: 'status',
    },

    /* 19 ─ Overtime Report */
    'overtime': {
        title: 'Overtime Report',
        icon: '⏰',
        filters: [],
        columns: ['#', 'Emp ID', 'Staff Name', 'Designation', 'Department', 'OT Days', 'OT Hours', 'Rate/Hr (₹)', 'OT Amount (₹)', 'Month'],
        rows: Array.from({ length: 15 }, (_, i) => {
            const hrs = rnd(4, 40); const rate = rnd(100, 300);
            return {
                sno: i + 1, empId: `EMP${String(100 + i).padStart(4, '0')}`,
                name: staff(i), desig: ['Teacher', 'Lab Asst', 'Peon', 'Security', 'Clerk'][i % 5],
                dept: ['Science', 'Maths', 'Admin', 'Security', 'Finance'][i % 5],
                days: rnd(1, 10), hrs, rate, amount: (hrs * rate).toLocaleString(), month: 'February 2025'
            };
        }),
        rowKeys: ['sno', 'empId', 'name', 'desig', 'dept', 'days', 'hrs', 'rate', 'amount', 'month'],
        badgeKey: null,
    },

    /* 20 ─ Audit Report */
    'audit': {
        title: 'Audit Report',
        icon: '🔍',
        filters: [],
        columns: ['#', 'Timestamp', 'User', 'Role', 'Module', 'Action', 'Record ID', 'IP Address', 'Status'],
        rows: Array.from({ length: 25 }, (_, i) => ({
            sno: i + 1,
            time: `${String(rnd(8, 17)).padStart(2, '0')}:${String(rnd(0, 59)).padStart(2, '0')} ${date(rnd(1, 19), 2, 2025)}`,
            user: ['admin', 'principal', 'teacher1', 'accountant', 'librarian'][i % 5],
            role: ['Admin', 'Principal', 'Teacher', 'Accountant', 'Librarian'][i % 5],
            module: ['Finance', 'Students', 'Attendance', 'Library', 'Settings'][i % 5],
            action: ['Create', 'Update', 'Delete', 'View', 'Login'][i % 5],
            record: `ID-${rnd(1000, 9999)}`,
            ip: `192.168.${rnd(1, 10)}.${rnd(1, 200)}`,
            status: ['Success', 'Warning', 'Error'][i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : 0],
        })),
        rowKeys: ['sno', 'time', 'user', 'role', 'module', 'action', 'record', 'ip', 'status'],
        badgeKey: 'status',
    },

    /* 21 ─ Account Ledger Report */
    'ledger': {
        title: 'Account Ledger Report',
        icon: '📒',
        filters: [],
        columns: ['#', 'Date', 'Description', 'Voucher No', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)', 'Category', 'Ref'],
        rows: (() => {
            let balance = 500000;
            return Array.from({ length: 25 }, (_, i) => {
                const isDebit = i % 3 !== 0;
                const amt = rnd(1, 20) * 1000;
                balance = isDebit ? balance - amt : balance + amt;
                return {
                    sno: i + 1, date: date(i + 1, 2, 2025),
                    desc: isDebit
                        ? ['Salary Payment', 'Utility Bill', 'Purchase', 'Transport Cost', 'Maintenance'][i % 5]
                        : ['Fee Collection', 'Grant Received', 'Donation', 'Interest Income', 'Refund'][i % 5],
                    voucher: `VCH-${String(3001 + i).padStart(5, '0')}`,
                    debit: isDebit ? amt.toLocaleString() : '—',
                    credit: !isDebit ? amt.toLocaleString() : '—',
                    balance: Math.abs(balance).toLocaleString(),
                    category: isDebit ? 'Expense' : 'Income',
                    ref: `REF-${rnd(1000, 9999)}`
                };
            });
        })(),
        rowKeys: ['sno', 'date', 'desc', 'voucher', 'debit', 'credit', 'balance', 'category', 'ref'],
        badgeKey: null,
    },

    /* 22 ─ Book Sales Report */
    'book-sales': {
        title: 'Book Sales Report',
        icon: '📚',
        filters: ['class'],
        columns: ['#', 'Sale ID', 'Book Title', 'Student Name', 'Class', 'Quantity', 'Price (₹)', 'Total (₹)', 'Date', 'Status'],
        rows: Array.from({ length: 30 }, (_, i) => ({
            sno: i + 1, id: `BS-${String(5001 + i).padStart(4, '0')}`,
            book: books[i % books.length], name: name(i), class: cls(i),
            qty: rnd(1, 3), price: rnd(150, 800),
            total: `₹${(rnd(1, 3) * rnd(150, 800)).toLocaleString()}`,
            date: date(rnd(1, 28), rnd(1, 3), 2025),
            status: ['Paid', 'Pending'][i % 6 === 0 ? 1 : 0]
        })),
        rowKeys: ['sno', 'id', 'book', 'name', 'class', 'qty', 'price', 'total', 'date', 'status'],
        badgeKey: 'status',
    },

    /* 23 ─ Book Inventory Report */
    'book-inventory': {
        title: 'Book Inventory Report',
        icon: '📦',
        filters: [],
        columns: ['#', 'Book ID', 'Title', 'Author', 'Category', 'Total Stock', 'Available', 'Issued', 'Price (₹)', 'Status'],
        rows: Array.from({ length: 25 }, (_, i) => {
            const total = rnd(50, 500);
            const issued = rnd(10, total - 10);
            const avail = total - issued;
            return {
                sno: i + 1, id: `BK-${String(1001 + i).padStart(4, '0')}`,
                title: books[i % books.length], author: authors[i % authors.length],
                category: ['Textbook', 'Reference', 'Fiction', 'Journal', 'Guide'][i % 5],
                total, available: avail, issued, price: rnd(150, 1200),
                status: avail > 20 ? 'In Stock' : (avail > 0 ? 'Low Stock' : 'Out of Stock')
            };
        }),
        rowKeys: ['sno', 'id', 'title', 'author', 'category', 'total', 'available', 'issued', 'price', 'status'],
        badgeKey: 'status',
    },

    /* 24 ─ Issued Books Report */
    'issued-books': {
        title: 'Issued Books Report',
        icon: '📖',
        filters: ['class', 'section'],
        columns: ['#', 'Borrow ID', 'Book Title', 'Student Name', 'Class', 'Issue Date', 'Due Date', 'Days Left', 'Status'],
        rows: Array.from({ length: 35 }, (_, i) => {
            const daysLeft = rnd(-10, 15);
            return {
                sno: i + 1, id: `BRW-${String(8001 + i).padStart(4, '0')}`,
                title: books[i % books.length], name: name(i), class: `${cls(i)}-${sec(i)}`,
                issueDate: date(rnd(1, 15), rnd(1, 2), 2025),
                dueDate: date(rnd(16, 28), rnd(2, 3), 2025),
                daysLeft: daysLeft < 0 ? '—' : daysLeft,
                status: daysLeft < 0 ? 'Overdue' : 'Issued'
            };
        }),
        rowKeys: ['sno', 'id', 'title', 'name', 'class', 'issueDate', 'dueDate', 'daysLeft', 'status'],
        badgeKey: 'status',
    },

    /* 25 ─ Book Defaulters Report */
    'book-defaulters': {
        title: 'Book Defaulters Report',
        icon: '⚠️',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Book Title', 'Due Date', 'Days Overdue', 'Fine (₹)', 'Status'],
        rows: Array.from({ length: 20 }, (_, i) => {
            const overdue = rnd(1, 45);
            return {
                sno: i + 1, admNo: admNo(i), name: name(i), class: `${cls(i)}-${sec(i)}`,
                title: books[i % books.length],
                dueDate: date(rnd(1, 28), rnd(1, 2), 2025),
                overdue, fine: `₹${(overdue * 5).toLocaleString()}`,
                status: 'Overdue'
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'title', 'dueDate', 'overdue', 'fine', 'status'],
        badgeKey: 'status',
    },

    /* 26 ─ Result Report */
    'result-report': {
        title: 'Student Result Report',
        icon: '📊',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Section', 'Total Marks', 'Max Marks', 'Percentage', 'Result', 'Grade'],
        rows: Array.from({ length: 40 }, (_, i) => {
            const max = [500, 600, 1000][i % 3];
            const obtained = rnd(max * 0.35, max);
            const pct = Math.round((obtained / max) * 100);
            return {
                sno: i + 1, admNo: admNo(i), name: name(i), class: cls(i), section: sec(i),
                total: obtained, maxMarks: max, pct,
                status: pct >= 40 ? 'Pass' : 'Fail',
                grade: grade(pct)
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'section', 'total', 'maxMarks', 'pct', 'status', 'grade'],
        badgeKey: 'status',
    },

    /* 27 ─ Class Result Report */
    'class-result-report': {
        title: 'Class-wise Result Report',
        icon: '🏫',
        filters: ['class'],
        columns: ['#', 'Class', 'Section', 'Total Students', 'Passed', 'Failed', 'Pass %', 'Avg %'],
        rows: Array.from({ length: 24 }, (_, i) => {
            const total = 35 + rnd(0, 15);
            const passed = rnd(Math.floor(total * 0.6), total);
            const failed = total - passed;
            const passPct = Math.round((passed / total) * 100);
            const avgPct = 60 + rnd(0, 30);
            return {
                sno: i + 1, class: cls(i), section: sec(i),
                total, passed, failed, passPct, avgPct
            };
        }),
        rowKeys: ['sno', 'class', 'section', 'total', 'passed', 'failed', 'passPct', 'avgPct'],
        badgeKey: null,
    },

    /* 28 ─ Progress Report */
    'progress-report': {
        title: 'Student Progress Report',
        icon: '📈',
        filters: ['class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Section', 'Total', 'Pct %', 'Grade', 'Attendance', 'Action'],
        rows: Array.from({ length: 40 }, (_, i) => {
            const pct = rnd(50, 98);
            return {
                sno: i + 1,
                admNo: admNo(i),
                name: name(i),
                class: cls(i),
                section: sec(i),
                total: `${Math.round(pct * 5)}/500`,
                pct,
                grade: grade(pct),
                attendance: `${rnd(80, 100)}%`,
                status: pct >= 40 ? 'Pass' : 'Fail', // hidden but used in badge
                action: 'Generate'
            };
        }),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'section', 'total', 'pct', 'grade', 'attendance', 'action'],
        badgeKey: 'grade',
    },

    /* -- Student Birthday Report -- */
    'student-birthday': {
        title: 'Student Birthday Report',
        icon: '🎂',
        filters: ['period', 'class', 'section'],
        columns: ['#', 'Adm No', 'Student Name', 'Class', 'Section', 'Date of Birth', 'Age'],
        rows: Array.from({ length: 45 }, (_, i) => ({
            sno: i + 1, admNo: admNo(i), name: name(i), class: cls(i), section: sec(i),
            dob: date(rnd(1, 28), rnd(1, 12), 2010 + i % 8),
            age: 2025 - (2010 + i % 8)
        })),
        rowKeys: ['sno', 'admNo', 'name', 'class', 'section', 'dob', 'age']
    },

    /* -- Staff Birthday Report -- */
    'staff-birthday': {
        title: 'Staff Birthday Report',
        icon: '🎂',
        filters: ['period'],
        columns: ['#', 'Emp ID', 'Staff Name', 'Department', 'Date of Birth', 'Age'],
        rows: Array.from({ length: 15 }, (_, i) => ({
            sno: i + 1, empId: `E-${100 + i}`, name: staff(i), department: ['Teaching', 'Admin', 'Support'][i % 3],
            dob: date(rnd(1, 28), rnd(1, 12), 1980 + i % 15),
            age: 2025 - (1980 + i % 15)
        })),
        rowKeys: ['sno', 'empId', 'name', 'department', 'dob', 'age']
    }
};

export const BADGE_COLORS = {
    // green
    Active: 'green', Issued: 'green', Printed: 'green', Generated: 'green',
    Returned: 'green', Pass: 'green', Approved: 'green', Success: 'green', Cleared: 'green',
    // orange
    Pending: 'orange', Partial: 'orange', 'Low Due': 'orange', Warning: 'orange', 'High Due': 'orange',
    // red
    Overdue: 'red', Fail: 'red', Rejected: 'red', Error: 'red', Failed: 'red',
    // blue
    B: 'blue', C: 'blue', D: 'blue', 'In Stock': 'blue',
    // purple (A grades)
    'A+': 'purple', A: 'purple',
    // special inventory
    'Low Stock': 'orange', 'Out of Stock': 'red'
};
