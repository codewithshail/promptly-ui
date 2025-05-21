"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories...");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    refreshCategories: fetchCategories,
  };
}
