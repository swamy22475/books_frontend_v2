import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    IconSearch, IconCopy, IconFileText,
    IconPrinter, IconEye, IconPencil,
    IconTrash, IconCloudUpload,
    IconCalendar, IconId, IconUser, IconPhone, IconAlertCircle,
    IconPackage, IconScale, IconTruck, IconChevronLeft
} from '@tabler/icons-react';
import { copyToClipboard, exportToCSV, exportToExcel, exportToPDF, printTable } from '../../../utils/exportUtils';
import '../Transport/ManageStudentTransport.css';
import './PostalRecords.css';

const SEED_POSTAL_SEND = [
    { id: 1, refNo: 'SND87546', sendDate: '2026-02-19', from: 'School Admin', to: 'State Board', address: '123 Ed Board St, City', phone: '9876543210', postalType: 'Speed Post', trackingNo: 'SP123456789IN', description: 'Exam Papers', weight: '2.5kg', dispatchDate: '2026-02-19', status: 'Delivered', remarks: 'Urgent delivery' },
    { id: 2, refNo: 'SND87340', sendDate: '2026-02-26', from: 'Principal Office', to: 'Auditor General', address: '45 Finance Ave, Center', phone: '9988776655', postalType: 'Registered Post', trackingNo: 'RP987654321IN', description: 'Annual Report', weight: '1.2kg', dispatchDate: '2026-02-26', status: 'Dispatched', remarks: 'Confidential' },
];

const PostalSend = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState(SEED_POSTAL_SEND);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [copied, setCopied] = useState(false);

    // Auto generate reference number function
    const generateRefNo = () => 'SND' + Math.floor(10000 + Math.random() * 90000);

    const initialFormState = {
        refNo: generateRefNo(),
        sendDate: new Date().toISOString().split('T')[0],
        from: '',
        to: '',
        address: '',
        phone: '',
        postalType: '',
        trackingNo: '',
        description: '',
        weight: '',
        dispatchDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const exportCols = ['refNo', 'sendDate', 'from', 'to', 'postalType', 'trackingNo', 'status'];
    const colLabels = { refNo: 'Reference No', sendDate: 'Send Date', from: 'From', to: 'To', postalType: 'Type', trackingNo: 'Tracking No', status: 'Status' };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            setRecords(records.map(r => r.id === editId ? { ...r, ...formData } : r));
            setShowEditModal(false);
            setIsEditing(false);
            setEditId(null);
        } else {
            const newRecord = { id: Date.now(), ...formData };
            setRecords([newRecord, ...records]);
        }
        setFormData({ ...initialFormState, refNo: generateRefNo() });
    };

    const handleReset = () => {
        setFormData({ ...initialFormState, refNo: generateRefNo() });
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setEditId(record.id);
        setFormData(record);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this postal record?')) {
            setRecords(records.filter(r => r.id !== id));
        }
    };

    const handleView = (record) => {
        setViewData(record);
        setShowViewModal(true);
    };

    const onCloseEditModal = () => {
        setShowEditModal(false);
        setIsEditing(false);
        setEditId(null);
        handleReset();
    };

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = (r.from.toLowerCase().includes(searchTerm.toLowerCase()) || r.to.toLowerCase().includes(searchTerm.toLowerCase()) || r.refNo.toLowerCase().includes(searchTerm.toLowerCase()) || r.trackingNo.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDate = filterDate ? r.sendDate === filterDate : true;
            const matchesStatus = filterStatus ? r.status === filterStatus : true;
            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [records, searchTerm, filterDate, filterStatus]);

    const onCopy = () => {
        copyToClipboard(filteredRecords, exportCols, colLabels).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const onCSV = () => exportToCSV(filteredRecords, exportCols, colLabels, 'Postal_Send_Records');
    const onExcel = () => exportToExcel(filteredRecords, exportCols, colLabels, 'Postal_Send_Records');
    const onPDF = () => exportToPDF(filteredRecords, exportCols, colLabels, 'Postal_Send_Records', 'Postal Send Records List');
    const onPrint = () => printTable(filteredRecords, exportCols, colLabels, 'Postal Send Records Report');

    return (
        <div className="student-list-page transport-page postal-records-page">
            <div className="page-header">
                <div className="page-title">
                    <h4>Postal Send</h4>
                    <nav className="breadcrumb flex items-center gap-2 text-[14px] font-medium mt-1">
                        <Link to="/school/front-office/visitors" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Front Office</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/postal" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Postal Records</Link>
                        <span className="text-slate-400">/</span>
                        <Link to="/school/front-office/postal-send" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Postal Send</Link>
                    </nav>
                </div>
            </div>

            <div className="postal-page-container fade-in">
                {/* Left Side: Add Form */}
                <div className="postal-form-card" style={{ flex: '0 0 400px' }}>
                    <div className="postal-form-header flex items-center gap-2">
                        <button onClick={() => navigate('/school/front-office/postal')} className="text-slate-500 hover:text-indigo-600 transition-colors bg-transparent border-0 p-0 cursor-pointer">
                            <IconChevronLeft size={20} />
                        </button>
                        <h5>Add Postal Send</h5>
                    </div>
                    <form onSubmit={handleSave} className="postal-form-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <div className="postal-input-group">
                            <label className="postal-label">Reference No <span className="text-xs text-slate-400 font-normal">(Auto Generated)</span></label>
                            <input type="text" name="refNo" className="postal-input bg-slate-50" readOnly value={formData.refNo} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Send Date <span className="required">*</span></label>
                            <input type="date" name="sendDate" className="postal-input" required value={formData.sendDate} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">From <span className="required">*</span></label>
                            <input type="text" name="from" className="postal-input" required value={formData.from} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">To <span className="required">*</span></label>
                            <input type="text" name="to" className="postal-input" required value={formData.to} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Address</label>
                            <textarea name="address" className="postal-textarea" value={formData.address} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Phone Number</label>
                            <input type="text" name="phone" className="postal-input" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Courier / Postal Type</label>
                            <select name="postalType" className="postal-input" value={formData.postalType} onChange={handleInputChange}>
                                <option value="">Select Type</option>
                                <option value="Ordinary Post">Ordinary Post</option>
                                <option value="Speed Post">Speed Post</option>
                                <option value="Registered Post">Registered Post</option>
                                <option value="Courier">Courier</option>
                                <option value="Parcel">Parcel</option>
                            </select>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Tracking Number</label>
                            <input type="text" name="trackingNo" className="postal-input" value={formData.trackingNo} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Item Description</label>
                            <textarea name="description" className="postal-textarea" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Weight</label>
                            <input type="text" name="weight" className="postal-input" placeholder="e.g. 500g, 2kg" value={formData.weight} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Dispatch Date</label>
                            <input type="date" name="dispatchDate" className="postal-input" value={formData.dispatchDate} onChange={handleInputChange} />
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Status <span className="required">*</span></label>
                            <select name="status" className="postal-input" required value={formData.status} onChange={handleInputChange}>
                                <option value="Pending">Pending</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Attach Document</label>
                            <div className="postal-file-upload">
                                <IconCloudUpload size={24} color="#7367f0" style={{ marginBottom: '8px' }} />
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Drag and drop a file here or click</div>
                            </div>
                        </div>
                        <div className="postal-input-group">
                            <label className="postal-label">Remarks</label>
                            <textarea name="remarks" className="postal-textarea" value={formData.remarks} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button type="button" onClick={() => navigate('/school/front-office/postal')} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Back</button>
                            <button type="button" onClick={handleReset} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Reset</button>
                            <button type="submit" className="flex-1 py-2.5 rounded-lg border-0 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">Save</button>
                        </div>
                    </form>
                </div>

                {/* Right Side: List Table */}
                <div className="postal-list-card">
                    <div className="postal-form-header">
                        <h5>Postal Send List</h5>
                    </div>

                    <div className="table-toolbar-premium" style={{ padding: '16px 24px', flexWrap: 'wrap', gap: '16px' }}>
                        <div className="search-pill-wrapper flex-1 min-w-[200px]">
                            <IconSearch size={18} className="search-icon-pill" />
                            <input
                                type="text"
                                placeholder="Search by name, ref no, tracking no..."
                                className="search-input-pill"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 min-w-[200px]">
                            <input
                                type="date"
                                className="postal-input mb-0 h-[42px]"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                title="Filter by Date"
                            />
                            <select
                                className="postal-input mb-0 h-[42px]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>

                        <div className="export-button-group">
                            <button className={`export-btn ${copied ? 'text-emerald-600 font-bold' : ''}`} onClick={onCopy}>
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                            <button className="export-btn" onClick={onCSV}>CSV</button>
                            <button className="export-btn" onClick={onExcel}>Excel</button>
                            <button className="export-btn" onClick={onPDF}>PDF</button>
                            <button className="export-btn" onClick={onPrint}>Print</button>
                        </div>
                    </div>

                    <div className="table-wrap px-0">
                        <table className="premium-table-v2">
                            <thead>
                                <tr>
                                    <th>Ref No</th>
                                    <th>To</th>
                                    <th>Tracking No</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">No records found</td></tr>
                                ) : filteredRecords.map((r, index) => (
                                    <tr key={r.id} className="table-row-v2" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td><div className="text-slate-700 font-medium text-sm">{r.refNo}</div></td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-medium">{r.to}</span>
                                                <span className="text-slate-500 text-xs mt-0.5 max-w-[150px] truncate" title={r.postalType}>{r.postalType}</span>
                                            </div>
                                        </td>
                                        <td><div className="text-slate-600 font-medium text-sm">{r.trackingNo || 'N/A'}</div></td>
                                        <td><div className="text-slate-500 text-xs">{r.sendDate}</div></td>
                                        <td>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${r.status === 'Delivered' ? 'text-emerald-600' :
                                                r.status === 'Dispatched' ? 'text-indigo-600' :
                                                    'text-amber-600'
                                                }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', border: 'none', cursor: 'pointer' }}
                                                    title="View Details"
                                                    onClick={() => handleView(r)}
                                                ><IconEye size={16} stroke={2} /></button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none', cursor: 'pointer' }}
                                                    title="Edit"
                                                    onClick={() => handleEdit(r)}
                                                ><IconPencil size={16} stroke={2} /></button>
                                                <button
                                                    className="flex items-center justify-center transition-all hover:scale-110"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f97316', border: 'none', cursor: 'pointer' }}
                                                    title="Delete"
                                                    onClick={() => handleDelete(r.id)}
                                                ><IconTrash size={16} stroke={2} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                        <span>Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} entries</span>
                    </div>
                </div>
            </div>

            {/* MODALS PLACEHOLDER */}
        </div>
    );
};

export default PostalSend;
