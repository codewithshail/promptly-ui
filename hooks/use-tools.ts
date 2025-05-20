"use client";

import { useState } from "react";
import { toast } from "sonner";

type Tool = {
  id: string;
  name: string;
  description: string;
  subtitle?: string;
  logo: string;
  screenshots?: string[];
  priceInfo?: string;
  generationType: string;
  isNew?: boolean;
};

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTools = async (options?: {
    categoryId?: string;
    search?: string;
    limit?: number;
  }) => {
    setIsLoading(true);

    try {
      let url = "/api/tools";
      const params = new URLSearchParams();

      if (options?.categoryId) {
        params.append("categoryId", options.categoryId);
      }

      if (options?.search) {
        params.append("search", options.search);
      }

      if (options?.limit) {
        params.append("limit", options.limit.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch tools");
      }

      const data = await response.json();
      setTools(data);
      return data;
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to load tools");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchTools = async (query: string) => {
    return fetchTools({ search: query });
  };

  const getToolsByCategory = async (categoryId: string) => {
    return fetchTools({ categoryId });
  };

  return {
    tools,
    isLoading,
    fetchTools,
    searchTools,
    getToolsByCategory,
  };
}
