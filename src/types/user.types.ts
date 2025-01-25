export interface User {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    favorites: string[];
  }
  
  export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
    status?: string;
  }