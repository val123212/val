export interface IUser {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  favorites: string[];
  lastLoginAt: Date;
}

export interface AuthSession {
  status: 'pending' | 'completed';
  createdAt: Date;
  user?: IUser;
}