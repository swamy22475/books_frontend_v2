import { useState } from 'react';
import './SystemSettings.css';

export default function Modules() {
  const [modules, setModules] = useState([
    { id: 1, name: 'Student Management', status: 'Enabled', version: '1.0' },
    { id: 2, name: 'Academics', status: 'Enabled', version: '1.5' },
    { id: 3, name: 'Finance', status: 'Enabled', version: '2.0' },
    { id: 4, name: 'Examination', status: 'Enabled', version: '1.2' },
    { id: 5, name: 'Human Resource', status: 'Disabled', version: '1.8' },
  ]);

  const handleToggleModule = (id) => {
    setModules(modules.map(m =>
      m.id === id ? { ...m, status: m.status === 'Enabled' ? 'Disabled' : 'Enabled' } : m
    ));
  };

  const handleSave = () => {
    console.log('Saving modules settings:', modules);
    alert('Modules settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Modules Management</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Version</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module.id}>
                <td>{module.name}</td>
                <td>{module.version}</td>
                <td>{module.status}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={module.status === 'Enabled'}
                    onChange={() => handleToggleModule(module.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
