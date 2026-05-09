import { useState } from 'react';
import './SystemSettings.css';

export default function SystemUpdate() {
  const [updateInfo, setUpdateInfo] = useState({
    currentVersion: '1.5.2',
    latestVersion: '1.6.0',
    lastChecked: '2024-02-15',
    updateAvailable: true,
  });

  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [updateLog, setUpdateLog] = useState([]);

  const handleStartUpdate = () => {
    if (window.confirm('This will update the system. Do you want to continue?')) {
      setUpdateInProgress(true);
      setUpdateLog(['Downloading update...', 'Verifying files...', 'Installing update...']);
      
      setTimeout(() => {
        setUpdateLog(prev => [...prev, 'Update completed successfully!', 'System restarting...']);
        setUpdateInProgress(false);
        setUpdateInfo(prev => ({ ...prev, currentVersion: prev.latestVersion }));
      }, 3000);
    }
  };

  const handleCheckUpdates = () => {
    alert('Checking for updates...');
    // In a real application, this would call an API
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Update</h2>
      </div>
      <div className="settings-form">
        <div className="update-info">
          <div className="info-card">
            <label>Current Version:</label>
            <span>{updateInfo.currentVersion}</span>
          </div>
          <div className="info-card">
            <label>Latest Version:</label>
            <span>{updateInfo.latestVersion}</span>
          </div>
          <div className="info-card">
            <label>Last Checked:</label>
            <span>{updateInfo.lastChecked}</span>
          </div>
        </div>

        {updateInfo.updateAvailable && updateInfo.currentVersion !== updateInfo.latestVersion && (
          <div className="alert alert-info">
            A new version is available. Please update to the latest version.
          </div>
        )}

        <div className="update-actions">
          <button className="btn-save" onClick={handleCheckUpdates}>
            Check for Updates
          </button>
          {updateInfo.updateAvailable && updateInfo.currentVersion !== updateInfo.latestVersion && (
            <button 
              className="btn-save" 
              onClick={handleStartUpdate}
              disabled={updateInProgress}
            >
              {updateInProgress ? 'Updating...' : 'Update Now'}
            </button>
          )}
        </div>

        {updateLog.length > 0 && (
          <div className="update-log">
            <h3>Update Log</h3>
            <div className="log-content">
              {updateLog.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </div>
        )}

        <div className="update-details">
          <h3>Update Details</h3>
          <ul>
            <li>Version 1.6.0 includes bug fixes and performance improvements</li>
            <li>New features for attendance and academics modules</li>
            <li>Enhanced security and data protection</li>
            <li>Backup will be created automatically before update</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
