
import { User } from './types';
import { supabase, DbUser } from './supabase';
import { mapDbUserToUser } from './databaseMappers';

export class UserService {
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
      
      return mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return undefined;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      
      if (error) throw error;
      
      return mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
      
      if (error) throw error;
      
      return mapDbUserToUser(data as DbUser);
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
      
      return mapDbUserToUser(data as DbUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }
}
