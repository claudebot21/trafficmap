/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const navigateGallery = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + images.length) % images.length
        : (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (event.key === "ArrowRight") {
        navigateGallery("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-6 bg-black text-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-medium flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {format(new Date(images[currentIndex].createdAt), "PPpp")}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <Image
            src={images[currentIndex].url}
            alt={`Traffic Map ${images[currentIndex].key}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateGallery("prev")}
            disabled={currentIndex === 0}
            aria-label="Previous image"
            className="bg-black text-white border-white hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateGallery("next")}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
            className="bg-black text-white border-white hover:bg-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
