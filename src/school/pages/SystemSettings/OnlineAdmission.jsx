import { useState } from 'react';
import './SystemSettings.css';

export default function OnlineAdmission() {
  const [settings, setSettings] = useState({
    admissionEnabled: false,
    form_customization: true,
    document_upload: true,
    payment_gateway: true,
    email_verification: true,
    maxApplicationsPerStudent: 5,
    applicationFee: 100,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    });
  };

  const handleSave = () => {
    console.log('Saving online admission settings:', settings);
    alert('Online admission settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Online Admission Settings</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="admissionEnabled"
            name="admissionEnabled"
            checked={settings.admissionEnabled}
            onChange={handleChange}
          />
          <label htmlFor="admissionEnabled">Enable Online Admission</label>
        </div>

        {settings.admissionEnabled && (
          <>
            <div className="option-group">
              <input
                type="checkbox"
                id="form_customization"
                name="form_customization"
                checked={settings.form_customization}
                onChange={handleChange}
              />
              <label htmlFor="form_customization">Allow Form Customization</label>
            </div>
            <div className="option-group">
              <input
                type="checkbox"
                id="document_upload"
                name="document_upload"
                checked={settings.document_upload}
                onChange={handleChange}
              />
              <label htmlFor="document_upload">Require Document Upload</label>
            </div>
            <div className="option-group">
              <input
                type="checkbox"
                id="payment_gateway"
                name="payment_gateway"
                checked={settings.payment_gateway}
                onChange={handleChange}
              />
              <label htmlFor="payment_gateway">Enable Payment Gateway</label>
            </div>
            <div className="option-group">
              <input
                type="checkbox"
                id="email_verification"
                name="email_verification"
                checked={settings.email_verification}
                onChange={handleChange}
              />
              <label htmlFor="email_verification">Require Email Verification</label>
            </div>
            <div className="form-group">
              <label>Max Applications per Student</label>
              <input
                type="number"
                name="maxApplicationsPerStudent"
                value={settings.maxApplicationsPerStudent}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Application Fee</label>
              <input
                type="number"
                name="applicationFee"
                value={settings.applicationFee}
                onChange={handleChange}
                min="0"
              />
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
