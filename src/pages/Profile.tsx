
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileSettings from '@/components/ProfileSettings';

const Profile = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          <ProfileSettings />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
