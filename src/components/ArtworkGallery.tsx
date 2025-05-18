import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase"; // ✅ adjust path as needed

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
}

const ArtworkGrid: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // ✅ Load images from Firebase Storage
  const loadArtworks = async () => {
    const folderRef = ref(storage, "images");
    const result = await listAll(folderRef);
    const urls = await Promise.all(
      result.items.map(async (itemRef, index) => {
        const url = await getDownloadURL(itemRef);
        return {
          id: itemRef.name,
          title: itemRef.name.split("-")[1]?.split(".")[0] || `Artwork ${index + 1}`,
          imageUrl: url,
        };
      })
    );
    setArtworks(urls);
  };

  useEffect(() => {
    loadArtworks(); // Load once on mount

    const interval = setInterval(() => {
      loadArtworks();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Artwork Gallery</h1>

      {artworks.length === 0 ? (
        <p>No artworks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map(({ id, title, imageUrl }) => (
            <Card
              key={id}
              className="overflow-hidden h-full flex flex-col cursor-pointer"
              onClick={() => setZoomedImage(imageUrl)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>

              <CardContent className="flex-1 flex flex-col p-4">
                <h2 className="text-lg font-semibold mb-1">{title}</h2>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
          role="button"
          tabIndex={0}
        >
          <img
            src={zoomedImage}
            alt="Zoomed artwork"
            className="max-w-full max-h-full rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ArtworkGrid;
