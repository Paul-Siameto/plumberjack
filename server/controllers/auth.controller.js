import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, token });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, token });
  } catch (e) { next(e); }
}

export async function getProfile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const updates = ['name', 'avatar', 'email'].reduce((acc, key) => {
      if (req.body[key]) acc[key] = req.body[key];
      return acc;
    }, {});
    if (req.body.password) updates.password = req.body.password;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    Object.assign(user, updates);
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (e) { next(e); }
}


