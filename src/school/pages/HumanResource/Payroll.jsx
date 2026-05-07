import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, ChevronRight, Eye, MoreHorizontal, Download, Filter } from 'lucide-react';
import ExportToolbar from '../Reports/ExportToolbar';
import './HumanResourceDashboard.css';

const samplePayroll = [
  { id: '1', employeeId: 'EMP001', name: 'Rahul Sharma', department: 'Administration', designation: 'Manager', phone: '9876543210', amount: 45000, status: 'Paid' },
  { id: '2', employeeId: 'EMP002', name: 'Anita Rao', department: 'Teaching', designation: 'Teacher', phone: '9123456780', amount: 30000, status: 'Generated' },
  { id: '3', employeeId: 'EMP003', name: 'Suresh Kumar', department: 'Transport', designation: 'Driver', phone: '9988776655', amount: 15000, status: 'Paid' },
  { id: '4', employeeId: 'EMP004', name: 'Meena Iyer', department: 'Accounts', designation: 'Accountant', phone: '9012345678', amount: 38000, status: 'Generated' }
];

const Payroll = () => {
  const [data] = useState(samplePayroll);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRow, setModalRow] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let out = [...data];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      out = out.filter(r => r.name.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q) || (r.phone || '').includes(q));
    }
    if (statusFilter !== 'All') {
      out = out.filter(r => r.status === statusFilter);
    }

    out.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return out;
  }, [data, searchQuery, statusFilter, sortBy]);

  const isAllSelected = filtered.length > 0 && filtered.every(r => selectedIds.has(r.id));

  const handleRowCheckboxChange = (id) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filtered.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="hr-page-header">
        <div>
          <h4 className="hr-page-title">Payroll Management</h4>
          <nav className="hr-breadcrumb">
            <Link to="/school/hr">Human Resource</Link>
            <span> / </span>
            <span className="hr-breadcrumb-current">Payroll</span>
          </nav>
        </div>
        <div className="hr-header-actions">
          <button className="hr-action-btn primary" onClick={() => navigate('/school/hr/set-salary')}>Set Salaries</button>
          <button className="hr-action-btn" style={{ background: '#fff', border: '1px solid #e0e0e0' }}>Generate Payroll</button>
        </div>
      </div>

      <div className="hr-card">
        <div className="hr-card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="search-box" style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search employee..."
              className="hr-search-input"
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select className="hr-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Generated">Generated</option>
            </select>
            <input type="date" className="hr-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
        </div>

        <div className="hr-table-wrap" style={{ padding: '0' }}>
          <table className="hr-mini-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
                <th>Employee</th>
                <th>Designation</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td style={{ paddingLeft: '24px' }}><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => handleRowCheckboxChange(row.id)} /></td>
                  <td>
                    <div className="hr-staff-info">
                      <div className="hr-avatar">{row.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{row.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{row.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{row.designation}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{row.department}</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{row.amount.toLocaleString()}</td>
                  <td>
                    <span className={`hr-status-badge ${row.status === 'Paid' ? 'approved' : 'pending'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="hr-table-btn" title="View Payslip" onClick={() => { setModalRow(row); setModalOpen(true); }}><Eye size={14} /></button>
                      <button className="hr-table-btn" title="More Actions"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && modalRow && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Payslip — {modalRow.name}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Employee ID:</span> <strong>{modalRow.employeeId}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Department:</span> <strong>{modalRow.department}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Designation:</span> <strong>{modalRow.designation}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Net Salary:</span> <strong style={{ color: '#3d5ee1', fontSize: '1.1rem' }}>₹{modalRow.amount.toLocaleString()}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Status:</span> <span className={`hr-status-badge ${modalRow.status === 'Paid' ? 'approved' : 'pending'}`}>{modalRow.status}</span></div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button className="hr-action-btn primary" style={{ flex: 1 }}><Download size={14} /> Download PDF</button>
              <button className="hr-table-btn" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
