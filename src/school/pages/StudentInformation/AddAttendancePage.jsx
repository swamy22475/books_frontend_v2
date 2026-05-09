import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceFlow.css';
import { IconInfoCircle } from '@tabler/icons-react';
import StudentPageContainer from './components/StudentPageContainer';

const classesSample = ['Select Class', 'Grade 1', 'Grade 2', 'Grade 3'];
const sectionsSample = ['Select Section', 'A', 'B', 'C'];

const AddAttendancePage = () => {
  const navigate = useNavigate();
  const [cls, setCls] = useState('Select Class');
  const [sec, setSec] = useState('Select Section');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!cls || cls === 'Select Class') e.cls = 'Please select a class';
    if (!sec || sec === 'Select Section') e.sec = 'Please select a section';
    if (!date) e.date = 'Please choose a date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = () => {
    if (!validate()) return;
    // navigate to portal, pass selection via state (absolute path)
    navigate('/school/student-attendance', { state: { cls, sec, date } });
  };

  return (
    <StudentPageContainer
      title="Add Student Attendance"
      breadcrumb={<><span>Student Information</span> / <span>Attendance</span> / <span className="current">Add</span></>}
      backTitle="Back to Attendance"
      pageClass="att-page add-wrap"
    >
      <div className="card form-card">
        <div className="form-field">
          <label>Class</label>
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="input">
            {classesSample.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.cls && <span className="muted" style={{ color: '#b91c1c' }}>{errors.cls}</span>}
        </div>

        <div className="form-field">
          <label>Section</label>
          <select value={sec} onChange={(e) => setSec(e.target.value)} className="input">
            {sectionsSample.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.sec && <span className="muted" style={{ color: '#b91c1c' }}>{errors.sec}</span>}
        </div>

        <div className="form-field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          {errors.date && <span className="muted" style={{ color: '#b91c1c' }}>{errors.date}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <div className="card info-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconInfoCircle style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontWeight: 600 }}>Note</div>
            <div className="muted">Proceed to mark attendance after selecting class, section and date.</div>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div className="proceed">
          <button className="btn primary" onClick={handleProceed}>Proceed to Attendance</button>
        </div>
      </div>
    </StudentPageContainer>
  );
};

export default AddAttendancePage;
