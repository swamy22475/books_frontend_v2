import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AttendanceFlow.css';

const fakeFetchStudents = (cls, sec) => new Promise((res) => {
  setTimeout(()=>{
    const students = Array.from({length:8}).map((_,i)=>({ id: i+1, name: `Student ${i+1}`, present: true }));
    res(students);
  }, 900);
});

const AttendancePortal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(()=>{
    const { cls, sec } = state || {};
    fakeFetchStudents(cls, sec).then(list => { setStudents(list); setLoading(false); });
  },[]);

  const toggle = (id) => setStudents(s => s.map(st => st.id===id? {...st, present:!st.present}:st));

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(()=>{ setSubmitting(false); setDone(true); setTimeout(()=> navigate('/school/student-attendance'), 1200); }, 900);
  };

  return (
    <div className="att-page portal">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <h2 className="att-title">Mark Attendance</h2>
        <div className="muted">{state?.cls} - {state?.sec} • {state?.date}</div>
      </div>

      <div className="card">
        {loading ? (
          <div className="student-list">
            {Array.from({length:6}).map((_,i)=>(<div key={i} className="student-row"><div className="skeleton" style={{width:180}}></div><div className="skeleton" style={{width:64}}></div></div>))}
          </div>
        ) : (
          <div>
            <div className="student-list">
              {students.map(st=> (
                <div key={st.id} className="student-row">
                  <div>
                    <div style={{fontWeight:600}}>{st.name}</div>
                    <div className="muted">Roll no: {st.id}</div>
                  </div>
                  <div className="toggle">
                    <label style={{display:'flex',alignItems:'center',gap:8}}>
                      <input type="checkbox" checked={st.present} onChange={()=>toggle(st.id)} />
                      <span className="muted">Present</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',marginTop:12,gap:12}}>
              <button className="btn" onClick={()=>navigate('/school/student-attendance')}>Cancel</button>
              <button className="btn primary" onClick={handleSubmit} disabled={submitting}>{submitting? 'Submitting...':'Submit Attendance'}</button>
            </div>
          </div>
        )}

        {done && (
          <div style={{position:'absolute',right:20,top:20,background:'#ecfdf5',padding:'8px 10px',borderRadius:8,color:'#065f46'}}>Submitted ✓</div>
        )}
      </div>
    </div>
  );
};

export default AttendancePortal;
