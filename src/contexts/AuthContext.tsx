
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'mentor' | 'admin' | 'teacher' | 'mentor_admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, role?: string, avatar?: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => void;
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
        role: 'mentor_admin',
        avatar: '/placeholder.svg',
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    }
    
    // Add demo users for different roles
    const demoUsers: Record<string, {password: string, role: User['role'], avatar?: string}> = {
      'mentor': { password: '12345678', role: 'mentor', avatar: '/placeholder.svg' },
      'teacher': { password: '12345678', role: 'teacher', avatar: '/placeholder.svg' },
      'student': { password: '12345678', role: 'student', avatar: '/placeholder.svg' },
      'admin': { password: '12345678', role: 'admin', avatar: '/placeholder.svg' },
    };
    
    if (demoUsers[username.toLowerCase()] && demoUsers[username.toLowerCase()].password === password) {
      const role = demoUsers[username.toLowerCase()].role;
      const newUser: User = {
        id: Date.now().toString(),
        username: username,
        email: `${username.toLowerCase()}@example.com`,
        role: role,
        avatar: demoUsers[username.toLowerCase()].avatar,
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
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
  const register = async (
    username: string, 
    email: string, 
    password: string, 
    role: string = 'student',
    avatar?: string
  ): Promise<boolean> => {
    // In a real app, you would make an API call to register the user
    // For this demo, we'll simulate a successful registration
    const validRole = ['student', 'mentor', 'admin', 'teacher', 'mentor_admin'].includes(role) 
      ? role as User['role'] 
      : 'student';
      
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: validRole,
      avatar: avatar || '/placeholder.svg',
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUserProfile 
    }}>
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
