import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-card-footer">
        <div className={`priority ${task.priority?.toLowerCase()}`}>{task.priority}</div>
        {task.assignedUser && <div className="assignee">{task.assignedUser.username}</div>}
        <button className="smart-assign-btn" title="Smart Assign">SA</button>
      </div>
    </div>
  );
};

export default TaskCard;