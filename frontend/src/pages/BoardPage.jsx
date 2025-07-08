import React, { useContext } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { AuthContext } from '../context/AuthContext';
import Board from '../components/Board';
import CreateTaskForm from '../components/CreateTaskForm';
import ActivityLog from '../components/ActivityLog';

// We will add state and API calls in a later phase.
// For now, this is a placeholder to prevent errors.
const handleDragEnd = () => {
    console.log("Drag ended. Logic will be added in a future phase.");
};

const BoardPage = () => {
  const { logout } = useContext(AuthContext);

  // We use static sample data for our static UI phase.
  const sampleTasks = [
      { _id: '1', title: 'Design the login page', description: 'Create a wireframe and mockups.', status: 'Todo', priority: 'High', assignedUser: { username: 'Saby' }},
      { _id: '2', title: 'Set up the database', description: 'Install MongoDB and create schemas.', status: 'In Progress', priority: 'Medium' },
      { _id: '3', title: 'Deploy to production', description: 'Configure Render and Vercel.', status: 'Done', priority: 'Low', assignedUser: { username: 'John' }},
  ];

  return (
    <>
      <button onClick={logout} className="logout-btn">Logout</button>
      <h1>Collaborative To-Do Board</h1>
      <div className="board-page-container">
        <div className="board-main-content">
          <CreateTaskForm />
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <Board tasks={sampleTasks} />
          </DndContext>
        </div>
        <ActivityLog />
      </div>
    </>
  );
};

export default BoardPage;