
import { Session } from './types';
import { supabase, DbSession, DbMessage } from './supabase';
import { mapDbSessionToSession, mapDbMessageToMessage } from './databaseMappers';

export class SessionService {
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
      
      return mapDbSessionToSession(data as DbSession);
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
      
      const session = mapDbSessionToSession(sessionData as DbSession);
      session.messages = (messagesData as DbMessage[]).map(dbMsg => mapDbMessageToMessage(dbMsg));
      
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  async listSessionsByMentor(mentorId: string): Promise<Session[]> {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('mentor_id', mentorId);
      
      if (sessionError) throw sessionError;
      
      // Map the DB sessions to our interface type
      const sessions: Session[] = [];
      
      for (const dbSession of (sessionData as DbSession[])) {
        // Get messages for this session
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', dbSession.id);
        
        if (messagesError) throw messagesError;
        
        const session = mapDbSessionToSession(dbSession);
        session.messages = (messagesData as DbMessage[]).map(dbMsg => mapDbMessageToMessage(dbMsg));
        
        sessions.push(session);
      }
      
      return sessions;
    } catch (error) {
      console.error('Error listing sessions by mentor:', error);
      return [];
    }
  }
}
