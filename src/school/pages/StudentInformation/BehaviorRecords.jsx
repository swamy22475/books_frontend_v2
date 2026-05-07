import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import './BehaviorRecords.css';
import HeaderActionButton from './components/HeaderActionButton';
import BackButton from './components/BackButton';
import TableFilter from '../../../components/common/TableFilter';

const BehaviorRecords = () => {
  const navigate = useNavigate();
  const { behaviorRecords, deleteBehaviorRecord, students } = useContext(StudentContext);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;
  
  // TableFilter states
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'student', 'class', 'title', 'type', 'date', 'reportedBy', 'actions'
  ]));
  const [selectedFilters, setSelectedFilters] = useState({});
  
  // Column definitions
  const columns = [
    { key: 'student', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'reportedBy', label: 'Reported By' },
    { key: 'actions', label: 'Actions' }
  ];
  
  // Get unique classes and types
  const uniqueClasses = useMemo(() => {
    return [...new Set(behaviorRecords.map(r => r.className).filter(Boolean))].sort();
  }, [behaviorRecords]);
  
  const uniqueTypes = useMemo(() => {
    return [...new Set(behaviorRecords.map(r => r.type).filter(Boolean))].sort();
  }, [behaviorRecords]);
  
  // Filter definitions
  const filters = [
    { key: 'class', label: 'Class', options: uniqueClasses },
    { key: 'type', label: 'Type', options: uniqueTypes }
  ];

  useEffect(() => {}, []);

  const filtered = useMemo(() => {
    let data = behaviorRecords.filter(r => {
      if (!q) return true;
      const s = q.toLowerCase();
      return [r.studentName, r.title, r.reportedBy, r.type, r.className].some(v => (v || '').toLowerCase().includes(s));
    });
    
    // Apply row filters
    if (selectedFilters.class) {
      data = data.filter(r => r.className === selectedFilters.class);
    }
    if (selectedFilters.type) {
      data = data.filter(r => r.type === selectedFilters.type);
    }
    
    setPage(1);
    return data;
  }, [behaviorRecords, q, selectedFilters]);

  const paged = filtered.slice((page-1)*perPage, page*perPage);

  const handleDelete = (id) => {
    if (!confirm('Delete this record?')) return;
    deleteBehaviorRecord(id);
  };

  return (
    <div className="behavior-page animate-fade">
      <div className="page-header">
        <div>
          <div className="back-button-wrapper">
            <BackButton title="Go back to Behavior Records" />
            <div>
              <h3>Student Behavior Records</h3>
              <nav className="breadcrumb">Dashboard &gt; Students &gt; Behavior Records</nav>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <div className="search-export">
            <input className="search-input" placeholder="Search records..." value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} />
            <div className="export-buttons">
              <button className="btn small">Copy</button>
              <button className="btn small">CSV</button>
              <button className="btn small">Excel</button>
              <button className="btn small">PDF</button>
              <button className="btn small">Print</button>
            </div>
          </div>
          <HeaderActionButton to={'/school/dashboard'} label={'Back to Dashboard'} />
          <button className="btn btn-primary" onClick={() => navigate('/school/behavior-records/add')}>Add New Record</button>
        </div>
      </div>

      <div className="card soft-card">
        {behaviorRecords.length === 0 ? (
            <div className="empty-state">
            <h4>No behavior records yet</h4>
            <p>Add records to track positive and negative incidents for students.</p>
            <button className="btn btn-primary" onClick={() => navigate('/school/behavior-records/add')}>Add New Record</button>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="filter-bar" style={{paddingBottom: 12, borderBottom: '1px solid var(--sl-border)'}}>
              <div className="filter-inputs">
                <TableFilter
                  columns={columns}
                  filters={filters}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  searchQuery={q}
                  setSearchQuery={setQ}
                  pageKey="behaviorRecords"
                />
              </div>
            </div>
            
            <div className="table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  {visibleColumns.has('student') && <th>Student</th>}
                  {visibleColumns.has('class') && <th>Class</th>}
                  {visibleColumns.has('title') && <th>Title</th>}
                  {visibleColumns.has('type') && <th>Type</th>}
                  {visibleColumns.has('date') && <th>Date</th>}
                  {visibleColumns.has('reportedBy') && <th>Reported By</th>}
                  {visibleColumns.has('actions') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.size} style={{ textAlign: 'center', padding: '20px' }}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paged.map(r => (
                  <tr key={r.id} className="hover-row">
                    {visibleColumns.has('student') && (
                      <td className="student-cell">
                        <div className="student-info">
                          <div className="avatar">{(r.studentName||'').slice(0,1)}</div>
                          <div>
                            <div className="student-name">{r.studentName}</div>
                            <div className="student-sub">{r.studentId || ''}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.has('class') && <td>{r.className}</td>}
                    {visibleColumns.has('title') && <td>{r.title}</td>}
                    {visibleColumns.has('type') && (
                      <td><span className={"badge " + (r.type === 'Positive' ? 'badge-positive' : 'badge-negative')}>{r.type}</span></td>
                    )}
                    {visibleColumns.has('date') && <td>{r.date}</td>}
                    {visibleColumns.has('reportedBy') && <td>{r.reportedBy}</td>}
                    {visibleColumns.has('actions') && (
                      <td>
                        <div className="action-icons">
                          <button className="icon-btn" title="Edit" onClick={() => navigate(`/school/behavior-records/add?edit=${r.id}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                          </button>
                          <button className="icon-btn" title="Delete" onClick={() => handleDelete(r.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )))}
              </tbody>
            </table>

            <div className="pagination">
              <div>Showing {(page-1)*perPage+1} - {Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
              <div className="pages">
                <button className="btn small" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
                <button className="btn small" onClick={() => setPage(p => p+1)} disabled={page*perPage >= filtered.length}>Next</button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BehaviorRecords;
