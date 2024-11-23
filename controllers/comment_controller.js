const Comment = require('../models/comments');

const create_comment = async (req, res) => {
    try {
        const { message, sender, post } = req.body;
        const new_comment = new Comment({ message, sender, post });
        await new_comment.save();
        res.status(201).json(new_comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update_comment = async (req, res) => {
    try {
        const { id, message } = req.body;
        const updated_comment = await Comment.findByIdAndUpdate(
            id,
            { message },
            { new: true }
        );
        if (!updated_comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(updated_comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const get_comments = async (req, res) => {
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const delete_comment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted_comment = await Comment.findByIdAndDelete(id);
        if (!deleted_comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    create_comment,
    update_comment,
    get_comments,
    delete_comment
}
