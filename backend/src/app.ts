import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/config';
import { authRouter } from './routes/auth';
import { favoritesRouter } from './routes/favorites';
import { TelegramBot } from './services/TelegramBot';
import { AuthService } from './services/AuthService';

const app = express();

// Логгер запросов
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Настройка CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Базовый роут для проверки работы сервера
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Роут для проверки здоровья сервера
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Обработка несуществующих роутов
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Подключение к MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Настройка завершения работы при отключении MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Запуск сервера
const port = config.port || 3001;
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log(`Frontend URL: ${config.frontendUrl}`);
});

// Запуск Telegram бота
const bot = new TelegramBot();
bot.launch();

// Периодическая очистка сессий авторизации
const CLEANUP_INTERVAL = 60000; // 1 минута
setInterval(() => {
  try {
    AuthService.getInstance().cleanupSessions();
  } catch (error) {
    console.error('Error during session cleanup:', error);
  }
}, CLEANUP_INTERVAL);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    
    bot.stop(signal);
    console.log('Telegram bot stopped');
    
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    }).catch((err) => {
      console.error('Error during MongoDB shutdown:', err);
      process.exit(1);
    });
  });

  // Принудительное завершение через 10 секунд
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обработка необработанных ошибок
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

export default app;