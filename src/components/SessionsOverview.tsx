
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video } from 'lucide-react';
import { database, Session } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for mentors
const mockMentors = {
  '1': {
    id: '1',
    name: 'Dr. Maria Garcia',
    avatar: '/placeholder.svg',
  },
  '2': {
    id: '2',
    name: 'Robert Johnson',
    avatar: '/placeholder.svg',
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status: Session['status']) => {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    case 'ongoing':
      return <Badge className="bg-green-500">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return null;
  }
};

const SessionsOverview = () => {
  const { user } = useAuth();
  
  // Mock sessions for demo (in a real app, these would come from the database)
  const mockSessions: Session[] = [
    {
      id: 'session1',
      mentorId: '1',
      studentId: user?.id || 'unknown',
      startTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // 2 days from now
      endTime: null,
      status: 'scheduled',
      messages: []
    },
    {
      id: 'session2',
      mentorId: '2',
      studentId: user?.id || 'unknown',
      startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      endTime: null,
      status: 'scheduled',
      messages: []
    }
  ];

  // In a real app, we would fetch sessions from the database
  // const sessions = user ? 
  //   (user.role === 'mentor' ? database.listSessionsByMentor(user.id) : database.listSessionsByStudent(user.id))
  //   : [];

  // For the prototype, use mock sessions
  const sessions = mockSessions;

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
            <Button className="mt-4 bg-mentor hover:bg-mentor-dark" asChild>
              <Link to="/mentors">Find a Mentor</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const mentor = mockMentors[session.mentorId as keyof typeof mockMentors];
        
        return (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={mentor?.avatar} alt={mentor?.name} />
                    <AvatarFallback>{mentor?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Session with {mentor?.name}</CardTitle>
                    <CardDescription>One-on-one mentorship</CardDescription>
                  </div>
                </div>
                {getStatusBadge(session.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>{formatDate(session.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>{formatTime(session.startTime)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {session.status === 'scheduled' && (
                    <Button size="sm" className="bg-mentor hover:bg-mentor-dark" asChild>
                      <Link to={`/mentors/${session.mentorId}/session`}>
                        <Video size={16} className="mr-1" />
                        Join Session
                      </Link>
                    </Button>
                  )}
                  {session.status === 'ongoing' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                      <Link to={`/mentors/${session.mentorId}/session`}>
                        <Video size={16} className="mr-1" />
                        Resume Session
                      </Link>
                    </Button>
                  )}
                  {session.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      View Recording
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SessionsOverview;
