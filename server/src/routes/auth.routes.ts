import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { signUp, signIn, getCurrentUser } from '../controllers/auth.controller'

const auth = new Hono()

// Public routes
auth.post('/signup', signUp)
auth.post('/signin', signIn)

// Protected routes
auth.use('/me', jwt({ secret: process.env.JWT_SECRET || 'super-secret-key' }))
auth.get('/me', getCurrentUser)

export default auth