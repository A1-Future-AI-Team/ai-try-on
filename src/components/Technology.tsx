import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Cpu, 
  Gauge, 
  Lock, 
  Layers, 
  Zap,
  CheckCircle
} from 'lucide-react';

export const Technology: React.FC = () => {
  const techFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Advanced Neural Networks",
      description: "Deep learning models trained on millions of fashion images"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Computer Vision",
      description: "Precise body and clothing detection with semantic segmentation"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "GPU Acceleration",
      description: "High-performance computing for real-time processing"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure Processing",
      description: "End-to-end encryption with automatic data deletion"
    }
  ];

  const capabilities = [
    "Realistic lighting and shadow generation",
    "Fabric texture preservation",
    "Body pose adaptation", 
    "Size and fit adjustment",
    "Color accuracy maintenance",
    "High-resolution output (up to 4K)",
    "Multiple clothing categories",
    "Batch processing support"
  ];

  const stats = [
    { value: "99.9%", label: "Accuracy Rate", icon: <CheckCircle className="h-5 w-5" /> },
    { value: "< 30s", label: "Processing Time", icon: <Gauge className="h-5 w-5" /> },
    { value: "50M+", label: "Images Processed", icon: <Zap className="h-5 w-5" /> },
    { value: "24/7", label: "Availability", icon: <Cpu className="h-5 w-5" /> }
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">
            <Brain className="h-4 w-4 mr-2" />
            Powered by AI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-light">
            Cutting-Edge <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with state-of-the-art artificial intelligence and computer vision technologies for unmatched accuracy and realism
          </p>
        </div>

        {/* Tech Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techFeatures.map((feature, index) => (
            <Card key={index} className="glass-card text-center hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capabilities and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Capabilities */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">AI Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card text-center p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Real-time Processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 