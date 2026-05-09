import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconPlus, IconSearch, IconAlertCircle, IconCopy, IconFileText,
    IconFileSpreadsheet, IconPrinter, IconRoute, IconEye, IconPencil,
    IconTrash, IconChevronDown, IconFilter
} from '@tabler/icons-react';
import '../Transport/ManageStudentTransport.css';

const SEED = [
    { id: 1, routeNo: 'RT-001', routeName: 'North Zone', startPoint: 'City Center', endPoint: 'North Campus', stops: 8, distance: '12 km', vehicle: 'VH-1001', driver: 'Rajesh Kumar', status: 'Active' },
    { id: 2, routeNo: 'RT-002', routeName: 'South Zone', startPoint: 'South Market', endPoint: 'South Campus', stops: 6, distance: '9 km', vehicle: 'VH-1002', driver: 'Suresh Singh', status: 'Inactive' },
    { id: 3, routeNo: 'RT-003', routeName: 'East Corridor', startPoint: 'East Station', endPoint: 'East Campus', stops: 10, distance: '15 km', vehicle: 'VH-1003', driver: 'Amit Verma', status: 'Active' },
];

const getRoutes = () => {
    const stored = localStorage.getItem('routes');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('routes', JSON.stringify(SEED));
    return SEED;
};

const ManageRoutes = () => {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState(getRoutes);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [viewRoute, setViewRoute] = useState(null); // State for View Modal

    const filteredRoutes = useMemo(() =>
        routes.filter(r =>
            r.routeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.driver.toLowerCase().includes(searchTerm.toLowerCase())
        ), [routes, searchTerm]);

    const handleSelectAll = (e) => {
        setSelectedRoutes(e.target.checked ? filteredRoutes.map(r => r.id) : []);
    };

    const handleSelectOne = (id) => {
        setSelectedRoutes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCopy = () => {
        const text = filteredRoutes.map(r => `${r.routeNo}\t${r.routeName}\t${r.driver}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Data copied to clipboard!');
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        const current = JSON.parse(localStorage.getItem('routes') || '[]');
        const updated = current.filter(r => r.id !== id);
        setRoutes(updated);
        localStorage.setItem('routes', JSON.stringify(updated));
    };

    const handleView = (route) => {
        setViewRoute(route);
    };

    const handleToggleStatus = (id) => {
        const updated = routes.map(r => {
            if (r.id === id) {
                return { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return r;
        });
        setRoutes(updated);
        localStorage.setItem('routes', JSON.stringify(updated));
    };

    return (
        <div className="student-list-page transport-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Manage Routes</h4>
                    <nav className="breadcrumb">
                        <span className="breadcrumb-link">Transport</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="current">Manage Routes</span>
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
                        onClick={() => navigate('/school/transport/routes/add')}
                    >
                        <IconPlus size={18} /> Add Route
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 overflow-hidden fade-in">
                <div className="premium-header-banner">
                    <h4 className="mb-0">Route Information</h4>
                </div>

                <div className="table-toolbar-premium">
                    <div className="search-pill-wrapper flex-1 max-w-sm">
                        <IconSearch size={18} className="search-icon-pill" />
                        <input
                            type="text"
                            placeholder="Search routes..."
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
                        <button className="export-btn" onClick={() => window.print()}>Print</button>
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
                                    <input type="checkbox" onChange={handleSelectAll}
                                        checked={filteredRoutes.length > 0 && selectedRoutes.length === filteredRoutes.length} />
                                </th>
                                <th>Route No</th>
                                <th>Route Name</th>
                                <th>Start Point</th>
                                <th>End Point</th>
                                <th>Stops</th>
                                <th>Distance</th>
                                <th>Vehicle</th>
                                <th>Driver</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoutes.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--sl-text-muted)' }}>
                                        <div className="flex flex-col items-center gap-3">
                                            <IconAlertCircle size={40} className="opacity-20" />
                                            <h3 className="text-lg font-semibold">No Routes Found</h3>
                                            <p className="text-sm opacity-70">Try adjusting your search or add a new route.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRoutes.map((route) => (
                                    <tr key={route.id} className="table-row-v2">
                                        <td>
                                            <input type="checkbox"
                                                checked={selectedRoutes.includes(route.id)}
                                                onChange={() => handleSelectOne(route.id)} />
                                        </td>
                                        <td>
                                            <div className="font-bold text-slate-700">{route.routeNo}</div>
                                        </td>
                                        <td>
                                            <div className="font-medium text-slate-600">{route.routeName}</div>
                                        </td>
                                        <td>{route.startPoint}</td>
                                        <td>{route.endPoint}</td>
                                        <td>
                                            <span className="status-text active" style={{ background: '#f8fafc', color: '#64748b' }}>
                                                {route.stops}
                                            </span>
                                        </td>
                                        <td>{route.distance}</td>
                                        <td>{route.vehicle}</td>
                                        <td>
                                            <div className="font-medium text-slate-600">{route.driver}</div>
                                        </td>
                                        <td>
                                            <span
                                                className={`status-text ${route.status === 'Active' ? 'active' : 'inactive'}`}
                                                onClick={() => handleToggleStatus(route.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {route.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="action-icon-btn view"
                                                    onClick={() => handleView(route)}
                                                    title="View"
                                                >
                                                    <IconEye size={18} />
                                                </button>
                                                <button
                                                    className="action-icon-btn edit"
                                                    onClick={() => navigate(`/school/transport/routes/edit/${route.id}`)}
                                                    title="Edit"
                                                >
                                                    <IconPencil size={18} />
                                                </button>
                                                <button
                                                    className="action-icon-btn delete"
                                                    onClick={() => handleDelete(route.id)}
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
                    <span>Showing 1 to {filteredRoutes.length} of {filteredRoutes.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Previous</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">1</button>
                        <button className="export-btn" disabled style={{ padding: '8px 20px' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* View Route Modal */}
            {viewRoute && (
                <div className="modal-overlay" onClick={() => setViewRoute(null)}>
                    <div className="view-modal" onClick={e => e.stopPropagation()}>
                        <div className="view-modal-header">
                            <h3 className="text-lg font-bold text-gray-900">Route Details</h3>
                            <button onClick={() => setViewRoute(null)} className="text-gray-400 hover:text-gray-600">
                                <IconAlertCircle size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="view-modal-body">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <IconRoute size={34} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{viewRoute.routeNo}</div>
                                    <div className="text-gray-500 font-medium text-lg">{viewRoute.routeName}</div>
                                </div>
                            </div>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Start Point</span>
                                    <span className="detail-value">{viewRoute.startPoint}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">End Point</span>
                                    <span className="detail-value">{viewRoute.endPoint}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Total Stops</span>
                                    <span className="detail-value">{viewRoute.stops} Stops</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Distance</span>
                                    <span className="detail-value">{viewRoute.distance}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Assigned Vehicle</span>
                                    <span className="detail-value">{viewRoute.vehicle}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Current Driver</span>
                                    <span className="detail-value">{viewRoute.driver}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Route Status</span>
                                    <span className={`badge ${viewRoute.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                        {viewRoute.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="view-modal-footer">
                            <button className="btn btn-primary px-8" onClick={() => setViewRoute(null)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoutes;
