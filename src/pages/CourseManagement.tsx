
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlusCircle, 
  BookOpen, 
  Edit, 
  Trash, 
  Users, 
  FileText, 
  Video, 
  Upload 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Mock courses data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn HTML, CSS, and JavaScript to build responsive websites.',
    students: 24,
    lastUpdated: '2023-09-15',
    status: 'published',
    instructor: 'Dr. Maria Garcia',
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    description: 'Deep dive into neural networks, reinforcement learning, and more.',
    students: 18,
    lastUpdated: '2023-09-12',
    status: 'published',
    instructor: 'Robert Johnson',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the principles of user interface and experience design.',
    students: 32,
    lastUpdated: '2023-09-18',
    status: 'draft',
    instructor: 'Emily Chen',
  },
];

const courseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  status: z.enum(['draft', 'published']),
});

const CourseManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState(mockCourses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'draft',
    },
  });
  
  const isAuthorized = isAuthenticated && (user?.role === 'teacher' || user?.role === 'mentor_admin');
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
                  <p className="text-muted-foreground">
                    You need to be logged in as a teacher or admin to access this page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddCourse = () => {
    setEditingCourseId(null);
    form.reset({
      title: '',
      description: '',
      status: 'draft',
    });
    setDialogOpen(true);
  };

  const handleEditCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setEditingCourseId(courseId);
      form.reset({
        title: course.title,
        description: course.description,
        status: course.status as 'draft' | 'published',
      });
      setDialogOpen(true);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    toast({
      title: "Course deleted",
      description: "The course has been deleted successfully",
    });
  };

  const onSubmit = (values: z.infer<typeof courseFormSchema>) => {
    if (editingCourseId) {
      // Update existing course
      setCourses(
        courses.map(course => 
          course.id === editingCourseId 
            ? { ...course, ...values, lastUpdated: new Date().toISOString().split('T')[0] } 
            : course
        )
      );
      toast({
        title: "Course updated",
        description: "The course has been updated successfully",
      });
    } else {
      // Add new course
      const newCourse = {
        id: `${Date.now()}`,
        ...values,
        students: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        instructor: user?.username || 'Unknown',
      };
      setCourses([...courses, newCourse]);
      toast({
        title: "Course created",
        description: "The course has been created successfully",
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Course Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Create, edit, and publish courses
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 flex items-center" 
              onClick={handleAddCourse}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Course
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="materials">Course Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">All Courses</h2>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="mb-4 md:mb-0 md:pr-6">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">{course.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                course.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Instructor: {course.instructor} • Last updated: {course.lastUpdated}
                            </p>
                            <p className="text-sm mt-2">{course.description}</p>
                            <div className="flex items-center mt-4 text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{course.students} students enrolled</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCourse(course.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Published Courses</h2>
                <div className="space-y-4">
                  {courses
                    .filter(course => course.status === 'published')
                    .map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-4 md:mb-0 md:pr-6">
                              <h3 className="text-lg font-medium">{course.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Last updated: {course.lastUpdated} • {course.students} students enrolled
                              </p>
                              <p className="text-sm mt-2">{course.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditCourse(course.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Draft Courses</h2>
                <div className="space-y-4">
                  {courses
                    .filter(course => course.status === 'draft')
                    .map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-4 md:mb-0 md:pr-6">
                              <h3 className="text-lg font-medium">{course.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Last updated: {course.lastUpdated} • Draft
                              </p>
                              <p className="text-sm mt-2">{course.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditCourse(course.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
                <Card>
                  <CardContent className="py-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Upload Materials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center text-center">
                            <FileText className="h-10 w-10 text-primary mb-2" />
                            <h4 className="font-medium">Documents</h4>
                            <p className="text-xs text-muted-foreground mt-1">Upload PDFs, docs, slides</p>
                          </div>
                        </Card>
                        
                        <Card className="p-4 cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center text-center">
                            <Video className="h-10 w-10 text-primary mb-2" />
                            <h4 className="font-medium">Video Lessons</h4>
                            <p className="text-xs text-muted-foreground mt-1">Upload videos or link external ones</p>
                          </div>
                        </Card>
                        
                        <Card className="p-4 cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center text-center">
                            <BookOpen className="h-10 w-10 text-primary mb-2" />
                            <h4 className="font-medium">Quizzes & Assessments</h4>
                            <p className="text-xs text-muted-foreground mt-1">Create interactive assessments</p>
                          </div>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Recent Uploads</h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-md hover:bg-muted">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Introduction_to_Web_Dev.pdf</p>
                            <p className="text-xs text-muted-foreground">Uploaded 2 days ago • 3.2 MB</p>
                          </div>
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        </div>
                        
                        <div className="flex items-center p-2 rounded-md hover:bg-muted">
                          <Video className="h-5 w-5 text-red-500 mr-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">CSS_Grid_Tutorial.mp4</p>
                            <p className="text-xs text-muted-foreground">Uploaded 3 days ago • 42 MB</p>
                          </div>
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingCourseId ? "Edit Course" : "Create New Course"}
            </DialogTitle>
            <DialogDescription>
              {editingCourseId 
                ? "Make changes to your course here. Click save when you're done." 
                : "Add the details for the new course you want to create."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Introduction to JavaScript" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this course" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="draft"
                            value="draft"
                            checked={field.value === "draft"}
                            onChange={() => field.onChange("draft")}
                            className="mr-2"
                          />
                          <label htmlFor="draft">Draft</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="published"
                            value="published"
                            checked={field.value === "published"}
                            onChange={() => field.onChange("published")}
                            className="mr-2"
                          />
                          <label htmlFor="published">Published</label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingCourseId ? "Save Changes" : "Create Course"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CourseManagement;
