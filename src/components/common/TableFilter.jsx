import React, { useState, useCallback, useEffect } from 'react';
import { IconFilter, IconChevronDown, IconX } from '@tabler/icons-react';
import './TableFilter.css';

/**
 * Advanced Table Filter Component
 * 
 * Provides reusable column visibility, row filters, and search integration
 * 
 * Props:
 * - columns: Array of { key, label } - Table columns
 * - filters: Array of { key, label, options: [] } - Available filters
 * - visibleColumns: Set of visible column keys
 * - setVisibleColumns: Setter for visible columns
 * - selectedFilters: Object { filterKey: value }
 * - setSelectedFilters: Setter for selected filters
 * - searchQuery: Current search query
 * - setSearchQuery: Setter for search query
 * - pageKey: Unique key for localStorage persistence (e.g., 'studentList')
 * - onFilterApply: Optional callback when filters are applied
 */
const TableFilter = ({
    columns = [],
    filters = [],
    visibleColumns,
    setVisibleColumns,
    selectedFilters = {},
    setSelectedFilters,
    searchQuery = '',
    setSearchQuery,
    pageKey = 'table-filter',
    onFilterApply
}) => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters);

    // Initialize column visibility from localStorage on mount
    useEffect(() => {
        const savedVisibility = localStorage.getItem(`${pageKey}-column-visibility`);
        if (savedVisibility && setVisibleColumns) {
            try {
                const visibility = JSON.parse(savedVisibility);
                const visibleSet = new Set(Object.keys(visibility).filter(key => visibility[key]));
                setVisibleColumns(visibleSet);
            } catch (e) {
                console.error('Error parsing column visibility:', e);
            }
        }
    }, [pageKey, setVisibleColumns]);

    // Persist column visibility to localStorage
    const handleColumnVisibilityChange = useCallback((columnKey) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }

            // Persist to localStorage
            const visibility = {};
            columns.forEach(col => {
                visibility[col.key] = newSet.has(col.key);
            });
            localStorage.setItem(`${pageKey}-column-visibility`, JSON.stringify(visibility));

            return newSet;
        });
    }, [columns, pageKey, setVisibleColumns]);

    // Handle filter change
    const handleFilterChange = (filterKey, value) => {
        setTempSelectedFilters(prev => {
            const updated = { ...prev };
            if (value === 'All' || value === '') {
                delete updated[filterKey];
            } else {
                updated[filterKey] = value;
            }
            return updated;
        });
    };

    // Apply filters
    const handleApplyFilters = useCallback(() => {
        setSelectedFilters(tempSelectedFilters);
        setShowFilterMenu(false);
        if (onFilterApply) {
            onFilterApply(tempSelectedFilters);
        }
    }, [tempSelectedFilters, setSelectedFilters, onFilterApply]);

    // Reset all filters
    const handleResetFilters = () => {
        setTempSelectedFilters({});
        setSelectedFilters({});
        setShowColumnMenu(false);
        setShowFilterMenu(false);
        if (onFilterApply) {
            onFilterApply({});
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.table-filter-container')) {
                setShowFilterMenu(false);
                setShowColumnMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if any filters are active
    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    // Check if all columns are hidden
    const allColumnsHidden = visibleColumns && visibleColumns.size === 0;

    return (
        <div className="table-filter-container">
            <div className="filter-controls">
                {/* Column Visibility Button */}
                <div className="filter-dropdown-container">
                    <button
                        className={`filter-button ${visibleColumns && visibleColumns.size === columns.length ? '' : 'active'}`}
                        onClick={() => {
                            setShowColumnMenu(!showColumnMenu);
                            setShowFilterMenu(false);
                        }}
                        title={`${columns.length - (visibleColumns?.size || 0)} column(s) hidden`}
                    >
                        <IconFilter size={18} /> Columns <IconChevronDown size={16} />
                    </button>
                    {showColumnMenu && (
                        <div className="filter-menu">
                            <div className="filter-header">
                                <h3>Show/Hide Columns</h3>
                            </div>
                            <div className="filter-body columns-section">
                                {columns.length === 0 ? (
                                    <p style={{ color: 'var(--sl-text-muted)', fontSize: '13px' }}>No columns available</p>
                                ) : (
                                    columns.map(column => (
                                        <div key={column.key} className="column-checkbox-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={!visibleColumns || visibleColumns.has(column.key)}
                                                    onChange={() => handleColumnVisibilityChange(column.key)}
                                                />
                                                <span>{column.label}</span>
                                            </label>
                                        </div>
                                    ))
                                )}
                                {allColumnsHidden && (
                                    <div className="warning-message">
                                        ⚠️ Select at least one column to display
                                    </div>
                                )}
                            </div>
                            <div className="filter-footer">
                                <button className="btn-reset" onClick={handleResetFilters}>
                                    Reset All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Row Filters Button */}
                {filters.length > 0 && (
                    <div className="filter-dropdown-container">
                        <button
                            className={`filter-button ${hasActiveFilters ? 'active' : ''}`}
                            onClick={() => {
                                setShowFilterMenu(!showFilterMenu);
                                setShowColumnMenu(false);
                            }}
                        >
                            <IconFilter size={18} /> Filter <IconChevronDown size={16} />
                            {hasActiveFilters && (
                                <span className="filter-badge">{Object.keys(selectedFilters).length}</span>
                            )}
                        </button>
                        {showFilterMenu && (
                            <div className="filter-menu">
                                <div className="filter-header">
                                    <h3>Filter Rows</h3>
                                </div>
                                <div className="filter-body">
                                    {filters.map(filter => (
                                        <div key={filter.key} className="filter-group-vertical">
                                            <label>{filter.label}</label>
                                            <select
                                                className="filter-select"
                                                value={tempSelectedFilters[filter.key] || ''}
                                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {filter.options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                <div className="filter-footer">
                                    <button className="btn-reset" onClick={() => {
                                        setTempSelectedFilters({});
                                        setSelectedFilters({});
                                    }}>
                                        Reset
                                    </button>
                                    <button className="btn-apply" onClick={handleApplyFilters}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
                <div className="active-filters">
                    {Object.entries(selectedFilters).map(([filterKey, filterValue]) => {
                        const filterLabel = filters.find(f => f.key === filterKey)?.label || filterKey;
                        return (
                            <span key={filterKey} className="filter-badge-item">
                                {filterLabel}: {filterValue}
                                <button
                                    className="badge-close"
                                    onClick={() => {
                                        const updated = { ...selectedFilters };
                                        delete updated[filterKey];
                                        setSelectedFilters(updated);
                                        setTempSelectedFilters(updated);
                                    }}
                                >
                                    <IconX size={14} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Search Input (if you want to render it here, or use externally) */}
            {searchQuery !== undefined && setSearchQuery && (
                <div className="search-input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            )}
        </div>
    );
};

export default TableFilter;
