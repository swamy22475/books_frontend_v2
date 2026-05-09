import React, { useState } from 'react';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';

/**
 * ExportToolbar
 * Props:
 *  - columns : string[]          — header labels
 *  - rows    : object[]          — raw data rows
 *  - rowKeys : string[]          — keys to extract from each row (same order as columns)
 *  - title   : string            — used as filename base
 *  - columnLabels : object       — map of keys to labels (optional, derived from columns/rowKeys if not provided)
 */
const ExportToolbar = ({ columns = [], rows = [], rowKeys = [], title = 'Report' }) => {
    const [copied, setCopied] = useState(false);

    // Create column map for utils
    const columnMap = {};
    rowKeys.forEach((key, index) => {
        columnMap[key] = columns[index];
    });

    const handleCopy = () => {
        copyToClipboard(rows, rowKeys, columnMap)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error("Copy failed", err));
    };

    const handleCSV = () => {
        exportToCSV(rows, rowKeys, columnMap, title);
    };

    const handleExcel = () => {
        exportToExcel(rows, rowKeys, columnMap, title);
    };

    const handlePDF = () => {
        // Fallback to print if jspdf not available
        try {
            exportToPDF(rows, rowKeys, columnMap, title);
        } catch (e) {
            console.warn("PDF export failed, falling back to print", e);
            window.print();
        }
    };

    const handlePrint = () => {
        printTable(rows, rowKeys, columnMap, title);
    };

    return (
        <div className="rpt-export-toolbar" style={{ display: 'flex', gap: '8px' }}>
            <button
                className={`btn btn-outline btn-sm ${copied ? 'btn-success' : ''}`}
                onClick={handleCopy}
                title="Copy to clipboard"
            >
                {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button
                className="btn btn-outline btn-sm"
                onClick={handleCSV}
                title="Download CSV"
            >
                📄 CSV
            </button>
            <button
                className="btn btn-outline btn-sm"
                onClick={handleExcel}
                title="Download Excel"
            >
                📊 Excel
            </button>
            <button
                className="btn btn-outline btn-sm"
                onClick={handlePDF}
                title="Download PDF"
            >
                🖨️ PDF
            </button>
            <button
                className="btn btn-outline btn-sm"
                onClick={handlePrint}
                title="Print"
            >
                🖨️ Print
            </button>
        </div>
    );
};

export default ExportToolbar;
