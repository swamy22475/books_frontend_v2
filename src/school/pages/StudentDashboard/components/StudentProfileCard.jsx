import React from 'react';
import { IconEdit, IconBook, IconFlask, IconAtom } from '@tabler/icons-react';

const StudentProfileCard = () => {
    const todaysClasses = [
        { subject: 'English', icon: IconBook, color: '#3d5ee1' },
        { subject: 'Chemistry', icon: IconFlask, color: '#ff9f43' },
        { subject: 'Physics', icon: IconAtom, color: '#28c76f' }
    ];

    return (
        <div className="student-profile-card">
            <div className="profile-horizontal-header">
                <div className="profile-top-info">
                    <div className="avatar-square-container">
                        <img
                            src="https://preskool.developer24.org/html/template/assets/img/students/student-01.jpg"
                            alt="Student"
                            className="avatar-img-square"
                        />
                    </div>
                    <div className="student-header-details">
                        <span className="id-badge-pill">#ST1234546</span>
                        <h3 className="student-name-white">Angelo Riana</h3>
                        <div className="student-meta-row">
                            <span className="meta-text">Class : III, C</span>
                            <span className="meta-bar">|</span>
                            <span className="meta-text">Roll No : 36545</span>
                        </div>
                    </div>
                </div>

                <div className="profile-dashed-line"></div>

                <div className="profile-bottom-row">
                    <div className="exam-status-group">
                        <span className="exam-quarter">1st Quarterly</span>
                        <div className="status-pass-badge">
                            <span className="dot-green"></span>
                            Pass
                        </div>
                    </div>
                    <button className="edit-profile-action-btn">
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="todays-class-section">
                <h4 className="todays-class-title">Today's Class</h4>
                <div className="todays-class-list">
                    {todaysClasses.map((item, index) => (
                        <div key={index} className="todays-class-row">
                            <div className="subject-icon-box" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                <item.icon size={20} />
                            </div>
                            <span className="subject-display-name">{item.subject}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProfileCard;
