import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageGridProps {
  images: Array<{
    key: string;
    url: string;
    createdAt: string;
  }>;
  onImageClick: (index: number) => void;
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <Card
          key={image.key}
          className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={() => onImageClick(index)}
        >
          <CardContent className="p-0 relative">
            <Image
              src={image.url}
              alt={`Traffic Map ${image.key}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-background/80 backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(image.createdAt), "PPpp")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
