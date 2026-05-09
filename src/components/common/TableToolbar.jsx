import React, { forwardRef } from 'react';
import { IconFilter, IconColumns, IconList, IconSortAZ } from '@tabler/icons-react';
import './TableToolbar.css';

/**
 * Reusable Table Toolbar Component
 * 
 * Matches the Teachers List design with:
 * - Title on the left
 * - Controls (Date range, Filter, Columns, Sort) on the right
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (e.g., "Teachers List", "Student List")
 * @param {Function} props.onFilterClick - Filter button click handler
 * @param {Function} props.onColumnsClick - Columns button click handler
 * @param {Function} props.onSortClick - Sort dropdown handler (optional)
 * @param {React.ReactNode} props.dateRangePicker - Date range picker component (optional)
 * @param {boolean} props.showColumnsButton - Show columns button (default: true)
 * @param {boolean} props.showSortButton - Show sort button (default: true)
 * @param {React.Ref} ref - Ref to the filter button
 */
const TableToolbar = forwardRef(({
    title = '',
    onFilterClick = () => { },
    onColumnsClick = () => { },
    onSortClick = () => { },
    dateRangePicker = null,
    showColumnsButton = true,
    showSortButton = true,
    showViewButton = false
}, filterButtonRef) => {
    const columnsButtonRef = React.useRef(null);
    return (
        <div className="toolbar-header">
            {/* Left: Title */}
            <div className="toolbar-title">
                <h2>{title}</h2>
            </div>

            {/* Right: Controls */}
            <div className="toolbar-controls">
                {/* Date Range Picker (if provided) */}
                {dateRangePicker && (
                    <div className="toolbar-control-item date-range">
                        {dateRangePicker}
                    </div>
                )}

                {/* Filter Button */}
                <button
                    ref={filterButtonRef}
                    className="toolbar-control-btn filter-btn"
                    onClick={onFilterClick}
                    title="Open filters and column options"
                    aria-label="Filter"
                >
                    <IconFilter size={18} />
                    <span>Filter</span>
                </button>

                {/* Columns Button (if enabled) */}
                {showColumnsButton && (
                    <button
                        ref={columnsButtonRef}
                        className="toolbar-control-btn columns-btn"
                        onClick={onColumnsClick}
                        title="Show/hide columns"
                        aria-label="Columns"
                    >
                        <IconColumns size={18} />
                    </button>
                )}

                {/* View Toggle Button (optional) */}
                {showViewButton && (
                    <button
                        className="toolbar-control-btn view-btn"
                        title="Toggle view"
                        aria-label="Toggle view"
                    >
                        <IconList size={18} />
                    </button>
                )}

                {/* Sort Button (if enabled) */}
                {showSortButton && (
                    <button
                        className="toolbar-control-btn sort-btn"
                        onClick={onSortClick}
                        title="Sort options"
                        aria-label="Sort"
                    >
                        <IconSortAZ size={18} />
                        <span>Sort by A-Z</span>
                    </button>
                )}
            </div>
        </div>
    );
});

TableToolbar.displayName = 'TableToolbar';

export default TableToolbar;

