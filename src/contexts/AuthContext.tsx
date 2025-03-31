
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'mentor' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, hardcoded credentials
    if (username === 'HARSH' && password === '12345678') {
      const newUser: User = {
        id: '1',
        username: 'HARSH',
        email: 'harsh@example.com',
        role: 'admin',
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call to register the user
    // For this demo, we'll simulate a successful registration
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'student',
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
