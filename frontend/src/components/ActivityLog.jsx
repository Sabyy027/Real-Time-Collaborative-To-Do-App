import React from 'react';

const ActivityLog = () => {
  return (
    <div className="activity-log-panel">
      <h3>Activity Log</h3>
      <ul>
        <li>
          <strong>Saby</strong> moved "Set up the database" to In Progress.
          <span className="log-timestamp">July 8, 2025, 2:30 PM</span>
        </li>
        <li>
          <strong>John</strong> created task "Deploy to production".
          <span className="log-timestamp">July 8, 2025, 1:15 PM</span>
        </li>
      </ul>
    </div>
  );
};

export default ActivityLog; 