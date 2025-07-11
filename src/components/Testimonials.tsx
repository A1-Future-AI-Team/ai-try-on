import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Designer",
      company: "StyleCo",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "This virtual try-on technology has revolutionized how I present my designs to clients. The accuracy is incredible and saves us so much time in the design process.",
      verified: true
    },
    {
      name: "Michael Chen",
      role: "E-commerce Manager", 
      company: "FashionForward",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "Our return rates dropped by 40% after implementing this virtual try-on solution. Customers love being able to see how clothes look before purchasing.",
      verified: true
    },
    {
      name: "Emily Rodriguez",
      role: "Personal Stylist",
      company: "StyleMe",
      avatar: "/api/placeholder/40/40", 
      rating: 5,
      text: "The quality of the virtual try-on results is outstanding. My clients can now visualize different outfit combinations quickly and efficiently.",
      verified: true
    },
    {
      name: "David Park",
      role: "Marketing Director",
      company: "TrendyWear",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "This platform has increased our customer engagement by 300%. The realistic results help customers make confident purchasing decisions.",
      verified: true
    },
    {
      name: "Lisa Thompson",
      role: "Online Retailer",
      company: "ChicBoutique",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "The integration was seamless and the results speak for themselves. Our customers love the interactive shopping experience this provides.",
      verified: true
    },
    {
      name: "James Wilson",
      role: "Fashion Photographer",
      company: "Studio Wilson",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "As a professional photographer, I'm impressed by the lighting and texture quality. This tool helps me showcase fashion in ways I never thought possible.",
      verified: true
    }
  ];

  const brands = [
    "StyleCo", "FashionForward", "TrendyWear", "ChicBoutique", "StyleMe", "Studio Wilson"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-light">
            Loved by <span className="bg-fashion-gradient bg-clip-text text-transparent font-medium">Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of fashion professionals who trust our virtual try-on technology
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300 relative">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="h-4 w-4 text-primary/30 absolute -top-1 -left-1" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                    {testimonial.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trusted By Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Trusted by leading fashion brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="text-muted-foreground/60 font-medium">
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">50M+</div>
              <p className="text-muted-foreground">Try-Ons Generated</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">4.9/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 