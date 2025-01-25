"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesRouter = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const router = (0, express_1.Router)();
// Middleware для проверки JWT
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await User_1.User.findOne({ telegramId: decoded.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.use(authMiddleware);
router.post('/', async (req, res) => {
    const { animeCode } = req.body;
    const user = req.user;
    try {
        if (!user.favorites.includes(animeCode)) {
            user.favorites.push(animeCode);
            await user.save();
        }
        res.json({ success: true, favorites: user.favorites });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:animeCode', async (req, res) => {
    const { animeCode } = req.params;
    const user = req.user;
    try {
        user.favorites = user.favorites.filter(code => code !== animeCode);
        await user.save();
        res.json({ success: true, favorites: user.favorites });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/', async (req, res) => {
    const user = req.user;
    res.json({ success: true, favorites: user.favorites });
});
exports.favoritesRouter = router;
