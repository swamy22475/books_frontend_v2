import { useState } from 'react';
import './SystemSettings.css';

export default function StudentProfileUpdate() {
  const [settings, setSettings] = useState({
    allowStudentUpdate: true,
    allowParentUpdate: true,
    requireApproval: true,
    editableFields: ['phone', 'address', 'email', 'parentInfo'],
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleToggleField = (field) => {
    setSettings({
      ...settings,
      editableFields: settings.editableFields.includes(field)
        ? settings.editableFields.filter(f => f !== field)
        : [...settings.editableFields, field],
    });
  };

  const handleSave = () => {
    console.log('Saving student profile update settings:', settings);
    alert('Settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Student Profile Update Settings</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="allowStudentUpdate"
            checked={settings.allowStudentUpdate}
            onChange={() => handleToggle('allowStudentUpdate')}
          />
          <label htmlFor="allowStudentUpdate">Allow Student Profile Update</label>
        </div>
        <div className="option-group">
          <input
            type="checkbox"
            id="allowParentUpdate"
            checked={settings.allowParentUpdate}
            onChange={() => handleToggle('allowParentUpdate')}
          />
          <label htmlFor="allowParentUpdate">Allow Parent Profile Update</label>
        </div>
        <div className="option-group">
          <input
            type="checkbox"
            id="requireApproval"
            checked={settings.requireApproval}
            onChange={() => handleToggle('requireApproval')}
          />
          <label htmlFor="requireApproval">Require Admin Approval for Updates</label>
        </div>

        <h3>Editable Fields</h3>
        <div className="checkbox-group">
          {['phone', 'address', 'email', 'parentInfo', 'emergencyContact'].map(field => (
            <label key={field}>
              <input
                type="checkbox"
                checked={settings.editableFields.includes(field)}
                onChange={() => handleToggleField(field)}
              />
              {field === 'phone' && 'Phone Number'}
              {field === 'address' && 'Address'}
              {field === 'email' && 'Email'}
              {field === 'parentInfo' && 'Parent Information'}
              {field === 'emergencyContact' && 'Emergency Contact'}
            </label>
          ))}
        </div>

        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
