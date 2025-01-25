import { Telegraf } from 'telegraf';
import { config } from '../config/config';
import { AuthService } from './AuthService';

export class TelegramBot {
  private bot: Telegraf;
  private authService: AuthService;

  constructor() {
    this.bot = new Telegraf(config.botToken);
    this.authService = AuthService.getInstance();
    this.setupCommands();
  }

  private setupCommands() {
    this.bot.command('start', async (ctx) => {
      const args = ctx.message.text.split(' ');
      if (args.length !== 2) {
        return ctx.reply('Для авторизации перейдите на сайт и нажмите "Войти через Telegram"');
      }

      const authCode = args[1];
      try {
        const token = await this.authService.completeAuthSession(authCode, ctx.from);
        // Просто отправляем сообщение об успешной авторизации без кнопки
        ctx.reply('Авторизация успешна! Вы можете вернуться на сайт.');
      } catch (error) {
        console.error('Auth error:', error);
        ctx.reply('Произошла ошибка при авторизации. Попробуйте еще раз.');
      }
    });
  }

  public launch() {
    this.bot.launch();
    console.log('Telegram bot started');
  }

  public stop(signal: string) {
    this.bot.stop(signal);
  }
}