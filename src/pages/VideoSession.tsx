
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Video, Mic, MicOff, VideoOff, Users, MessageSquare, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const VideoSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to join a video session",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Fetch session details
    const storedSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
    const foundSession = storedSessions.find((s: any) => s.id === sessionId);

    if (!foundSession) {
      toast({
        title: "Session Not Found",
        description: "The requested session does not exist or has ended",
        variant: "destructive",
      });
      navigate("/schedule");
      return;
    }

    setSession(foundSession);

    // Add current user to participants
    const sessionParticipants = foundSession.participants || [];
    if (user && !sessionParticipants.includes(user.id)) {
      sessionParticipants.push(user.id);
    }
    
    setParticipants(sessionParticipants);

    // Save updated participants list
    const updatedSessions = storedSessions.map((s: any) => {
      if (s.id === sessionId) {
        return { ...s, participants: sessionParticipants };
      }
      return s;
    });
    
    localStorage.setItem('videoSessions', JSON.stringify(updatedSessions));

    // Simulate connection after a brief delay
    const timer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Notify others that user joined
      toast({
        title: "Connected to Session",
        description: `You've joined "${foundSession.title}"`,
      });
      
      // Initialize WebRTC (simplified mock version)
      initializeWebRTC();
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Clean up WebRTC connections
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      // Stop all media tracks
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const mediaStream = localVideoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [sessionId, user, navigate, toast]);

  const initializeWebRTC = async () => {
    try {
      // Request user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      
      // In a real implementation, we would:
      // 1. Create a peer connection
      // 2. Add tracks from the media stream
      // 3. Create an offer and exchange SDP with the remote peer
      // 4. Handle ICE candidates
      
      // For this demo, we're just displaying the local stream
      // and will simulate the remote peer connection
      
      // Simulate remote peer after a delay (for demo purposes)
      setTimeout(() => {
        // In a real implementation, this would come from the remote peer
        // For demo purposes, we'll just use the local stream as a placeholder
        if (remoteVideoRef.current && participants.length > 1) {
          remoteVideoRef.current.srcObject = mediaStream;
        }
      }, 3000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera or microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const mediaStream = localVideoRef.current.srcObject as MediaStream;
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const mediaStream = localVideoRef.current.srcObject as MediaStream;
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const mediaStream = localVideoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach(track => track.stop());
    }
    
    // Remove user from participants
    const storedSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
    const updatedSessions = storedSessions.map((s: any) => {
      if (s.id === sessionId && user) {
        const updatedParticipants = (s.participants || []).filter(
          (p: string) => p !== user.id
        );
        return { ...s, participants: updatedParticipants };
      }
      return s;
    });
    
    localStorage.setItem('videoSessions', JSON.stringify(updatedSessions));
    
    toast({
      title: "Call Ended",
      description: "You have left the video session",
    });
    
    navigate("/schedule");
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Connecting to Session...</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="animate-pulse h-16 w-16 rounded-full bg-primary/50 flex items-center justify-center">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-center text-muted-foreground">
                Please wait while we establish your connection...
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Session header */}
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{session?.title || "Video Session"}</h1>
                <p className="text-sm text-gray-500">
                  {session?.instructor || session?.mentor || "Instructor"} • 
                  {session?.scheduled ? new Date(session.scheduled).toLocaleString() : "Live Session"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  Live
                </span>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-1" />
                  <span>{participants.length} participants</span>
                </div>
              </div>
            </div>

            {/* Video grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Local video */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="rounded-full bg-gray-700 w-24 h-24 flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    You {!isMicOn && "(Muted)"}
                  </div>
                </div>

                {/* Remote video (only show if there are other participants) */}
                {participants.length > 1 ? (
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {session?.instructor || session?.mentor || "Other participant"}
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Users size={48} className="mx-auto mb-2" />
                      <p>Waiting for others to join...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  variant={isMicOn ? "outline" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </Button>
                <Button
                  variant={isVideoOn ? "outline" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video /> : <VideoOff />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={endCall}
                >
                  <Phone className="rotate-135" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat section - can be expanded for real implementation */}
          <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold flex items-center">
                <MessageSquare className="mr-2" size={20} />
                Chat
              </h2>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <p className="text-center text-gray-500">
                Chat functionality would be implemented here in a real application.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoSession;
