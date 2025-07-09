import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({ username, password });
  if (user) {
    res.status(201).json({ _id: user._id, username: user.username, token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, username: user.username, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

// New function to get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('_id username');
  res.json(users);
};

export { registerUser, loginUser, getAllUsers };