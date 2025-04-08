
import { Message, Session, User } from './types';
import { DbUser, DbSession, DbMessage } from './supabase';

export function mapDbUserToUser(dbUser: DbUser): User {
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

export function mapDbSessionToSession(dbSession: DbSession): Session {
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

export function mapDbMessageToMessage(dbMessage: DbMessage): Message {
  return {
    id: dbMessage.id,
    sessionId: dbMessage.session_id,
    sender: dbMessage.sender,
    text: dbMessage.text,
    timestamp: new Date(dbMessage.timestamp),
  };
}
