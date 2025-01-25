import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  addToFavorites: (animeCode: string) => Promise<void>;
  removeFromFavorites: (animeCode: string) => Promise<void>;
  isInFavorites: (animeCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация: проверяем, есть ли сохраненный пользователь
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Получаем URL для авторизации через Telegram
      const authUrl = await authService.initAuth();
      const authCode = authUrl.split('start=')[1];
      
      // Открываем Telegram в новом окне с заданными размерами
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        authUrl,
        'Telegram Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Начинаем проверять статус авторизации
      const checkAuthStatus = async () => {
        try {
          const response = await authService.checkAuthStatus(authCode);
          console.log('Auth status response:', response);
          
          if (response.success && response.user) {
            setUser(response.user);
            setLoading(false);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error checking auth status:', error);
          return false;
        }
      };

      // Функция для периодической проверки статуса
      const pollAuthStatus = async () => {
        let attempts = 0;
        const maxAttempts = 150; // 5 минут (150 попыток * 2 секунды)
        
        const interval = setInterval(async () => {
          attempts++;
          
          const isAuthenticated = await checkAuthStatus();
          if (isAuthenticated) {
            clearInterval(interval);
            console.log('Authentication successful');
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setError('Время ожидания авторизации истекло. Попробуйте еще раз.');
            setLoading(false);
          }
        }, 2000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
      };

      pollAuthStatus();
    } catch (error) {
      console.error('Error during login:', error);
      setError('Произошла ошибка при авторизации. Попробуйте еще раз.');
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const addToFavorites = async (animeCode: string) => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.addToFavorites(animeCode);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Не удалось добавить аниме в избранное');
    }
  };

  const removeFromFavorites = async (animeCode: string) => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.removeFromFavorites(animeCode);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError('Не удалось удалить аниме из избранного');
    }
  };

  const isInFavorites = (animeCode: string): boolean => {
    return user?.favorites?.includes(animeCode) || false;
  };

  // Значение контекста
  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    addToFavorites,
    removeFromFavorites,
    isInFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;