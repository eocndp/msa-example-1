const express = require('express');
const Post = require('../models/post');
const router = express.Router();

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }
    next();
};

// Create a new post
router.post('/', checkAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.session.userId; // Get authorId from session
        const post = new Post({ title, content, authorId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        res.json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a post
router.put('/:id', checkAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        // Check if the logged-in user is the author
        if (post.authorId.toString() !== req.session.userId) {
            return res.status(403).send('Forbidden: You are not the author of this post');
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a post
router.delete('/:id', checkAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        // Check if the logged-in user is the author
        if (post.authorId.toString() !== req.session.userId) {
            return res.status(403).send('Forbidden: You are not the author of this post');
        }

        await Post.findByIdAndDelete(req.params.id);
        res.send('Post deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
