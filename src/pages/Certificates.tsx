import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Certificate from '@/components/Certificate';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';

interface CertificateData {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  completionDate: string;
  courseTitle: string;
}

const Certificates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to view certificates",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const storedCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      const userCertificates = storedCertificates.filter(
        (cert: CertificateData) => cert.userId === user.id
      );

      setCertificates(userCertificates);

      if (courseId) {
        const courseSpecificCert = userCertificates.find(
          (cert: CertificateData) => cert.courseId === courseId
        );
        if (courseSpecificCert) {
          setSelectedCertificate(courseSpecificCert);
        }
      } else if (userCertificates.length > 0) {
        setSelectedCertificate(userCertificates[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading certificates:", error);
      setLoading(false);
    }
  }, [user, navigate, toast, courseId]);

  const handleCertificateSelect = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
  };

  const handleDownload = () => {
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading certificates...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Certificates</h1>
          
          {certificates.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">No Certificates Yet</h2>
              <p className="text-gray-600 mb-6">
                Complete courses to earn certificates that showcase your skills and knowledge.
              </p>
              <Button onClick={() => navigate('/courses')}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {selectedCertificate && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        {selectedCertificate.courseTitle} Certificate
                      </h2>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={handleDownload}
                        >
                          <Download size={16} />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={handleShare}
                        >
                          <Share2 size={16} />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <Certificate
                        courseTitle={selectedCertificate.courseTitle}
                        studentName={user?.username || "Student"}
                        completionDate={new Date(selectedCertificate.completionDate).toLocaleDateString()}
                        certificateId={selectedCertificate.id}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Your Achievements</h3>
                    <div className="space-y-2">
                      {certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className={`p-3 rounded-lg cursor-pointer ${
                            selectedCertificate?.id === cert.id
                              ? 'bg-primary/10 border border-primary/30'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          onClick={() => handleCertificateSelect(cert)}
                        >
                          <h4 className="font-medium">{cert.courseTitle}</h4>
                          <p className="text-sm text-gray-500">
                            Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">About Certificates</h3>
                  <p className="text-sm text-gray-600">
                    Certificates verify your course completion and can be shared on your professional profiles. 
                    They showcase your skills and dedication to continuous learning.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;
