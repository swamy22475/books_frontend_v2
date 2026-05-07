import { useState } from 'react';
import './SystemSettings.css';

export default function RolesPermissions() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['full_access'] },
    { id: 2, name: 'Teacher', permissions: ['view_attendance', 'submit_grades'] },
    { id: 3, name: 'Student', permissions: ['view_grades', 'view_attendance'] },
    { id: 4, name: 'Parent', permissions: ['view_student_info'] },
  ]);

  const [newRole, setNewRole] = useState('');

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, { id: Date.now(), name: newRole, permissions: [] }]);
      setNewRole('');
      alert('Role added successfully');
    }
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(r => r.id !== id));
    alert('Role deleted successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Roles & Permissions</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.permissions.join(', ') || 'No permissions'}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(role.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add New Role</h3>
        <div className="form-group">
          <label>Role Name</label>
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Enter role name"
          />
        </div>
        <button className="btn-save" onClick={handleAddRole}>
          Add Role
        </button>
      </div>
    </div>
  );
}
