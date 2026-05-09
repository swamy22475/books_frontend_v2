import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import './DisableStudentPage.css';
import { PlaceholderAvatar } from '../../../components/Icons';
import StudentPageContainer from './components/StudentPageContainer';

const reasons = [
  'Transfer to Another School',
  'Relocation of Family',
  'Completed Schooling',
  'Admission Cancelled',
  'Long-Term Absenteeism',
  'Financial Constraints',
  'Medical Reasons',
  'Disciplinary Action',
  'Change of Curriculum/Board',
  'Personal / Family Reasons'
];

const DisableStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, disableStudent, disabledStudents, disablingIds } = useContext(StudentContext);
  const student = students.find(s => s.id === id) || disabledStudents.find(s => s.id === id) || { name: 'Unknown' };
  const [selected, setSelected] = useState('');
  const [pending, setPending] = useState(false);

  const confirmDisable = async () => {
    if (!selected) return alert('Please select a reason');
    if (disabledStudents.find(s => s.id === id)) { alert('Student is already disabled'); return; }
    if (disablingIds.includes(id)) return;
    setPending(true);
    const ok = await disableStudent(id, selected);
    setPending(false);
    if (ok) {
      navigate('/school/disabled-students', { state: { disabled: true } });
    } else {
      alert('Unable to disable student (already disabled or missing).');
    }
  };

  return (
    <StudentPageContainer
      title="Disable Student"
      breadcrumb={<><span>Student Management</span> / <span className="current">Disable</span></>}
      backTitle="Go back to Students"
      pageClass="disable-student-page"
    >

      {/* Main Card */}
      <div className="card soft-card disable-card">
        {/* Student Info Pill */}
        <div className="student-info-pill">
          <div className="student-info-content">
            {student.image ? (
              <img src={student.image} alt={student.name} className="student-avatar" />
            ) : (
              <div className="student-avatar-placeholder">
                <PlaceholderAvatar gender={student.gender} size={40} />
              </div>
            )}
            <div className="student-details">
              <span className="student-name">{student.name || 'Unknown Student'}</span>
              <span className="student-meta">{student.admissionNo || student.id} • {student.class || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="disable-helper">
          <p>This action will deactivate the student account and prevent login access.</p>
        </div>

        {/* Reason Selection */}
        <div className="disable-reasons-section">
          <label className="section-label">Select a reason for disabling</label>
          <div className="reasons-grid">
            {reasons.map(r => (
              <label key={r} className={`reason-option ${selected === r ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={selected === r}
                  onChange={() => setSelected(r)}
                />
                <span className="reason-text">{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="disable-footer">
          <button
            className="btn btn-outline"
            onClick={() => navigate(-1)}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={confirmDisable}
            disabled={pending || !selected}
          >
            {pending ? 'Disabling...' : 'Confirm Disable'}
          </button>
        </div>
      </div>
    </StudentPageContainer>
  );
};

export default DisableStudentPage;
