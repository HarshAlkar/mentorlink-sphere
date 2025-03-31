
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, CalendarDays, Upload, FileText, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock assignment data
const mockAssignments = [
  {
    id: 'assignment1',
    title: 'Create a Landing Page',
    courseId: '1',
    description: 'Design and develop a responsive landing page for a fictional product or service of your choice. The page should include a hero section, features section, testimonials, and a call-to-action form.',
    requirements: [
      'Use semantic HTML5 elements',
      'Implement responsive design with media queries',
      'Use Flexbox or Grid for layout',
      'Include at least one CSS animation',
      'Ensure the page passes basic accessibility checks'
    ],
    resources: [
      { name: 'Landing Page Design Guide', url: '#' },
      { name: 'CSS Animation Examples', url: '#' }
    ],
    dueDate: '2023-11-15T23:59:59Z',
    maxPoints: 100,
    submissionType: 'file',
    status: 'active'
  },
  {
    id: 'assignment2',
    title: 'JavaScript Calculator',
    courseId: '1',
    description: 'Build a functional calculator using vanilla JavaScript that can perform basic arithmetic operations.',
    requirements: [
      'Implement addition, subtraction, multiplication, and division',
      'Include decimal point functionality',
      'Provide clear/reset button',
      'Handle division by zero gracefully',
      'Use event listeners for button interactions'
    ],
    resources: [
      { name: 'JavaScript Events Documentation', url: '#' },
      { name: 'Calculator UI Examples', url: '#' }
    ],
    dueDate: '2023-11-20T23:59:59Z',
    maxPoints: 100,
    submissionType: 'file',
    status: 'active'
  }
];

const AssignmentPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading assignment
    setLoading(true);
    setTimeout(() => {
      const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
      setAssignment(foundAssignment || null);
      setLoading(false);
    }, 500);
  }, [assignmentId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles(fileArray);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please attach at least one file to submit.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate submission
    setSubmitted(true);
    toast({
      title: "Assignment Submitted",
      description: "Your assignment has been submitted successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = () => {
    if (!assignment) return false;
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    return now > dueDate;
  };

  const getDaysRemaining = () => {
    if (!assignment) return 0;
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
                    Please log in to view this assignment.
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
                  <h2 className="text-2xl font-bold mb-4">Loading Assignment...</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Assignment Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The assignment you're looking for doesn't exist or you don't have permission to view it.
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
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to={`/courses/${assignment.courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                    <div className={`flex items-center ${
                      isOverdue() ? 'text-red-500' : getDaysRemaining() <= 3 ? 'text-amber-500' : 'text-green-500'
                    }`}>
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {isOverdue() 
                          ? 'Overdue' 
                          : getDaysRemaining() === 0 
                            ? 'Due today' 
                            : `Due in ${getDaysRemaining()} days`}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-2">Due: {formatDate(assignment.dueDate)}</p>
                    <p>{assignment.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {assignment.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {!submitted ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Submit Your Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload Files</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              ZIP, PDF, DOCX, HTML, CSS, JS (MAX. 10MB)
                            </p>
                          </div>
                          <input 
                            id="dropzone-file" 
                            type="file" 
                            className="hidden" 
                            multiple 
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                          <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => removeFile(index)}
                                >
                                  <XCircle className="h-5 w-5 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Comments (Optional)</label>
                      <Textarea 
                        placeholder="Add any comments about your submission..."
                        className="mt-1"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSubmit}>
                      Submit Assignment
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <div className="flex flex-col items-center text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Assignment Submitted</h3>
                      <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                        Your assignment has been submitted successfully. Your instructor will review it and provide feedback.
                      </p>
                      <Button variant="outline" onClick={() => setSubmitted(false)}>
                        Resubmit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.resources.map((resource: any, index: number) => (
                      <a 
                        key={index} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm">{resource.name}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assignment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Point Value</h3>
                      <p className="text-sm text-muted-foreground">{assignment.maxPoints} points</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Submission Type</h3>
                      <p className="text-sm text-muted-foreground capitalize">{assignment.submissionType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Due Date</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(assignment.dueDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        submitted ? 'bg-green-100 text-green-800' : isOverdue() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {submitted ? 'Submitted' : isOverdue() ? 'Overdue' : 'Open'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssignmentPage;
