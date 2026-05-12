import React, { useState, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
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
    // Book Sales
    '/school/book-sales': 'inventory',
    '/school/book-sales/vendors': 'inventory',
    '/school/book-sales/inventory': 'inventory',
    '/school/book-sales/sales': 'inventory',
    '/school/book-sales/returns': 'inventory',
    '/school/book-sales/reports': 'report_financial',
};

const withTenantPath = (path, tenantId) => {
    if (!path?.startsWith('/school/book-sales')) return path;
    return path.replace('/school/book-sales', `/${tenantId}/books`);
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
const SubMenuItemNested = ({ item, level = 0, tenantId }) => {
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
                                <SubMenuItemNested item={sub} level={level + 1} tenantId={tenantId} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={withTenantPath(item.path, tenantId) || '#'}
            className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
        >
            {item.title}
        </NavLink>
    );
};

const SidebarMenuItem = ({ item, tenantId }) => {
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
                                <SubMenuItemNested item={sub} level={0} tenantId={tenantId} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={withTenantPath(item.path, tenantId) || '#'}
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
    const { tenantId: routeTenantId } = useParams();
    const tenantId = routeTenantId || localStorage.getItem('tenant_id') || 'default';
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
                                    <SidebarMenuItem item={item} tenantId={tenantId} />
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
