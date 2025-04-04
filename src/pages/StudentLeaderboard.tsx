
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Clock, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Type definitions for leaderboard entries
type LeaderboardEntry = {
  userId: string;
  username: string;
  avatar?: string;
  coursesCompleted: number;
  totalPoints: number;
  lastActivity: string;
};

type IncompleteEntry = {
  userId: string;
  username: string;
  avatar?: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  lastActivity: string;
};

// Define the demo user type to ensure it matches what we need
type DemoUser = {
  id: string;
  username: string;
  avatar: string;
  role: string;
};

const StudentLeaderboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [incomplete, setIncomplete] = useState<IncompleteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('completed');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to view leaderboards",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Fetch leaderboard data - in a real app this would be from an API
    const fetchLeaderboardData = () => {
      setLoading(true);

      // Get all enrollments from localStorage
      const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
      
      // Get all certificates from localStorage
      const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      
      // Get all users for the leaderboard
      const userIds = new Set<string>();
      [...enrollments, ...certificates].forEach(item => {
        if (item.userId) userIds.add(item.userId);
      });
      
      // Demo data for additional users to make the leaderboard more interesting
      const demoUsers: DemoUser[] = [
        { id: 'user1', username: 'JohnDoe', avatar: '/placeholder.svg', role: 'student' },
        { id: 'user2', username: 'AliceSmith', avatar: '/placeholder.svg', role: 'student' },
        { id: 'user3', username: 'BobJohnson', avatar: '/placeholder.svg', role: 'student' },
        { id: 'user4', username: 'EmmaWilson', avatar: '/placeholder.svg', role: 'student' },
        { id: 'user5', username: 'MichaelBrown', avatar: '/placeholder.svg', role: 'student' },
      ];
      
      // Combine real users with demo data
      const allUsers: (DemoUser | typeof user)[] = [...demoUsers];
      
      // Add the current user with avatar defaulting to placeholder if not available
      if (user) {
        allUsers.push({
          id: user.id,
          username: user.username,
          avatar: user.avatar || '/placeholder.svg',
          role: user.role,
        });
      }
      
      // Create leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = allUsers.map(u => {
        // Count completed courses
        const userCertificates = certificates.filter((c: any) => c.userId === u.id);
        
        // Calculate total points (arbitrary scoring for demo)
        const totalPoints = userCertificates.length * 100 + Math.floor(Math.random() * 300);
        
        return {
          userId: u.id,
          username: u.username,
          avatar: u.avatar,
          coursesCompleted: userCertificates.length,
          totalPoints,
          lastActivity: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString()
        };
      });
      
      // Add some random completed courses to the demo users
      leaderboardEntries.forEach((entry, index) => {
        if (entry.userId !== user?.id) {
          entry.coursesCompleted = Math.floor(Math.random() * 5) + 1;
          entry.totalPoints = entry.coursesCompleted * 100 + Math.floor(Math.random() * 300);
        }
      });
      
      // Sort by points (highest first)
      leaderboardEntries.sort((a, b) => b.totalPoints - a.totalPoints);
      
      // Create incomplete courses entries
      const incompleteEntries: IncompleteEntry[] = [];
      
      enrollments.forEach((enrollment: any) => {
        // Skip completed enrollments
        if (enrollment.completedAt) return;
        
        // Find user
        const enrolledUser = allUsers.find(u => u.id === enrollment.userId);
        if (!enrolledUser) return;
        
        // Find course (using mock data since we don't have a real database)
        const mockCourses = [
          { id: '1', title: 'Introduction to Web Development' },
          { id: '2', title: 'Data Science Fundamentals with Python' },
        ];
        
        const course = mockCourses.find(c => c.id === enrollment.courseId);
        if (!course) return;
        
        incompleteEntries.push({
          userId: enrolledUser.id,
          username: enrolledUser.username,
          avatar: enrolledUser.avatar,
          courseId: course.id,
          courseTitle: course.title,
          progress: enrollment.progress || Math.floor(Math.random() * 70),
          lastActivity: enrollment.lastAccessedAt || new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString()
        });
      });
      
      // Add demo incomplete entries
      demoUsers.forEach(demoUser => {
        // Skip if user already has incomplete entries
        const hasEntries = incompleteEntries.some(entry => entry.userId === demoUser.id);
        if (hasEntries) return;
        
        // Add 1-3 random incomplete courses
        const numCourses = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numCourses; i++) {
          const courseId = Math.random() > 0.5 ? '1' : '2';
          const courseTitle = courseId === '1' ? 'Introduction to Web Development' : 'Data Science Fundamentals with Python';
          
          incompleteEntries.push({
            userId: demoUser.id,
            username: demoUser.username,
            avatar: demoUser.avatar,
            courseId,
            courseTitle,
            progress: Math.floor(Math.random() * 70),
            lastActivity: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString()
          });
        }
      });
      
      // Sort by progress (lowest first)
      incompleteEntries.sort((a, b) => a.progress - b.progress);
      
      setLeaderboard(leaderboardEntries);
      setIncomplete(incompleteEntries);
      setLoading(false);
    };

    fetchLeaderboardData();

    // Set up interval to refresh data every 30 seconds for "real-time" effect
    const interval = setInterval(fetchLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, [user, navigate, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  // Get user position in leaderboard
  const getUserPosition = () => {
    if (!user) return null;
    const position = leaderboard.findIndex(entry => entry.userId === user.id) + 1;
    return position ? position : null;
  };

  // Get user's incomplete entry
  const getUserIncomplete = () => {
    if (!user) return [];
    return incomplete.filter(entry => entry.userId === user.id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Student Leaderboard</h1>
            {getUserPosition() && (
              <div className="bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-2 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                <span>Your Rank: #{getUserPosition()}</span>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="completed">
                <Check className="mr-2 h-4 w-4" />
                Completion Leaderboard
              </TabsTrigger>
              <TabsTrigger value="incomplete">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Incomplete Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Top Course Completers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading leaderboard data...</div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8">
                      No course completion data available yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Rank</th>
                            <th className="text-left py-3 px-4">Student</th>
                            <th className="text-center py-3 px-4">Courses Completed</th>
                            <th className="text-center py-3 px-4">Points</th>
                            <th className="text-right py-3 px-4">Last Activity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry, index) => (
                            <tr 
                              key={entry.userId} 
                              className={`border-b hover:bg-gray-50 ${entry.userId === user?.id ? 'bg-primary/5' : ''}`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <span className={`
                                    ${index === 0 ? 'text-amber-500 font-bold' : ''}
                                    ${index === 1 ? 'text-gray-500 font-bold' : ''}
                                    ${index === 2 ? 'text-amber-700 font-bold' : ''}
                                  `}>
                                    #{index + 1}
                                  </span>
                                  {index < 3 && (
                                    <Award 
                                      className={`ml-1 h-4 w-4
                                        ${index === 0 ? 'text-amber-500' : ''}
                                        ${index === 1 ? 'text-gray-500' : ''}
                                        ${index === 2 ? 'text-amber-700' : ''}
                                      `}
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={entry.avatar || '/placeholder.svg'} />
                                    <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <span className={entry.userId === user?.id ? 'font-semibold' : ''}>
                                    {entry.username}
                                    {entry.userId === user?.id && <span className="ml-2 text-xs text-primary">(You)</span>}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm">
                                  {entry.coursesCompleted}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center font-semibold">
                                {entry.totalPoints}
                              </td>
                              <td className="py-4 px-4 text-right text-gray-500 text-sm">
                                <div className="flex items-center justify-end">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatDate(entry.lastActivity)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incomplete">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                    Courses In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading course data...</div>
                  ) : incomplete.length === 0 ? (
                    <div className="text-center py-8">
                      No incomplete courses found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Student</th>
                            <th className="text-left py-3 px-4">Course</th>
                            <th className="text-center py-3 px-4">Progress</th>
                            <th className="text-right py-3 px-4">Last Activity</th>
                            <th className="text-right py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomplete.map((entry) => (
                            <tr 
                              key={`${entry.userId}-${entry.courseId}`} 
                              className={`border-b hover:bg-gray-50 ${entry.userId === user?.id ? 'bg-primary/5' : ''}`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarImage src={entry.avatar || '/placeholder.svg'} />
                                    <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <span className={entry.userId === user?.id ? 'font-semibold' : ''}>
                                    {entry.username}
                                    {entry.userId === user?.id && <span className="ml-2 text-xs text-primary">(You)</span>}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {entry.courseTitle}
                              </td>
                              <td className="py-4 px-4">
                                <div className="w-full flex flex-col gap-1">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{entry.progress}%</span>
                                  </div>
                                  <Progress value={entry.progress} className="h-2" />
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right text-gray-500 text-sm">
                                <div className="flex items-center justify-end">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatDate(entry.lastActivity)}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Button 
                                  size="sm"
                                  variant={entry.userId === user?.id ? "default" : "outline"}
                                  disabled={entry.userId !== user?.id}
                                  onClick={() => navigate(`/course/${entry.courseId}`)}
                                >
                                  Continue
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {user && getUserIncomplete().length === 0 && (
                <div className="mt-6 text-center p-6 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium mb-2">You don't have any incomplete courses!</h3>
                  <p className="text-gray-600 mb-4">
                    Browse our course catalog to find new courses to enroll in.
                  </p>
                  <Button onClick={() => navigate('/courses')}>
                    Explore Courses
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentLeaderboard;
