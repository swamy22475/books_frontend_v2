import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import './HumanResourceDashboard.css';

const staffAttendanceData = [
  { id: 1, name: 'Rahul Sharma', role: 'Manager', dept: 'Admin', status: 'Present', time: '09:00 AM' },
  { id: 2, name: 'Anita Rao', role: 'Teacher', dept: 'Teaching', status: 'Present', time: '08:45 AM' },
  { id: 3, name: 'Suresh Kumar', role: 'Driver', dept: 'Transport', status: 'Absent', time: '-' },
  { id: 4, name: 'Meena Iyer', role: 'Accountant', dept: 'Accounts', status: 'Late', time: '09:30 AM' },
  { id: 5, name: 'Jessica Taylor', role: 'Teacher', dept: 'Teaching', status: 'On Leave', time: '-' },
];

const StaffAttendance = () => {
  const [attendance, setAttendance] = useState(staffAttendanceData);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleStatusChange = (id, newStatus) => {
    setAttendance(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Staff Attendance</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Staff Attendance</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary">Save Attendance</button>
        </div>
      </div>

      <div className="hr-card">
        <div className="hr-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="date"
              className="hr-select"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px' }}
            />
            <select className="hr-select" style={{ padding: '8px', borderRadius: '8px' }}>
              <option>All Departments</option>
              <option>Teaching</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="hr-attendance-summary" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ fontSize: '13px' }}><span style={{ color: '#28c76f' }}>●</span> Present: <strong>{attendance.filter(a => a.status === 'Present').length}</strong></div>
            <div style={{ fontSize: '13px' }}><span style={{ color: '#ea5455' }}>●</span> Absent: <strong>{attendance.filter(a => a.status === 'Absent').length}</strong></div>
            <div style={{ fontSize: '13px' }}><span style={{ color: '#ff9f43' }}>●</span> Late: <strong>{attendance.filter(a => a.status === 'Late').length}</strong></div>
          </div>
        </div>

        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>In Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(staff => (
                <tr key={staff.id}>
                  <td>
                    <div className="hr-staff-info">
                      <div className="hr-avatar">{staff.name.split(' ').map(n => n[0]).join('')}</div>
                      <span>{staff.name}</span>
                    </div>
                  </td>
                  <td>{staff.role}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                      <Clock size={14} /> {staff.time}
                    </div>
                  </td>
                  <td>
                    <span className={`hr-status-badge ${staff.status === 'Present' ? 'approved' :
                        staff.status === 'Absent' ? 'rejected' :
                          'pending'
                      }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                      <button
                        className={`hr-table-btn ${staff.status === 'Present' ? 'active' : ''}`}
                        style={staff.status === 'Present' ? { background: '#28c76f20', borderColor: '#28c76f', color: '#28c76f' } : {}}
                        onClick={() => handleStatusChange(staff.id, 'Present')}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        className={`hr-table-btn ${staff.status === 'Absent' ? 'active' : ''}`}
                        style={staff.status === 'Absent' ? { background: '#ea545520', borderColor: '#ea5455', color: '#ea5455' } : {}}
                        onClick={() => handleStatusChange(staff.id, 'Absent')}
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        className={`hr-table-btn ${staff.status === 'Late' ? 'active' : ''}`}
                        style={staff.status === 'Late' ? { background: '#ff9f4320', borderColor: '#ff9f43', color: '#ff9f43' } : {}}
                        onClick={() => handleStatusChange(staff.id, 'Late')}
                      >
                        <AlertCircle size={16} />
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
  );
};

export default StaffAttendance;
