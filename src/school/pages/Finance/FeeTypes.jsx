import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  IconGridDots, IconPlus, IconSearch, IconPencil,
  IconTrash, IconDownload, IconFilter, IconCalendarEvent,
  IconCash, IconCheck, IconX, IconBriefcase, IconFileTypeDoc,
  IconFileText, IconTable, IconPrinter
} from '@tabler/icons-react';
import { FeeContext } from '../../../context/FeeContext';
import './FeeTypes.css';

const FeeTypes = () => {
  const {
    feeTypes, getFeeTypes, addFeeType,
    updateFeeType, deleteFeeType, loading
  } = useContext(FeeContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    getFeeTypes();
  }, []);

  const filteredTypes = useMemo(() => {
    return feeTypes.filter(type => {
      const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || type.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [feeTypes, searchTerm, filterStatus]);

  const stats = [
    { label: 'Academic Types', val: feeTypes.length, icon: <IconFileTypeDoc size={24} />, color: '#3d5ee1', bg: '#eff2ff' },
    { label: 'Active Fees', val: feeTypes.filter(t => t.status === 'Active').length, icon: <IconCheck size={24} />, color: '#28c76f', bg: '#ebfaf2' },
    { label: 'Revenue Streams', val: 12, icon: <IconCash size={24} />, color: '#ff9f43', bg: '#fff5e6' },
    { label: 'Scheduled', val: 8, icon: <IconCalendarEvent size={24} />, color: '#7367f0', bg: '#f0edff' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await updateFeeType(editingType.id, formData);
      } else {
        await addFeeType(formData);
      }
      setShowModal(false);
      setEditingType(null);
      setFormData({ name: '', description: '', status: 'Active' });
    } catch (error) {
      console.error('Failed to save fee type:', error);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      status: type.status
    });
    setShowModal(true);
  };

  return (
    <div className="ft-page">
      <div className="ft-header">
        <div>
          <h1 className="ft-title">Fee Type</h1>
          <nav className="ft-breadcrumb">
            Finance / <span>Fee Types</span>
          </nav>
        </div>
        <button className="btn-premium btn-premium-primary" onClick={() => setShowModal(true)}>
          <IconPlus size={20} /> Create New Type
        </button>
      </div>

      <div className="ft-stats-grid">
        {stats.map((s, i) => (
          <div className="ft-stat-card" key={i}>
            <div className="ft-stat-icon" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="ft-stat-val">{s.val}</div>
              <div className="ft-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ft-command-bar">
        <div className="ft-search-wrap">
          <IconSearch size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="ft-search-input"
            placeholder="Search Fee Names, Billing Codes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select
            className="fee-select-modern"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Entities</option>
            <option value="Active">Operational</option>
            <option value="Inactive">Suspended</option>
          </select>
          <div className="ft-export-buttons">
            <button className="ft-export-btn"><IconFileText /> Copy</button>
            <button className="ft-export-btn"><IconDownload /> CSV</button>
            <button className="ft-export-btn"><IconTable /> Excel</button>
            <button className="ft-export-btn"><IconFileText color="#ea5455" /> PDF</button>
            <button className="ft-export-btn"><IconPrinter /> Print</button>
          </div>
        </div>
      </div>

      <main className="ft-table-card">
        <table className="ft-table">
          <thead>
            <tr>
              <th>Billing Code</th>
              <th>Fee Strategy Type</th>
              <th>Description / Service Scope</th>
              <th>Status</th>
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map(type => (
              <tr key={type.id}>
                <td><span className="ft-code-badge">{type.code}</span></td>
                <td className="ft-name-cell">{type.name}</td>
                <td><span style={{ fontSize: 13, color: '#64748b' }}>{type.description}</span></td>
                <td>
                  <span className={`status-badge ${type.status === 'Active' ? 'status-paid' : 'status-partial'}`}>
                    {type.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="action-circle" onClick={() => handleEdit(type)}><IconPencil size={16} /></button>
                    <button className="action-circle" onClick={() => deleteFeeType(type.id)}><IconTrash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {showModal && (
        <div className="ft-modal-overlay">
          <div className="ft-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{editingType ? 'Refine Strategy' : 'New Billing Entity'}</h2>
              <IconX size={24} style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ft-form-group">
                <label className="ft-label">Internal Name *</label>
                <input
                  className="ft-input"
                  placeholder="e.g. Q4 Lab Tuition"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="ft-form-group">
                <label className="ft-label">Lifecycle Status</label>
                <select
                  className="ft-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active / Operational</option>
                  <option value="Inactive">On Hold / Legacy</option>
                </select>
              </div>
              <div className="ft-form-group">
                <label className="ft-label">Strategy Scope (Description)</label>
                <textarea
                  className="ft-textarea"
                  placeholder="Detailed breakdown of this fee types coverage..."
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: '2rem' }}>
                <button type="button" className="btn-premium btn-premium-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Discard
                </button>
                <button type="submit" className="btn-premium btn-premium-primary" style={{ flex: 1 }}>
                  {editingType ? 'Save Changes' : 'Initialize Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypes;
