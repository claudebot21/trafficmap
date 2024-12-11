"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, List, Grid, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ImageGrid } from "@/components/image-grid";
import { ImageList } from "@/components/image-list";
import { ImageGallery } from "@/components/image-gallery";

interface Image {
  key: string;
  url: string;
  createdAt: string;
}

export default function TrafficMapApp() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = selectedDate
    ? images.filter(
        (image) =>
          format(new Date(image.createdAt), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : images;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <MapPin className="mr-2" />
            Daily Traffic Maps
          </h1>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(null)}
                aria-label="Clear date filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <Tabs
            value={viewMode}
            onValueChange={(value: "grid" | "list") => setViewMode(value)}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <TabsContent value="grid">
                <ImageGrid
                  images={filteredImages}
                  onImageClick={setGalleryIndex}
                />
              </TabsContent>
              <TabsContent value="list">
                <ImageList
                  images={filteredImages}
                  onImageClick={setGalleryIndex}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </main>
      <ImageGallery
        images={filteredImages}
        initialIndex={galleryIndex ?? 0}
        isOpen={galleryIndex !== null}
        onClose={() => setGalleryIndex(null)}
      />
    </div>
  );
}
