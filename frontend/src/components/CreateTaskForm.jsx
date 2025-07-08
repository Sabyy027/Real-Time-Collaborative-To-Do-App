import React from 'react';

const CreateTaskForm = () => {
  return (
    <div className="create-task-container">
      <form className="create-task-form">
        <input type="text" placeholder="Task Title" required />
        <textarea placeholder="Task Description" required></textarea>
        <select>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default CreateTaskForm;