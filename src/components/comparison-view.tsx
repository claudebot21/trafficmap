"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComparisonViewProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  selectedImages: number[];
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonView({
  images,
  selectedImages,
  isOpen,
  onClose,
}: ComparisonViewProps) {
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position when zoom changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [zoom]);

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 100) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate boundaries to prevent dragging outside the image
      const containerWidth = containerRef.current?.clientWidth || 0;
      const containerHeight = containerRef.current?.clientHeight || 0;
      const maxX = Math.max(
        0,
        ((containerWidth * zoom) / 100 - containerWidth) / 2
      );
      const maxY = Math.max(
        0,
        ((containerHeight * zoom) / 100 - containerHeight) / 2
      );

      setPosition({
        x: Math.min(maxX, Math.max(-maxX, newX)),
        y: Math.min(maxY, Math.max(-maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom and position
  const resetView = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Navigate between images in fullscreen mode
  const navigateImages = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "next") {
        setActiveIndex((prev) => (prev + 1) % selectedImages.length);
      } else {
        setActiveIndex(
          (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
        );
      }
    },
    [selectedImages.length]
  );

  // Calculate grid columns based on number of selected images
  const getGridColumns = () => {
    const count = selectedImages.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2 md:grid-cols-4";
    return "grid-cols-2 md:grid-cols-3";
  };

  useEffect(() => {
    // Add event listeners to handle mouse up outside the component
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    // Handle keyboard events for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        if (fullscreen) {
          setFullscreen(false);
        } else {
          onClose();
        }
      }

      if (fullscreen) {
        if (e.key === "ArrowRight") {
          navigateImages("next");
        } else if (e.key === "ArrowLeft") {
          navigateImages("prev");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, fullscreen, onClose, navigateImages]);

  if (selectedImages.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-6 bg-slate-900 text-white border-slate-700 shadow-xl shadow-black/20">
        <DialogHeader className="mb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            {fullscreen
              ? format(
                  new Date(images[selectedImages[activeIndex]].createdAt),
                  "PPpp"
                )
              : `Comparing ${selectedImages.length} Traffic Maps`}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {!fullscreen && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(100, zoom - 25))}
                  disabled={zoom <= 100}
                  className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
                <Slider
                  value={[zoom]}
                  min={100}
                  max={300}
                  step={25}
                  onValueChange={(value) => setZoom(value[0])}
                  className="w-32 mx-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(300, zoom + 25))}
                  disabled={zoom >= 300}
                  className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                  className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
            >
              {fullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-1" />
                  Exit Full
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-1" />
                  Full View
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogHeader>

        {fullscreen ? (
          <div
            className="relative w-full h-[calc(100vh-12rem)] overflow-hidden"
            ref={containerRef}
          >
            <div
              className="w-full h-full overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ touchAction: "none" }}
            >
              <div
                style={{
                  transform: `scale(${zoom / 100}) translate(${
                    position.x / (zoom / 100)
                  }px, ${position.y / (zoom / 100)}px)`,
                  transformOrigin: "center",
                  width: "100%",
                  height: "100%",
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={
                    images[selectedImages[activeIndex]].url ||
                    "/placeholder.svg?height=600&width=800"
                  }
                  alt={`Traffic Map ${images[selectedImages[activeIndex]].key}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateImages("prev")}
                className="rounded-full bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateImages("next")}
                className="rounded-full bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              {activeIndex + 1} / {selectedImages.length}
            </div>
          </div>
        ) : (
          <div
            className={`grid ${getGridColumns()} gap-4 w-full h-[calc(100vh-12rem)] overflow-hidden`}
            ref={containerRef}
          >
            {selectedImages.map((imageIndex, i) => {
              const image = images[imageIndex];
              return (
                <div
                  key={image.key}
                  className="relative overflow-hidden border border-slate-700 rounded-lg bg-slate-800/50 group"
                  onClick={() => {
                    setActiveIndex(i);
                    setFullscreen(true);
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/70 to-transparent z-10 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span className="text-xs">
                      {format(new Date(image.createdAt), "PPpp")}
                    </span>
                  </div>
                  <div
                    className="w-full h-full overflow-hidden cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ touchAction: "none" }}
                  >
                    <div
                      style={{
                        transform: `scale(${zoom / 100}) translate(${
                          position.x / (zoom / 100)
                        }px, ${position.y / (zoom / 100)}px)`,
                        transformOrigin: "center",
                        width: "100%",
                        height: "100%",
                        transition: isDragging
                          ? "none"
                          : "transform 0.2s ease-out",
                      }}
                    >
                      <Image
                        src={
                          image.url || "/placeholder.svg?height=400&width=600"
                        }
                        alt={`Traffic Map ${image.key}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Fullscreen button overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/30 border-white/30 hover:bg-black/60 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(i);
                        setFullscreen(true);
                      }}
                    >
                      <Maximize className="h-4 w-4 mr-1.5" />
                      Full View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
