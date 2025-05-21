'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Category = {
  id: string;
  name: string;
  icon?: string;
};

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startIndex, setStartIndex] = useState(0);
  
  const currentCategory = searchParams.get('category');
  const itemsToShow = 4;
  
  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - itemsToShow));
  };
  
  const handleNext = () => {
    setStartIndex(prev => 
      Math.min(categories.length - itemsToShow, prev + itemsToShow)
    );
  };
  
  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentCategory === categoryName) {
      params.delete('category');
    } else {
      params.set('category', categoryName);
      params.delete('search');
    }
    
    router.push(`/apps?${params.toString()}`);
  };
  
  const visibleCategories = categories.slice(startIndex, startIndex + itemsToShow);
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={startIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex space-x-2 overflow-hidden">
        {visibleCategories.map(category => (
          <Button
            key={category.id}
            variant={currentCategory === category.name ? "default" : "outline"}
            onClick={() => handleCategoryClick(category.name)}
            className="whitespace-nowrap"
          >
            {category.icon && <span className="mr-1">{category.icon}</span>}
            {category.name}
          </Button>
        ))}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={startIndex >= categories.length - itemsToShow}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}