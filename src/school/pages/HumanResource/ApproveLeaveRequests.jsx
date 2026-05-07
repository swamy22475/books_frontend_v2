import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Check, X, Eye, FileText } from 'lucide-react';
import './HumanResourceDashboard.css';

const leaveRequestsData = [
  { id: 1, name: 'Rahul Sharma', role: 'Manager', type: 'Sick Leave', from: '24 Feb', to: '26 Feb', reason: 'Flu and fever', status: 'Pending' },
  { id: 2, name: 'Anita Rao', role: 'Teacher', type: 'Casual Leave', from: '01 Mar', to: '01 Mar', reason: 'Personal work', status: 'Approved' },
  { id: 3, name: 'Manish Kumar', role: 'Driver', type: 'Medical Leave', from: '28 Feb', to: '05 Mar', reason: 'Surgery recovery', status: 'Pending' },
  { id: 4, name: 'Meena Iyer', role: 'Accountant', type: 'Sick Leave', from: '20 Feb', to: '21 Feb', reason: 'Fever', status: 'Rejected' },
];

const ApproveLeaveRequests = () => {
  const [requests, setRequests] = useState(leaveRequestsData);

  const handleAction = (id, newStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Approve Leave Requests</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Leave Requests</span>
          </nav>
        </div>
      </div>

      <div className="hr-card">
        <div className="hr-card-header">
          <h5 className="hr-card-title">Pending Requests ({requests.filter(r => r.status === 'Pending').length})</h5>
        </div>
        <div className="hr-table-wrap" style={{ padding: 0 }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>
                    <div className="hr-staff-info">
                      <div className="hr-avatar">{req.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{req.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{req.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{req.type}</td>
                  <td>
                    <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="#888" /> {req.from} - {req.to}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.reason}>
                    {req.reason}
                  </td>
                  <td>
                    <span className={`hr-status-badge ${req.status === 'Approved' ? 'approved' :
                        req.status === 'Rejected' ? 'rejected' :
                          'pending'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="hr-table-btn" title="Approve" style={{ color: '#28c76f' }} onClick={() => handleAction(req.id, 'Approved')}><Check size={16} /></button>
                        <button className="hr-table-btn" title="Reject" style={{ color: '#ea5455' }} onClick={() => handleAction(req.id, 'Rejected')}><X size={16} /></button>
                        <button className="hr-table-btn" title="View Details"><Eye size={16} /></button>
                      </div>
                    ) : (
                      <button className="hr-table-btn">View Details</button>
                    )}
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

export default ApproveLeaveRequests;
