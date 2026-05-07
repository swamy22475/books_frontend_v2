import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPackageImport, IconSearch, IconUser, IconCalendar, IconPackage, IconPlus, IconMinus } from '@tabler/icons-react';
import './Inventory.css';

const AddStock = () => {
    const title = 'Add Stock';
    const icon = '📥';

    // Sample items for selection
    const [availableItems] = useState([
        { id: 1, name: 'Whiteboard Markers', sku: 'INV-WBM-001', currentStock: 150, unit: 'pieces' },
        { id: 2, name: 'Laboratory Microscopes', sku: 'INV-LMO-002', currentStock: 12, unit: 'units' },
        { id: 3, name: 'Computer Mouse', sku: 'INV-CMO-003', currentStock: 8, unit: 'pieces' },
        { id: 4, name: 'Basketball', sku: 'INV-BBA-004', currentStock: 0, unit: 'pieces' },
        { id: 5, name: 'Notebooks (A4)', sku: 'INV-NBA-005', currentStock: 500, unit: 'pieces' }
    ]);

    const [stockEntries, setStockEntries] = useState([
        {
            id: Date.now(),
            itemId: '',
            quantity: '',
            unitPrice: '',
            totalValue: '',
            supplier: '',
            invoiceNo: '',
            receivedDate: '',
            notes: '',
            condition: 'Good'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showItemSelector, setShowItemSelector] = useState(false);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);

    // Filter items for search
    const filteredItems = availableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEntry = () => {
        const newEntry = {
            id: Date.now(),
            itemId: '',
            quantity: '',
            unitPrice: '',
            totalValue: '',
            supplier: '',
            invoiceNo: '',
            receivedDate: '',
            notes: '',
            condition: 'Good'
        };
        setStockEntries([...stockEntries, newEntry]);
    };

    const handleRemoveEntry = (id) => {
        setStockEntries(stockEntries.filter(entry => entry.id !== id));
    };

    const handleFieldChange = (id, field, value) => {
        const updatedEntries = stockEntries.map(entry => {
            if (entry.id === id) {
                const updatedEntry = { ...entry, [field]: value };
                
                // Calculate total value when quantity and unit price are available
                if (field === 'quantity' || field === 'unitPrice') {
                    const quantity = parseFloat(field === 'quantity' ? value : entry.quantity) || 0;
                    const unitPrice = parseFloat(field === 'unitPrice' ? value : entry.unitPrice) || 0;
                    updatedEntry.totalValue = (quantity * unitPrice).toFixed(2);
                }
                
                return updatedEntry;
            }
            return entry;
        });
        setStockEntries(updatedEntries);
    };

    const handleItemSelect = (item, entryIndex) => {
        const updatedEntries = stockEntries.map((entry, index) => {
            if (index === entryIndex) {
                return {
                    ...entry,
                    itemId: item.id,
                    itemName: item.name,
                    itemSku: item.sku,
                    currentStock: item.currentStock,
                    unit: item.unit
                };
            }
            return entry;
        });
        setStockEntries(updatedEntries);
        setShowItemSelector(false);
        setSelectedEntryIndex(null);
    };

    const openItemSelector = (entryIndex) => {
        setSelectedEntryIndex(entryIndex);
        setShowItemSelector(true);
        setSearchTerm('');
    };

    const calculateGrandTotal = () => {
        return stockEntries.reduce((total, entry) => {
            return total + (parseFloat(entry.totalValue) || 0);
        }, 0);
    };

    const handleSubmit = () => {
        // Validation
        const isValid = stockEntries.every(entry => 
            entry.itemId && 
            entry.quantity && 
            entry.unitPrice && 
            entry.supplier && 
            entry.receivedDate
        );

        if (!isValid) {
            alert('Please fill in all required fields for each entry');
            return;
        }

        // Here you would normally submit to backend
        alert(`Stock added successfully! Total Value: ₹${calculateGrandTotal().toFixed(2)}`);
        
        // Reset form
        setStockEntries([{
            id: Date.now(),
            itemId: '',
            quantity: '',
            unitPrice: '',
            totalValue: '',
            supplier: '',
            invoiceNo: '',
            receivedDate: '',
            notes: '',
            condition: 'Good'
        }]);
    };

    return (
        <div className="inv-page">
            {/* Header */}
            <div className="inv-page-header">
                <div>
                    <h4 className="inv-page-title">{icon} {title}</h4>
                    <nav className="inv-breadcrumb">
                        <Link to="/school/dashboard">Dashboard</Link> /&nbsp;
                        <Link to="/school/inventory">Inventory</Link> /&nbsp;
                        <span className="inv-breadcrumb-current">{title}</span>
                    </nav>
                </div>
            </div>

            {/* Stock Entry Form */}
            <div className="inv-form-card">
                <div className="inv-form-header">
                    <h5 className="inv-form-title">Stock Entry Details</h5>
                </div>

                <div className="inv-stock-entries">
                    {stockEntries.map((entry, index) => (
                        <div key={entry.id} className="inv-stock-entry">
                            <div className="inv-entry-header">
                                <h6>Entry #{index + 1}</h6>
                                {stockEntries.length > 1 && (
                                    <button 
                                        className="inv-btn-icon inv-btn-delete"
                                        onClick={() => handleRemoveEntry(entry.id)}
                                        title="Remove Entry"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className="inv-form-grid">
                                <div className="inv-form-group">
                                    <label>Select Item *</label>
                                    <div className="inv-item-selector">
                                        {entry.itemId ? (
                                            <div className="inv-selected-item">
                                                <IconPackage size={16} />
                                                <div>
                                                    <strong>{entry.itemName}</strong>
                                                    <small>{entry.itemSku}</small>
                                                </div>
                                                <button 
                                                    className="inv-btn-icon"
                                                    onClick={() => openItemSelector(index)}
                                                    title="Change Item"
                                                >
                                                    <IconSearch size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className="inv-item-select-btn"
                                                onClick={() => openItemSelector(index)}
                                            >
                                                <IconSearch size={16} /> Select Item
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="inv-form-group">
                                    <label>Current Stock</label>
                                    <input
                                        type="text"
                                        value={entry.currentStock || ''}
                                        readOnly
                                        className="inv-form-input inv-readonly"
                                        placeholder="N/A"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Quantity Added *</label>
                                    <input
                                        type="number"
                                        value={entry.quantity}
                                        onChange={(e) => handleFieldChange(entry.id, 'quantity', e.target.value)}
                                        className="inv-form-input"
                                        placeholder="Enter quantity"
                                        min="1"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Unit Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={entry.unitPrice}
                                        onChange={(e) => handleFieldChange(entry.id, 'unitPrice', e.target.value)}
                                        className="inv-form-input"
                                        placeholder="Enter unit price"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Total Value (₹)</label>
                                    <input
                                        type="text"
                                        value={entry.totalValue || ''}
                                        readOnly
                                        className="inv-form-input inv-readonly"
                                        placeholder="Auto-calculated"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Supplier *</label>
                                    <input
                                        type="text"
                                        value={entry.supplier}
                                        onChange={(e) => handleFieldChange(entry.id, 'supplier', e.target.value)}
                                        className="inv-form-input"
                                        placeholder="Enter supplier name"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Invoice Number</label>
                                    <input
                                        type="text"
                                        value={entry.invoiceNo}
                                        onChange={(e) => handleFieldChange(entry.id, 'invoiceNo', e.target.value)}
                                        className="inv-form-input"
                                        placeholder="Enter invoice number"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Received Date *</label>
                                    <input
                                        type="date"
                                        value={entry.receivedDate}
                                        onChange={(e) => handleFieldChange(entry.id, 'receivedDate', e.target.value)}
                                        className="inv-form-input"
                                    />
                                </div>

                                <div className="inv-form-group">
                                    <label>Condition</label>
                                    <select
                                        value={entry.condition}
                                        onChange={(e) => handleFieldChange(entry.id, 'condition', e.target.value)}
                                        className="inv-form-select"
                                    >
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>

                                <div className="inv-form-group full-width">
                                    <label>Notes</label>
                                    <textarea
                                        value={entry.notes}
                                        onChange={(e) => handleFieldChange(entry.id, 'notes', e.target.value)}
                                        className="inv-form-textarea"
                                        placeholder="Enter any additional notes..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="inv-form-actions">
                    <button 
                        className="inv-btn inv-btn-secondary"
                        onClick={handleAddEntry}
                    >
                        <IconPlus size={16} /> Add Another Entry
                    </button>
                </div>

                {/* Summary */}
                <div className="inv-stock-summary">
                    <div className="inv-summary-card">
                        <h6>Summary</h6>
                        <div className="inv-summary-row">
                            <span>Total Entries:</span>
                            <strong>{stockEntries.length}</strong>
                        </div>
                        <div className="inv-summary-row">
                            <span>Total Items Added:</span>
                            <strong>
                                {stockEntries.reduce((sum, entry) => sum + (parseFloat(entry.quantity) || 0), 0)}
                            </strong>
                        </div>
                        <div className="inv-summary-row grand-total">
                            <span>Grand Total Value:</span>
                            <strong>₹{calculateGrandTotal().toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                <div className="inv-form-footer">
                    <Link to="/school/inventory" className="inv-btn inv-btn-outline">
                        Cancel
                    </Link>
                    <button 
                        className="inv-btn inv-btn-primary"
                        onClick={handleSubmit}
                    >
                        <IconPackageImport size={16} /> Add Stock
                    </button>
                </div>
            </div>

            {/* Item Selector Modal */}
            {showItemSelector && (
                <div className="inv-modal-overlay">
                    <div className="inv-modal-content">
                        <div className="inv-modal-header">
                            <h5>Select Item</h5>
                            <button 
                                className="inv-modal-close"
                                onClick={() => {
                                    setShowItemSelector(false);
                                    setSelectedEntryIndex(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="inv-modal-body">
                            <div className="inv-search-wrapper">
                                <IconSearch size={16} className="inv-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="inv-search-input"
                                />
                            </div>
                            
                            <div className="inv-item-list">
                                {filteredItems.map(item => (
                                    <div 
                                        key={item.id}
                                        className="inv-item-option"
                                        onClick={() => handleItemSelect(item, selectedEntryIndex)}
                                    >
                                        <div className="inv-item-option-icon">
                                            <IconPackage size={20} />
                                        </div>
                                        <div className="inv-item-option-details">
                                            <strong>{item.name}</strong>
                                            <div className="inv-item-option-meta">
                                                <span>SKU: {item.sku}</span>
                                                <span>Current Stock: {item.currentStock} {item.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStock;
