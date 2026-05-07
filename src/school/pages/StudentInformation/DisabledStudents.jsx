import React, { useContext, useState, useMemo } from 'react';
import { StudentContext } from '../../../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import './StudentList.css';
import { EyeIcon, CheckIcon, PlaceholderAvatar } from '../../../components/Icons';
import TableFilter from '../../../components/common/TableFilter';
import StudentPageContainer from './components/StudentPageContainer';

// Compact Disabled Students table — matches Student List styles

const DisabledStudents = () => {
  const { disabledStudents, enableStudent, enablingIds } = useContext(StudentContext);
  const navigate = useNavigate();
  const [pendingId, setPendingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'admission', 'photo', 'name', 'class', 'disabledOn', 'reason', 'actions'
  ]));
  const [selectedFilters, setSelectedFilters] = useState({});

  // Get unique classes
  const uniqueClasses = useMemo(() => {
    return [...new Set(disabledStudents.map(s => s.class || s.className).filter(Boolean))].sort();
  }, [disabledStudents]);

  // Column definitions
  const columns = [
    { key: 'admission', label: 'Adm No.' },
    { key: 'photo', label: 'Photo' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'disabledOn', label: 'Disabled On' },
    { key: 'reason', label: 'Reason' },
    { key: 'actions', label: 'Actions' }
  ];

  // Filter definitions
  const filters = [
    { key: 'class', label: 'Class', options: uniqueClasses }
  ];

  // Filtered students
  const filteredStudents = useMemo(() => {
    let data = disabledStudents.filter(d =>
      (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.admissionNo || d.id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedFilters.class) {
      data = data.filter(d => (d.class || d.className) === selectedFilters.class);
    }

    return data;
  }, [disabledStudents, searchQuery, selectedFilters]);

  return (
    <StudentPageContainer
      title="Disabled Students"
      breadcrumb={<><span>Students</span> / <span className="current">Disabled</span></>}
      backTitle="Go back to Disabled Students"
    >

      <div className="card soft-card fade-in compact-table">
        {disabledStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <h3>No disabled students</h3>
            <p className="muted">Students you disable will appear here. You can re-enable them at any time.</p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="filter-bar" style={{ paddingBottom: 12, borderBottom: '1px solid var(--sl-border)' }}>
              <div className="filter-inputs">
                <TableFilter
                  columns={columns}
                  filters={filters}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  pageKey="disabledStudents"
                />
              </div>
            </div>

            <div className="table-wrap">
              <table className="fee-types-table">
                <thead>
                  <tr>
                    {visibleColumns.has('admission') && <th className="col-adm">Adm No.</th>}
                    {visibleColumns.has('photo') && <th className="col-photo">Photo</th>}
                    {visibleColumns.has('name') && <th className="col-name">Name</th>}
                    {visibleColumns.has('class') && <th className="col-class">Class</th>}
                    {visibleColumns.has('disabledOn') && <th className="col-disabled">Disabled On</th>}
                    {visibleColumns.has('reason') && <th className="col-reason">Reason</th>}
                    {visibleColumns.has('actions') && <th className="col-actions">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumns.size} style={{ textAlign: 'center', padding: '20px' }}>
                        No disabled students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(d => (
                      <tr key={d.id}>
                        {visibleColumns.has('admission') && <td className="adm">{d.admissionNo || d.id || '—'}</td>}
                        {visibleColumns.has('photo') && (
                          <td className="photo">
                            {d.image ? <img src={d.image} className="avatar" alt={d.name} /> : <PlaceholderAvatar gender={d.gender} size={36} />}
                          </td>
                        )}
                        {visibleColumns.has('name') && <td className="name">{d.name}</td>}
                        {visibleColumns.has('class') && <td className="class">{d.class || d.className || '—'}</td>}
                        {visibleColumns.has('disabledOn') && <td className="disabled">{new Date(d.disabledAt || d.disabledDate || Date.now()).toLocaleDateString()}</td>}
                        {visibleColumns.has('reason') && (
                          <td className="reason"><span className="badge badge-danger" style={{ background: '#FFF5F5', color: '#C53030' }}>{d.reason || '—'}</span></td>
                        )}
                        {visibleColumns.has('actions') && (
                          <td className="actions">
                            <button className="icon-btn icon-view" title="View" onClick={() => navigate(`/school/student-profile/${d.id}`)}><EyeIcon /></button>
                            <button className="icon-btn icon-reenable" title="Re-enable" onClick={async () => {
                              if (enablingIds.includes(d.id) || pendingId === d.id) return;
                              setPendingId(d.id);
                              const ok = await enableStudent(d.id);
                              setPendingId(null);
                              if (ok) { setShowToast(true); setTimeout(() => setShowToast(false), 2600); }
                            }}>{pendingId === d.id ? <span style={{ fontSize: 12 }}>...</span> : <CheckIcon />}</button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {showToast && <div className="snackbar success">Student re-enabled</div>}
      </div>
    </StudentPageContainer>
  );
};

export default DisabledStudents;

