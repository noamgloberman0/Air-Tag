import { Request, Response } from 'express';
import Comment from '../models/comment';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { message, sender, post } = req.body;
    const newComment = new Comment({ message, sender, post });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id, message } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(id, { message }, { new: true });
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id) {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.status(200).json(comment);
    } else {
      const comments = await Comment.find();
      res.status(200).json(comments);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { post } = req.params;
    const comments = await Comment.find({ post });
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
