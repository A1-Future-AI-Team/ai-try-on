import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Technology } from '@/components/Technology';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Technology />
        <UploadSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
