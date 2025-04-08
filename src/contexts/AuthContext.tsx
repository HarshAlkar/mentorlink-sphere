
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/services/supabase';
import { database } from '@/services/database';

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

  // Check for existing Supabase session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          return;
        }
        
        if (session) {
          // Get user data from our database
          const dbUser = await database.getUserByEmail(session.user.email || '');
          
          if (dbUser) {
            const currentUser: User = {
              id: dbUser.id,
              username: dbUser.name,
              email: dbUser.email,
              avatar: dbUser.profilePicture,
              role: dbUser.role,
              // Default preferences
              preferences: {
                theme: 'system',
                notifications: true,
                language: 'en'
              }
            };
            
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Refresh user progress
            refreshUserProgress(currentUser);
          }
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user data from our database
          const dbUser = await database.getUserByEmail(session.user.email || '');
          
          if (dbUser) {
            const currentUser: User = {
              id: dbUser.id,
              username: dbUser.name,
              email: dbUser.email,
              avatar: dbUser.profilePicture,
              role: dbUser.role,
              preferences: {
                theme: 'system',
                notifications: true,
                language: 'en'
              }
            };
            
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Refresh user progress
            refreshUserProgress(currentUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Calculate and update user progress
  const refreshUserProgress = async (currentUser: User | null = user) => {
    if (!currentUser) return;
    
    try {
      // For demo purposes - in real implementation, this would query Supabase
      const certificates = await fetchUserCertificates(currentUser.id);
      const enrollments = await fetchUserEnrollments(currentUser.id);
      
      // Calculate points (100 per certificate + progress on incomplete courses)
      let totalPoints = certificates.length * 100;
      let coursesCompleted = certificates.length;
      
      enrollments.forEach((enrollment: any) => {
        // Add points for progress
        const progress = enrollment.progress || 0;
        totalPoints += Math.floor(progress * 0.5); // 0.5 point per percent completed
      });
      
      // Update user progress
      const updatedUser = {
        ...currentUser,
        progress: {
          coursesCompleted,
          certificatesEarned: certificates.length,
          totalPoints
        }
      };
      
      setUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing user progress:", error);
    }
  };

  // Helper functions for demo data
  const fetchUserCertificates = async (userId: string) => {
    // In a real implementation, this would query the certificates table
    return [];
  };
  
  const fetchUserEnrollments = async (userId: string) => {
    // In a real implementation, this would query the enrollments table
    return [];
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, still support demo users
      if (isDemoUser(email)) {
        return handleDemoLogin(email, password);
      }
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Invalid email or password."
        });
        return false;
      }
      
      // Successfully authenticated with Supabase
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
      return true;
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

  // Helper for demo users during transition to Supabase
  const isDemoUser = (username: string): boolean => {
    const demoUsers = ['mentor', 'teacher', 'student', 'admin', 'HARSH'];
    return demoUsers.includes(username.toUpperCase());
  };
  
  const handleDemoLogin = (username: string, password: string): boolean => {
    if (password !== '12345678') return false;
    
    // Case-insensitive username comparison
    const lowerUsername = username.toLowerCase();
    let role: User['role'] = 'student';
    
    if (lowerUsername === 'mentor') role = 'mentor';
    else if (lowerUsername === 'teacher') role = 'teacher';
    else if (lowerUsername === 'admin') role = 'admin';
    else if (username.toUpperCase() === 'HARSH') role = 'mentor_admin';
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username,
      email: `${lowerUsername}@example.com`,
      role: role,
      avatar: '/placeholder.svg',
      preferences: {
        theme: 'system',
        notifications: true,
        language: 'en'
      },
      progress: {
        coursesCompleted: role === 'student' ? 3 : (role === 'mentor' ? 12 : 15),
        certificatesEarned: role === 'student' ? 2 : (role === 'mentor' ? 8 : 10),
        totalPoints: role === 'student' ? 350 : (role === 'mentor' ? 1200 : 1500)
      }
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clean up local state
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout error",
        description: "An error occurred during logout."
      });
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
    try {
      // First register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Next, create the user in our users table with additional info
      const validRole = ['student', 'mentor', 'admin', 'teacher', 'mentor_admin'].includes(role) 
        ? role as User['role'] 
        : 'student';
      
      // In a real implementation, we would create the user in our database
      // For demo, simulate successful registration
      const newUser: User = {
        id: authData.user?.id || `user_${Date.now()}`,
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
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during registration. Please try again."
      });
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // In a real implementation, update the user in the database
      const updatedUser = { ...user, ...updates };
      
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
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    try {
      const updatedUser = { 
        ...user, 
        preferences: { 
          ...(user.preferences || {}), 
          ...preferences 
        } 
      };
      
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
