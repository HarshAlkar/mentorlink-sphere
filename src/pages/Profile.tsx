
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, BookOpen, Calendar, Shield, Bell, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your profile information has been updated.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col items-center py-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt={user?.username} />
                    <AvatarFallback className="text-2xl">{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{user?.username}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="mt-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="space-y-1 p-3">
                  <Button 
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Information
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                  <Button 
                    variant={activeTab === 'courses' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('courses')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Courses
                  </Button>
                  <Button 
                    variant={activeTab === 'sessions' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('sessions')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Sessions
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={user?.username} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself" rows={4} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profileImage">Profile Image</Label>
                        <Input id="profileImage" type="file" />
                      </div>
                      
                      <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <Bell className="mr-2 h-5 w-5" />
                          Notification Settings
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="emailNotifications" className="rounded" defaultChecked />
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="sessionReminders" className="rounded" defaultChecked />
                            <Label htmlFor="sessionReminders">Session Reminders</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="courseUpdates" className="rounded" defaultChecked />
                            <Label htmlFor="courseUpdates">Course Updates</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <Shield className="mr-2 h-5 w-5" />
                          Password & Security
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Account Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="darkMode" className="rounded" />
                            <Label htmlFor="darkMode">Enable Dark Mode</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="twoFactorAuth" className="rounded" />
                            <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleSaveChanges}>Save Settings</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Courses</CardTitle>
                      <CardDescription>Courses you're enrolled in or teaching</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">Web Development Fundamentals</h4>
                              <p className="text-sm text-gray-500">Instructor: John Smith</p>
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">In Progress</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Continue</Button>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm flex justify-between mb-1">
                              <span>Progress</span>
                              <span>75%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-mentor rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">Data Science Basics</h4>
                              <p className="text-sm text-gray-500">Instructor: Sarah Johnson</p>
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">In Progress</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Continue</Button>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm flex justify-between mb-1">
                              <span>Progress</span>
                              <span>45%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-mentee rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">Machine Learning Concepts</h4>
                              <p className="text-sm text-gray-500">Instructor: Alex Cooper</p>
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">In Progress</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Continue</Button>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm flex justify-between mb-1">
                              <span>Progress</span>
                              <span>30%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-gradient-to-r from-mentor to-mentee rounded-full" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sessions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduled Sessions</CardTitle>
                      <CardDescription>Your upcoming and past mentoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="upcoming">
                        <TabsList className="mb-4">
                          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                          <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upcoming">
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">Career Guidance</h4>
                                  <p className="text-sm text-gray-500">Mentor: John Smith</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <Calendar size={16} className="mr-1" />
                                    <span>Today, 3:00 PM (30 minutes)</span>
                                  </div>
                                </div>
                                <Button size="sm">Join</Button>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">Project Review</h4>
                                  <p className="text-sm text-gray-500">Mentor: Sarah Johnson</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <Calendar size={16} className="mr-1" />
                                    <span>Tomorrow, 1:30 PM (45 minutes)</span>
                                  </div>
                                </div>
                                <Button size="sm">Join</Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="past">
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">Technical Interview Prep</h4>
                                  <p className="text-sm text-gray-500">Mentor: Alex Cooper</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <Calendar size={16} className="mr-1" />
                                    <span>May 15, 2:00 PM (60 minutes)</span>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">View Notes</Button>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">Course Selection Guidance</h4>
                                  <p className="text-sm text-gray-500">Mentor: Emma Wilson</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <Calendar size={16} className="mr-1" />
                                    <span>May 10, 11:00 AM (30 minutes)</span>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">View Notes</Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-6">
                        <Button>Schedule New Session</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
