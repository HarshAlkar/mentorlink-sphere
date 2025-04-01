
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  MessageCircle, 
  Users, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  ScreenShare, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Settings 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Initial mock chat messages
const initialChatMessages = [
  { id: 'msg1', user: 'Dr. Maria Garcia', message: 'Welcome to our session!', time: '15:01', isInstructor: true },
  { id: 'msg2', user: 'Alex Chen', message: 'Thank you for accepting my session request!', time: '15:02', isInstructor: false },
];

const VideoSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Simulate loading session
    setLoading(true);
    setTimeout(() => {
      // First check local storage for sessions
      const storedSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
      let foundSession = storedSessions.find((s: any) => s.id === sessionId);
      
      // If not found in localStorage, check mock data
      if (!foundSession) {
        // Mock video session data
        const mockVideoSessions = [
          {
            id: 'video1',
            title: 'CSS Grid & Flexbox Masterclass',
            courseId: '1',
            instructor: 'Dr. Maria Garcia',
            thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
            description: 'Master modern CSS layout techniques with Grid and Flexbox.',
            duration: '45:00',
            scheduled: '2023-10-15T15:00:00Z',
            participants: [
              { id: 'user1', name: 'Alex Chen', avatar: '/placeholder.svg', role: 'student' },
              { id: 'user2', name: 'Sarah Johnson', avatar: '/placeholder.svg', role: 'student' },
              { id: 'user3', name: 'Dr. Maria Garcia', avatar: '/placeholder.svg', role: 'instructor' },
            ]
          },
          {
            id: 'video2',
            title: 'JavaScript Promises & Async/Await',
            courseId: '1',
            instructor: 'Robert Johnson',
            thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
            description: 'Learn how to work with asynchronous JavaScript using Promises and async/await.',
            duration: '60:00',
            scheduled: '2023-10-20T14:00:00Z',
            participants: [
              { id: 'user1', name: 'Alex Chen', avatar: '/placeholder.svg', role: 'student' },
              { id: 'user4', name: 'Robert Johnson', avatar: '/placeholder.svg', role: 'instructor' },
            ]
          },
        ];
        
        foundSession = mockVideoSessions.find(s => s.id === sessionId);
      }
      
      setSession(foundSession || null);
      setLoading(false);
      
      if (foundSession) {
        // Simulate a welcome message from the instructor
        if (foundSession.instructor && user?.username !== foundSession.instructor) {
          setTimeout(() => {
            const welcomeMessage = {
              id: `msg${Date.now()}`,
              user: foundSession.instructor,
              message: `Welcome to the ${foundSession.title} session! Let me know if you have any questions.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isInstructor: true,
            };
            setChatMessages(prev => [...prev, welcomeMessage]);
          }, 2000);
        }
      }
    }, 500);
  }, [sessionId, user?.username]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: `msg${Date.now()}`,
      user: user?.username || 'Anonymous',
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: user?.role === 'teacher' || user?.role === 'mentor',
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };
  
  const handleEndCall = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this session?");
    if (confirmEnd) {
      toast({
        title: "Session ended",
        description: "Your video session has been ended successfully."
      });
      navigate('/dashboard');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                  <p className="text-muted-foreground mb-6">
                    Please log in to join this video session.
                  </p>
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Loading Session...</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The video session you're looking for doesn't exist or you don't have permission to join it.
                  </p>
                  <Button asChild>
                    <Link to="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-900 text-white">
        <div className="container py-4 px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="text-white">
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Leave Session
                </Link>
              </Button>
              <div className="ml-4">
                <h1 className="text-xl font-bold tracking-tight">
                  {session.title}
                </h1>
                <p className="text-sm text-gray-300">
                  Instructor: {session.instructor}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <div className="bg-red-500 h-2 w-2 rounded-full mr-2"></div>
              <span className="mr-4">LIVE</span>
              <Button size="sm" variant="outline" className="border-gray-600 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="relative bg-black rounded-md overflow-hidden aspect-video mb-4">
                {/* This would be replaced with actual video component in a real app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-20 w-20 text-gray-700/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full h-10 w-10 p-0 bg-gray-800/90 border-gray-600"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full h-10 w-10 p-0 bg-gray-800/90 border-gray-600"
                      onClick={() => setVideoEnabled(!videoEnabled)}
                    >
                      {videoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`rounded-full h-10 w-10 p-0 bg-gray-800/90 border-gray-600 ${screenShareEnabled ? 'bg-blue-600' : ''}`}
                      onClick={() => setScreenShareEnabled(!screenShareEnabled)}
                    >
                      <ScreenShare className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full h-10 w-10 p-0 bg-gray-800/90 border-gray-600"
                      onClick={() => setSpeakerEnabled(!speakerEnabled)}
                    >
                      {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-full px-6"
                      onClick={handleEndCall}
                    >
                      End Call
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {session.participants && session.participants.map((participant: any) => (
                  <div key={participant.id} className="relative bg-gray-800 rounded-md overflow-hidden aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {participant.avatar ? (
                        <img 
                          src={participant.avatar} 
                          alt={participant.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          {participant.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs">
                      {participant.name} 
                      {(participant.role === 'instructor' || participant.role === 'teacher' || participant.role === 'mentor') && ' (Instructor)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2 bg-gray-800 text-white">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">Chat</TabsTrigger>
                  <TabsTrigger value="participants" className="data-[state=active]:bg-gray-700">Participants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="mt-0">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-0">
                      <div className="flex flex-col h-[calc(100vh-380px)] md:h-[60vh]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {chatMessages.map((msg) => (
                            <div key={msg.id} className="flex flex-col">
                              <div className="flex items-center">
                                <span className={`font-medium text-sm ${msg.isInstructor ? 'text-blue-300' : 'text-gray-300'}`}>
                                  {msg.user} {msg.isInstructor && '(Instructor)'}
                                </span>
                                <span className="text-gray-500 text-xs ml-2">{msg.time}</span>
                              </div>
                              <p className="text-sm mt-1">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 border-t border-gray-700">
                          <div className="flex gap-2">
                            <Textarea 
                              className="min-h-10 bg-gray-700 border-gray-600 resize-none"
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                            />
                            <Button 
                              className="shrink-0" 
                              size="sm"
                              onClick={sendMessage}
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="participants" className="mt-0">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Participants ({session.participants ? session.participants.length : 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 h-[calc(100vh-380px)] md:h-[60vh] overflow-y-auto pr-2">
                        {session.participants && session.participants.map((participant: any) => (
                          <div key={participant.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-700">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                {participant.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {participant.name}
                                  {(participant.role === 'instructor' || participant.role === 'teacher' || participant.role === 'mentor') && 
                                    <span className="ml-2 text-xs py-0.5 px-1.5 bg-blue-900 text-blue-200 rounded">Instructor</span>
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              <button className="p-1 text-gray-400 hover:text-white">
                                <Mic className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white">
                                <VideoIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoSession;
