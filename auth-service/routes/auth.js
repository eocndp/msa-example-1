const express = require('express')
const User = require('../models/user')
const router = express.Router()

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = new User({ username, password })
        await user.save()
        res.status(201).send('User registered')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid credentials')
        }
        req.session.userId = user._id
        res.send('Logged in')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.')
        }
        res.send('Logged out')
    })
})

// Get user info
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated')
    }
    try {
        const user = await User.findById(req.session.userId).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
