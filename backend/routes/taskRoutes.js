import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getActionLogs,
  smartAssignTask
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/logs').get(protect, getActionLogs);
router.route('/:id/smart-assign').post(protect, smartAssignTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

export default router;