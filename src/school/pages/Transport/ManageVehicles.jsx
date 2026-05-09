import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconAlertCircle, IconCopy, IconFileText,
    IconFileSpreadsheet, IconPrinter, IconBus, IconEye, IconPencil,
    IconTrash, IconChevronDown, IconFilter
} from '@tabler/icons-react';
import '../Transport/ManageStudentTransport.css';

const SEED = [
    { id: 1, vehicleNo: 'VH-1001', model: 'Volvo Bus 2023', driver: 'Rajesh Kumar', license: 'DL-04-2021-12345', phone: '9876543210', capacity: 40, status: 'Active' },
    { id: 2, vehicleNo: 'VH-1002', model: 'Tata Starbus', driver: 'Suresh Singh', license: 'DL-04-2020-67890', phone: '9123456780', capacity: 35, status: 'Inactive' },
    { id: 3, vehicleNo: 'VH-1003', model: 'Force Traveler', driver: 'Amit Verma', license: 'DL-04-2022-54321', phone: '9988776655', capacity: 20, status: 'Active' },
];

const getVehicles = () => {
    const stored = localStorage.getItem('vehicles');
    if (stored) return JSON.parse(stored);

    // First load — seed localStorage with full set
    localStorage.setItem('vehicles', JSON.stringify(SEED));
    return SEED;
};

const ManageVehicles = () => {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState(getVehicles);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [viewVehicle, setViewVehicle] = useState(null); // State for View Modal

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v =>
            v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.driver.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vehicles, searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedVehicles(filteredVehicles.map(v => v.id));
        } else {
            setSelectedVehicles([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedVehicles(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleCopy = () => {
        const text = filteredVehicles.map(v => `${v.vehicleNo}\t${v.model}\t${v.driver}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Data copied to clipboard!');
    };

    const handlePrint = () => window.print();

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        const current = JSON.parse(localStorage.getItem('vehicles') || '[]');
        const updated = current.filter(v => v.id !== id);
        setVehicles(updated);
        localStorage.setItem('vehicles', JSON.stringify(updated));
    };

    const handleView = (vehicle) => {
        setViewVehicle(vehicle);
    };

    const handleToggleStatus = (id) => {
        const updated = vehicles.map(v => {
            if (v.id === id) {
                return { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return v;
        });
        setVehicles(updated);
        localStorage.setItem('vehicles', JSON.stringify(updated));
    };

    return (
        <div className="student-list-page transport-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Manage Vehicles</h4>
                    <nav className="breadcrumb">
                        <span className="breadcrumb-link">Transport</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="current">Manage Vehicles</span>
                    </nav>
                </div>
                <div className="page-header-actions">
                    <button
                        className="btn btn-primary"
                        style={{
                            background: 'linear-gradient(135deg, #3d5ee1 0%, #6e8efb 100%)',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(61, 94, 225, 0.2)'
                        }}
                        onClick={() => navigate('/school/transport/vehicles/add')}
                    >
                        <IconPlus size={18} /> Add Vehicle
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Vehicle Information</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            className="search-input-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="export-button-group">
                        <button className="export-btn" onClick={handleCopy}>Copy</button>
                        <button className="export-btn">CSV</button>
                        <button className="export-btn">Excel</button>
                        <button className="export-btn">PDF</button>
                        <button className="export-btn" onClick={handlePrint}>Print</button>
                        <div className="filter-dropdown-btn">
                            <IconFilter size={16} />
                            <span>Filter</span>
                            <IconChevronDown size={14} />
                        </div>
                    </div>
                </div>

                <div className="table-wrap px-0">
                    <table className="premium-table-v2">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={filteredVehicles.length > 0 && selectedVehicles.length === filteredVehicles.length}
                                    />
                                </th>
                                <th>Vehicle Number</th>
                                <th>Vehicle Model</th>
                                <th>Driver Name</th>
                                <th>License Number</th>
                                <th>Phone Number</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--sl-text-muted)' }}>
                                        <div className="flex flex-col items-center gap-3">
                                            <IconAlertCircle size={40} className="opacity-20" />
                                            <h3 className="text-lg font-semibold">No Vehicles Found</h3>
                                            <p className="text-sm opacity-70">Try adjusting your search to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="table-row-v2">
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedVehicles.includes(vehicle.id)}
                                                onChange={() => handleSelectOne(vehicle.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="font-bold text-slate-700">{vehicle.vehicleNo}</div>
                                        </td>
                                        <td>{vehicle.model}</td>
                                        <td>
                                            <div className="font-medium text-slate-600">{vehicle.driver}</div>
                                        </td>
                                        <td>{vehicle.license}</td>
                                        <td>{vehicle.phone}</td>
                                        <td>
                                            <span className="status-text active" style={{ background: '#f8fafc', color: '#64748b' }}>
                                                {vehicle.capacity}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`status-text ${vehicle.status === 'Active' ? 'active' : 'inactive'}`}
                                                onClick={() => handleToggleStatus(vehicle.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="action-icon-btn view"
                                                    onClick={() => handleView(vehicle)}
                                                    title="View"
                                                >
                                                    <IconEye size={18} />
                                                </button>
                                                <button
                                                    className="action-icon-btn edit"
                                                    onClick={() => navigate(`/school/transport/vehicles/edit/${vehicle.id}`)}
                                                    title="Edit"
                                                >
                                                    <IconPencil size={18} />
                                                </button>
                                                <button
                                                    className="action-icon-btn delete"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    title="Delete"
                                                >
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 flex items-center justify-between text-[13px] text-gray-500 border-t border-slate-100 bg-slate-50/30">
                    <span>Showing 1 to {filteredVehicles.length} of {filteredVehicles.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* View Vehicle Modal */}
            {viewVehicle && (
                <div className="modal-overlay" onClick={() => setViewVehicle(null)}>
                    <div className="view-modal" onClick={e => e.stopPropagation()}>
                        <div className="view-modal-header">
                            <h3 className="text-lg font-bold text-gray-900">Vehicle Details</h3>
                            <button onClick={() => setViewVehicle(null)} className="text-gray-400 hover:text-gray-600">
                                <IconAlertCircle size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="view-modal-body">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <IconBus size={32} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{viewVehicle.vehicleNo}</div>
                                    <div className="text-gray-500 font-medium">{viewVehicle.model}</div>
                                </div>
                            </div>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Driver Name</span>
                                    <span className="detail-value">{viewVehicle.driver}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone Number</span>
                                    <span className="detail-value">{viewVehicle.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">License No</span>
                                    <span className="detail-value">{viewVehicle.license}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Capacity</span>
                                    <span className="detail-value">{viewVehicle.capacity} Seats</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Current Status</span>
                                    <span className={`badge ${viewVehicle.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                        {viewVehicle.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="view-modal-footer">
                            <button className="btn btn-primary" onClick={() => setViewVehicle(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVehicles;
