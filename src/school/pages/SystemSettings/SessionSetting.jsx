import { useState } from 'react';
import './SystemSettings.css';

export default function SessionSetting() {
  const [sessions, setSessions] = useState([
    { id: 1, name: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', isActive: true }
  ]);
  const [newSession, setNewSession] = useState({ name: '', startDate: '', endDate: '' });

  const handleAddSession = () => {
    if (newSession.name && newSession.startDate && newSession.endDate) {
      setSessions([...sessions, { ...newSession, id: Date.now(), isActive: false }]);
      setNewSession({ name: '', startDate: '', endDate: '' });
      alert('Session added successfully');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Session Settings</h2>
      </div>
      <div className="settings-form">
        <h3>Active Sessions</h3>
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Session Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td>{session.name}</td>
                <td>{session.startDate}</td>
                <td>{session.endDate}</td>
                <td>{session.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add New Session</h3>
        <div className="form-group">
          <label>Session Name</label>
          <input
            type="text"
            value={newSession.name}
            onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
            placeholder="e.g., 2024-2025"
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={newSession.startDate}
            onChange={(e) => setNewSession({ ...newSession, startDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={newSession.endDate}
            onChange={(e) => setNewSession({ ...newSession, endDate: e.target.value })}
          />
        </div>
        <button className="btn-save" onClick={handleAddSession}>
          Add Session
        </button>
      </div>
    </div>
  );
}
