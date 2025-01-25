import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env файл
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anime_website',
  botToken: process.env.BOT_TOKEN || '',
  botUsername: process.env.BOT_USERNAME || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key'
};

// Проверка обязательных переменных окружения
const requiredEnvVars = ['BOT_TOKEN', 'BOT_USERNAME'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});