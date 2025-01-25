"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const AuthService_1 = require("../services/AuthService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const router = (0, express_1.Router)();
const authService = AuthService_1.AuthService.getInstance();
router.post('/init', (req, res) => {
    const authCode = authService.createAuthSession();
    const authUrl = `https://t.me/${config_1.config.botUsername}?start=${authCode}`;
    res.json({ success: true, authUrl, authCode });
});
router.get('/status/:authCode', (req, res) => {
    const { authCode } = req.params;
    const session = authService.getSession(authCode);
    if (!session) {
        return res.json({ success: false, error: 'Session not found' });
    }
    if (Date.now() - session.createdAt.getTime() > 300000) {
        return res.json({ success: false, error: 'Session expired' });
    }
    if (session.status === 'completed' && session.user) {
        const token = jsonwebtoken_1.default.sign({ userId: session.user.telegramId }, config_1.config.jwtSecret, { expiresIn: '7d' });
        return res.json({ success: true, token, user: session.user });
    }
    res.json({ success: false, status: 'pending' });
});
exports.authRouter = router;
