const Comment = require('../models/comments');

exports.create_comment = async (req, res) => {
    try {
        const { message, sender, post } = req.body;
        const new_comment = new Comment({ message, sender, post });
        await new_comment.save();
        res.status(201).json(new_comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
