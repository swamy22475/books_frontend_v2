import { useState } from 'react';
import './SystemSettings.css';

export default function CaptchaSetting() {
  const [settings, setSettings] = useState({
    captchaEnabled: false,
    captchaType: 'recaptcha_v2',
    siteKey: '',
    secretKey: '',
    appliedTo: ['login'],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleToggleAppliedTo = (option) => {
    setSettings({
      ...settings,
      appliedTo: settings.appliedTo.includes(option)
        ? settings.appliedTo.filter(a => a !== option)
        : [...settings.appliedTo, option],
    });
  };

  const handleSave = () => {
    console.log('Saving captcha settings:', settings);
    alert('Captcha settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Captcha Settings</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="captchaEnabled"
            name="captchaEnabled"
            checked={settings.captchaEnabled}
            onChange={handleChange}
          />
          <label htmlFor="captchaEnabled">Enable Captcha</label>
        </div>

        {settings.captchaEnabled && (
          <>
            <div className="form-group">
              <label>Captcha Type</label>
              <select name="captchaType" value={settings.captchaType} onChange={handleChange}>
                <option value="recaptcha_v2">reCAPTCHA v2</option>
                <option value="recaptcha_v3">reCAPTCHA v3</option>
                <option value="hcaptcha">hCaptcha</option>
              </select>
            </div>
            <div className="form-group">
              <label>Site Key</label>
              <input
                type="text"
                name="siteKey"
                value={settings.siteKey}
                onChange={handleChange}
                placeholder="Enter site key"
              />
            </div>
            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="password"
                name="secretKey"
                value={settings.secretKey}
                onChange={handleChange}
                placeholder="Enter secret key"
              />
            </div>
            <div className="form-group">
              <label>Apply Captcha To:</label>
              <div className="checkbox-group">
                {['login', 'registration', 'contact', 'admission'].map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={settings.appliedTo.includes(option)}
                      onChange={() => handleToggleAppliedTo(option)}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
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
