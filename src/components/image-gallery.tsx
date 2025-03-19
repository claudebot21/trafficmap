"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageGallery({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset position when zoom changes or image changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [zoom, currentIndex]);

  const navigateGallery = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "prev"
          ? (currentIndex - 1 + images.length) % images.length
          : (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);
    },
    [currentIndex, images.length]
  );

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
      const containerWidth = e.currentTarget.clientWidth;
      const containerHeight = e.currentTarget.clientHeight;
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (event.key === "ArrowRight") {
        navigateGallery("next");
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Add event listeners to handle mouse up outside the component
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isOpen, onClose, navigateGallery]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-6 bg-slate-900 text-white border-slate-700 shadow-xl shadow-black/20">
        <DialogHeader className="mb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            {format(new Date(currentImage.createdAt), "PPpp")}
          </DialogTitle>
          <div className="flex items-center gap-2">
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

        <div className="relative w-full h-[calc(100vh-12rem)]">
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
                  currentImage.url || "/placeholder.svg?height=600&width=800"
                }
                alt={`Traffic Map ${currentImage.key}`}
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
              onClick={() => navigateGallery("prev")}
              className="rounded-full bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateGallery("next")}
              className="rounded-full bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
