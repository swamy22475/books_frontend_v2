import React from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';

const EventsHolidays = () => {
    return (
        <StudentPageContainer title="Events & Holidays" description="Manage school events and holiday calendar">
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                    <p>Events and Holidays - Coming Soon</p>
                </div>
            </div>
        </StudentPageContainer>
    );
};

export default EventsHolidays;
