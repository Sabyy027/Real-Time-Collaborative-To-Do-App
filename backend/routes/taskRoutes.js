const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getActionLogs,
  smartAssignTask
} = require('../controllers/taskController.js');

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/logs').get(protect, getActionLogs);
router.route('/:id/smart-assign').post(protect, smartAssignTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;