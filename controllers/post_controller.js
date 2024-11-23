const Post = require('../models/posts');

const add_post = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const get_all_posts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const get_post_by_id = async (req, res) => {
    try {
        const { post_id } = req.params;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const get_posts_by_sender = async (req, res) => {
    try {
        const { sender } = req.query;
        const posts = await Post.find({ sender });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update_post = async (req, res) => {
    try {
        const { post_id } = req.params;
        const updatedPost = await Post.findByIdAndUpdate(post_id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    add_post,
    get_all_posts,
    get_post_by_id,
    get_posts_by_sender,
    update_post
};
