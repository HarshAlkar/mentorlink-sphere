
// Types for our database entities
export interface Message {
  id: string;
  sessionId: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  messages: Message[];
  title?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'teacher' | 'admin';
  profilePicture?: string;
  bio?: string;
  expertise?: string[];
  joinDate: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  modules: CourseModule[];
  createdAt: Date;
  updatedAt: Date;
  price?: string;
  category: string;
  duration: string;
  studentsEnrolled: number;
  rating: number;
  reviews: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string;
  duration: string;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  progress: number;
  lastAccessedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string; 
  completionDate: string;
}

// Import Supabase client and types
import { supabase, DbUser, DbSession, DbMessage, DbCourse, DbCourseModule, DbLesson, DbEnrollment, DbCertificate } from './supabase';

// Database service using Supabase
class SupabaseDatabase {
  // User methods
  async createUser(user: Omit<User, 'id'>): Promise<User | undefined> {
    try {
      const { data, error } = await supabase.from('users').insert({
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: user.profilePicture,
        bio: user.bio,
        expertise: user.expertise,
        join_date: user.joinDate.toISOString(),
      }).select().single();
      
      if (error) throw error;
      
      return this.mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return undefined;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      
      if (error) throw error;
      
      return this.mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
      
      if (error) throw error;
      
      return this.mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.role) updateData.role = updates.role;
      if (updates.profilePicture) updateData.profile_picture = updates.profilePicture;
      if (updates.bio) updateData.bio = updates.bio;
      if (updates.expertise) updateData.expertise = updates.expertise;
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Session methods
  async createSession(session: Omit<Session, 'id' | 'messages'>): Promise<Session | undefined> {
    try {
      const { data, error } = await supabase.from('sessions').insert({
        mentor_id: session.mentorId,
        student_id: session.studentId,
        start_time: session.startTime.toISOString(),
        end_time: session.endTime?.toISOString() || null,
        status: session.status,
        title: session.title,
        description: session.description,
      }).select().single();
      
      if (error) throw error;
      
      return this.mapDbSessionToSession(data as DbSession);
    } catch (error) {
      console.error('Error creating session:', error);
      return undefined;
    }
  }

  async getSession(id: string): Promise<Session | undefined> {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Get messages for this session
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', id);
      
      if (messagesError) throw messagesError;
      
      const session = this.mapDbSessionToSession(sessionData as DbSession);
      session.messages = (messagesData as DbMessage[]).map(dbMsg => this.mapDbMessageToMessage(dbMsg));
      
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  // Helper methods to map DB types to our interface types
  private mapDbUserToUser(dbUser: DbUser): User {
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      profilePicture: dbUser.profile_picture,
      bio: dbUser.bio,
      expertise: dbUser.expertise,
      joinDate: new Date(dbUser.join_date),
    };
  }

  private mapDbSessionToSession(dbSession: DbSession): Session {
    return {
      id: dbSession.id,
      mentorId: dbSession.mentor_id,
      studentId: dbSession.student_id,
      startTime: new Date(dbSession.start_time),
      endTime: dbSession.end_time ? new Date(dbSession.end_time) : null,
      status: dbSession.status,
      messages: [],
      title: dbSession.title,
      description: dbSession.description,
    };
  }

  private mapDbMessageToMessage(dbMessage: DbMessage): Message {
    return {
      id: dbMessage.id,
      sessionId: dbMessage.session_id,
      sender: dbMessage.sender,
      text: dbMessage.text,
      timestamp: new Date(dbMessage.timestamp),
    };
  }

  // Add more methods as needed for other entities...
}

// Export singleton instance
export const database = new SupabaseDatabase();
