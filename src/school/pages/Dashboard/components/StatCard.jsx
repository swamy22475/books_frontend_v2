import React, { useState, useEffect, useRef } from 'react';
import { FaSms, FaWhatsapp } from 'react-icons/fa';

// Use direct URL paths to SVG images in public directory
const studentIcon = '/images/student.svg';
const teacherIcon = '/images/teacher.svg';
const staffIcon = '/images/staff.svg';

// Custom hook for counting animation
const useCountUp = (end, duration = 1500) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const endValue = parseInt(end.replace(/,/g, ''), 10);

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const currentCount = Math.floor(easeOutQuart * endValue);

            setCount(currentCount);

            if (percentage < 1) {
                countRef.current = requestAnimationFrame(animate);
            }
        };

        countRef.current = requestAnimationFrame(animate);

        return () => {
            if (countRef.current) {
                cancelAnimationFrame(countRef.current);
            }
        };
    }, [end, duration]);

    return count;
};

const StatCard = ({ title, value, activeCount, inactiveCount, iconSrc, IconComponent, iconColor, bgColor, percentage }) => {
    const animatedValue = useCountUp(value, 1500);
    const animatedActive = useCountUp(activeCount, 1800);
    const animatedInactive = useCountUp(inactiveCount, 1800);

    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor }}>
                    {iconSrc ? (
                        <img src={iconSrc} alt={title} className="stat-icon-img" />
                    ) : IconComponent ? (
                        <IconComponent style={{ width: '36px', height: '36px', color: iconColor }} />
                    ) : null}
                </div>
                <div className="stat-info">
                    <h3 className="stat-value">{animatedValue.toLocaleString()}</h3>
                    <p className="stat-title">{title}</p>
                </div>
                <span className="stat-badge">
                    {percentage}
                </span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-breakdown">
                <span className="active">Active : <strong>{animatedActive.toLocaleString()}</strong></span>
                <span className="separator"></span>
                <span className="inactive">Inactive : <strong>{animatedInactive.toString().padStart(2, '0')}</strong></span>
            </div>
        </div>
    );
};

// Preset configurations for the 4 stat cards with SVG images
export const statsData = [
    {
        title: 'Total Students',
        value: '3654',
        activeCount: '3643',
        inactiveCount: '11',
        iconSrc: studentIcon,
        bgColor: '#ffe3e2',
        percentage: '1.2%'
    },
    {
        title: 'Total Teachers',
        value: '284',
        activeCount: '254',
        inactiveCount: '30',
        iconSrc: teacherIcon,
        bgColor: '#d4f4e2',
        percentage: '1.2%'
    },
    {
        title: 'Total Staff',
        value: '162',
        activeCount: '161',
        inactiveCount: '02',
        iconSrc: staffIcon,
        bgColor: '#fff4de',
        percentage: '1.2%'
    },
    {
        title: 'SMS Sent',
        value: '12450',
        activeCount: '12400',
        inactiveCount: '50',
        IconComponent: FaSms,
        iconColor: '#3d5ee1',
        bgColor: '#e8f4ff',
        percentage: '2.5%'
    },
    {
        title: 'WhatsApp Sent',
        value: '8400',
        activeCount: '8300',
        inactiveCount: '100',
        IconComponent: FaWhatsapp,
        iconColor: '#25D366',
        bgColor: '#d4f4e2',
        percentage: '4.1%'
    }
];

export default StatCard;
