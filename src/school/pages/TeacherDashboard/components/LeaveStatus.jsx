import React from 'react';
import { Calendar, Hospital, AlertCircle, FileWarning } from 'lucide-react';

const LeaveStatus = () => {
    const leaves = [
        { type: 'Emergency Leave', date: '15 Jun 2024', status: 'Pending', statusBg: 'rgba(14, 165, 233, 0.1)', statusColor: '#0EA5E9', icon: AlertCircle, iconBg: 'rgba(239, 68, 68, 0.1)', iconColor: '#EF4444' },
        { type: 'Medical Leave', date: '15 Jun 2024', status: 'Approved', statusBg: '#E1F3E9', statusColor: '#1AB394', icon: Hospital, iconBg: 'rgba(14, 165, 233, 0.1)', iconColor: '#0EA5E9' },
        { type: 'Medical Leave', date: '16 Jun 2024', status: 'Declined', statusBg: '#FFF0F0', statusColor: '#E84646', icon: Hospital, iconBg: 'rgba(14, 165, 233, 0.1)', iconColor: '#0EA5E9' },
        { type: 'Not Well', date: '16 Jun 2024', status: 'Approved', statusBg: '#E1F3E9', statusColor: '#1AB394', icon: FileWarning, iconBg: 'rgba(239, 68, 68, 0.1)', iconColor: '#EF4444' },
    ];

    return (
        <div
            className="h-full"
            style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
            }}
        >
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                <h4 className="text-lg font-semibold" style={{ color: '#333333' }}>Leave Status</h4>
                <a href="#" className="text-sm flex items-center gap-1.5" style={{ color: '#888888' }}>
                    <Calendar size={18} /> This Month
                </a>
            </div>
            <div className="px-5 py-4">
                <div className="space-y-4">
                    {leaves.map((leave, index) => {
                        const IconComponent = leave.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg"
                                style={{ backgroundColor: '#FAFAFA' }}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: leave.iconBg }}
                                    >
                                        <IconComponent size={18} style={{ color: leave.iconColor }} />
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold mb-0.5" style={{ color: '#333333' }}>{leave.type}</h6>
                                        <p className="text-xs" style={{ color: '#888888' }}>Date: {leave.date}</p>
                                    </div>
                                </div>
                                <span
                                    className="px-3 py-1 text-xs font-semibold rounded-full"
                                    style={{ backgroundColor: leave.statusBg, color: leave.statusColor }}
                                >
                                    {leave.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LeaveStatus;
