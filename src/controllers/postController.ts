import { Request, Response } from 'express';
import Post from '../models/post';

export const addPost = async (req: Request, res: Response) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostsBySender = async (req: Request, res: Response) => {
  try {
    const { sender } = req.query;
    const posts = await Post.find({ sender: sender});
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(post_id, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
