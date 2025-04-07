import { Context } from 'hono'
import { sign } from 'hono/jwt'
import * as bcrypt from 'bcryptjs'
import { User, IUser } from '../models/user.model'
import { randomBytes } from 'crypto'

interface AuthPayload {
  email: string
  password: string
}

interface JwtPayload {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export const signUp = async (c: Context) => {
  try {
    const { email, password }: AuthPayload = await c.req.json()
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({
      email,
      password: hashedPassword
    })
    
    await newUser.save()
    
    const token = await sign({ userId: (newUser._id as string).toString() }, JWT_SECRET)

    return c.json({ 
        "message": "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email
      }
    }, 201)
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 400)
  }
}

export const signIn = async (c: Context) => {
  try {
    const { email, password } = await c.req.json()
    
    const user = await User.findOne({ email })
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const token = await sign({ userId: (user._id as string).toString() }, JWT_SECRET)

    return c.json({ 
        "message": "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    })
  } catch (error) {
    return c.json({ error: 'Login failed' }, 400)
  }
}

export const getCurrentUser = async (c: Context) => {
  try {
    const jwtPayload = c.get('jwtPayload')
    const user = await User.findById(jwtPayload.userId).select('-password')
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json(user)
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

// Update the User model interface reference


// Fix the forgotPassword implementation
export const forgotPassword = async (c: Context) => {
  try {
    const { email } = await c.req.json()

    const user = await User.findOne({ email }) as IUser
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Add proper error handling for email sending
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    
    return c.json({ 
      message: 'Password reset instructions sent to email',
      resetToken // Remove in production
    }, 200)
  } catch (error) {
    return c.json({ error: 'Password reset failed' }, 500)
  }
}