import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconFilter, IconChevronDown, IconX } from '@tabler/icons-react';
import './FilterDropdown.css';

/**
 * Premium Reusable Filter Dropdown Component
 * 
 * A polished, accessible filter dropdown that matches Teachers List design.
 * Handles column visibility with apply/reset functionality.
 * 
 * Props:
 * - columns: Array of {key: string, label: string}
 * - visibleColumns: Set of visible column keys
 * - onApply: Callback when Apply is clicked
 * - onReset: Callback when Reset is clicked
 * - title: Dropdown title (default: "Filter Columns")
 */
const FilterDropdown = ({
    columns = [],
    visibleColumns = new Set(),
    onApply = () => {},
    onReset = () => {},
    title = 'Filter Columns'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempVisible, setTempVisible] = useState(new Set(visibleColumns));
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Initialize temp visible columns when component mounts or visibleColumns changes
    useEffect(() => {
        setTempVisible(new Set(visibleColumns));
    }, [visibleColumns]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add listener only when dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Toggle column visibility in temp state
    const toggleColumn = useCallback((columnKey) => {
        setTempVisible(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }
            return newSet;
        });
    }, []);

    // Handle Apply
    const handleApply = useCallback(() => {
        onApply(tempVisible);
        setIsOpen(false);
    }, [tempVisible, onApply]);

    // Handle Reset
    const handleReset = useCallback(() => {
        const allColumns = new Set(columns.map(col => col.key));
        setTempVisible(allColumns);
        onReset(allColumns);
        setIsOpen(false);
    }, [columns, onReset]);

    // Check if all columns are visible
    const allVisible = tempVisible.size === columns.length;
    const noneVisible = tempVisible.size === 0;

    return (
        <div className="filter-dropdown-wrapper" ref={containerRef}>
            {/* Filter Button */}
            <button
                className={`filter-btn ${isOpen ? 'active' : ''} ${!allVisible ? 'filtered' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={`${columns.length - tempVisible.size} column(s) hidden`}
                aria-label="Toggle filter dropdown"
                aria-expanded={isOpen}
            >
                <IconFilter size={18} />
                Filter
                <IconChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {/* Filter Dropdown Panel */}
            {isOpen && (
                <div className="filter-dropdown-panel" ref={dropdownRef} role="dialog" aria-modal="true">
                    {/* Header */}
                    <div className="filter-panel-header">
                        <h3>{title}</h3>
                        <button
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close filter"
                        >
                            <IconX size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="filter-panel-content">
                        {columns.length === 0 ? (
                            <p className="empty-message">No columns available</p>
                        ) : (
                            columns.map(column => (
                                <label key={column.key} className="filter-checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={tempVisible.has(column.key)}
                                        onChange={() => toggleColumn(column.key)}
                                        aria-label={`Toggle ${column.label} column`}
                                    />
                                    <span className="checkbox-label">{column.label}</span>
                                </label>
                            ))
                        )}
                        {noneVisible && columns.length > 0 && (
                            <div className="warning-box">
                                ⚠️ Select at least one column to display
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="filter-panel-footer">
                        <button
                            className="btn-reset"
                            onClick={handleReset}
                            aria-label="Reset to default columns"
                        >
                            Reset
                        </button>
                        <button
                            className={`btn-apply ${noneVisible ? 'disabled' : ''}`}
                            onClick={handleApply}
                            disabled={noneVisible}
                            aria-label="Apply filter changes"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
