import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { AuthContext } from '../context/AuthContext';
import { getTasks, updateTask, getActionLogs, getAllUsers } from '../services/api';
import Board from '../components/Board';
import CreateTaskForm from '../components/CreateTaskForm';
import ActivityLog from '../components/ActivityLog';

const socket = io(import.meta.env.VITE_API_URL);

const BoardPage = () => {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [popAnim, setPopAnim] = useState(null); // 'Done', 'In Progress', 'Todo', or null

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [tasksRes, logsRes, usersRes] = await Promise.all([getTasks(), getActionLogs(), getAllUsers()]);
        setTasks(tasksRes.data);
        setLogs(logsRes.data);
        setUsers(usersRes.data);
      } catch (error) { console.error("Failed to fetch initial data", error); }
    };
    fetchInitialData();

    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('task_created', (newTask) => setTasks(prev => [...prev, newTask]));
    socket.on('task_updated', (updatedTask) => setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t)));
    socket.on('task_deleted', (taskId) => setTasks(prev => prev.filter(t => t._id !== taskId)));
    socket.on('new_log', (newLog) => setLogs(prev => [newLog, ...prev].slice(0, 20)));

    return () => {
      socket.off('connect');
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
      socket.off('new_log');
    };
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    let overContainer = over.id;
    const taskInOverContainer = tasks.find(t => t._id === over.id);
    if (taskInOverContainer) {
      overContainer = taskInOverContainer.status;
    }
    const originalTask = tasks.find(t => t._id === active.id);
    if (!originalTask || originalTask.status === overContainer) return;
    const tasksBeforeUpdate = [...tasks];
    setTasks(prev => prev.map(t => t._id === active.id ? { ...t, status: overContainer } : t));
    try {
      await updateTask(active.id, { status: overContainer });
      setPopAnim(overContainer);
      setTimeout(() => setPopAnim(null), 1000);
    } catch (error) {
      console.error("API call to update task FAILED:", error);
      setTasks(tasksBeforeUpdate);
    }
  };

  // Animation JSX for each column
  const thumbsUp = (
    <div className="thumbs-up-anim">
      <span role="img" aria-label="thumbs up">👍</span>
    </div>
  );
  const loadingDots = (
    <div className="dots-anim" aria-label="loading">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
  const memoPop = (
    <div className="memo-anim">
      <span role="img" aria-label="memo">📝</span>
    </div>
  );

  return (
    <>
      <button onClick={logout} className="logout-btn">Logout</button>
      <h1>Collaborative To-Do Board</h1>
      <CreateTaskForm />
      <div className="board-page-container">
        <div className="board-wrapper" style={{ position: 'relative' }}>
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <Board 
              tasks={tasks} 
              users={users} 
              thumbsUp={popAnim === 'Done' ? thumbsUp : null}
              loadingDots={popAnim === 'In Progress' ? loadingDots : null}
              memoPop={popAnim === 'Todo' ? memoPop : null}
            />
          </DndContext>
        </div>
        <ActivityLog logs={logs} />
      </div>
    </>
  );
};

export default BoardPage;
