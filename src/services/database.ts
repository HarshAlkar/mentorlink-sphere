
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

// In-memory database (this would be a real database in production)
class InMemoryDatabase {
  private sessions: Session[] = [];
  private messages: Message[] = [];

  // Session methods
  createSession(session: Omit<Session, 'id' | 'messages'>): Session {
    const id = `session_${Date.now()}`;
    const newSession: Session = { 
      ...session, 
      id, 
      messages: []
    };
    this.sessions.push(newSession);
    return newSession;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.find(session => session.id === id);
  }

  updateSession(id: string, updates: Partial<Session>): Session | undefined {
    const sessionIndex = this.sessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) return undefined;
    
    this.sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...updates };
    return this.sessions[sessionIndex];
  }

  listSessionsByMentor(mentorId: string): Session[] {
    return this.sessions.filter(session => session.mentorId === mentorId);
  }

  listSessionsByStudent(studentId: string): Session[] {
    return this.sessions.filter(session => session.studentId === studentId);
  }

  // Message methods
  addMessage(message: Omit<Message, 'id'>): Message {
    const id = `msg_${Date.now()}`;
    const newMessage: Message = { ...message, id };
    this.messages.push(newMessage);
    
    // Add reference to session
    const session = this.getSession(message.sessionId);
    if (session) {
      session.messages.push(newMessage);
    }
    
    return newMessage;
  }

  getSessionMessages(sessionId: string): Message[] {
    return this.messages.filter(message => message.sessionId === sessionId);
  }
}

// Export singleton instance
export const database = new InMemoryDatabase();
