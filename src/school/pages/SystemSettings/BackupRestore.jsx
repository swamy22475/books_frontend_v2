import { useState } from 'react';
import './SystemSettings.css';

export default function BackupRestore() {
  const [backups, setBackups] = useState([
    { id: 1, date: '2024-02-15', size: '250 MB', status: 'Success' },
    { id: 2, date: '2024-02-14', size: '248 MB', status: 'Success' },
  ]);

  const [backupInProgress, setBackupInProgress] = useState(false);

  const handleCreateBackup = () => {
    setBackupInProgress(true);
    setTimeout(() => {
      setBackups([{ id: Date.now(), date: new Date().toLocaleDateString(), size: '252 MB', status: 'Success' }, ...backups]);
      setBackupInProgress(false);
      alert('Backup created successfully');
    }, 2000);
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      alert('Restore started. This may take a few minutes.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Backup & Restore</h2>
      </div>
      <div className="settings-form">
        <div className="backup-actions">
          <button 
            className="btn-save" 
            onClick={handleCreateBackup}
            disabled={backupInProgress}
          >
            {backupInProgress ? 'Creating Backup...' : 'Create Backup'}
          </button>
        </div>

        <h3>Backup History</h3>
        <table className="settings-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Size</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id}>
                <td>{backup.date}</td>
                <td>{backup.size}</td>
                <td>{backup.status}</td>
                <td>
                  <button className="btn-small">Download</button>
                  <button 
                    className="btn-small"
                    onClick={() => handleRestore(backup.id)}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
