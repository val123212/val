import mongoose, { Document } from 'mongoose';
import { IUser } from '../types';

export interface UserDocument extends IUser, Document {}

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  photoUrl: String,
  favorites: [String],
  lastLoginAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const User = mongoose.model<UserDocument>('User', UserSchema);