
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
  role: 'student' | 'mentor' | 'teacher' | 'admin' | 'mentor_admin';
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
