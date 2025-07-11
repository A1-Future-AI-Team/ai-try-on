import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Sparkles, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      step: "01",
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Upload Model Photo",
      description: "Upload a clear photo of yourself or your model. Our AI works best with well-lit, front-facing photos.",
      tip: "Tip: Use natural lighting for best results"
    },
    {
      step: "02", 
      icon: <ImageIcon className="h-8 w-8 text-accent" />,
      title: "Select Clothing",
      description: "Choose the dress or clothing item you want to try on. Upload your own design or select from our catalog.",
      tip: "Tip: High-resolution images give better results"
    },
    {
      step: "03",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: "AI Processing",
      description: "Our advanced AI technology processes both images and creates a realistic virtual try-on in seconds.",
      tip: "Tip: Processing typically takes 15-30 seconds"
    },
    {
      step: "04",
      icon: <Download className="h-8 w-8 text-green-500" />,
      title: "Download Results",
      description: "View, download, and share your virtual try-on results. Perfect for social media or decision making.",
      tip: "Tip: Results are available in multiple formats"
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-light">
            How It <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with virtual try-on in just 4 simple steps. No technical expertise required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="glass-card hover:shadow-lg transition-all duration-300 group h-full">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary/30 mb-2">{step.step}</div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                  <div className="text-xs text-primary/70 font-medium">
                    {step.tip}
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="fashion" 
            size="lg" 
            onClick={handleGetStarted}
            className="group"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Your First Try-On'}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}; 