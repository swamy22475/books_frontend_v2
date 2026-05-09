import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../full/vertical/sidebar/Sidebar';
import Header from '../full/vertical/header/Header';

const SuperAdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

    return (
        <div className="flex w-full min-h-screen">
            {/* Sidebar — hidden below xl, fixed-positioned */}
            <div className="hidden xl:block">
                <Sidebar collapsed={sidebarCollapsed} />
            </div>

            {/* Spacer div that matches sidebar width — pushes content right */}
            <div
                className="hidden xl:block transition-all duration-300 ease-in-out shrink-0 min-w-0"
                style={{
                    width: sidebarCollapsed ? 0 : 270
                }} />


            <div className="body-wrapper w-full bg-white dark:bg-dark min-w-0">
                {/* Top Header */}
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    onToggleSidebar={toggleSidebar} />


                {/* Body Content */}
                <div className="mx-auto px-6 py-30">
                    <main className="grow">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>);

};

export default SuperAdminLayout;
