import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconSearch, IconUserPlus, IconPlus, IconEdit, IconTrash, IconIdBadge2, IconPrinter } from '@tabler/icons-react';
import '../Accounts/Accounts.css';

const LibraryMembers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        memberId: '',
        name: '',
        memberType: 'Student',
        classDet: '',
        department: '',
        photo: null,
        photoPreview: ''
    });
    const [showIdModal, setShowIdModal] = useState(false);
    const [selectedMemberIdCard, setSelectedMemberIdCard] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                alert('Only JPG, JPEG, and PNG formats are allowed');
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                photo: file,
                photoPreview: previewUrl
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.memberType === 'Student' && !formData.photo) {
            alert('Student photo is required');
            return;
        }

        const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
        const newMember = {
            id: newId,
            memberId: formData.memberId,
            name: formData.name,
            type: formData.memberType,
            class: formData.memberType === 'Student' ? formData.classDet.split(' - ')[0] || '' : '',
            section: formData.memberType === 'Student' ? formData.classDet.split(' - ')[1] || '' : '',
            department: formData.memberType !== 'Student' ? formData.department : '',
            booksIssued: 0,
            status: 'Active',
            photo: formData.photoPreview,
            library_generated_id: null
        };

        setMembers(prev => [...prev, newMember]);
        setShowAddModal(false);
        setFormData({ memberId: '', name: '', memberType: 'Student', classDet: '', department: '', photo: null, photoPreview: '' });
    };

    const [members, setMembers] = useState([
        { id: 1, memberId: 'LIB-S-101', name: 'John Doe', type: 'Student', class: '10th', section: 'A', booksIssued: 2, status: 'Active' },
        { id: 2, memberId: 'LIB-S-102', name: 'Jane Smith', type: 'Student', class: '9th', section: 'B', booksIssued: 0, status: 'Active' },
        { id: 3, memberId: 'LIB-T-201', name: 'Samuel Wilson', type: 'Teacher', department: 'Mathematics', booksIssued: 5, status: 'Active' },
        { id: 4, memberId: 'LIB-S-103', name: 'Alice Brown', type: 'Student', class: '8th', section: 'C', booksIssued: 1, status: 'Disabled' },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            setMembers(prev => prev.filter(member => member.id !== id));
        }
    };

    const handleGenerateId = (member) => {
        let memberToView = { ...member };

        // If ID not generated yet, generate and save it
        if (!memberToView.library_generated_id) {
            const year = new Date().getFullYear();
            const increment = member.id.toString().padStart(4, '0');
            const newGeneratedId = `LIB-${year}-${increment}`;

            memberToView.library_generated_id = newGeneratedId;
            setMembers(prev => prev.map(m => m.id === member.id ? { ...m, library_generated_id: newGeneratedId } : m));
        }

        setSelectedMemberIdCard(memberToView);
        setShowIdModal(true);
    };

    const handleEdit = (member) => {
        setFormData({
            memberId: member.memberId,
            name: member.name,
            memberType: member.type,
            classDet: member.type === 'Student' ? `${member.class} - ${member.section}` : '',
            department: member.type !== 'Student' ? member.department : '',
            photo: null,
            photoPreview: member.photo || ''
        });
        setShowAddModal(true);
    };

    return (
        <div className="accounts-page">
            <div className="page-header no-print">
                <div className="page-title">
                    <div className="d-flex align-items-center gap-2">
                        <button className="action-btn" onClick={() => navigate(-1)}>
                            <IconChevronLeft size={20} />
                        </button>
                        <h4>Library Members</h4>
                    </div>
                    <nav className="breadcrumb">
                        <span>Dashboard</span> / <span>Library</span> / <span className="current">Members</span>
                    </nav>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <IconUserPlus size={18} />
                    Add New Member
                </button>
            </div>

            <div className="card shadow-soft border-0 mt-6 no-print" style={{ background: 'var(--bg-card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', background: 'var(--bg-card)', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                        <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Member Directory</h5>
                        <div className="search-box-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '42px', width: '360px', transition: 'all 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <IconSearch size={22} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="Search by member ID or name..."
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
                                    <th>Member ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Class / Dept</th>
                                    <th style={{ textAlign: 'center' }}>Books Issued</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(member => (
                                    <tr key={member.id}>
                                        <td style={{ fontWeight: '600' }}>{member.memberId}</td>
                                        <td style={{ fontWeight: '500' }}>{member.name}</td>
                                        <td>{member.type}</td>
                                        <td>{member.type === 'Student' ? `${member.class} - ${member.section}` : member.department}</td>
                                        <td style={{ textAlign: 'center' }}>{member.booksIssued}</td>
                                        <td>
                                            <span className={`status-badge ${member.status.toLowerCase()}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn generate" title="Generate ID" onClick={() => handleGenerateId(member)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 123, 255, 0.1)', color: '#007bff', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}>
                                                    <IconIdBadge2 size={18} />
                                                </button>
                                                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(member)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(member.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            {/* ID Card Modal */}
            {showIdModal && selectedMemberIdCard && (
                <div className="modal-overlay id-card-overlay">
                    <div className="modal-content add-income-modal id-card-modal id-card-print-target" style={{ maxWidth: '400px' }}>
                        <div className="modal-header no-print">
                            <h3>ID Card Generated</h3>
                            <button type="button" className="close-btn" onClick={() => setShowIdModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="modal-body id-card-container id-card-print-body" style={{ padding: '20px', background: 'var(--bg-main)' }}>
                            <div className="id-card" style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                padding: '0',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                textAlign: 'center'
                            }}>
                                <div className="id-card-header" style={{ background: '#2b3a67', color: '#fff', padding: '15px 10px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>OUR SCHOOL ERP</h4>
                                </div>
                                <div className="id-card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="id-photo-wrapper" style={{ marginBottom: '15px' }}>
                                        {selectedMemberIdCard.photo ? (
                                            <img src={selectedMemberIdCard.photo} alt="Student" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--border-color)' }} />
                                        ) : (
                                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-main)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '3px solid var(--border-color)' }}>
                                                <IconUserPlus size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="id-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', background: 'var(--bg-main)', padding: '15px', borderRadius: '8px', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Name:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedMemberIdCard.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Member ID:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedMemberIdCard.library_generated_id}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Type:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedMemberIdCard.type}</span>
                                        </div>
                                        {selectedMemberIdCard.type === 'Student' ? (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Class & Sec:</span>
                                                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{`${selectedMemberIdCard.class || '-'} - ${selectedMemberIdCard.section || '-'}`}</span>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Department:</span>
                                                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedMemberIdCard.department || '-'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="id-card-footer" style={{ background: '#2b3a67', height: '10px' }}></div>
                            </div>
                        </div>
                        <div className="modal-footer no-print" style={{ justifyContent: 'center' }}>
                            <button type="button" className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px' }}>
                                <IconPrinter size={18} />
                                Print ID Card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="modal-overlay no-print">
                    <div className="modal-content add-income-modal" style={{ maxWidth: '550px' }}>
                        <div className="modal-header">
                            <h3>Add Library Member</h3>
                            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
                                <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form className="modal-body" onSubmit={handleSubmit}>
                            <div className="form-group full-width">
                                <label>Student Photo {formData.memberType === 'Student' && <span style={{ color: '#ea5455' }}>*</span>}</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {formData.photoPreview && (
                                        <img src={formData.photoPreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    )}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handlePhotoChange}
                                        style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>Max file size: 2MB. Accepted formats: JPG, JPEG, PNG.</small>
                            </div>

                            <div className="form-group full-width">
                                <label>Member Type <span style={{ color: '#ea5455' }}>*</span></label>
                                <select
                                    name="memberType"
                                    value={formData.memberType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Member ID <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter Member ID (e.g. LIB-S-105)"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Name <span style={{ color: '#ea5455' }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                />
                            </div>

                            {formData.memberType === 'Student' && (
                                <div className="form-group full-width">
                                    <label>Class & Section</label>
                                    <input
                                        type="text"
                                        name="classDet"
                                        value={formData.classDet}
                                        onChange={handleChange}
                                        placeholder="e.g. 10th - A"
                                    />
                                </div>
                            )}

                            {(formData.memberType === 'Teacher' || formData.memberType === 'Staff') && (
                                <div className="form-group full-width">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryMembers;
