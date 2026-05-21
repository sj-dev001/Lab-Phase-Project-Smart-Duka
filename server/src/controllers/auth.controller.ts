import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

function generateToken(id: string): string {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
}

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ success: false, message: 'Email already in use' });
    return;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    data: { user, token },
    message: 'Registration successful',
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ success: false, message: 'Account suspended' });
    return;
  }

  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    data: { user, token },
    message: 'Login successful',
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user!.id);
  res.json({
    success: true,
    data: user,
  });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, message: 'Logged out' });
}
