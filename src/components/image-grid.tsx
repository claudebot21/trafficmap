"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Check, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageGridProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  onImageClick: (index: number) => void;
  selectedImages?: number[];
  comparisonMode?: boolean;
}

export function ImageGrid({
  images,
  onImageClick,
  selectedImages = [],
  comparisonMode = false,
}: ImageGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => {
        const isSelected = selectedImages.includes(index);
        const isHovered = hoveredIndex === index;

        return (
          <Card
            key={image.key}
            className={cn(
              "group overflow-hidden cursor-pointer transition-all duration-300 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 relative",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onImageClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {comparisonMode && isSelected && (
              <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}

            <CardContent className="p-0 relative">
              <div className="relative overflow-hidden aspect-video">
                <Image
                  src={image.url || "/placeholder.svg?height=400&width=600"}
                  alt={`Traffic Map ${image.key}`}
                  width={600}
                  height={400}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    isHovered && "scale-105"
                  )}
                />

                {/* Overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-100"
                  )}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                    <p className="text-sm font-medium text-white flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {format(new Date(image.createdAt), "PPpp")}
                    </p>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info bar (always visible) */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900/90 to-transparent",
                  isHovered && "opacity-0 transition-opacity duration-300"
                )}
              >
                <p className="text-sm font-medium text-white flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  {format(new Date(image.createdAt), "PPp")}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
