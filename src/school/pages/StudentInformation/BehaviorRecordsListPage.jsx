import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import './BehaviorRecords.css';
import StudentPageContainer from './components/StudentPageContainer';

const BehaviorRecordsListPage = () => {
  const navigate = useNavigate();
  const { behaviorRecords, deleteBehaviorRecord, students } = useContext(StudentContext);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => { }, []);

  const filtered = behaviorRecords.filter(r => {
    if (!q) return true;
    const s = q.toLowerCase();
    return [r.studentName, r.title, r.reportedBy, r.type, r.className].some(v => (v || '').toLowerCase().includes(s));
  });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = (id) => {
    if (!confirm('Delete this record?')) return;
    deleteBehaviorRecord(id);
  };

  const headerActions = (
    <>
      <div className="search-export">
        <input className="search-input" placeholder="Search records..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        <div className="export-buttons">
          <button className="btn small">Copy</button>
          <button className="btn small">CSV</button>
          <button className="btn small">Excel</button>
          <button className="btn small">PDF</button>
          <button className="btn small">Print</button>
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/school/behavior-records/add')}>Add New Record</button>
    </>
  );

  return (
    <StudentPageContainer
      title="Student Behavior Records"
      breadcrumb={<>Dashboard &gt; Students &gt; Behavior Records</>}
      backTitle="Go back to Behavior Records"
      pageClass="behavior-page animate-fade"
      actions={headerActions}
    >

      <div className="card soft-card">
        {behaviorRecords.length === 0 ? (
          <div className="empty-state">
            <h4>No behavior records yet</h4>
            <p>Add records to track positive and negative incidents for students.</p>
            <button className="btn btn-primary" onClick={() => navigate('/school/behavior-records/add')}>Add New Record</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Reported By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(r => (
                  <tr key={r.id} className="hover-row">
                    <td className="student-cell">
                      <div className="student-info">
                        <div className="avatar">{(r.studentName || '').slice(0, 1)}</div>
                        <div>
                          <div className="student-name">{r.studentName}</div>
                          <div className="student-sub">{r.studentId || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.className}</td>
                    <td>{r.title}</td>
                    <td><span className={"badge " + (r.type === 'Positive' ? 'badge-positive' : 'badge-negative')}>{r.type}</span></td>
                    <td>{r.date}</td>
                    <td>{r.reportedBy}</td>
                    <td>
                      <div className="action-icons">
                        <button className="icon-btn" title="Edit" onClick={() => navigate(`/school/behavior-records/add?edit=${r.id}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                        </button>
                        <button className="icon-btn" title="Delete" onClick={() => handleDelete(r.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div>Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}</div>
              <div className="pages">
                <button className="btn small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                <button className="btn small" onClick={() => setPage(p => p + 1)} disabled={page * perPage >= filtered.length}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentPageContainer>
  );
};

export default BehaviorRecordsListPage;
