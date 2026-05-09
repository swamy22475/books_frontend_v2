import { useState } from 'react';
import './SystemSettings.css';

export default function SystemFields() {
  const [fields, setFields] = useState([
    { id: 1, name: 'Admission Number', mandatory: true, visible: true },
    { id: 2, name: 'Date of Birth', mandatory: true, visible: true },
    { id: 3, name: 'Aadhar Number', mandatory: false, visible: true },
    { id: 4, name: 'Blood Group', mandatory: false, visible: false },
  ]);

  const handleToggle = (id, field) => {
    setFields(fields.map(f =>
      f.id === id ? { ...f, [field]: !f[field] } : f
    ));
  };

  const handleSave = () => {
    console.log('Saving system fields:', fields);
    alert('System fields saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Fields</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Mandatory</th>
              <th>Visible</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.id}>
                <td>{field.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={field.mandatory}
                    onChange={() => handleToggle(field.id, 'mandatory')}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={field.visible}
                    onChange={() => handleToggle(field.id, 'visible')}
                  />
                </td>
                <td>
                  <button className="btn-small">Configure</button>
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
