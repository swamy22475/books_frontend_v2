import { useState } from 'react';
import './SystemSettings.css';

export default function FileTypes() {
  const [fileTypes, setFileTypes] = useState([
    { id: 1, extension: '.pdf', mimeType: 'application/pdf', allowed: true, maxSize: 5 },
    { id: 2, extension: '.jpg', mimeType: 'image/jpeg', allowed: true, maxSize: 2 },
    { id: 3, extension: '.png', mimeType: 'image/png', allowed: true, maxSize: 2 },
    { id: 4, extension: '.doc', mimeType: 'application/msword', allowed: false, maxSize: 5 },
    { id: 5, extension: '.xlsx', mimeType: 'application/vnd.ms-excel', allowed: true, maxSize: 3 },
  ]);

  const [newType, setNewType] = useState({ extension: '', mimeType: '', maxSize: 5 });

  const handleAddType = () => {
    if (newType.extension && newType.mimeType) {
      setFileTypes([...fileTypes, { id: Date.now(), ...newType, allowed: true }]);
      setNewType({ extension: '', mimeType: '', maxSize: 5 });
      alert('File type added successfully');
    }
  };

  const handleToggle = (id) => {
    setFileTypes(fileTypes.map(f =>
      f.id === id ? { ...f, allowed: !f.allowed } : f
    ));
  };

  const handleDelete = (id) => {
    setFileTypes(fileTypes.filter(f => f.id !== id));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>File Types Settings</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Extension</th>
              <th>MIME Type</th>
              <th>Max Size (MB)</th>
              <th>Allowed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fileTypes.map(type => (
              <tr key={type.id}>
                <td>{type.extension}</td>
                <td>{type.mimeType}</td>
                <td>{type.maxSize}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={type.allowed}
                    onChange={() => handleToggle(type.id)}
                  />
                </td>
                <td>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(type.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add File Type</h3>
        <div className="form-group">
          <label>Extension</label>
          <input
            type="text"
            value={newType.extension}
            onChange={(e) => setNewType({ ...newType, extension: e.target.value })}
            placeholder=".pdf"
          />
        </div>
        <div className="form-group">
          <label>MIME Type</label>
          <input
            type="text"
            value={newType.mimeType}
            onChange={(e) => setNewType({ ...newType, mimeType: e.target.value })}
            placeholder="application/pdf"
          />
        </div>
        <div className="form-group">
          <label>Max Size (MB)</label>
          <input
            type="number"
            value={newType.maxSize}
            onChange={(e) => setNewType({ ...newType, maxSize: parseInt(e.target.value) })}
            min="1"
          />
        </div>
        <button className="btn-save" onClick={handleAddType}>
          Add File Type
        </button>
      </div>
    </div>
  );
}
