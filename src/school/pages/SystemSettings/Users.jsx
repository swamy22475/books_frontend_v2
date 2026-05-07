import { useState } from 'react';
import './SystemSettings.css';
import ExportToolbar from '../Reports/ExportToolbar';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@school.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Teacher', email: 'john@school.com', role: 'Teacher', status: 'Active' },
    { id: 3, name: 'Jane Head', email: 'jane@school.com', role: 'Admin', status: 'Inactive' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Teacher' });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { id: Date.now(), ...newUser, status: 'Active' }]);
      setNewUser({ name: '', email: '', role: 'Teacher' });
      alert('User added successfully');
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Users Management</h2>
        <ExportToolbar
          rows={users}
          columns={['Name', 'Email', 'Role', 'Status']}
          rowKeys={['name', 'email', 'role', 'status']}
          title="Users_List"
        />
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button
                    className="btn-small"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add New User</h3>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter user name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <button className="btn-save" onClick={handleAddUser}>
          Add User
        </button>
      </div>
    </div>
  );
}
