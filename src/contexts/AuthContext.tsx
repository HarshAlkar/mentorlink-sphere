
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'mentor' | 'admin' | 'teacher' | 'mentor_admin';
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    language?: string;
  };
  progress?: {
    coursesCompleted: number;
    certificatesEarned: number;
    totalPoints: number;
  };
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, role?: string, avatar?: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  refreshUserProgress: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Refresh user progress on login
        refreshUserProgress(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Calculate and update user progress
  const refreshUserProgress = (currentUser: User | null = user) => {
    if (!currentUser) return;
    
    try {
      // Get certificates earned
      const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      const userCertificates = certificates.filter((cert: any) => cert.userId === currentUser.id);
      
      // Get enrollments
      const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
      const userEnrollments = enrollments.filter((enroll: any) => enroll.userId === currentUser.id);
      
      // Calculate points (100 per certificate + progress on incomplete courses)
      let totalPoints = userCertificates.length * 100;
      
      userEnrollments.forEach((enrollment: any) => {
        // Add points for progress
        const progress = enrollment.progress || 0;
        totalPoints += Math.floor(progress * 0.5); // 0.5 point per percent completed
      });
      
      // Update user progress
      const updatedUser = {
        ...currentUser,
        progress: {
          coursesCompleted: userCertificates.length,
          certificatesEarned: userCertificates.length,
          totalPoints
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error refreshing user progress:", error);
    }
  };

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, hardcoded credentials
      if (username.toUpperCase() === 'HARSH' && password === '12345678') {
        const newUser: User = {
          id: '1',
          username: 'HARSH',
          email: 'harsh@example.com',
          role: 'mentor_admin',
          avatar: '/placeholder.svg',
          preferences: {
            theme: 'system',
            notifications: true,
            language: 'en'
          },
          progress: {
            coursesCompleted: 5,
            certificatesEarned: 5,
            totalPoints: 750
          }
        };
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        return true;
      }
      
      // Add demo users for different roles
      const demoUsers: Record<string, {
        password: string, 
        role: User['role'], 
        avatar?: string
        progress?: {
          coursesCompleted: number;
          certificatesEarned: number;
          totalPoints: number;
        }
      }> = {
        'mentor': { 
          password: '12345678', 
          role: 'mentor', 
          avatar: '/placeholder.svg',
          progress: {
            coursesCompleted: 12,
            certificatesEarned: 8,
            totalPoints: 1200
          }
        },
        'teacher': { 
          password: '12345678', 
          role: 'teacher', 
          avatar: '/placeholder.svg',
          progress: {
            coursesCompleted: 15,
            certificatesEarned: 10,
            totalPoints: 1500
          }
        },
        'student': { 
          password: '12345678', 
          role: 'student', 
          avatar: '/placeholder.svg',
          progress: {
            coursesCompleted: 3,
            certificatesEarned: 2,
            totalPoints: 350
          }
        },
        'admin': { 
          password: '12345678', 
          role: 'admin', 
          avatar: '/placeholder.svg',
          progress: {
            coursesCompleted: 20,
            certificatesEarned: 18,
            totalPoints: 2500
          }
        },
      };
      
      // Case-insensitive username comparison
      const lowerUsername = username.toLowerCase();
      const demoUserKey = Object.keys(demoUsers).find(
        key => key.toLowerCase() === lowerUsername
      );
      
      if (demoUserKey && demoUsers[demoUserKey].password === password) {
        const demoUserData = demoUsers[demoUserKey];
        const role = demoUserData.role;
        
        const newUser: User = {
          id: `user_${Date.now()}`,
          username: username,
          email: `${lowerUsername}@example.com`,
          role: role,
          avatar: demoUserData.avatar,
          preferences: {
            theme: 'system',
            notifications: true,
            language: 'en'
          },
          progress: demoUserData.progress
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        setIsAuthenticated(true);
        return true;
      }
      
      // Login failed
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password. Try using demo credentials (username: 'student', password: '12345678')."
      });
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred during login."
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    try {
      const validRole = ['student', 'mentor', 'admin', 'teacher', 'mentor_admin'].includes(role) 
        ? role as User['role'] 
        : 'student';
        
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        role: validRole,
        avatar: avatar || '/placeholder.svg',
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en'
        },
        progress: {
          coursesCompleted: 0,
          certificatesEarned: 0,
          totalPoints: 0
        }
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully."
      });
      
      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration. Please try again."
      });
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...updates };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update your profile. Please try again."
        });
      }
    }
  };

  // Update user preferences
  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      try {
        const updatedUser = { 
          ...user, 
          preferences: { 
            ...(user.preferences || {}), 
            ...preferences 
          } 
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Preferences updated",
          description: "Your preferences have been updated successfully."
        });
      } catch (error) {
        console.error("Error updating user preferences:", error);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update your preferences. Please try again."
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUserProfile,
      updateUserPreferences,
      refreshUserProgress
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
