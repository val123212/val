"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBot = void 0;
const telegraf_1 = require("telegraf");
const config_1 = require("../config/config");
const AuthService_1 = require("./AuthService");
class TelegramBot {
    constructor() {
        this.bot = new telegraf_1.Telegraf(config_1.config.botToken);
        this.authService = AuthService_1.AuthService.getInstance();
        this.setupCommands();
    }
    setupCommands() {
        this.bot.command('start', async (ctx) => {
            const args = ctx.message.text.split(' ');
            if (args.length !== 2) {
                return ctx.reply('Для авторизации перейдите на сайт и нажмите "Войти через Telegram"');
            }
            const authCode = args[1];
            try {
                const token = await this.authService.completeAuthSession(authCode, ctx.from);
                ctx.reply('Успешная авторизация! Можете вернуться на сайт.', { reply_markup: { inline_keyboard: [[{ text: 'Вернуться на сайт', url: config_1.config.frontendUrl }]] } });
            }
            catch (error) {
                ctx.reply('Произошла ошибка при авторизации. Попробуйте еще раз.');
            }
        });
    }
    launch() {
        this.bot.launch();
        console.log('Telegram bot started');
    }
    stop(signal) {
        this.bot.stop(signal);
    }
}
exports.TelegramBot = TelegramBot;
