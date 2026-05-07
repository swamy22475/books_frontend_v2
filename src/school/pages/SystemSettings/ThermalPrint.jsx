import { useState } from 'react';
import './SystemSettings.css';

export default function ThermalPrint() {
  const [settings, setSettings] = useState({
    thermalEnabled: false,
    paperWidth: '80',
    orientation: 'portrait',
    fontSize: '12',
    autoPrint: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    console.log('Saving thermal print settings:', settings);
    alert('Thermal print settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Thermal Print Settings</h2>
      </div>
      <div className="settings-form">
        <div className="option-group">
          <input
            type="checkbox"
            id="thermalEnabled"
            name="thermalEnabled"
            checked={settings.thermalEnabled}
            onChange={handleChange}
          />
          <label htmlFor="thermalEnabled">Enable Thermal Printing</label>
        </div>

        {settings.thermalEnabled && (
          <>
            <div className="form-group">
              <label>Paper Width (mm)</label>
              <input
                type="number"
                name="paperWidth"
                value={settings.paperWidth}
                onChange={handleChange}
                min="50"
                max="150"
              />
            </div>
            <div className="form-group">
              <label>Orientation</label>
              <select name="orientation" value={settings.orientation} onChange={handleChange}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="form-group">
              <label>Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={settings.fontSize}
                onChange={handleChange}
                min="8"
                max="20"
              />
            </div>
            <div className="option-group">
              <input
                type="checkbox"
                id="autoPrint"
                name="autoPrint"
                checked={settings.autoPrint}
                onChange={handleChange}
              />
              <label htmlFor="autoPrint">Auto Print on Generation</label>
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
