import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
    IconLayoutDashboard, IconApps, IconUser, IconUsers, IconUserPlus,
    IconSchool, IconBook, IconBooks, IconCalendar, IconClock,
    IconHome, IconClipboard, IconFileText, IconCash, IconBuildingBank,
    IconTruck, IconBallFootball, IconBed, IconSettings, IconReportAnalytics,
    IconChartPie, IconChartBar, IconBell, IconMail, IconLock,
    IconChevronDown, IconChevronRight, IconMenu2, IconUserCircle,
    IconBriefcase, IconCreditCard, IconBeach, IconLayoutSidebar,
    IconReceipt, IconSearch, IconRefresh, IconDiscount, IconShield,
    IconWallet, IconTrendingUp, IconTrendingDown, IconShoppingCart,
    IconUserCheck, IconAlertCircle, IconAccessible, IconBuilding,
    IconListDetails, IconFileInvoice, IconNotebook, IconPencil,
    IconDeviceLaptop, IconCertificate, IconFileDownload, IconMessage,
    IconBrandWhatsapp, IconMail as IconMailAlt, IconPrinter, IconCloud,
    IconDatabase, IconForms, IconUpload, IconMenu, IconZoomQuestion,
    IconId, IconTicket, IconClockHour4, IconHistory, IconPackage,
    IconCategory, IconUsersGroup, IconRoute, IconGps, IconDoor,
    IconKeyboard, IconWorld, IconApi, IconBackspace, IconFilePlus,
    IconArchive, IconAffiliate, IconVideo, IconMessages
} from '@tabler/icons-react';
import './Layout.css';

// ── Try importing auth context (graceful fallback if not available) ──
let useAuth;
try {
    useAuth = require('../../../context/AuthContext').useAuth;
} catch {
    useAuth = null;
}

// ────────────────────────────────────────────────
// Mapping: sidebar sub-item paths → MasterMenuBuilder permission IDs.
// The MasterMenuBuilder saves permissions as { [permId]: boolean }
// in localStorage under key `menu_access_{role}`.
// ────────────────────────────────────────────────
const PATH_TO_PERMISSION_ID = {
    // Dashboard
    '/school/dashboard': 'dashboard_overview',
    '/school/teacher-dashboard': 'dashboard_overview',
    '/school/student-dashboard': 'dashboard_overview',
    '/school/parent-dashboard': 'dashboard_overview',

    // Finance & Fees
    '/school/finance/collect-fees': 'fee_collect',
    '/school/finance/search-due-fees': 'fee_dues',
    '/school/finance/all-transactions': 'fee_reports',
    '/school/finance/online-transactions': 'fee_reports',
    '/school/finance/fees-carry-forward': 'fee_structure',
    '/school/finance/assign-fees': 'fee_structure',
    '/school/finance/fees-master': 'fee_structure',
    '/school/finance/fee-groups': 'fee_structure',
    '/school/finance/fees-discount': 'fee_structure',
    '/school/finance/fee-types': 'fee_structure',
    '/school/finance/fee-permissions': 'fee_structure',

    // Accounts
    '/school/accounts/income': 'expenses',
    '/school/accounts/income-heads': 'expenses',
    '/school/accounts/expense': 'expenses',
    '/school/accounts/expense-heads': 'expenses',

    // Student Information
    '/school/student-list': 'student_list',
    '/school/quick-admission': 'student_add',
    '/school/student-attendance': 'attendance_mark',
    '/school/behavior-records': 'behaviour',
    '/school/student-categories': 'student_list',
    '/school/disabled-students': 'student_list',
    '/school/bulk-edit': 'student_list',

    // Teachers
    '/school/teachers/all': 'staff_list',
    '/school/teachers/list': 'staff_list',
    '/school/teachers/routine': 'timetable_view',
    '/school/teachers/user': 'staff_list',

    // Academics
    '/school/academics/classes': 'class_list',
    '/school/academics/sections': 'section_manage',
    '/school/academics/subjects': 'subject_list',
    '/school/academics/assign-subjects': 'subject_assign',
    '/school/academics/assign-class-teacher': 'class_list',
    '/school/academics/manage-periods': 'timetable_create',
    '/school/academics/class-timetable': 'timetable_view',
    '/school/academics/promote-students': 'student_promote',
    '/school/academics/homework': 'homework_list',

    // Exam
    '/school/exam/dashboard': 'exam_schedule',
    '/school/exam/schedule': 'exam_schedule',

    // HR
    '/school/hr': 'dashboard_overview',
    '/school/hr/staff': 'staff_list',
    '/school/hr/attendance': 'staff_attendance',
    '/school/hr/payroll': 'salary',
    '/school/hr/set-salary': 'salary',
    '/school/hr/leave': 'leave_approve',
    '/school/hr/leave-types': 'leave_approve',
    '/school/hr/departments': 'staff_list',
    '/school/hr/designations': 'staff_list',

    // Communication
    '/communicate/notice': 'notice_board',
    '/communicate/events': 'notice_board',
    '/communicate/broadcast': 'sms_send',
    '/communicate/history': 'sms_send',

    // Library
    '/library/issue-return': 'library',
    '/library/books': 'library',
    '/library/categories': 'library',

    // Inventory
    '/school/inventory/issue-item': 'inventory',
    '/school/inventory/add-stock': 'inventory',
    '/school/inventory/items': 'inventory',
    '/school/inventory/categories': 'inventory',
    '/school/inventory/suppliers': 'inventory',
    '/school/inventory/reports': 'inventory',

    // Transport
    '/transport/vehicles': 'transport',
    '/transport/routes': 'transport',
    '/transport/tracking': 'transport',

    // Hostel
    '/school/hostel': 'hostel',
    '/school/hostel/category': 'hostel',
    '/school/hostel/manage': 'hostel',
    '/hostel/allocation': 'hostel',
    '/hostel/rooms': 'hostel',
    '/hostel/room-types': 'hostel',
    '/hostel/manage': 'hostel',
    '/hostel/permissions': 'hostel',

    // Reports
    '/reports/class': 'report_academic',
    '/reports/student': 'report_academic',
    '/reports/attendance': 'report_attendance',
    '/reports/fees': 'report_financial',
    '/reports/due-fees': 'report_financial',
    '/reports/balance-fees': 'report_financial',
    '/reports/transactions': 'report_financial',
    '/reports/salary': 'report_financial',
    '/reports/audit': 'report_financial',
    '/reports/ledger': 'report_financial',
    '/reports/sponsorship': 'report_academic',
    '/reports/id-card': 'report_academic',
    '/reports/hall-ticket': 'report_academic',
    '/reports/timetable': 'report_academic',
    '/reports/exam-schedule': 'report_academic',
    '/reports/library': 'report_academic',
    '/reports/terminal': 'report_academic',
    '/reports/merit': 'report_academic',
    '/reports/online-exam': 'report_academic',
    '/reports/certificate': 'report_academic',
    '/reports/leave': 'report_academic',
    '/reports/purchase': 'report_financial',
    '/reports/sales': 'report_financial',
    '/reports/fines': 'report_financial',
    '/reports/overtime': 'report_financial',

    // Settings
    '/settings/general': 'settings',
    '/settings/session': 'settings',
    '/settings/notifications': 'settings',
    '/settings/whatsapp': 'settings',
    '/settings/sms': 'settings',
    '/settings/email': 'settings',
    '/settings/payments': 'settings',
    '/settings/print': 'settings',
    '/settings/thermal-print': 'settings',
    '/settings/cms': 'settings',
    '/settings/roles': 'settings',
    '/settings/backup': 'settings',
    '/settings/users': 'settings',
    '/settings/modules': 'settings',
    '/settings/custom-fields': 'settings',
    '/settings/captcha': 'settings',
    '/settings/system-fields': 'settings',
    '/settings/student-profile': 'settings',
    '/settings/admission': 'settings',
    '/settings/file-types': 'settings',
    '/settings/sidebar': 'settings',
    '/settings/update': 'settings',

    // Study Center
    '/study/resources': 'online_classes',
    '/study/assignments': 'homework_list',
    '/study/live-classes': 'online_classes',

    // Certificates
    '/school/certificates/templates': 'transfer_cert',
    '/school/certificates/generate': 'transfer_cert',

    // Front Office
    '/school/front-office/visitors': 'visitor_log',
    '/school/front-office/complaints': 'visitor_log',
    '/school/front-office/postal': 'visitor_log',
    '/school/front-office/admission-enquiry': 'visitor_log',

    // Book Sales
    '/school/book-sales': 'inventory',
    '/school/book-sales/vendors': 'inventory',
    '/school/book-sales/inventory': 'inventory',
    '/school/book-sales/sales': 'inventory',
    '/school/book-sales/returns': 'inventory',
    '/school/book-sales/reports': 'report_financial',

    // Online Exam
    '/exam/online': 'exam_schedule',
};

/**
 * Load role-based menu access from localStorage.
 * Returns null if no role or no saved permissions.
 */
function loadRoleMenuAccess(role) {
    if (!role) return null;
    try {
        const saved = localStorage.getItem(`menu_access_${role}`);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
}

/**
 * Check if a sub-item path is permitted for the current role.
 */
function isSubItemPermitted(path, access) {
    if (!access) return true; // no restrictions configured
    const permId = PATH_TO_PERMISSION_ID[path];
    if (!permId) return true; // unmapped items are shown by default
    return access[permId] !== false;
}

const menuData = [
    {
        group: 'Book Sales',
        items: [
            { title: 'Dashboard', icon: IconLayoutDashboard, path: '/school/book-sales' },
            { title: 'Vendor Details', icon: IconUsers, path: '/school/book-sales/vendors' },
            { title: 'Book Inventory', icon: IconBooks, path: '/school/book-sales/inventory' },
            { title: 'Stock In', icon: IconPackage, path: '/school/book-sales/stock-in' },
            { title: 'Sales Entry', icon: IconShoppingCart, path: '/school/book-sales/sales' },
            { title: 'Returns', icon: IconRefresh, path: '/school/book-sales/returns' },
            { title: 'Reports & Analytics', icon: IconChartBar, path: '/school/book-sales/reports' },
        ]
    }
];

// Recursive component for nested menu items
const SubMenuItemNested = ({ item, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const IconComponent = item.icon;

    const handleClick = (e) => {
        if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    if (hasSubItems) {
        return (
            <div className="menu-item-container">
                <a
                    href="#"
                    className={`menu-item ${isOpen ? 'active' : ''}`}
                    onClick={handleClick}
                    style={{ paddingLeft: `${level > 0 ? 12 + level * 12 : 0}px` }}
                >
                    <span className="menu-item-content">
                        {IconComponent && <IconComponent size={16} stroke={1.5} />}
                        <span className="menu-title-text">{item.title}</span>
                    </span>
                    {isOpen ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                </a>
                {isOpen && (
                    <ul className="submenu">
                        {item.subItems.map((sub, idx) => (
                            <li key={idx}>
                                <SubMenuItemNested item={sub} level={level + 1} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path || '#'}
            className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
        >
            {item.title}
        </NavLink>
    );
};

const SidebarMenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const IconComponent = item.icon;

    const handleClick = (e) => {
        if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    if (hasSubItems) {
        return (
            <div className="menu-item-container">
                <a
                    href="#"
                    className={`menu-item ${isOpen ? 'active' : ''}`}
                    onClick={handleClick}
                >
                    <span className="menu-item-content">
                        <IconComponent size={18} stroke={1.5} />
                        <span className="menu-title-text">{item.title}</span>
                    </span>
                    {isOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                </a>
                {isOpen && (
                    <ul className="submenu">
                        {item.subItems.map((sub, idx) => (
                            <li key={idx}>
                                <SubMenuItemNested item={sub} level={0} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path || '#'}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
            <span className="menu-item-content">
                <IconComponent size={18} stroke={1.5} />
                <span className="menu-title-text">{item.title}</span>
            </span>
        </NavLink>
    );
};

const Sidebar = ({ isOpen }) => {
    // ── Get current user role (graceful fallback) ──
    let userRole = null;
    let branchName = null;
    try {
        if (useAuth) {
            const auth = useAuth();
            userRole = auth?.user?.role || null;
            branchName = auth?.user?.branchName || null;
        }
    } catch {
        // AuthContext not available — show all menus
    }

    // ── Load role-based menu access ──
    const roleAccess = useMemo(() => loadRoleMenuAccess(userRole), [userRole]);

    // ── Filter menu data based on role permissions ──
    const filteredMenuData = useMemo(() => {
        if (!roleAccess) return menuData; // no filtering if no access config

        return menuData
            .map((section) => {
                const filteredItems = section.items
                    .map((item) => {
                        if (!item.subItems || item.subItems.length === 0) return item;

                        const filteredSubItems = item.subItems.filter((sub) =>
                            isSubItemPermitted(sub.path, roleAccess)
                        );

                        if (filteredSubItems.length === 0) return null;
                        return { ...item, subItems: filteredSubItems };
                    })
                    .filter(Boolean);

                if (filteredItems.length === 0) return null;
                return { ...section, items: filteredItems };
            })
            .filter(Boolean);
    }, [roleAccess]);

    return (
        <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            {/* Sidebar header removed as requested */}

            <div className="sidebar-menu">
                {filteredMenuData.map((section, idx) => (
                    <div key={idx} className="menu-section">
                        <h6 className="menu-group-title">{section.group}</h6>
                        <ul className="menu-list">
                            {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                    <SidebarMenuItem item={item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
