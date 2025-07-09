import React from 'react';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ActivityLog = ({ logs = [] }) => {
  return (
    <div className="activity-log-panel">
      <h3>Activity Log</h3>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            <strong>{log.user?.username || 'User'}</strong> {log.details}
            <span className="log-timestamp">{formatDate(log.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;