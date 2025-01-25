"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const auth_1 = require("./routes/auth");
const favorites_1 = require("./routes/favorites");
const TelegramBot_1 = require("./services/TelegramBot");
const AuthService_1 = require("./services/AuthService");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.authRouter);
app.use('/api/favorites', favorites_1.favoritesRouter);
// Connect to MongoDB
mongoose_1.default.connect(config_1.config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Start Telegram bot
const bot = new TelegramBot_1.TelegramBot();
bot.launch();
// Start server
app.listen(config_1.config.port, () => {
    console.log(`Server is running on port ${config_1.config.port}`);
});
// Cleanup auth sessions periodically
setInterval(() => {
    AuthService_1.AuthService.getInstance().cleanupSessions();
}, 60000); // Every minute
// Handle graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
