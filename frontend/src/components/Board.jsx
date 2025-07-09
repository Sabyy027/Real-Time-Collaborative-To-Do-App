import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Column = ({ id, tasks, users }) => {
    const { setNodeRef } = useDroppable({ id });
    const taskIds = tasks.map(task => task._id);

    return (
        <SortableContext id={id} items={taskIds} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className="board-column">
                <h2>{id}</h2>
                <div className="task-list">
                    {tasks.map(task => (
                        <TaskCard key={task._id} task={task} users={users} />
                    ))}
                </div>
            </div>
        </SortableContext>
    );
};

const Board = ({ tasks, users }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <div className="board-container">
      {columns.map(columnId => (
        <Column 
            key={columnId} 
            id={columnId} 
            tasks={getTasksByStatus(columnId)}
            users={users}
        />
      ))}
    </div>
  );
};

export default Board;