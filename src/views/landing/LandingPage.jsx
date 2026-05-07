import { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import darkLogo from '../../assets/images/logos/dark-logo.svg';
import '../../css/pages/landing.css';

/* ─── Lucide-style SVG icons (memoized) ─── */
const Icon = memo(({ d, size = 20, color = 'currentColor' }) =>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
Icon.displayName = 'Icon';

// Common icon paths (Lucide)
const icons = {
    menu: 'M4 6h16M4 12h16M4 18h16',
    x: 'M18 6L6 18M6 6l12 12',
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    sun: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
    arrowRight: 'M5 12h14M12 5l7 7-7 7',
    phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    graduationCap: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 0 3 3 6 3s6-3 6-3v-5',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    dollarSign: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
    monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
    creditCard: 'M1 4h22v16H1zM1 10h22',
    idCard: 'M2 5h20v14H2zM6 12h4M6 15h8M16 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    receipt: 'M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2z',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    messageCircle: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    barChart: 'M12 20V10M18 20V4M6 20v-4',
    lock: 'M5 11h14v10H5zM7 11V7a5 5 0 0 1 10 0v4',
    headphones: 'M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z',
    fingerprint: 'M2 12a10 10 0 0 1 18-6M12 2a10 10 0 0 1 10 10M12 12a0 0 0 0 1 0 0',
    buildingIcon: 'M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'
};

/* ─── Features Data (exact from OurSchoolERP) ─── */
const features = [
    { icon: icons.clipboard, title: 'Admission Management', desc: 'Streamlined admission process from inquiry to enrollment with online applications and document management.', color: 'fi-red' },
    { icon: icons.users, title: 'Student Management', desc: 'Complete student lifecycle management with profiles, attendance, and academic records.', color: 'fi-green' },
    { icon: icons.settings, title: 'Staff Management', desc: 'Complete HR solution for managing staff records, attendance, leaves, and performance evaluation.', color: 'fi-blue' },
    { icon: icons.dollarSign, title: 'Fee Management', desc: 'Automated fee collection with multiple payment modes, receipt generation, and comprehensive financial reporting.', color: 'fi-amber' },
    { icon: icons.checkCircle, title: 'Smart Attendance', desc: 'Digital attendance tracking with biometric integration, real-time reports, and automated notifications to parents.', color: 'fi-cyan' },
    { icon: icons.book, title: 'Exam & Result Management', desc: 'End-to-end examination management from scheduling to result publication with detailed analytics.', color: 'fi-purple' },
    { icon: icons.monitor, title: 'Online Class Management', desc: 'Integrated virtual classroom solution with video conferencing, assignments, and resource sharing.', color: 'fi-teal' },
    { icon: icons.messageCircle, title: 'Reception Management', desc: 'Digital front desk solution for visitor management, enquiry tracking, and appointment scheduling.', color: 'fi-pink' },
    { icon: icons.idCard, title: 'ID Card Management', desc: 'Automated ID card generation with customizable templates and barcode/QR code integration.', color: 'fi-orange' },
    { icon: icons.receipt, title: 'Invoice Management', desc: 'Professional invoice generation with customizable templates, automated billing, and payment tracking.', color: 'fi-indigo' },
    { icon: icons.book, title: 'Library Management', desc: 'Complete library automation with book cataloging, issue/return tracking, and fine management.', color: 'fi-lime' },
    { icon: icons.globe, title: 'Website Management', desc: 'Build and manage your school website with dynamic content, news updates, and event management.', color: 'fi-rose' }];


/* ─── Pre-computed feature columns (avoid slicing on every render) ─── */
const featureColumns = [
    features.slice(0, 4),
    features.slice(4, 8),
    features.slice(8, 12)];


/* ─── Why Us Data ─── */
const whyUsItems = [
    { icon: icons.messageCircle, title: 'Effective Communication', desc: 'Bridge the gap between schools, parents, and students with instant messaging, notifications, and announcements.' },
    { icon: icons.zap, title: 'Streamlined Operations', desc: 'Automate repetitive tasks and eliminate paperwork to focus on what matters most – quality education.' },
    { icon: icons.graduationCap, title: 'Student-Centric Approach', desc: 'Every feature is designed keeping student success and well-being at the center of decision-making.' },
    { icon: icons.users, title: 'Multi-User Functionality', desc: 'Role-based access for administrators, teachers, students, parents, and staff with customizable permissions.' },
    { icon: icons.barChart, title: 'Data-Driven Insights', desc: 'Comprehensive analytics and reporting to make informed decisions and track institutional performance.' },
    { icon: icons.shield, title: 'Secure and Reliable', desc: 'Enterprise-grade security with data encryption, regular backups, and 99.9% uptime guarantee.' }];


/* ─── Services Data ─── */
const services = [
    { icon: icons.settings, title: 'School ERP System', desc: 'Complete school management solution covering all administrative and academic operations.', color: 'fi-blue' },
    { icon: icons.globe, title: 'School Website Management', desc: 'Professional website development and management with integrated parent and student portals.', color: 'fi-purple' },
    { icon: icons.fingerprint, title: 'Biometric Attendance', desc: 'Advanced biometric systems for accurate attendance tracking with real-time synchronization.', color: 'fi-green' },
    { icon: icons.headphones, title: 'Technical Support', desc: '24/7 dedicated support team to assist with implementation, training, and troubleshooting.', color: 'fi-amber' }];


/* ─── Schools (Trusted By marquee) ─── */
const schoolColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1', '#84cc16', '#f43f5e'];

/* ─── Nav Items (exact from OurSchoolERP) ─── */
const navItems = [
    { label: 'Home', href: '#' },
    { label: 'About Us', href: '#about' },
    { label: 'Why Our School ERP', href: '#whyus' },
    { label: 'Features', href: '#features' },
    { label: 'Modules', href: '#features' },
    { label: 'Benefits', href: '#whyus' },
    { label: 'Purpose', href: '#services' },
    { label: 'Contact Us', href: '#footer' }];


/* ─── Memoized sub-components ─── */
const FeatureCard = memo(({ icon, title, desc, color }) =>
    <div className="landing-feature-card">
        <div className={`landing-feature-icon ${color}`}>
            <Icon d={icon} />
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);
FeatureCard.displayName = 'FeatureCard';

const WhyUsCard = memo(({ icon, title, desc }) =>
    <div className="landing-whyus-card">
        <div className="icon-wrap">
            <Icon d={icon} />
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);
WhyUsCard.displayName = 'WhyUsCard';

const ServiceCard = memo(({ icon, title, desc, color }) =>
    <div className="landing-service-card">
        <div className={`service-icon ${color}`}>
            <Icon d={icon} size={24} />
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);
ServiceCard.displayName = 'ServiceCard';

/* ─── Smooth scroll helper (reused across CTA buttons) ─── */
const scrollToId = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// API base URL for unauthenticated landing page fetch
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'https://ourschoolerp-m9y9k.ondigitalocean.app/api/v1';

const LandingPage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeNav, setActiveNav] = useState('Home');
    const [darkMode, setDarkMode] = useState(false);
    const [clientLogos, setClientLogos] = useState([]);

    const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), []);
    const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

    // Fetch client logos
    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/master/client-logos/public`);
                if (response.ok) {
                    const data = await response.json();
                    setClientLogos(data || []);
                }
            } catch (error) {
                console.error('Failed to fetch client logos for landing page', error);
            }
        };
        fetchLogos();
    }, []);

    // Throttled scroll handler using rAF for smooth 60fps performance
    const rafRef = useRef(0);
    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 50);
                rafRef.current = 0;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const handleNav = useCallback((e, item) => {
        setActiveNav(item.label);
        setMobileOpen(false);
        if (item.href.startsWith('#') && item.href !== '#') {
            e.preventDefault();
            document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Pre-compute feature columns with doubled items for marquee
    const featureColumnsDoubled = useMemo(() =>
        featureColumns.map((col) => [...col, ...col]),
        []
    );

    // Pre-compute doubled dynamic logos for CSS marquee seamless loop
    const logosDoubled = useMemo(() => [...clientLogos, ...clientLogos], [clientLogos]);
    const logosReversedDoubled = useMemo(() => {
        const reversed = [...clientLogos].reverse();
        return [...reversed, ...reversed];
    }, [clientLogos]);

    // Fallback data if DB is empty
    const fallbackSchools = ['Delhi Public School', 'St. Mary\'s Convent', 'Modern High School', 'Cambridge Academy', 'National Public School', 'Holy Cross School'];
    const fallbackSchoolsDoubled = [...fallbackSchools, ...fallbackSchools];
    const fallbackSchoolsReversedDoubled = [...[...fallbackSchools].reverse(), ...[...fallbackSchools].reverse()];

    const getMarqueeItem = (client, i) => {
        return (
            <div key={`${client.id || 'fb'}-${i}`} className="marquee-item">
                {client.logo_url && !client.logo_url.includes('ui-avatars') ? (
                    <img src={client.logo_url} alt={client.client_name} className="school-logo-img" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                    <span className="school-icon" style={{ background: schoolColors[i % schoolColors.length] }}>
                        {client.client_name ? client.client_name.charAt(0) : client.charAt(0)}
                    </span>
                )}
                {client.client_name || client}
            </div>
        );
    };

    return (
        <div className={`landing-page${darkMode ? ' dark' : ''}`}>
            {/* ===== HEADER ===== */}
            <header className={`landing-header${scrolled ? ' scrolled' : ''}`}>
                <a href="/" className="landing-logo">
                    <img src={darkLogo} alt="Mindwhile ERP" />
                </a>
                <nav className="landing-nav">
                    {navItems.map((item) =>
                        <a key={item.label} href={item.href} className={activeNav === item.label ? 'active' : ''} onClick={(e) => handleNav(e, item)}>
                            {item.label}
                        </a>
                    )}
                </nav>
                <div className="landing-header-actions">
                    <button className="landing-theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <Icon d={darkMode ? icons.sun : icons.moon} size={18} />
                    </button>
                    <a href="/auth/auth2/login" className="landing-login-btn">
                        School Login <Icon d={icons.arrowRight} size={16} />
                    </a>
                    <button className="landing-mobile-toggle" onClick={toggleMobile} aria-label="Menu">
                        <Icon d={mobileOpen ? icons.x : icons.menu} size={24} />
                    </button>
                </div>
                <div className={`landing-mobile-menu ${mobileOpen ? 'open' : ''}`}>
                    {navItems.map((item) =>
                        <a key={item.label} href={item.href} onClick={(e) => handleNav(e, item)}>
                            {item.label}
                        </a>
                    )}
                    <a href="/auth/auth2/login" style={{ color: 'hsl(225 80% 55%)', fontWeight: 600 }}>
                        School Login →
                    </a>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className="landing-hero">
                <video className="landing-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/landing/image1-D7lCEF3b.jpg">
                    <source src="/assets/landing/main-video.mp4" type="video/mp4" />
                </video>
                <div className="landing-hero-overlay" />
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <div className="landing-hero-content">
                    <span className="lp-badge">ERP Software for Schools</span>
                    <h1>School ERP</h1>
                    <p>Complete school management solution covering all administrative and academic operations with seamless integration.</p>
                    <div className="landing-hero-buttons">
                        <a href="/auth/auth2/login" className="btn-primary">Get Started <Icon d={icons.arrowRight} size={16} /></a>
                        <a href="#about" className="btn-outline" onClick={(e) => scrollToId(e, 'about')}>Learn More</a>
                    </div>
                </div>
            </section>

            {/* ===== ABOUT ===== */}
            <section id="about" className="landing-about lp-section">
                <div className="lp-container">
                    <div className="landing-about-grid">
                        <div className="landing-about-images">
                            <img src="/assets/landing/image1-D7lCEF3b.jpg" alt="School ERP Dashboard" loading="lazy" />
                            <img src="/assets/landing/image2-CUR1fDxC.png" alt="School Management" loading="lazy" />
                            <img src="/assets/landing/image3-Cu1pBdLp.png" alt="Student Portal" loading="lazy" />
                            <img src="/assets/landing/image4-rvNuSUTq.png" alt="Mobile App" loading="lazy" />
                        </div>
                        <div className="landing-about-text">
                            <span className="lp-badge">About Our Solution</span>
                            <h2>What is Our School ERP?</h2>
                            <p>
                                Our School ERP is a comprehensive Enterprise Resource Planning solution specifically designed for educational institutions. It serves as a unified platform that integrates all aspects of school management, from academic operations to administrative tasks.
                            </p>
                            <p>
                                The system brings together administration, academics, finance, and communication modules into one seamless ecosystem. This integration eliminates data silos, reduces redundancy, and ensures real-time information flow across all departments.
                            </p>
                            <div className="about-stats">
                                <div className="about-stat">
                                    <div className="about-stat-value">500+</div>
                                    <div className="about-stat-label">Schools</div>
                                </div>
                                <div className="about-stat">
                                    <div className="about-stat-value">50K+</div>
                                    <div className="about-stat-label">Students</div>
                                </div>
                                <div className="about-stat">
                                    <div className="about-stat-value">99.9%</div>
                                    <div className="about-stat-label">Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="landing-features lp-section">
                <div className="lp-container">
                    <div className="landing-features-header">
                        <span className="lp-badge">Features</span>
                        <h2>Awesome Features</h2>
                        <p>Discover the comprehensive set of features that make our School ERP the most complete solution for educational institutions.</p>
                    </div>
                    <div className="landing-features-grid">
                        {featureColumnsDoubled.map((colFeatures, col) =>
                            <div key={col} className="features-marquee-col">
                                <div className={`features-marquee-track${col === 1 ? ' reverse' : ''}`}>
                                    {colFeatures.map((f, i) =>
                                        <FeatureCard key={`${f.title}-${i}`} icon={f.icon} title={f.title} desc={f.desc} color={f.color} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== WHY US ===== */}
            <section id="whyus" className="landing-whyus lp-section">
                <div className="lp-container">
                    <div className="landing-whyus-header">
                        <span className="lp-badge">Why Us</span>
                        <h2>Why to Choose OurSchoolERP?</h2>
                        <p>Here's what makes us the preferred choice for educational institutions across the country.</p>
                    </div>
                    <div className="landing-whyus-grid">
                        {whyUsItems.map((item, i) =>
                            <WhyUsCard key={i} icon={item.icon} title={item.title} desc={item.desc} />
                        )}
                    </div>
                </div>
            </section>

            {/* ===== SERVICES ===== */}
            <section id="services" className="landing-services lp-section">
                <div className="lp-container">
                    <div className="landing-services-header">
                        <span className="lp-badge">Our Services</span>
                        <h2>What We Offer</h2>
                        <p>Comprehensive solutions to transform your educational institution.</p>
                    </div>
                    <div className="landing-services-grid">
                        {services.map((s, i) =>
                            <ServiceCard key={i} icon={s.icon} title={s.title} desc={s.desc} color={s.color} />
                        )}
                    </div>
                </div>
            </section>

            {/* ===== TRUSTED BY (Marquee) ===== */}
            <section className="landing-trusted lp-section">
                <div className="lp-container">
                    <div className="landing-trusted-header">
                        <span className="lp-badge">Trusted By</span>
                        <h2>Our Clients</h2>
                        <p>Schools and institutions that trust OurSchoolERP for their management needs.</p>
                    </div>
                </div>
                {/* Row 1 — forward */}
                <div className="marquee-wrapper" style={{ marginBottom: '1rem' }}>
                    <div className="marquee-track forward">
                        {clientLogos.length > 0
                            ? logosDoubled.map((client, i) => getMarqueeItem(client, i))
                            : fallbackSchoolsDoubled.map((name, i) => getMarqueeItem(name, i))}
                    </div>
                </div>
                {/* Row 2 — reverse */}
                {clientLogos.length > 2 || clientLogos.length === 0 ? (
                    <div className="marquee-wrapper">
                        <div className="marquee-track reverse">
                            {clientLogos.length > 0
                                ? logosReversedDoubled.map((client, i) => getMarqueeItem(client, i))
                                : fallbackSchoolsReversedDoubled.map((name, i) => getMarqueeItem(name, i))}
                        </div>
                    </div>
                ) : null}
            </section>

            {/* ===== CTA ===== */}
            <section className="landing-cta lp-section">
                <div className="cta-glow cta-glow-1" />
                <div className="cta-glow cta-glow-2" />
                <div className="lp-container">
                    <div className="landing-cta-content">
                        <h2>Ready to Transform Your School?</h2>
                        <p>Take the first step towards a smarter, more efficient school management experience with OurSchoolERP.</p>
                        <div className="landing-cta-buttons">
                            <a href="#footer" className="btn-white" onClick={(e) => scrollToId(e, 'footer')}>
                                <Icon d={icons.phone} size={16} /> Contact Us for Demo
                            </a>
                            <a href="#features" className="btn-ghost" onClick={(e) => scrollToId(e, 'features')}>
                                View All Features
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer id="footer" className="landing-footer lp-section">
                <div className="landing-footer-bg" style={{ backgroundImage: 'url(/assets/landing/footer-bg-new-jNI1tpY-.jpeg)' }} />
                <div className="lp-container landing-footer-content">
                    <div className="landing-footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <img src={darkLogo} alt="Mindwhile ERP" />
                            </div>
                            <p>A school management system works by integrating various modules, allowing administrators, teachers, students, and parents to access and manage information, automate tasks, communicate, and generate reports for efficient school management.</p>
                            <div className="footer-social">
                                <a href="#" className="social-icon" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                                </a>
                                <a href="#" className="social-icon" aria-label="Twitter">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
                                </a>
                                <a href="#" className="social-icon" aria-label="YouTube">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Useful Links */}
                        <div className="footer-links">
                            <h4>Useful Links</h4>
                            <ul>
                                <li><a href="#"><span className="link-dot" />Home</a></li>
                                <li><a href="#about"><span className="link-dot" />About Us</a></li>
                                <li><a href="#features"><span className="link-dot" />Features</a></li>
                                <li><a href="#features"><span className="link-dot" />Modules</a></li>
                                <li><a href="#footer"><span className="link-dot" />Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Important Links */}
                        <div className="footer-links">
                            <h4>Important Links</h4>
                            <ul>
                                <li><a href="#"><span className="link-dot" />Privacy Policy</a></li>
                                <li><a href="#"><span className="link-dot" />Terms &amp; Conditions</a></li>
                                <li><a href="#"><span className="link-dot" />FAQ</a></li>
                                <li><a href="#"><span className="link-dot" />Support</a></li>
                            </ul>
                        </div>

                        {/* Our Location */}
                        <div className="footer-contact">
                            <h4>Our Location</h4>
                            <div className="footer-contact-item">
                                <span className="contact-icon"><Icon d={icons.mapPin} size={14} /></span>
                                <span>4th Floor, Mayuri tech park, Mangalagiri, Guntur Andhra Pradesh 522503</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="contact-icon"><Icon d={icons.phone} size={14} /></span>
                                <span>+91 9494022475</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="contact-icon"><Icon d={icons.mail} size={14} /></span>
                                <span>Ourschoolerp123@gmail.com</span>
                            </div>
                            <div className="store-badges">
                                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" loading="lazy" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        © Copyright 2025 <a href="https://mindwhile.com" target="_blank" rel="noopener noreferrer">Mindwhile IT Solutions Pvt Ltd</a> – All Rights Reserved
                    </div>
                </div>
            </footer>
        </div>);

};

export default LandingPage;