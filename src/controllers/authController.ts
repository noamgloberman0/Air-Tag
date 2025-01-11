import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET!);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, fullname, password, email } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, fullname, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("im here")
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
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ error: 'Invalid request' });
      }
      if (user.refreshToken !== token) {
        user.refreshToken = undefined;
        await user.save();
        return res.status(403).json({ error: 'Invalid request' });
      }
      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();
      res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
};

