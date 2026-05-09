import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const ManageRooms = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        roomNo: '',
        hostelName: '',
        roomType: '',
        noOfBeds: '',
        costPerBed: '',
    });

    const [rooms, setRooms] = useState([
        { id: 1, roomNo: '101', hostelName: 'Boys Hostel A', roomType: '2 Seater', noOfBeds: 2, costPerBed: '500.00' },
        { id: 2, roomNo: '205', hostelName: 'Girls Hostel B', roomType: '4 Seater', noOfBeds: 4, costPerBed: '300.00' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAddModal(false);
    };

    const handleEdit = (room) => {
        setFormData(room);
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            setRooms(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Manage Rooms</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Hostel</span> / <span className="current">Manage Rooms</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconPlus size={18} />
                    Add Room
                </button>
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Room List</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '360px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search by room number or hostel..."
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    padding: '0',
                                    height: '100%',
                                    width: '100%',
                                    boxShadow: 'none'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Room No / Name</th>
                                    <th>Hostel</th>
                                    <th>Room Type</th>
                                    <th>No of Beds</th>
                                    <th>Cost per Bed</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id}>
                                        <td style={{ fontWeight: '500' }}>{room.roomNo}</td>
                                        <td>{room.hostelName}</td>
                                        <td>{room.roomType}</td>
                                        <td>{room.noOfBeds}</td>
                                        <td>${room.costPerBed}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(room)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(room.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header">
                            <h3>Add Room</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Hostel <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="text" name="hostelName" value={formData.hostelName} onChange={handleChange} required placeholder="Select hostel" />
                            </div>
                            <div className="form-group full-width">
                                <label>Room No / Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} required placeholder="Enter room number" />
                            </div>
                            <div className="form-group full-width">
                                <label>Room Type <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="text" name="roomType" value={formData.roomType} onChange={handleChange} required placeholder="Select room type" />
                            </div>
                            <div className="form-group full-width">
                                <label>Number of Beds <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="number" name="noOfBeds" value={formData.noOfBeds} onChange={handleChange} required placeholder="Enter number of beds" />
                            </div>
                            <div className="form-group full-width">
                                <label>Cost per Bed <span style={{ color: '#ea5455' }}>*</span></label>
                                <input type="number" name="costPerBed" value={formData.costPerBed} onChange={handleChange} required placeholder="Enter cost" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRooms;
