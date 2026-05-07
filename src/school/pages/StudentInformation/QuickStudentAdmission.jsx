import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPageContainer from './components/StudentPageContainer';
import './StudentList.css';

const QuickStudentAdmission = () => {
  const navigate = useNavigate();

  const backToListBtn = (
    <button
      onClick={() => navigate('/school/student-list')}
      className="btn btn-primary"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Back to List
    </button>
  );

  return (
    <StudentPageContainer
      title="Quick Student Admission"
      breadcrumb={<><span>Student Management</span> / <span className="current">Quick Admission</span></>}
      backTitle="Go back to Student List"
      actions={backToListBtn}
    >
      {/* Content */}
      <div className="card soft-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Quick Student Admission</h3>
        <p className="muted">Fast-track student admission form coming soon.</p>
        <p style={{ marginTop: '20px', color: '#999' }}>This feature is under development. You can use the regular Student List → Add Student for now.</p>
      </div>
    </StudentPageContainer>
  );
};

export default QuickStudentAdmission;
