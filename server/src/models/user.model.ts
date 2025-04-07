import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  resetToken: String,
  resetTokenExpiry: Date
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export const User = mongoose.model<IUser>('User', userSchema)