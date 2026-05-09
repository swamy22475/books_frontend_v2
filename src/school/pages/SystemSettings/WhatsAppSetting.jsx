import { useState } from 'react';
import './SystemSettings.css';

export default function WhatsAppSetting() {
  const [settings, setSettings] = useState({
    whatsappEnabled: false,
    whatsappNumber: '',
    businessAccountId: '',
    accessToken: '',
    templateApprovals: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    console.log('Saving WhatsApp settings:', settings);
    alert('WhatsApp settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>WhatsApp Messaging</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="whatsappEnabled"
            name="whatsappEnabled"
            checked={settings.whatsappEnabled}
            onChange={handleChange}
          />
          <label htmlFor="whatsappEnabled">Enable WhatsApp Integration</label>
        </div>

        {settings.whatsappEnabled && (
          <>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                placeholder="Enter WhatsApp number"
              />
            </div>
            <div className="form-group">
              <label>Business Account ID</label>
              <input
                type="text"
                name="businessAccountId"
                value={settings.businessAccountId}
                onChange={handleChange}
                placeholder="Enter Business Account ID"
              />
            </div>
            <div className="form-group">
              <label>Access Token</label>
              <input
                type="password"
                name="accessToken"
                value={settings.accessToken}
                onChange={handleChange}
                placeholder="Enter Access Token"
              />
            </div>
            <div className="option-group">
              <input
                type="checkbox"
                id="templateApprovals"
                name="templateApprovals"
                checked={settings.templateApprovals}
                onChange={handleChange}
              />
              <label htmlFor="templateApprovals">Require Message Template Approvals</label>
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
