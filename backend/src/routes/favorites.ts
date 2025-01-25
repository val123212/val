import { Router, Request, Response, NextFunction } from 'express';
import { User, UserDocument } from '../models/User';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const router = Router();

// Расширяем интерфейс Request для добавления пользователя
interface AuthRequest extends Request {
  user?: UserDocument;
}

// Middleware для проверки JWT
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    const user = await User.findOne({ telegramId: decoded.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res: Response) => {
  const { animeCode } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  try {
    if (!user.favorites.includes(animeCode)) {
      user.favorites.push(animeCode);
      await user.save();
    }
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:animeCode', async (req: AuthRequest, res: Response) => {
  const { animeCode } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  try {
    user.favorites = user.favorites.filter((code: string) => code !== animeCode);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({ success: true, favorites: user.favorites });
});

export const favoritesRouter = router;