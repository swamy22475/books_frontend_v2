import { useState } from 'react';
import './SystemSettings.css';

export default function PaymentMethods() {
  const [methods, setMethods] = useState([
    { id: 1, name: 'Credit Card', enabled: true },
    { id: 2, name: 'Debit Card', enabled: true },
    { id: 3, name: 'Net Banking', enabled: false },
    { id: 4, name: 'Digital Wallet', enabled: false },
  ]);

  const handleToggle = (id) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const handleSave = () => {
    console.log('Saving payment methods:', methods);
    alert('Payment methods saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Payment Methods</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {methods.map(method => (
              <tr key={method.id}>
                <td>{method.name}</td>
                <td>{method.enabled ? 'Enabled' : 'Disabled'}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={() => handleToggle(method.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-save" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
