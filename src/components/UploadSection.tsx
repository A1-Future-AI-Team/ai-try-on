import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { TryOnResult } from './TryOnResult';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader, ArrowRight, Sparkles, User, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadApi, tryOnApi, Image, TryOnSession } from '@/lib/api';

export const UploadSection: React.FC = () => {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [dressImage, setDressImage] = useState<File | null>(null);
  const [modelImageData, setModelImageData] = useState<Image | null>(null);
  const [dressImageData, setDressImageData] = useState<Image | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [isUploadingDress, setIsUploadingDress] = useState(false);
  const [currentSession, setCurrentSession] = useState<TryOnSession | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleModelImageSelect = async (file: File | null) => {
    // Handle image removal
    if (!file) {
      setModelImage(null);
      setModelImageData(null);
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return;
    }

    setModelImage(file);
    setIsUploadingModel(true);

    try {
      const response = await uploadApi.uploadImage(file, 'model');
      setModelImageData(response.data.data!.image);
      toast({
        title: "Model image uploaded!",
        description: "Your model image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload model image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingModel(false);
    }
  };

  const handleDressImageSelect = async (file: File | null) => {
    // Handle image removal
    if (!file) {
      setDressImage(null);
      setDressImageData(null);
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return;
    }

    setDressImage(file);
    setIsUploadingDress(true);

    try {
      const response = await uploadApi.uploadImage(file, 'dress');
      setDressImageData(response.data.data!.image);
      toast({
        title: "Dress image uploaded!",
        description: "Your dress image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload dress image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDress(false);
    }
  };

  const handleProcess = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create try-on sessions.",
        variant: "destructive",
      });
      return;
    }

    if (!modelImageData || !dressImageData) {
      toast({
        title: "Missing Images",
        description: "Please upload both model and dress images to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create try-on session with real AI processing
      const sessionResponse = await tryOnApi.createSession({
        modelImageId: modelImageData._id,
        dressImageId: dressImageData._id,
      });

      const session = sessionResponse.data.data!.session;
      setCurrentSession(session);

      toast({
        title: "Try-On Processing Started!",
        description: "Your virtual try-on is being processed using AI. This may take a few moments.",
      });

      // Poll for completion
      const pollForCompletion = async () => {
        try {
          const statusResponse = await tryOnApi.getSessionById(session.sessionId);
          const currentSession = statusResponse.data.data!.session;
          
          setCurrentSession(currentSession);

          if (currentSession.status === 'completed') {
            toast({
              title: "Try-On Complete!",
              description: "Your AI-generated virtual try-on is ready for download.",
            });
            setIsProcessing(false);
          } else if (currentSession.status === 'failed') {
            toast({
              title: "Processing Failed",
              description: currentSession.errorMessage || "AI processing failed. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          } else {
            // Continue polling
            setTimeout(pollForCompletion, 3000);
          }
        } catch (error) {
          console.error('Polling error:', error);
          setIsProcessing(false);
        }
      };

      // Start polling after a short delay
      setTimeout(pollForCompletion, 2000);

    } catch (error: any) {
      toast({
        title: "Processing Failed",
        description: error.response?.data?.message || "Failed to start AI processing.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleNewTryOn = () => {
    setCurrentSession(null);
    setModelImage(null);
    setDressImage(null);
    setModelImageData(null);
    setDressImageData(null);
    setIsProcessing(false);
  };

  // Show call-to-action section for non-authenticated users
  if (!isAuthenticated) {
    return (
      <section id="upload-section" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-light">
              Ready to <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Get Started?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of users who are already transforming their fashion experience with AI-powered virtual try-on
            </p>
          </div>

          {/* Demo Upload Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Model Photo Demo */}
            <Card className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Model Photo</h3>
              <p className="text-muted-foreground mb-4">
                Upload a clear photo of yourself or your model
              </p>
              <div className="w-full h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>

            {/* Dress Photo Demo */}
            <Card className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Choose Clothing</h3>
              <p className="text-muted-foreground mb-4">
                Select the dress or outfit you want to try on
              </p>
              <div className="w-full h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>

            {/* Result Demo */}
            <Card className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
              <p className="text-muted-foreground mb-4">
                Receive your realistic virtual try-on in seconds
              </p>
              <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Button 
                variant="fashion" 
                size="xl" 
                onClick={() => navigate('/register')}
                className="group"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account? <Button variant="link" onClick={() => navigate('/login')}>Sign in</Button>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>Results in 30 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="upload-section" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-light">
            Upload & <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Transform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your photos and let our AI create the perfect virtual try-on experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Model Image Upload */}
          <ImageUpload
            title="Model Photo"
            description="Upload a clear photo of the person who will try on the dress"
            onImageSelect={handleModelImageSelect}
            selectedImage={modelImage}
            isUploading={isUploadingModel}
            uploadedImageUrl={modelImageData?.url}
          />

          {/* Dress Image Upload */}
          <ImageUpload
            title="Dress Photo"
            description="Upload the dress or clothing item you want to try on"
            onImageSelect={handleDressImageSelect}
            selectedImage={dressImage}
            isUploading={isUploadingDress}
            uploadedImageUrl={dressImageData?.url}
          />

          {/* Process Button */}
          <Card className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Try-On</h3>
            <p className="text-muted-foreground mb-6">
              {modelImageData && dressImageData 
                ? "Ready to create your virtual try-on!"
                : "Upload both images to get started"
              }
            </p>
            <Button
              variant="fashion"
              size="lg"
              onClick={handleProcess}
              disabled={!modelImageData || !dressImageData || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Create Try-On
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Try-On Result */}
        {currentSession && (
          <div className="max-w-2xl mx-auto">
            <TryOnResult session={currentSession} />
            {currentSession.status === 'completed' && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleNewTryOn}
                  className="group"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create New Try-On
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};