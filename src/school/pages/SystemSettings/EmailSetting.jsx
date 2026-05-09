import { useState } from 'react';
import './SystemSettings.css';

export default function EmailSetting() {
  const [settings, setSettings] = useState({
    emailEnabled: false,
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    encryption: 'tls',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    console.log('Saving email settings:', settings);
    alert('Email settings saved successfully');
  };

  const handleTestEmail = () => {
    alert('Test email sent successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Email Setting</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="emailEnabled"
            name="emailEnabled"
            checked={settings.emailEnabled}
            onChange={handleChange}
          />
          <label htmlFor="emailEnabled">Enable Email Integration</label>
        </div>

        {settings.emailEnabled && (
          <>
            <div className="form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleChange}
                placeholder="e.g., smtp.gmail.com"
              />
            </div>
            <div className="form-group">
              <label>SMTP Port</label>
              <input
                type="number"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>SMTP Username</label>
              <input
                type="text"
                name="smtpUsername"
                value={settings.smtpUsername}
                onChange={handleChange}
                placeholder="Enter SMTP username"
              />
            </div>
            <div className="form-group">
              <label>SMTP Password</label>
              <input
                type="password"
                name="smtpPassword"
                value={settings.smtpPassword}
                onChange={handleChange}
                placeholder="Enter SMTP password"
              />
            </div>
            <div className="form-group">
              <label>From Email</label>
              <input
                type="email"
                name="fromEmail"
                value={settings.fromEmail}
                onChange={handleChange}
                placeholder="e.g., noreply@school.com"
              />
            </div>
            <div className="form-group">
              <label>From Name</label>
              <input
                type="text"
                name="fromName"
                value={settings.fromName}
                onChange={handleChange}
                placeholder="e.g., School Management System"
              />
            </div>
            <div className="form-group">
              <label>Encryption</label>
              <select name="encryption" value={settings.encryption} onChange={handleChange}>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
            <button className="btn-secondary" onClick={handleTestEmail}>
              Send Test Email
            </button>
          </>
        )}

        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
