import { useState } from 'react';
import './SystemSettings.css';

export default function CustomFields() {
  const [fields, setFields] = useState([
    { id: 1, name: 'Guardian Mobile', type: 'text', applicable: 'Student' },
    { id: 2, name: 'Religion', type: 'select', applicable: 'Student' },
    { id: 3, name: 'Caste', type: 'text', applicable: 'Student' },
  ]);

  const [newField, setNewField] = useState({ name: '', type: 'text', applicable: 'Student' });

  const handleAddField = () => {
    if (newField.name.trim()) {
      setFields([...fields, { id: Date.now(), ...newField }]);
      setNewField({ name: '', type: 'text', applicable: 'Student' });
      alert('Custom field added successfully');
    }
  };

  const handleDelete = (id) => {
    setFields(fields.filter(f => f.id !== id));
    alert('Field deleted successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Custom Fields</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Field Type</th>
              <th>Applicable To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.id}>
                <td>{field.name}</td>
                <td>{field.type}</td>
                <td>{field.applicable}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(field.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add Custom Field</h3>
        <div className="form-group">
          <label>Field Name</label>
          <input
            type="text"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            placeholder="Enter field name"
          />
        </div>
        <div className="form-group">
          <label>Field Type</label>
          <select 
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
            <option value="date">Date</option>
          </select>
        </div>
        <div className="form-group">
          <label>Applicable To</label>
          <select 
            value={newField.applicable}
            onChange={(e) => setNewField({ ...newField, applicable: e.target.value })}
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <button className="btn-save" onClick={handleAddField}>
          Add Field
        </button>
      </div>
    </div>
  );
}
