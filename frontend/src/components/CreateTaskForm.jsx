import React, { useState } from 'react';
import { createTask } from '../services/api';

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('Task title is required.');
    try {
      await createTask({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('Medium');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task.');
    }
  };

  return (
    <div className="create-task-container">
      <form onSubmit={handleSubmit} className="create-task-form">
        <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
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