import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const router = Router();
const authService = AuthService.getInstance();

// Добавим GET метод для тестирования
router.get('/init', (req: Request, res: Response) => {
  try {
    console.log('Received auth init GET request');
    const authCode = authService.createAuthSession();
    const authUrl = `https://t.me/${config.botUsername}?start=${authCode}`;
    console.log('Generated auth URL:', authUrl);
    res.json({ success: true, authUrl, authCode });
  } catch (error) {
    console.error('Error in auth init:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Оставляем также POST метод для использования в приложении
router.post('/init', (req: Request, res: Response) => {
  try {
    console.log('Received auth init POST request');
    const authCode = authService.createAuthSession();
    const authUrl = `https://t.me/${config.botUsername}?start=${authCode}`;
    console.log('Generated auth URL:', authUrl);
    res.json({ success: true, authUrl, authCode });
  } catch (error) {
    console.error('Error in auth init:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/status/:authCode', (req: Request, res: Response) => {
  try {
    const { authCode } = req.params;
    console.log('Checking status for auth code:', authCode);
    const session = authService.getSession(authCode);

    if (!session) {
      return res.json({ success: false, error: 'Session not found' });
    }

    if (Date.now() - session.createdAt.getTime() > 300000) {
      return res.json({ success: false, error: 'Session expired' });
    }

    if (session.status === 'completed' && session.user) {
      const token = jwt.sign({ userId: session.user.telegramId }, config.jwtSecret, { expiresIn: '7d' });
      console.log('Auth completed for user:', session.user.username);
      return res.json({ success: true, token, user: session.user });
    }

    res.json({ success: false, status: 'pending' });
  } catch (error) {
    console.error('Error in auth status check:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export const authRouter = router;