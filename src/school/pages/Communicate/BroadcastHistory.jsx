import React from 'react';
import StudentPageContainer from '../../pages/StudentInformation/components/StudentPageContainer';

const BroadcastHistory = () => {
    return (
        <StudentPageContainer title="Broadcast History" description="View history of sent broadcasts">
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                    <p>Broadcast History - Coming Soon</p>
                </div>
            </div>
        </StudentPageContainer>
    );
};

export default BroadcastHistory;
