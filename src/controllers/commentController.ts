import { Request, Response } from 'express';
import Comment from '../models/comment';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sender, post } = req.body;
    const newComment = new Comment({ message, sender, post });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, message } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(id, { message }, { new: true }).exec();
    if (!updatedComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (id && id !== "{id}") {
      const comment = await Comment.findById(id).exec();
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      res.status(200).json(comment);
    } else {
      const comments = await Comment.find().exec();
      res.status(200).json(comments);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { post } = req.params;
    const comments = await Comment.find({ post }).exec();
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
