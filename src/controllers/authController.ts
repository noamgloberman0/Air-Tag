import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET!);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, fullname, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, fullname, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken });
  });
};
