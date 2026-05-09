import { useState } from 'react';
import './SystemSettings.css';

export default function PrintHeaderFooter() {
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const handleSave = () => {
    console.log('Saving print header/footer:', { header, footer, logoUrl });
    alert('Print settings saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Print Header Footer</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Enter logo URL"
          />
        </div>
        <div className="form-group">
          <label>Header Text (HTML allowed)</label>
          <textarea
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Enter header content"
            rows={6}
          />
        </div>
        <div className="form-group">
          <label>Footer Text (HTML allowed)</label>
          <textarea
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            placeholder="Enter footer content"
            rows={6}
          />
        </div>
        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
