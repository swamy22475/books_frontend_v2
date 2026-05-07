import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../components/provider/theme-provider';
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
    const isDarkMode = theme === 'dark';

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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/auth/login', { replace: true });
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
                {/* Menu toggle removed as requested */}
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

                <div className="user-profile-brief" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--bs-text)' }}>Admin User</div>
                        <div style={{ fontSize: '11px', color: 'var(--bs-muted)' }}>School Principal</div>
                    </div>
                    <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--bs-primary), var(--bs-purple))',
                        display: 'flex',
                        alignItems: 'center',
                        justify-content: 'center',
                        color: '#fff',
                        fontWeight: '700'
                    }}>A</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
