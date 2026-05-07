import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import './HumanResourceDashboard.css';

const initialDesignations = [
  { id: 1, name: 'Principal' },
  { id: 2, name: 'Vice Principal' },
  { id: 3, name: 'Senior Teacher' },
  { id: 4, name: 'Junior Teacher' },
  { id: 5, name: 'Manager' },
  { id: 6, name: 'Accountant' },
  { id: 7, name: 'Librarian' },
  { id: 8, name: 'Driver' },
];

const Designations = () => {
  const [desig, setDesig] = useState(initialDesignations);
  const [showAdd, setShowAdd] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [newName, setNewName] = useState('');

  const addDesig = () => {
    if (!newName) return;
    setDesig([...desig, { id: Date.now(), name: newName }]);
    setNewName('');
    setShowAdd(false);
  };

  const saveEdit = () => {
    setDesig(desig.map(d => d.id === editingDesig.id ? { ...d, name: newName } : d));
    setEditingDesig(null);
    setNewName('');
  };

  const startEdit = (d) => {
    setEditingDesig(d);
    setNewName(d.name);
    setShowAdd(false);
  };

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Designations</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr/staff">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Designations</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary" onClick={() => { setShowAdd(true); setEditingDesig(null); setNewName(''); }}><Plus size={16} /> Add Designation</button>
        </div>
      </div>

      {(showAdd || editingDesig) && (
        <div className="hr-card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid #7367f0', background: '#7367f005' }}>
          <h6 style={{ margin: '0 0 15px 0', color: '#7367f0' }}>{editingDesig ? 'Edit Designation' : 'Add New Designation'}</h6>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Designation Name"
              className="hr-select"
              style={{ padding: '10px', flex: 1 }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <button className="hr-action-btn primary" style={{ background: '#7367f0' }} onClick={editingDesig ? saveEdit : addDesig}>
              {editingDesig ? 'Update' : 'Save'}
            </button>
            <button className="hr-table-btn" onClick={() => { setShowAdd(false); setEditingDesig(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="hr-card">
        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Designation Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {desig.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#7367f015', color: '#7367f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={18} />
                      </div>
                      <span style={{ fontWeight: '600' }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="hr-table-btn" title="Edit" onClick={() => startEdit(d)}><Edit2 size={14} /></button>
                      <button className="hr-table-btn" title="Delete" style={{ color: '#ea5455' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Designations;
