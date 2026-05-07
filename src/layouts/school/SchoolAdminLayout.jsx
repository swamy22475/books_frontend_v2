import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../school/components/Layout/Sidebar';
import Header from '../../school/components/Layout/Header';
const SchoolAdminLayout = () => {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar isOpen={true} />
            <div className="layout-content flex-1">
                <Header toggleSidebar={() => { }} />
                <main className="page-wrapper">
                    <Outlet />
                </main>
            </div>
        </div>);

};

export default SchoolAdminLayout;