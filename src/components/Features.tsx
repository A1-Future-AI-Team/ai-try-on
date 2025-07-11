import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Clock, 
  Image as ImageIcon, 
  Palette,
  Users,
  Download,
  Cloud
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered Technology",
      description: "Advanced machine learning algorithms ensure realistic and accurate try-on results every time."
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Lightning Fast",
      description: "Get your virtual try-on results in under 30 seconds with our optimized processing pipeline."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Privacy Protected",
      description: "Your images are securely processed and automatically deleted after 24 hours for complete privacy."
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-blue-500" />,
      title: "High Quality Results",
      description: "Generate high-resolution images with realistic lighting, shadows, and fabric textures."
    },
    {
      icon: <Palette className="h-8 w-8 text-purple-500" />,
      title: "Style Variety",
      description: "Works with all types of clothing - dresses, shirts, jackets, and more fashion items."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Multiple Models",
      description: "Try clothes on different body types and poses to see how they look on various figures."
    },
    {
      icon: <Download className="h-8 w-8 text-indigo-500" />,
      title: "Easy Download",
      description: "Download your results in multiple formats and resolutions for any use case."
    },
    {
      icon: <Cloud className="h-8 w-8 text-cyan-500" />,
      title: "Cloud Processing",
      description: "No software installation required. Everything runs in the cloud for maximum convenience."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-light">
            Powerful <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create stunning virtual try-on experiences with professional-grade results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 