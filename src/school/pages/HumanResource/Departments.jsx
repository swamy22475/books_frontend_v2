import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import './HumanResourceDashboard.css';

const initialDepartments = [
  { id: 1, name: 'Administration', staffCount: 12 },
  { id: 2, name: 'Teaching', staffCount: 85 },
  { id: 3, name: 'Accounts', staffCount: 5 },
  { id: 4, name: 'Transport', staffCount: 14 },
  { id: 5, name: 'Library', staffCount: 3 },
];

const Departments = () => {
  const [depts, setDepts] = useState(initialDepartments);
  const [showAdd, setShowAdd] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [newName, setNewName] = useState('');

  const addDept = () => {
    if (!newName) return;
    setDepts([...depts, { id: Date.now(), name: newName, staffCount: 0 }]);
    setNewName('');
    setShowAdd(false);
  };

  const saveEdit = () => {
    setDepts(depts.map(d => d.id === editingDept.id ? { ...d, name: newName } : d));
    setEditingDept(null);
    setNewName('');
  };

  const startEdit = (dept) => {
    setEditingDept(dept);
    setNewName(dept.name);
    setShowAdd(false);
  };

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Departments</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr/staff">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Departments</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary" onClick={() => { setShowAdd(true); setEditingDept(null); setNewName(''); }}><Plus size={16} /> Add Department</button>
        </div>
      </div>

      {(showAdd || editingDept) && (
        <div className="hr-card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid #3d5ee1', background: '#3d5ee105' }}>
          <h6 style={{ margin: '0 0 15px 0', color: '#3d5ee1' }}>{editingDept ? 'Edit Department' : 'Add New Department'}</h6>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Department Name"
              className="hr-select"
              style={{ padding: '10px', flex: 1 }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <button className="hr-action-btn primary" onClick={editingDept ? saveEdit : addDept}>
              {editingDept ? 'Update' : 'Save'}
            </button>
            <button className="hr-table-btn" onClick={() => { setShowAdd(false); setEditingDept(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="hr-card">
        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Staff Count</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {depts.map(dept => (
                <tr key={dept.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#3d5ee115', color: '#3d5ee1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} />
                      </div>
                      <span style={{ fontWeight: '600' }}>{dept.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>{dept.staffCount}</span>
                      <span style={{ color: '#888', fontSize: '12px' }}>Employees</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="hr-table-btn" title="Edit" onClick={() => startEdit(dept)}><Edit2 size={14} /></button>
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

export default Departments;
