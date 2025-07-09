import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { smartAssign, updateTask } from '../services/api';

const stringToColor = (str = '') => {
  let hash = 0;
  str.split('').forEach(char => { hash = char.charCodeAt(0) + ((hash << 5) - hash) });
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const TaskCard = ({ task, users = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const handleSmartAssign = async () => {
    try { await smartAssign(task._id); }
    catch (error) { alert('Failed to smart assign task.'); }
  };

  const handleManualAssign = async (userId) => {
    try {
      await updateTask(task._id, { assignedUser: userId });
      setShowDropdown(false);
    } catch (error) {
      alert('Failed to assign task.');
    }
  };

  const assignee = task.assignedUser;

  return (
    <div ref={setNodeRef} style={style} className="task-card">
      {/* The drag handle is now separate */}
      <div {...attributes} {...listeners} className="drag-handle">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
      </div>
      
      <div className="task-card-footer">
        <div className={`priority ${task.priority?.toLowerCase()}`}>{task.priority}</div>
        <div className="assignee-container">
          <button onClick={handleSmartAssign} className="smart-assign-btn" title="Smart Assign">SA</button>
          <div 
            className="assignee-avatar" 
            style={{ backgroundColor: assignee ? stringToColor(assignee.username) : '#ccc' }}
            onClick={() => setShowDropdown(prev => !prev)}
            title={assignee ? `Assigned to ${assignee.username}` : "Unassigned"}
          >
            {assignee ? assignee.username.charAt(0).toUpperCase() : '?'}
          </div>
          {showDropdown && (
            <div className="assignee-dropdown">
              {users.map(user => (
                <button key={user._id} onClick={() => handleManualAssign(user._id)}>
                  {user.username}
                </button>
              ))}
              <button onClick={() => handleManualAssign(null)}>Unassign</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;