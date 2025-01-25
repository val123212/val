"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const User_1 = require("../models/User");
class AuthService {
    constructor() {
        this.authSessions = new Map();
    }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    createAuthSession() {
        const authCode = Math.random().toString(36).substring(7);
        this.authSessions.set(authCode, {
            status: 'pending',
            createdAt: new Date()
        });
        return authCode;
    }
    async completeAuthSession(authCode, telegramUser) {
        const session = this.authSessions.get(authCode);
        if (!session)
            throw new Error('Session not found');
        let user = await User_1.User.findOne({ telegramId: telegramUser.id });
        if (!user) {
            user = await User_1.User.create({
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
        return jsonwebtoken_1.default.sign({ userId: user.telegramId }, config_1.config.jwtSecret, { expiresIn: '7d' });
    }
    getSession(authCode) {
        return this.authSessions.get(authCode);
    }
    cleanupSessions() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        for (const [code, session] of this.authSessions) {
            if (session.createdAt < fiveMinutesAgo) {
                this.authSessions.delete(code);
            }
        }
    }
}
exports.AuthService = AuthService;
