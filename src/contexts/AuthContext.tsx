// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      password
    });
    
    const { user, session } = response.data;
    setUser(user);
    localStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3000/auth/register', {
      email,
      password
    });
    
    const { user, session } = response.data;
    setUser(user);
    localStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/auth/logout');
    setUser(null);
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Check session on mount and after refresh
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = localStorage.getItem('session');
        const storedUser = localStorage.getItem('user');
        
        if (!session || !storedUser) {
          return;
        }

        const sessionData = JSON.parse(session);
        const userData = JSON.parse(storedUser);

        // Check if session is expired (5 minutes timeout)
        const expiresAt = new Date(sessionData.expires_at).getTime();
        const now = new Date().getTime();
        
        if (now > expiresAt) {
          await logout();
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('Session check failed:', error);
        await logout();
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};