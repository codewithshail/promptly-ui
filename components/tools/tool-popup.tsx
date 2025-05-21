'use client';

import { useState } from "react";
import { Heart, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Tool } from "./tool-card";

type ToolPopupProps = {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (e: React.MouseEvent) => void;
};

export function ToolPopup({
  tool,
  isOpen,
  onClose,
  isBookmarked,
  onBookmarkToggle,
}: ToolPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const screenshots = tool.screenshots || [];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const handleUseTool = () => {
    if (!isSignedIn) {
      toast.error("Authentication required");
      router.push("/login");
      return;
    }

    router.push(`/apps/${tool.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
          {/* Left side - Images */}
          <div className="relative bg-muted flex items-center justify-center">
            {screenshots.length > 0 ? (
              <>
                <img
                  src={screenshots[currentImageIndex] || "/placeholder.svg"}
                  alt={`${tool.name} screenshot`}
                  className="max-h-full max-w-full object-contain"
                />

                {screenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {screenshots.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <div className="h-16 w-16 rounded-md bg-background flex items-center justify-center overflow-hidden mb-4">
                  {tool.logo ? (
                    <img
                      src={tool.logo || "/placeholder.svg"}
                      alt={tool.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p>No screenshots available</p>
              </div>
            )}
          </div>

          {/* Right side - Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {tool.logo ? (
                      <img
                        src={tool.logo || "/placeholder.svg"}
                        alt={tool.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {tool.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <DialogTitle className="text-xl">{tool.name}</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="mt-2">
                {tool.subtitle}
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-4" />

            <div className="flex-1 overflow-auto">
              <p className="text-sm mb-6">{tool.description}</p>

              <Collapsible open={showInfo} onOpenChange={setShowInfo}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                  >
                    <span>Additional Information</span>
                    <Info className="h-4 w-4 ml-2" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Generation Type
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {tool.generationType}
                    </p>
                  </div>

                  {tool.priceInfo && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Pricing</h4>
                      <p className="text-sm text-muted-foreground">
                        {tool.priceInfo}
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>

            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onBookmarkToggle}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleUseTool}>
                Use Tool
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}