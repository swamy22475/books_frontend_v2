import React, { useState } from 'react';
import {
    IconRefresh,
    IconPrinter,
    IconFileExport,
    IconChevronDown,
    IconFileTypePdf,
    IconFileTypeXls,
    IconHome,
    IconLayoutGrid
} from '@tabler/icons-react';
import './Academics.css';

const AcademicsPlaceholder = ({ title }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    return (
        <div className="academics-page">
            <header className="ref-header-bar">
                <div className="ref-header-left">
                    <IconLayoutGrid size={18} />
                    <span>{title}</span>
                </div>
                <div className="ref-header-right">
                    <IconHome size={14} />
                    <a href="#">Dashboard</a>
                    <span className="mx-1">/</span>
                    <span>Academics</span>
                    <span className="mx-1">/</span>
                    <span>{title}</span>
                </div>
            </header>

            <div className="add-btn-container">
                <div className="header-actions">
                    <button className="icon-btn hover:text-blue-500 hover:border-blue-500">
                        <IconRefresh size={20} />
                    </button>
                    <button className="icon-btn hover:text-blue-500 hover:border-blue-500" onClick={() => window.print()}>
                        <IconPrinter size={20} />
                    </button>
                    <div className="export-dropdown-container">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors ${showExportMenu ? 'bg-gray-200' : ''}`}
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            <IconFileExport size={18} /> Export <IconChevronDown size={14} />
                        </button>
                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 min-w-[180px]">
                                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                    <IconFileTypePdf size={16} /> Export as PDF
                                </button>
                                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                    <IconFileTypeXls size={16} /> Export as Excel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 flex justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-xl w-full">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconLayoutGrid size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} Page</h2>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        This module is currently under development. The full feature set for **{title}**
                        will be available in the next system update.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                            Learn More
                        </button>
                        <button className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                            Return Home
                        </button>
                    </div>
                </div>
            </div>

            <footer className="academics-footer">
                <p>Copyright © 2024 MindWhile. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AcademicsPlaceholder;
