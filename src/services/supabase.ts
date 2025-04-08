
import { createClient } from '@supabase/supabase-js';

// These values will be automatically injected after connecting your project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type DbUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'teacher' | 'admin' | 'mentor_admin';
  profile_picture?: string;
  bio?: string;
  expertise?: string[];
  join_date: string;
}

export type DbSession = {
  id: string;
  mentor_id: string;
  student_id: string;
  start_time: string;
  end_time: string | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  title?: string;
  description?: string;
}

export type DbMessage = {
  id: string;
  session_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type DbCourse = {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  price?: string;
  category: string;
  duration: string;
  students_enrolled: number;
  rating: number;
  reviews: number;
}

export type DbCourseModule = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
}

export type DbLesson = {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string;
  duration: string;
  order: number;
}

export type DbEnrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress: number;
  last_accessed_at: string;
}

export type DbCertificate = {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  completion_date: string;
}
