import { useState } from 'react';
import './SystemSettings.css';

export default function SMSSetting() {
  const [settings, setSettings] = useState({
    smsEnabled: false,
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    senderNumber: '',
    credits: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    console.log('Saving SMS settings:', settings);
    alert('SMS settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>SMS Setting</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="smsEnabled"
            name="smsEnabled"
            checked={settings.smsEnabled}
            onChange={handleChange}
          />
          <label htmlFor="smsEnabled">Enable SMS Integration</label>
        </div>

        {settings.smsEnabled && (
          <>
            <div className="form-group">
              <label>SMS Provider</label>
              <select name="provider" value={settings.provider} onChange={handleChange}>
                <option value="twilio">Twilio</option>
                <option value="aws">AWS SNS</option>
                <option value="custom">Custom Provider</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account SID</label>
              <input
                type="text"
                name="accountSid"
                value={settings.accountSid}
                onChange={handleChange}
                placeholder="Enter Account SID"
              />
            </div>
            <div className="form-group">
              <label>Auth Token</label>
              <input
                type="password"
                name="authToken"
                value={settings.authToken}
                onChange={handleChange}
                placeholder="Enter Auth Token"
              />
            </div>
            <div className="form-group">
              <label>Sender Number</label>
              <input
                type="tel"
                name="senderNumber"
                value={settings.senderNumber}
                onChange={handleChange}
                placeholder="Enter sender number"
              />
            </div>
            <div className="form-group">
              <label>Available Credits: {settings.credits}</label>
              <button className="btn-secondary">Add Credits</button>
            </div>
          </>
        )}

        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
