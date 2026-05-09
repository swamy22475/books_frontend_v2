import React, { useEffect, useMemo, useState } from 'react';
import './StudentAttendance.css';
import { EyeIcon, PlaceholderAvatar } from '../../../components/Icons';
import { postAttendance, fetchStudentsMock } from './attendanceApi';
import StudentPageContainer from './components/StudentPageContainer';

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const SECTIONS = ['A', 'B', 'C', 'D'];

function makeInitialRecord(s) {
  return {
    student_id: s.id,
    admission_no: s.admission_no,
    name: s.name,
    phone: s.phone || '—',
    class: s.class,
    section: s.section,
    photo: s.photo,
    status: 'P',
    remark: '',
    selected: false
  }
}

const StudentAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [attendanceState, setAttendanceState] = useState([]);
  const [originalState, setOriginalState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch students when class/section changes
  useEffect(() => {
    let active = true;
    if (!classId || !sectionId) {
      setAttendanceState([]);
      setOriginalState([]);
      return;
    }
    setLoading(true);
    fetchStudentsMock(classId, sectionId).then(list => {
      if (!active) return;
      const records = list.map(s => makeInitialRecord(s));
      setAttendanceState(records);
      setOriginalState(JSON.parse(JSON.stringify(records)));
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setAttendanceState([]);
      setOriginalState([]);
      setLoading(false);
    });
    return () => { active = false; };
  }, [classId, sectionId]);


  // Detect if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(attendanceState) !== JSON.stringify(originalState);
  }, [attendanceState, originalState]);

  // Filter students based on search
  const filteredAttendance = useMemo(() => {
    if (!searchQuery.trim()) return attendanceState;
    const query = searchQuery.toLowerCase();
    return attendanceState.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.admission_no.toLowerCase().includes(query)
    );
  }, [attendanceState, searchQuery]);

  const PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / PER_PAGE));
  const paginatedAttendance = filteredAttendance.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, classId, sectionId, date]);

  const setAllStatus = (status) => {
    setAttendanceState(prev => prev.map(r => ({
      ...r,
      status
    })));
  };

  const updateRecord = (student_id, patch) => {
    setAttendanceState(prev => prev.map(r =>
      r.student_id === student_id ? { ...r, ...patch } : r
    ));
  };

  const isRowModified = (record) => {
    const original = originalState.find(o => o.student_id === record.student_id);
    if (!original) return false;
    return original.status !== record.status || original.remark !== record.remark;
  };

  const saveAttendance = async () => {
    setSaving(true);
    const payload = {
      date,
      class: classId,
      section: sectionId,
      records: attendanceState.map(r => ({
        student_id: r.student_id,
        status: r.status,
        remark: r.remark || null
      }))
    };
    try {
      await postAttendance(payload);
      setOriginalState(JSON.parse(JSON.stringify(attendanceState)));
      alert('Attendance saved successfully');
      setSaving(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save attendance');
      setSaving(false);
    }
  };

  return (
    <StudentPageContainer
      title="Student Attendance"
      breadcrumb={<><span>Student Information</span> / <span className="current">Student Attendance</span></>}
      backTitle="Go back to Student Information"
      pageClass="student-attendance-page"
    >

      {/* Empty State */}
      {attendanceState.length === 0 && classId && sectionId && !loading ? (
        <div className="empty-state-container">
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>No Students Found</h3>
            <p>No students in selected class and section</p>
          </div>
        </div>
      ) : (
        <div className="card table-card soft-card">

          {/* Filter/Control Bar */}
          <div className="filter-bar">
            <div className="filter-inputs">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="sort-select control-date" />
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className="sort-select">
                <option value="">Select Class</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="sort-select">
                <option value="">Select Section</option>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
              {classId && (
                <div className="toolbar-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-field"
                  />
                </div>
              )}
            </div>
            <div className="filter-actions">
              <button className="btn btn-action" onClick={() => setAllStatus('P')}>Mark All Present</button>
              <button className="btn btn-action" onClick={() => setAllStatus('A')}>Mark All Absent</button>
            </div>
          </div>

          {/* Table Toolbar */}
          {classId && sectionId && (
            <div className="table-toolbar">
              <div className="table-stats">
                <strong>{filteredAttendance.length}</strong> students
              </div>
              <div className="toolbar-actions">
                <button className="toolbar-btn" title="Copy">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Copy
                </button>
                <button className="toolbar-btn" title="CSV">
                  CSV
                </button>
                <button className="toolbar-btn" title="Excel">
                  Excel
                </button>
                <button className="toolbar-btn" title="PDF">
                  PDF
                </button>
                <button className="toolbar-btn" title="Print" onClick={() => window.print()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Print
                </button>
              </div>
            </div>
          )}

          {/* Message: Select Class/Section */}
          {!classId || !sectionId ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--sa-text-muted)' }}>
              Please select Class & Section to load students
            </div>
          ) : loading ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--sa-text-muted)' }}>
              Loading students…
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--sa-text-muted)' }}>
              No students match your search
            </div>
          ) : (
            <div className="table-wrap">
              <table className="fee-types-table">
                <thead>
                  <tr>
                    <th className="sno-col" style={{ width: 60, textAlign: 'center' }}>S.No</th>
                    <th>Adm No</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Attendance Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAttendance.map((r, index) => (
                    <tr key={r.student_id} className={`${isRowModified(r) ? 'row-modified' : ''}`}>
                      <td className="sno-td" style={{ textAlign: 'center', color: 'var(--sa-text-muted)', fontWeight: 600 }}>
                        {(page - 1) * PER_PAGE + index + 1}
                      </td>
                      <td>{r.admission_no || '—'}</td>
                      <td>
                        {r.photo ? (
                          <img src={r.photo} alt={r.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <PlaceholderAvatar size={36} />
                        )}
                      </td>
                      <td className="name-cell">{r.name}</td>
                      <td className="phone-cell">{r.phone}</td>
                      <td>{r.class}</td>
                      <td>{r.section}</td>
                      <td>
                        <div className="status-buttons">
                          <button
                            className={`status-btn ${r.status === 'P' ? 'active' : ''} status-present`}
                            onClick={() => updateRecord(r.student_id, { status: 'P' })}
                            title="Mark Present"
                          >
                            P
                          </button>
                          <button
                            className={`status-btn ${r.status === 'A' ? 'active' : ''} status-absent`}
                            onClick={() => updateRecord(r.student_id, { status: 'A' })}
                            title="Mark Absent"
                          >
                            A
                          </button>
                          <button
                            className={`status-btn ${r.status === 'L' ? 'active' : ''} status-late`}
                            onClick={() => updateRecord(r.student_id, { status: 'L' })}
                            title="Mark Late"
                          >
                            L
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="remark-input"
                          value={r.remark || ''}
                          onChange={(e) => updateRecord(r.student_id, { remark: e.target.value })}
                          placeholder="Add remark (optional)"
                          maxLength="100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {classId && sectionId && totalPages > 1 && filteredAttendance.length > 0 && (
            <div className="sa-pagination">
              <span className="sa-page-info">
                Page {page} of {totalPages} · {filteredAttendance.length} results
              </span>
              <div className="sa-page-btns">
                <button className="sa-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="sa-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.min(Math.max(page - 2, 1) + i, totalPages);
                  return (
                    <button key={p}
                      className={`sa-page-btn ${p === page ? 'sa-page-active' : ''}`}
                      onClick={() => setPage(p)}>{p}
                    </button>
                  );
                })}
                <button className="sa-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                <button className="sa-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          )}

          {/* Sticky Save Button */}
          {classId && sectionId && attendanceState.length > 0 && (
            <div className="save-button-container">
              {hasChanges && (
                <span className="unsaved-indicator">Unsaved changes</span>
              )}
              <button
                className="btn btn-primary save-btn"
                onClick={saveAttendance}
                disabled={!hasChanges || saving}
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          )}

        </div>
      )}
    </StudentPageContainer>
  );
};

export default StudentAttendance;
