const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getAllUsers);

module.exports = router;