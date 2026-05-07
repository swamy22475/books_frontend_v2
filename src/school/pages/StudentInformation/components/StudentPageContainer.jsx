import React from 'react';
import BackButton from './BackButton';

/**
 * StudentPageContainer
 * 
 * Reusable page wrapper for all Student Information pages.
 * Provides a consistent layout with:
 *  - Page header (back button, title, breadcrumb, actions)
 *  - Content area (children)
 * 
 * @param {string}  title         - Page title (e.g. "Students", "Bulk Edit")
 * @param {string}  breadcrumb    - Breadcrumb text (e.g. "Student Management / Students")
 * @param {string}  backTitle     - Tooltip for back button
 * @param {React.ReactNode} actions - Extra action buttons in the header
 * @param {React.ReactNode} children - Page content
 * @param {string}  className     - Additional class for the outer wrapper
 * @param {string}  pageClass     - CSS class for page wrapper (default "student-list-page")
 */
const StudentPageContainer = ({
    title,
    breadcrumb,
    backTitle = 'Back',
    showDashboard = true,
    actions,
    children,
    className = '',
    pageClass = 'student-list-page',
}) => {
    return (
        <div className={`${pageClass} ${className}`.trim()}>
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-title">
                        <div className="back-button-wrapper">
                            <BackButton title={backTitle} />
                            <div>
                                <h4>{title}</h4>
                                {breadcrumb && (
                                    <nav className="breadcrumb">
                                        {typeof breadcrumb === 'string' ? (
                                            <span dangerouslySetInnerHTML={{ __html: breadcrumb }} />
                                        ) : (
                                            breadcrumb
                                        )}
                                    </nav>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="page-header-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {actions}
                    </div>
                </div>

                {/* Page Content */}
                {children}
            </div>
        </div>
    );
};

export default StudentPageContainer;
