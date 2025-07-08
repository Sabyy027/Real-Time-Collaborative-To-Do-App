import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

// A new, small component for the column itself
const Column = ({ id, tasks }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className="board-column">
                <h2>{id}</h2>
                <div className="task-list">
                    {tasks.map(task => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </div>
            </div>
        </SortableContext>
    );
};


const Board = ({ tasks }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <div className="board-container">
      {columns.map(columnId => (
        <Column key={columnId} id={columnId} tasks={getTasksByStatus(columnId)} />
      ))}
    </div>
  );
};

export default Board;