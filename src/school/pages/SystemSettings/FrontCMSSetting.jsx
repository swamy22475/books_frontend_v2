import { useState } from 'react';
import './SystemSettings.css';

export default function FrontCMSSetting() {
  const [settings, setSettings] = useState({
    cmsEnabled: false,
    siteTitle: '',
    siteDescription: '',
    bannerImage: '',
    aboutUs: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    console.log('Saving CMS settings:', settings);
    alert('CMS settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Front CMS Settings</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="cmsEnabled"
            name="cmsEnabled"
            checked={settings.cmsEnabled}
            onChange={handleChange}
          />
          <label htmlFor="cmsEnabled">Enable Front CMS</label>
        </div>

        {settings.cmsEnabled && (
          <>
            <div className="form-group">
              <label>Site Title</label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                placeholder="Enter site title"
              />
            </div>
            <div className="form-group">
              <label>Site Description</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Banner Image URL</label>
              <input
                type="text"
                name="bannerImage"
                value={settings.bannerImage}
                onChange={handleChange}
                placeholder="Enter banner image URL"
              />
            </div>
            <div className="form-group">
              <label>About Us</label>
              <textarea
                name="aboutUs"
                value={settings.aboutUs}
                onChange={handleChange}
                placeholder="Enter about us content"
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                placeholder="Enter contact email"
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                placeholder="Enter contact phone"
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
