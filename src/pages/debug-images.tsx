import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import images directly from assets
import img2713 from "@/assets/img_2713.jpeg";
import img2714 from "@/assets/img_2714.jpeg";
import img2715 from "@/assets/img_2715.jpeg";
import img2716 from "@/assets/img_2716.jpeg";
import img2717 from "@/assets/img_2717.jpeg";
import img2718 from "@/assets/img_2718.jpeg";
import img2719 from "@/assets/img_2719.jpeg";
import img2720 from "@/assets/img_2720.jpeg";

const images = [
  { id: "2713", src: img2713, title: "Image 2713 - Marked Areas to Fix" },
  { id: "2714", src: img2714, title: "Image 2714 - Marked Areas to Fix" },
  { id: "2715", src: img2715, title: "Image 2715 - Marked Areas to Fix" },
  { id: "2716", src: img2716, title: "Image 2716 - Marked Areas to Fix" },
  { id: "2717", src: img2717, title: "Image 2717 - Marked Areas to Fix" },
  { id: "2718", src: img2718, title: "Image 2718 - Marked Areas to Fix" },
  { id: "2719", src: img2719, title: "Image 2719 - Marked Areas to Fix" },
  { id: "2720", src: img2720, title: "Image 2720 - Marked Areas to Fix" },
];

export default function DebugImages() {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug: Viewing Marked Areas</h1>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          {images.map((img, index) => (
            <Button
              key={img.id}
              variant={currentImage === index ? "default" : "outline"}
              onClick={() => setCurrentImage(index)}
              className="text-xs"
            >
              {img.title}
            </Button>
          ))}
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{images[currentImage]?.title}</h2>
            <div className="flex justify-center">
              <img 
                src={images[currentImage]?.src} 
                alt={images[currentImage]?.title}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '80vh' }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Image {currentImage + 1} of {images.length} - Use buttons above to navigate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}