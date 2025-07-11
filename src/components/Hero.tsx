import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollToUpload = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      const uploadSection = document.getElementById('upload-section');
      uploadSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="fashion-hero min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Virtual Try-On</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-light leading-tight">
            Try On Fashion
            <br />
            <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">
              Without Limits
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload your model photo and any dress design. Our AI instantly creates 
            realistic try-on results, revolutionizing fashion visualization.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="fashion" 
            size="xl" 
            onClick={scrollToUpload}
            className="group"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Your Try-On'}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {!isAuthenticated && (
            <Button 
              variant="glass" 
              size="xl"
              onClick={() => navigate('/register')}
            >
              <Zap className="h-5 w-5" />
              Get Started Free
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50">
          <div className="space-y-2">
            <div className="text-3xl font-semibold text-primary">99.9%</div>
            <div className="text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold text-accent">&lt; 30s</div>
            <div className="text-muted-foreground">Processing Time</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold text-primary">10K+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
};