
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Users, Award, Clock, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="container">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.username}!</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="text-mentor" size={20} />
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-500">Active courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="text-mentee" size={20} />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-gray-500">Upcoming sessions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="text-mentor" size={20} />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">8</p>
                <p className="text-sm text-gray-500">Active connections</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="text-mentee" size={20} />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-gray-500">Certificates earned</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your current learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Web Development Fundamentals</span>
                        <span className="text-sm text-gray-500">75%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-mentor rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Data Science Basics</span>
                        <span className="text-sm text-gray-500">45%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-mentee rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Machine Learning Concepts</span>
                        <span className="text-sm text-gray-500">30%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gradient-to-r from-mentor to-mentee rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">View All Courses</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentoring sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Career Guidance</h4>
                        <p className="text-sm text-gray-500">with John Smith</p>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>Today, 3:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Project Review</h4>
                        <p className="text-sm text-gray-500">with Sarah Johnson</p>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>Tomorrow, 1:30 PM</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Learning Path Discussion</h4>
                        <p className="text-sm text-gray-500">with Alex Cooper</p>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>Wed, 10:00 AM</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full">Schedule Session</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
