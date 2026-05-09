import React from 'react';

const TransportDashboard = () => {
    return (
        <div className="student-list-page">
            <div className="container">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Transport Dashboard</h4>
                        <nav className="breadcrumb">
                            <span className="text-gray-500">Transport</span> / <span className="current">Dashboard</span>
                        </nav>
                    </div>
                </div>

                <div className="card soft-card p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Transport Overview</h2>
                    <p className="text-gray-500 mt-2">Welcome to the Transport Dashboard. Metrics and vehicle status will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default TransportDashboard;
