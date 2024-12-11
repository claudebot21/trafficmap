import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageListProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  onImageClick: (index: number) => void;
}

export function ImageList({ images, onImageClick }: ImageListProps) {
  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <Card key={image.key} className="overflow-hidden">
          <CardContent className="p-4 flex items-center">
            <div className="w-24 h-24 mr-4 flex-shrink-0">
              <Image
                src={image.url}
                alt={`Traffic Map ${image.key}`}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium mb-1 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(image.createdAt), "PPpp")}
              </p>
              <p className="text-xs text-muted-foreground">
                Traffic map snapshot
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => onImageClick(index)}
            >
              View
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
