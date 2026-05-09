import { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';

const FullLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <>
      <div className="flex w-full min-h-screen">
        <div className="page-wrapper flex w-full ">
          {/* Sidebar — hidden below xl, collapsible on xl+ */}
          <div
            className="hidden xl:block transition-all duration-300 ease-in-out"
            style={{
              width: sidebarCollapsed ? 0 : 270,
              minWidth: sidebarCollapsed ? 0 : 270,
              flexShrink: 0,
              overflow: 'hidden'
            }}>
            
            <div
              className="transition-transform duration-300 ease-in-out"
              style={{
                transform: sidebarCollapsed ? 'translateX(-270px)' : 'translateX(0)',
                width: 270
              }}>
              
              <Sidebar />
            </div>
          </div>

          <div className="body-wrapper w-full bg-white dark:bg-dark min-w-0">
            {/* Top Header  */}
            <Header
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={toggleSidebar} />
            

            {/* Body Content  */}
            <div className={'container mx-auto px-6 py-30'}>
              <main className="grow">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>);

};

export default FullLayout;