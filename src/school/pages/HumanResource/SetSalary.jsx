import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Save, Calculator, IndianRupee } from 'lucide-react';
import './HumanResourceDashboard.css';

const staffSalaryData = [
  { id: 1, name: 'Rahul Sharma', role: 'Manager', dept: 'Admin', currentSalary: 45000 },
  { id: 2, name: 'Anita Rao', role: 'Teacher', dept: 'Teaching', currentSalary: 30000 },
  { id: 3, name: 'Suresh Kumar', role: 'Driver', dept: 'Transport', currentSalary: 15000 },
];

const SetSalary = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Set Staff Salary</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Set Salary</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary"><Save size={16} /> Bulk Update</button>
        </div>
      </div>

      <div className="hr-card">
        <div className="hr-card-header">
          <div className="search-box" style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search staff to set salary..."
              className="hr-search-input"
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Department / Role</th>
                <th>Basic Salary (Monthly)</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffSalaryData.map(staff => (
                <tr key={staff.id}>
                  <td>
                    <div className="hr-staff-info">
                      <div className="hr-avatar">{staff.name.split(' ').map(n => n[0]).join('')}</div>
                      <span style={{ fontWeight: '600' }}>{staff.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{staff.role}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{staff.dept}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '150px' }}>
                      <IndianRupee size={14} color="#666" />
                      <input
                        type="number"
                        className="hr-select"
                        defaultValue={staff.currentSalary}
                        style={{ padding: '5px 10px', fontSize: '14px', fontWeight: '700' }}
                      />
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="hr-action-btn" style={{ padding: '6px 15px', background: '#3d5ee110', color: '#3d5ee1', border: 'none' }}>Update</button>
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

export default SetSalary;
