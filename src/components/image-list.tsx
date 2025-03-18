"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Check, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageListProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  onImageClick: (index: number) => void;
  selectedImages?: number[];
  comparisonMode?: boolean;
}

export function ImageList({
  images,
  onImageClick,
  selectedImages = [],
  comparisonMode = false,
}: ImageListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {images.map((image, index) => {
        const isSelected = selectedImages.includes(index);
        const isHovered = hoveredIndex === index;

        return (
          <Card
            key={image.key}
            className={cn(
              "overflow-hidden bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 transition-all duration-300",
              isSelected && "ring-2 ring-primary"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CardContent className="p-4 flex items-center">
              <div className="w-24 h-16 sm:w-32 sm:h-20 mr-4 flex-shrink-0 relative overflow-hidden rounded-md">
                <Image
                  src={image.url || "/placeholder.svg?height=80&width=128"}
                  alt={`Traffic Map ${image.key}`}
                  width={128}
                  height={80}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    isHovered && "scale-105"
                  )}
                />
                {comparisonMode && isSelected && (
                  <div className="absolute top-1 right-1 z-10 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <p className="text-sm font-medium mb-1 flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  {format(new Date(image.createdAt), "PPpp")}
                </p>
                <p className="text-xs text-slate-400">Traffic map snapshot</p>
              </div>

              <Button
                variant={comparisonMode && isSelected ? "default" : "secondary"}
                size="sm"
                className={cn(
                  "ml-2",
                  comparisonMode && isSelected
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-slate-700/50 hover:bg-slate-700 text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(index);
                }}
              >
                {comparisonMode ? (
                  <>
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
