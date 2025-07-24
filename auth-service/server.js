const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3001;

// Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

// Middleware
app.use(express.json());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true, only transmit cookie over https
            httpOnly: true, // if true, prevents client side JS from reading the cookie
            maxAge: 1000 * 60 * 60 * 24 // session max age in milliseconds
        }
    })
);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/auth-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
});
