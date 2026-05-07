import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconX, IconChevronDown } from '@tabler/icons-react';
import './FilterPanel.css';

/**
 * Advanced Filter Panel Component
 * 
 * Combines column visibility selectors with filter inputs
 * Opens as a popover on the right side of a button
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{key, label}, ...]
 * @param {Set} props.visibleColumns - Currently visible columns
 * @param {Function} props.onColumnsChange - Callback when columns change
 * @param {Array} props.filterOptions - Filter field definitions
 * @param {Object} props.filterValues - Current filter values
 * @param {Function} props.onFilterChange - Callback when filter values change
 * @param {boolean} props.isOpen - Whether panel is open
 * @param {Function} props.onClose - Close panel handler
 * @param {Element} props.triggerRef - Reference to trigger button
 */
const FilterPanel = ({
    columns = [],
    visibleColumns = new Set(),
    onColumnsChange = () => {},
    filterOptions = [],
    filterValues = {},
    onFilterChange = () => {},
    isOpen = false,
    onClose = () => {},
    triggerRef = null
}) => {
    const panelRef = useRef(null);
    const [tempVisibleColumns, setTempVisibleColumns] = useState(new Set(visibleColumns));
    const [tempFilterValues, setTempFilterValues] = useState({ ...filterValues });
    const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });

    // Sync temp state with props
    useEffect(() => {
        setTempVisibleColumns(new Set(visibleColumns));
        setTempFilterValues({ ...filterValues });
    }, [visibleColumns, filterValues]);

    // Calculate panel position
    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPanelPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, [isOpen, triggerRef]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isOpen) return;
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                if (triggerRef?.current && !triggerRef.current.contains(e.target)) {
                    onClose();
                }
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, triggerRef]);

    const toggleColumn = useCallback((columnKey) => {
        setTempVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }
            return newSet;
        });
    }, []);

    const handleFilterChange = useCallback((fieldKey, value) => {
        setTempFilterValues(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    }, []);

    const handleApply = () => {
        onColumnsChange(tempVisibleColumns);
        onFilterChange(tempFilterValues);
        onClose();
    };

    const handleReset = () => {
        setTempVisibleColumns(new Set(columns.map(c => c.key)));
        setTempFilterValues({});
        onColumnsChange(new Set(columns.map(c => c.key)));
        onFilterChange({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="filter-panel-overlay" onClick={onClose}>
            <div 
                className="filter-panel"
                ref={panelRef}
                style={{
                    position: 'fixed',
                    top: `${panelPosition.top}px`,
                    right: `${panelPosition.right}px`,
                    zIndex: 10000
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Filter and column options"
            >
                {/* Header */}
                <div className="filter-panel-header">
                    <h3>Filter</h3>
                    <button
                        className="filter-panel-close"
                        onClick={onClose}
                        aria-label="Close filter panel"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="filter-panel-content">
                    {/* Show Columns Section */}
                    {columns.length > 0 && (
                        <div className="filter-section">
                            <h4 className="filter-section-title">Show Columns</h4>
                            <div className="columns-grid">
                                {columns.map(column => (
                                    <label key={column.key} className="column-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempVisibleColumns.has(column.key)}
                                            onChange={() => toggleColumn(column.key)}
                                            aria-label={`Toggle ${column.label} column`}
                                        />
                                        <span className="checkbox-label">{column.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filter Options Section */}
                    {filterOptions.length > 0 && (
                        <div className="filter-section">
                            {filterOptions.map(option => (
                                <div key={option.key} className="filter-option">
                                    <label className="filter-option-label">{option.label}</label>
                                    {option.type === 'text' && (
                                        <input
                                            type="text"
                                            className="filter-input"
                                            placeholder={`Filter by ${option.label.toLowerCase()}...`}
                                            value={tempFilterValues[option.key] || ''}
                                            onChange={(e) => handleFilterChange(option.key, e.target.value)}
                                        />
                                    )}
                                    {option.type === 'select' && (
                                        <select
                                            className="filter-select"
                                            value={tempFilterValues[option.key] || ''}
                                            onChange={(e) => handleFilterChange(option.key, e.target.value)}
                                        >
                                            <option value="">Select {option.label.toLowerCase()}...</option>
                                            {option.options?.map((opt, idx) => {
                                                // Handle both string options and object options
                                                const optValue = typeof opt === 'string' ? opt : opt.value;
                                                const optLabel = typeof opt === 'string' ? opt : opt.label;
                                                return (
                                                    <option key={idx} value={optValue}>
                                                        {optLabel}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    )}
                                    {option.type === 'multi-select' && (
                                        <select
                                            className="filter-select"
                                            multiple
                                            value={tempFilterValues[option.key] || []}
                                            onChange={(e) => {
                                                const values = Array.from(e.target.selectedOptions, opt => opt.value);
                                                handleFilterChange(option.key, values);
                                            }}
                                        >
                                            {option.options?.map((opt, idx) => {
                                                const optValue = typeof opt === 'string' ? opt : opt.value;
                                                const optLabel = typeof opt === 'string' ? opt : opt.label;
                                                return (
                                                    <option key={idx} value={optValue}>
                                                        {optLabel}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    )}
                                    {option.type === 'date' && (
                                        <input
                                            type="date"
                                            className="filter-input"
                                            value={tempFilterValues[option.key] || ''}
                                            onChange={(e) => handleFilterChange(option.key, e.target.value)}
                                        />
                                    )}
                                    {option.type === 'date-range' && (
                                        <div className="date-range-inputs">
                                            <input
                                                type="date"
                                                className="filter-input"
                                                placeholder="From"
                                                value={tempFilterValues[`${option.key}_from`] || ''}
                                                onChange={(e) => handleFilterChange(`${option.key}_from`, e.target.value)}
                                            />
                                            <span className="date-separator">to</span>
                                            <input
                                                type="date"
                                                className="filter-input"
                                                placeholder="To"
                                                value={tempFilterValues[`${option.key}_to`] || ''}
                                                onChange={(e) => handleFilterChange(`${option.key}_to`, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="filter-panel-footer">
                    <button
                        className="btn-reset"
                        onClick={handleReset}
                        aria-label="Reset all filters"
                    >
                        Reset
                    </button>
                    <button
                        className="btn-apply"
                        onClick={handleApply}
                        aria-label="Apply filters"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
