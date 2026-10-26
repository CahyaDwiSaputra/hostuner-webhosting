import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { DomainChecker } from '../components/DomainChecker';
import { HostingPricingSection } from '../components/HostingPricingSection';
import { VpsSection } from '../components/VpsSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';
import { CtaBanner } from '../components/CtaBanner';

export const HomePage: React.FC = () => {
  return (
    <main className="w-full">
      <HeroSection />
      <DomainChecker />
      <HostingPricingSection />
      <VpsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </main>
  );
};
