import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IconSend, IconInbox, IconArrowRight } from '@tabler/icons-react';
import './PostalRecords.css';

const PostalRecords = () => {
    const navigate = useNavigate();

    return (
        <div className="student-list-page transport-page postal-records-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Postal Records</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/postal" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Postal Records</Link>
                    </nav>
                </div>
            </div>

            <div className="postal-landing-grid fade-in flex-1">
                {/* Box 1: Postal Send */}
                <div
                    className="postal-landing-card group"
                    onClick={() => navigate('/school/front-office/postal-send')}
                >
                    <div className="postal-icon-wrapper send-icon-wrapper">
                        <IconSend size={48} stroke={1.5} />
                    </div>
                    <h3 className="postal-landing-title">Postal Send</h3>
                    <p className="postal-landing-subtitle">
                        Record and track all outgoing postal items, packages, and documents sent from the institution.
                    </p>
                    <div className="postal-landing-arrow send-arrow">
                        <IconArrowRight size={24} stroke={2} />
                    </div>
                </div>

                {/* Box 2: Postal Receive */}
                <div
                    className="postal-landing-card group"
                    onClick={() => navigate('/school/front-office/postal-receive')}
                >
                    <div className="postal-icon-wrapper receive-icon-wrapper">
                        <IconInbox size={48} stroke={1.5} />
                    </div>
                    <h3 className="postal-landing-title">Postal Receive</h3>
                    <p className="postal-landing-subtitle">
                        Log and manage all incoming mail, couriers, and deliveries received at the front desk.
                    </p>
                    <div className="postal-landing-arrow receive-arrow">
                        <IconArrowRight size={24} stroke={2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostalRecords;
