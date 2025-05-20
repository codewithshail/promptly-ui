'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Feature = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgColor: string;
};

export function FeatureBanner({ features }: { features: Feature[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (features.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [features.length]);
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + features.length) % features.length);
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % features.length);
  };
  
  if (features.length === 0) return null;
  
  const currentFeature = features[currentIndex];
  
  return (
    <div className={`relative rounded-lg overflow-hidden ${currentFeature.bgColor} transition-colors duration-500`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{currentFeature.title}</h2>
            <p className="text-white/90">{currentFeature.description}</p>
            <Button asChild size="lg" variant="secondary">
              <a href={currentFeature.buttonLink}>{currentFeature.buttonText}</a>
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="relative h-48 md:h-64 w-full max-w-md">
              <img 
                src={currentFeature.image || "/placeholder.svg"} 
                alt={currentFeature.title}
                className="object-contain h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {features.length > 1 && (
        <>
          <button 
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
            aria-label="Previous feature"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
            aria-label="Next feature"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {features.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}