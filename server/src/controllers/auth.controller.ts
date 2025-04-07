import { Context, Hono } from "hono";
import { User } from "../models/user.model";
import * as bcrypt from 'bcryptjs';
import { jwt, sign } from "hono/jwt";

interface AuthRequest {
  email: string;
  password: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; requirements: Record<string, boolean> } => {
  const requirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    specialCharacters: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = Object.values(requirements).every(Boolean);
  return { isValid, requirements };
};

const signupHandler = async (c: Context) => {
  const { email, password }: AuthRequest = await c.req.json();
  
  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  if (!validateEmail(email)) {
    return c.json({ error: 'Invalid email format' }, 400);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return c.json({
      error: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters',
      requirements: passwordValidation.requirements
    }, 400);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: 'Email already exists' }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    newUser.save();

    return c.json({ message: 'Signup successful' }, 201);
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return c.json({ error: 'Email already exists' }, 409);
    }
    console.error('Error creating user:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
};

const signinHandler = async (c: Context) => {
  const { email, password }: AuthRequest = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  try {
    const user = await User.findOne({ 
      email: email.toLowerCase()
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

   const token = await sign({ id: user.id.toString() }, process.env.JWT_SECRET!);

    return c.json({
      message: 'Signin successful',
      "token": token,
      user: {
        id: user.id,
        email: user.email
      }
    }, 200);
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: 'An error occurred during signin' }, 500);
  }
};

const getMe = async (c: Context) => {
  try {
    const user = c.get('user');
    return c.json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user data' }, 500);
  }
}

export { signupHandler, signinHandler, getMe };
