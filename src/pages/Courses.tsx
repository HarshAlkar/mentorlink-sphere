
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

// Temporary mock data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
    },
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
  },
  {
    id: '2',
    title: 'Data Science Fundamentals with Python',
    instructor: {
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
    },
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Master the fundamentals of data analysis using Python and popular libraries.',
  },
  {
    id: '3',
    title: 'UX/UI Design Principles',
    instructor: {
      name: 'Elena Rodriguez',
      avatar: '/placeholder.svg',
    },
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Learn the principles of creating user-friendly and aesthetically pleasing digital interfaces.',
  },
  {
    id: '4',
    title: 'Machine Learning Essentials',
    instructor: {
      name: 'Dr. James Wilson',
      avatar: '/placeholder.svg',
    },
    category: 'AI & ML',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Understand the core concepts of machine learning algorithms and their applications.',
  },
  {
    id: '5',
    title: 'Advanced JavaScript Programming',
    instructor: {
      name: 'Alex Thompson',
      avatar: '/placeholder.svg',
    },
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Take your JavaScript skills to the next level with advanced concepts and modern patterns.',
  },
  {
    id: '6',
    title: 'Cybersecurity Fundamentals',
    instructor: {
      name: 'Priya Patel',
      avatar: '/placeholder.svg',
    },
    category: 'Cybersecurity',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Learn the essential principles and practices of cybersecurity for beginners.',
  },
  {
    id: '7',
    title: 'Project Management with Agile',
    instructor: {
      name: 'David Kim',
      avatar: '/placeholder.svg',
    },
    category: 'Management',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Master the Agile methodology and learn how to apply it to your projects effectively.',
  },
  {
    id: '8',
    title: 'Digital Marketing Strategy',
    instructor: {
      name: 'Sophia Williams',
      avatar: '/placeholder.svg',
    },
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Learn how to create and implement effective digital marketing strategies for business growth.',
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container py-8 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Search courses..." className="pl-10" />
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="ai">AI & ML</SelectItem>
                  <SelectItem value="cyber">Cybersecurity</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                instructor={course.instructor}
                category={course.category}
                thumbnail={course.thumbnail}
                description={course.description}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg">Load More Courses</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
