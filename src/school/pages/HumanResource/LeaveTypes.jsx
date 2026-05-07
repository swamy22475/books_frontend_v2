import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CalendarHeart } from 'lucide-react';
import './HumanResourceDashboard.css';

const initialLeaveTypes = [
  { id: 1, name: 'Sick Leave', days: 12 },
  { id: 2, name: 'Casual Leave', days: 15 },
  { id: 3, name: 'Medical Leave', days: 30 },
  { id: 4, name: 'Maternity Leave', days: 180 },
  { id: 5, name: 'Paternity Leave', days: 15 },
];

const LeaveTypes = () => {
  const [types, setTypes] = useState(initialLeaveTypes);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Leave Types</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Leave Types</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Leave Type</button>
        </div>
      </div>

      {showAdd && (
        <div className="hr-card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Leave Type Name" className="hr-select" style={{ padding: '10px', flex: 2 }} />
          <input type="number" placeholder="No. of Days" className="hr-select" style={{ padding: '10px', flex: 1 }} />
          <button className="hr-action-btn primary">Save</button>
          <button className="hr-table-btn" onClick={() => setShowAdd(false)}>Cancel</button>
        </div>
      )}

      <div className="hr-card">
        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Total Days (Annual)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map(type => (
                <tr key={type.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ea545515', color: '#ea5455', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarHeart size={18} />
                      </div>
                      <span style={{ fontWeight: '600' }}>{type.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>{type.days}</span>
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '5px' }}>Days</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="hr-table-btn" title="Edit"><Edit2 size={14} /></button>
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

export default LeaveTypes;
