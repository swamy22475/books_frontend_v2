import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../school/components/Layout/Sidebar';
import Header from '../../school/components/Layout/Header';
import { SettingsProvider } from '../../context/SettingsContext';
import { LogoSettingsModal } from '../../components/settings/SettingsModals';

const SchoolAdminLayout = () => {
    const [activeModal, setActiveModal] = useState(null);

    const handleSettingsAction = (action) => {
        setActiveModal(action);
    };

    const closeModal = () => setActiveModal(null);

    return (
        <SettingsProvider>
            <div className="flex w-full min-h-screen">
                <Sidebar isOpen={true} onSettingsAction={handleSettingsAction} />
                <div className="layout-content flex-1">
                    <Header toggleSidebar={() => { }} />
                    <main className="page-wrapper">
                        <Outlet />
                    </main>
                </div>
            </div>

            {activeModal === 'logo-settings' && (
                <LogoSettingsModal onClose={closeModal} />
            )}
        </SettingsProvider>
    );
};

export default SchoolAdminLayout;