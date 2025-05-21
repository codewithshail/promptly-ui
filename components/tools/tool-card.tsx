'use client';

import { useState } from "react";
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolPopup } from "./tool-popup";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/use-bookmarks";

export type Tool = {
  id: string;
  name: string;
  description: string;
  subtitle?: string | null;
  logo: string;
  screenshots?: string[] | null;
  priceInfo?: string | null;
  generationType: string;
  isNew?: boolean | null;
  categories?: any[];
  createdAt?: Date;
  updatedAt?: Date;
};

export function ToolCard({ tool }: { tool: Tool }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const isBookmarked = bookmarks.some((b) => b.toolId === tool.id);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Authentication Required");
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(tool.id);
        toast.success("Bookmarked removed");
      } else {
        await addBookmark(tool.id);
        toast.success("Bookmark added");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer group"
        onClick={() => setIsPopupOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              {tool.logo ? (
                <img
                  src={tool.logo || "/placeholder.svg"}
                  alt={tool.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold">{tool.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium">{tool.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tool.subtitle || tool.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/50 flex justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBookmarkToggle}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`h-4 w-4 mr-1 ${
                isBookmarked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </CardFooter>
      </Card>

      <ToolPopup
        tool={tool}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </>
  );
}