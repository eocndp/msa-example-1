const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const postRoutes = require('./routes/posts')

const app = express()
const port = 3002

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
})

redisClient.on('error', (err) => {
    console.log('Redis error: ', err)
})

app.use(express.json())
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'mySecretKey', // Must be the same secret as auth-service
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)

// MongoDB connection
mongoose
    .connect('mongodb://localhost:27017/posts-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
    })

// Routes
app.use('/posts', postRoutes)

app.listen(port, () => {
    console.log(`Posts service listening at http://localhost:${port}`)
})
