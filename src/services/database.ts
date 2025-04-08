
import { UserService } from './userService';
import { SessionService } from './sessionService';
import { User, Session } from './types';

// Database service using Supabase
class SupabaseDatabase {
  private userService: UserService;
  private sessionService: SessionService;

  constructor() {
    this.userService = new UserService();
    this.sessionService = new SessionService();
  }

  // User methods
  async createUser(user: Omit<User, 'id'>): Promise<User | undefined> {
    return this.userService.createUser(user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.userService.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userService.getUserByEmail(email);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    return this.userService.updateUser(id, updates);
  }

  // Session methods
  async createSession(session: Omit<Session, 'id' | 'messages'>): Promise<Session | undefined> {
    return this.sessionService.createSession(session);
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessionService.getSession(id);
  }

  async listSessionsByMentor(mentorId: string): Promise<Session[]> {
    return this.sessionService.listSessionsByMentor(mentorId);
  }

  // Add more methods as needed for other entities...
}

// Export singleton instance
export const database = new SupabaseDatabase();

// Re-export types for convenience
export * from './types';
