
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Mentors from "./pages/Mentors";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MentorRequest from "./pages/MentorRequest";
import MentorSession from "./pages/MentorSession";
import MentorDashboard from "./pages/MentorDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import MentorAdminDashboard from "./pages/MentorAdminDashboard";
import CourseManagement from "./pages/CourseManagement";
import MentorManagement from "./pages/MentorManagement";
import StudentLeaderboard from "./pages/StudentLeaderboard";
import DocumentPage from "./pages/DocumentPage";
import VideoSession from "./pages/VideoSession";
import QuizPage from "./pages/QuizPage";
import AssignmentPage from "./pages/AssignmentPage";
import Certificates from "./pages/Certificates";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/mentors/:id/request" element={<MentorRequest />} />
              <Route path="/mentors/:id/session" element={<MentorSession />} />
              
              {/* Role-specific routes */}
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
              <Route path="/mentor-admin/dashboard" element={<MentorAdminDashboard />} />
              
              {/* Course and content management routes */}
              <Route path="/course-management" element={<CourseManagement />} />
              <Route path="/mentor-management" element={<MentorManagement />} />
              
              {/* Content type routes */}
              <Route path="/document/:documentId" element={<DocumentPage />} />
              <Route path="/video/:videoId" element={<VideoSession />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/assignment/:assignmentId" element={<AssignmentPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
