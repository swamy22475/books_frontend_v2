import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../components/provider/theme-provider';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import UserSettingsModal from '../UserSettingsModal/UserSettingsModal';
import {
    CalendarIcon, PlusIcon, MoonIcon, BellIcon, MessageIcon,
    ChartBarIcon, MaximizeIcon, MenuIcon, SearchIcon,
    UserIcon, SettingsIcon, LogoutIcon, ChevronDownIcon, SunIcon
} from '../../assets/icons';
import './Layout.css';

// Custom icons for Add Menu
const StudentIcon = ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
);

const TeachersIcon = ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
        <circle cx="19" cy="11" r="2"></circle>
        <path d="M19 8v1"></path>
        <path d="M19 13v1"></path>
    </svg>
);

const StaffsIcon = ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"></circle>
        <circle cx="5" cy="19" r="3"></circle>
        <circle cx="19" cy="19" r="3"></circle>
        <path d="M12 8v4"></path>
        <path d="M8 14l4-2 4 2"></path>
    </svg>
);

const InvoiceIcon = ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"></rect>
        <line x1="9" y1="6" x2="15" y2="6"></line>
        <line x1="9" y1="10" x2="15" y2="10"></line>
        <line x1="9" y1="14" x2="12" y2="14"></line>
    </svg>
);

const Header = ({ toggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const settings = useSettings();
    const settingsLogo = settings?.logo || null;
    const isDarkMode = theme === 'dark';
    const displayName = user?.username || 'Admin User';
    const schoolName = user?.school_name || user?.tenant_id || 'School Principal';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [selectedYear, setSelectedYear] = useState('2024 / 2025');

    const profileRef = useRef(null);
    const addRef = useRef(null);
    const yearRef = useRef(null);
    const navigate = useNavigate();
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const academicYears = [
        '2024 / 2025',
        '2023 / 2024',
        '2022 / 2023',
        '2021 / 2022'
    ];

    const addMenuItems = [
        { title: 'Students', icon: StudentIcon, path: '/students/add', color: '#3d5ee1', bgColor: 'var(--accent)' },
        { title: 'Teachers', icon: TeachersIcon, path: '/teachers/add', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
        { title: 'Staffs', icon: StaffsIcon, path: '/staff/add', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
        { title: 'Invoice', icon: InvoiceIcon, path: '/invoice/add', color: '#3d5ee1', bgColor: 'var(--accent)' }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (addRef.current && !addRef.current.contains(event.target)) {
                setShowAddDropdown(false);
            }
            if (yearRef.current && !yearRef.current.contains(event.target)) {
                setShowYearDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        const adminBackup = localStorage.getItem('admin_session_backup');
        logout();
        if (adminBackup) {
            try {
                const parsedBackup = JSON.parse(adminBackup);
                if (parsedBackup.token && parsedBackup.user && parsedBackup.tenantId) {
                    localStorage.setItem('auth_token', parsedBackup.token);
                    localStorage.setItem('auth_user', parsedBackup.user);
                    localStorage.setItem('tenant_id', parsedBackup.tenantId);
                    localStorage.removeItem('admin_session_backup');
                    navigate('/admin/dashboard', { replace: true });
                    return;
                }
            } catch (error) {
                localStorage.removeItem('admin_session_backup');
            }
        }
        navigate('/books/login', { replace: true });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setShowYearDropdown(false);
    };

    return (
        <header className="top-header">
            <div className="header-left">
                {/* Logo is in the sidebar top-left */}
            </div>

            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '20px' }}>
                <div className="theme-toggle-group" style={{ 
                    display: 'flex', 
                    background: 'var(--bs-border)', 
                    padding: '4px', 
                    borderRadius: '30px',
                    gap: '4px'
                }}>
                    <button 
                        onClick={() => setTheme('light')}
                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                        style={{
                            border: 'none',
                            background: theme === 'light' ? 'var(--bs-primary)' : 'transparent',
                            color: theme === 'light' ? '#fff' : 'var(--bs-muted)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <SunIcon size={16} /> Light
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                        style={{
                            border: 'none',
                            background: theme === 'dark' ? 'var(--bs-primary)' : 'transparent',
                            color: theme === 'dark' ? '#fff' : 'var(--bs-muted)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <MoonIcon size={16} /> Dark
                    </button>
                </div>

                <button 
                    className="header-icon-btn" 
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        marginLeft: '5px',
                        background: 'rgba(234, 84, 85, 0.1)',
                        borderColor: 'rgba(234, 84, 85, 0.2)',
                        color: '#ea5455'
                    }}
                >
                    <LogoutIcon size={20} />
                </button>

                <div className="profile-dropdown-container" ref={profileRef}>
                    <div 
                        className="user-profile-brief" 
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            background: showProfileDropdown ? 'var(--bs-border)' : 'transparent'
                        }}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--bs-text)' }}>{displayName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--bs-muted)' }}>{schoolName}</div>
                        </div>
                        <div style={{ 
                            width: '38px', 
                            height: '38px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--bs-primary), var(--bs-purple))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: '700'
                        }}>{avatarLetter}</div>
                        <ChevronDownIcon size={14} color="var(--bs-muted)" />
                    </div>

                    {showProfileDropdown && (
                        <div className="profile-dropdown" style={{ display: 'block' }}>
                            <div className="dropdown-header">
                                <div className="dropdown-avatar-container">
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%', 
                                        background: 'linear-gradient(135deg, var(--bs-primary), var(--bs-purple))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: '700'
                                    }}>{avatarLetter}</div>
                                    <span className="online-indicator"></span>
                                </div>
                                <div className="dropdown-user-info">
                                    <span className="dropdown-user-name">{displayName}</span>
                                    <span className="dropdown-user-role">{schoolName}</span>
                                </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            <ul className="dropdown-menu-list">
                                <li>
                                    <button 
                                        className="dropdown-menu-item"
                                        onClick={() => {
                                            navigate('/user-profile');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <UserIcon size={18} />
                                        <span>My Profile</span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="dropdown-menu-item"
                                        onClick={() => {
                                            setShowSettingsModal(true);
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <SettingsIcon size={18} />
                                        <span>Settings</span>
                                    </button>
                                </li>
                                <div className="dropdown-divider"></div>
                                <li>
                                    <button 
                                        className="dropdown-menu-item logout-btn" 
                                        onClick={handleLogout}
                                    >
                                        <LogoutIcon size={18} />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <UserSettingsModal 
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                currentUser={user}
                onUpdateSuccess={(updatedUser) => {
                    // Update user in context/localStorage if needed
                    if (updatedUser?.user) {
                        localStorage.setItem('auth_user', JSON.stringify(updatedUser.user));
                    }
                }}
            />
        </header>
    );
};

export default Header;
