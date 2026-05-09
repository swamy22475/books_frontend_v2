import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceFlow.css';
import { IconPlus, IconChevronRight } from '@tabler/icons-react';

const mockRecords = [];

const AttendanceListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="att-page">
      <div className="att-topbar">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <h2 className="att-title">Student Attendance</h2>
          </div>
          <div className="breadcrumbs" style={{marginTop:8}}>
            <span>Dashboard</span>
            <IconChevronRight style={{width:14,height:14,color:'#9aa4b2'}} />
            <span>Students</span>
            <IconChevronRight style={{width:14,height:14,color:'#9aa4b2'}} />
            <span className="muted">Attendance</span>
          </div>
        </div>

        <div>
          <button className="btn primary" onClick={() => navigate('/school/student-attendance/add') }>
            <IconPlus style={{width:16,height:16}} />
            Add Student Attendance
          </button>
        </div>
      </div>

      {mockRecords.length === 0 ? (
        <div className="card empty">
          <svg className="ill" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="108" height="60" rx="8" fill="#E9F2FF" />
          </svg>
          <div>
            <h3 style={{margin:0}}>No attendance records yet</h3>
            <p className="muted">Click "+ Add Student Attendance" to create the first record.</p>
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {mockRecords.map((r, idx) => (
            <div key={idx} className="card">
              <div className="title">{r.title}</div>
              <div className="muted">{r.meta}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceListPage;
