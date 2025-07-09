const Task = require('../models/taskModel.js');
const ActionLog = require('../models/actionLogModel.js');
const User = require('../models/userModel.js');

const logAction = async (userId, action, details, io) => {
  try {
    const newLog = await ActionLog.create({ user: userId, action, details });
    const populatedLog = await ActionLog.findById(newLog._id).populate('user', 'username');
    io.emit('new_log', populatedLog);
  } catch (error) { console.error('Error logging action:', error); }
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({}).populate('assignedUser', 'username');
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (['Todo', 'In Progress', 'Done'].includes(title)) return res.status(400).json({ message: 'Task title cannot be a column name' });
  try {
    const task = new Task({ title, description, priority, lastUpdatedBy: req.user._id });
    const createdTask = await task.save();
    await logAction(req.user._id, 'CREATE_TASK', `Created task "${title}"`, req.io);
    const populatedTask = await Task.findById(createdTask._id).populate('assignedUser', 'username');
    req.io.emit('task_created', populatedTask);
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: 'A task with this title probably already exists.' });
  }
};

const updateTask = async (req, res) => {
  const { lastKnownTimestamp, ...updateData } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (lastKnownTimestamp && new Date(lastKnownTimestamp).getTime() !== task.updatedAt.getTime()) {
    const currentTask = await Task.findById(req.params.id).populate('assignedUser', 'username');
    return res.status(409).json({ message: 'Conflict: This task was updated by someone else.', currentTask });
  }

  const oldStatus = task.status;
  const newStatus = updateData.status;

  Object.assign(task, updateData, { lastUpdatedBy: req.user._id });
  const updatedTask = await task.save();
  
  if (updateData.assignedUser) {
    const assignedToUser = await User.findById(updateData.assignedUser);
    await logAction(req.user._id, 'ASSIGN_TASK', `Assigned task "${task.title}" to ${assignedToUser.username}`, req.io);
  } else if (oldStatus !== newStatus && newStatus) {
    await logAction(req.user._id, 'MOVE_TASK', `Moved task "${task.title}" to ${newStatus}`, req.io);
  } else {
    await logAction(req.user._id, 'UPDATE_TASK', `Updated task "${task.title}"`, req.io);
  }

  const populatedTask = await Task.findById(updatedTask._id).populate('assignedUser', 'username');
  req.io.emit('task_updated', populatedTask);
  res.json(populatedTask);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const taskTitle = task.title;
    await task.deleteOne();
    await logAction(req.user._id, 'DELETE_TASK', `Deleted task "${taskTitle}"`, req.io);
    req.io.emit('task_deleted', req.params.id);
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

const getActionLogs = async (req, res) => {
  const logs = await ActionLog.find({}).sort({ createdAt: -1 }).limit(20).populate('user', 'username');
  res.json(logs);
};

const smartAssignTask = async (req, res) => {
  try {
    const taskToAssign = await Task.findById(req.params.id);
    if (!taskToAssign) return res.status(404).json({ message: 'Task not found' });
    const users = await User.find({});
    const activeTasks = await Task.find({ status: { $in: ['Todo', 'In Progress'] } });
    const userTaskCounts = users.reduce((acc, user) => ({ ...acc, [user._id.toString()]: 0 }), {});
    activeTasks.forEach(task => {
      if (task.assignedUser) userTaskCounts[task.assignedUser.toString()]++;
    });
    let userToAssignId = Object.keys(userTaskCounts).reduce((a, b) => userTaskCounts[a] < userTaskCounts[b] ? a : b);
    taskToAssign.assignedUser = userToAssignId;
    taskToAssign.lastUpdatedBy = req.user._id;
    await taskToAssign.save();
    const assignedUserDetails = await User.findById(userToAssignId);
    await logAction(req.user._id, 'SMART_ASSIGN', `Smart assigned task "${taskToAssign.title}" to ${assignedUserDetails.username}`, req.io);
    const populatedTask = await Task.findById(taskToAssign._id).populate('assignedUser', 'username');
    req.io.emit('task_updated', populatedTask);
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error during smart assign.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getActionLogs, smartAssignTask };