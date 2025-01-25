import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';
import { IUser } from '../types';

export class AuthService {
  private static instance: AuthService;
  private authSessions: Map<string, { status: string; createdAt: Date; user?: IUser }>;

  private constructor() {
    this.authSessions = new Map();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public createAuthSession(): string {
    const authCode = Math.random().toString(36).substring(7);
    this.authSessions.set(authCode, {
      status: 'pending',
      createdAt: new Date()
    });
    return authCode;
  }

  public async completeAuthSession(authCode: string, telegramUser: any): Promise<string> {
    const session = this.authSessions.get(authCode);
    if (!session) throw new Error('Session not found');

    let user = await User.findOne({ telegramId: telegramUser.id });

    if (!user) {
      user = await User.create({
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.profile_photo_url,
        favorites: []
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    this.authSessions.set(authCode, {
      status: 'completed',
      createdAt: session.createdAt,
      user: user.toObject()
    });

    return jwt.sign({ userId: user.telegramId }, config.jwtSecret, { expiresIn: '7d' });
  }

  public getSession(authCode: string) {
    return this.authSessions.get(authCode);
  }

  public cleanupSessions() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    for (const [code, session] of this.authSessions) {
      if (session.createdAt < fiveMinutesAgo) {
        this.authSessions.delete(code);
      }
    }
  }
}