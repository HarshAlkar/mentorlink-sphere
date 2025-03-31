
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Users, Home, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-mentor to-mentee rounded-md p-1">
              <div className="bg-white rounded-sm p-1">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-mentor to-mentee">
                  ML
                </span>
              </div>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">MentorLink Sphere</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/courses" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link to="/mentors" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Users size={18} />
              <span>Mentors</span>
            </Link>
            <Link to="/schedule" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Calendar size={18} />
              <span>Schedule</span>
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-mentor to-mentee hover:from-mentor-dark hover:to-mentee-dark" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
          <div className="hidden md:block">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="animate-fade-in absolute top-16 left-0 right-0 bg-white shadow-md z-50 border-b">
          <nav className="flex flex-col py-4">
            <Link 
              to="/" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/courses" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link 
              to="/mentors" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Users size={18} />
              <span>Mentors</span>
            </Link>
            <Link 
              to="/schedule" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Calendar size={18} />
              <span>Schedule</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
