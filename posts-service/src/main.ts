import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as redis from 'redis'
import * as express from 'express'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const redisClient = redis.createClient({
        url: 'redis://localhost:6379',
    })

    redisClient.on('error', (err) => {
        console.error('Redis error:', err)
    })

    redisClient.on('connect', () => {
        console.log('Connected to Redis')
    })

    await redisClient.connect()

    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: 'mySecretKey',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    )

    app.use(express.json())
    await app.listen(3002)
    console.log(`Posts service running on http://localhost:3002`)
}
bootstrap()
