import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEdit, IconTrash, IconUserPlus, IconPlus, IconChevronDown, IconCopy, IconFileSpreadsheet, IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './User.css';

export default function User() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [recordsPerPage, setRecordsPerPage] = useState(50);

    // Initialize/Load users from localStorage on mount
    useEffect(() => {
        const storedUsers = localStorage.getItem('school_users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            // Default users if nothing in storage
            const defaultUsers = [
                { id: 1, photo: null, name: 'DRIVER', phone: '', role: 'Driver', status: true },
                { id: 2, photo: null, name: 'Attender', phone: '', role: 'Attender', status: true },
                { id: 3, photo: null, name: 'PRASANNA', phone: '', role: 'Accountant', status: true },
                { id: 4, photo: null, name: 'Nithya', phone: '00000000', role: 'Receptionist', status: true },
            ];
            setUsers(defaultUsers);
            localStorage.setItem('school_users', JSON.stringify(defaultUsers));
        }
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id) => {
        const updatedUsers = users.map(u => u.id === id ? { ...u, status: !u.status } : u);
        setUsers(updatedUsers);
        localStorage.setItem('school_users', JSON.stringify(updatedUsers));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            localStorage.setItem('school_users', JSON.stringify(updatedUsers));
        }
    };

    const [selectedUser, setSelectedUser] = useState(null);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    const handleCopy = () => {
        const text = filteredUsers.map(u => `${u.name}\t${u.phone || '-'}\t${u.role}\t${u.status ? 'Active' : 'Inactive'}`).join('\n');
        navigator.clipboard.writeText(`Name\tPhone\tRole\tStatus\n${text}`);
        alert('User list copied to clipboard!');
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Phone', 'Role', 'Status'];
        const rows = filteredUsers.map(u => [u.name, u.phone || '-', u.role, u.status ? 'Active' : 'Inactive']);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users-list.csv';
        link.click();
    };

    const handleExportExcel = () => {
        const headers = ['Name', 'Phone', 'Role', 'Status'];
        const rows = filteredUsers.map(u => [u.name, u.phone || '-', u.role, u.status ? 'Active' : 'Inactive']);
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users-list.xlsx');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('User List Report', 14, 15);
        autoTable(doc, {
            head: [['#', 'Name', 'Phone', 'Role', 'Status']],
            body: filteredUsers.map((u, i) => [i + 1, u.name, u.phone || '-', u.role, u.status ? 'Active' : 'Inactive']),
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [61, 94, 225] }
        });
        doc.save('users-list.pdf');
    };

    return (
        <div className="user-mgmt-page">
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content add-income-modal">
                        <div className="modal-header">
                            <h3>User Details</h3>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
                                    {selectedUser.photo ? (
                                        <img src={selectedUser.photo} alt={selectedUser.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=random&size=100`} alt={selectedUser.name} style={{ borderRadius: '50%' }} />
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Name</span>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedUser.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Role</span>
                                    <span className="user-role-tag">{selectedUser.role}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Phone</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{selectedUser.phone || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Status</span>
                                    <span className={`status-badge ${selectedUser.status ? 'active' : 'inactive'}`}>
                                        {selectedUser.status ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-cancel" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="user-header-row">
                <div className="user-breadcrumb">
                    <h2>User</h2>
                    <div className="breadcrumb-path">Dashboard / <span>User</span></div>
                </div>
                <div className="user-header-actions">
                    <button className="btn-add-primary" onClick={() => navigate('/school/teachers/user/add')}>
                        <IconUserPlus size={20} /> Add a user
                    </button>
                </div>
            </div>

            <div className="card shadow-soft border-0 mt-6" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>User List</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '40px', width: '320px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={20} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search users..."
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

                    <div className="toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="export-button-group" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <button className="export-btn-minimal" onClick={handleCopy} title="Copy" style={{ background: 'transparent', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
                                <IconCopy size={18} />
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportExcel} title="Excel" style={{ background: 'transparent', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
                                <IconFileSpreadsheet size={18} />
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportCSV} title="CSV" style={{ background: 'transparent', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
                                <IconFileTypeCsv size={18} />
                            </button>
                            <button className="export-btn-minimal" onClick={handleExportPDF} title="PDF" style={{ background: 'transparent', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
                                <IconFileTypePdf size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="user-table-responsive">
                    <table className="user-mgmt-table">
                        <thead>
                            <tr>
                                <th width="60">#</th>
                                <th width="80">Photo</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th width="100">Status</th>
                                <th width="120">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.slice(0, recordsPerPage).map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="user-avatar-cell">
                                            {user.photo ? (
                                                <img src={user.photo} alt="avatar" style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="avatar" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="user-name-cell">{user.name}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td><span className="user-role-tag">{user.role}</span></td>
                                    <td>
                                        <div
                                            className={`user-status-toggle ${user.status ? 'active' : ''}`}
                                            onClick={() => toggleStatus(user.id)}
                                        >
                                            <div className="toggle-handle"></div>
                                            <span className="toggle-text">{user.status ? 'ON' : 'OFF'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-action-group">
                                            <button className="action-icn view" title="View" onClick={() => setSelectedUser(user)}>
                                                <IconEye size={18} />
                                            </button>
                                            <button className="action-icn edit" title="Edit" onClick={() => navigate(`/school/teachers/user/edit/${user.id}`)}>
                                                <IconEdit size={18} />
                                            </button>
                                            <button className="action-icn delete" title="Delete" onClick={() => handleDelete(user.id)}>
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="user-table-footer">
                    <div className="footer-info">
                        Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
                    </div>
                    <div className="user-pagination">
                        <button className="page-nav disabled">Previous</button>
                        <button className="page-num active">1</button>
                        <button className="page-nav disabled">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
