import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Tag as TagIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ArtworkUploadForm from "./ArtworkUploadForm";
import { Artwork } from "../types/artwork";
import { fetchArtworks, deleteArtwork } from "../lib/artworkService";

const ArtworkManagement = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    setIsLoading(true);
    try {
      const data = await fetchArtworks();
      setArtworks(data);
    } catch (error) {
      console.error("Error loading artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsUploadDialogOpen(true);
  };

  const handleDeleteClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArtwork) return;

    try {
      const success = await deleteArtwork(selectedArtwork.id);
      if (success) {
        setArtworks(artworks.filter((art) => art.id !== selectedArtwork.id));
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedArtwork(null);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    setSelectedArtwork(null);
    loadArtworks();
  };

  const handleCancelUpload = () => {
    setIsUploadDialogOpen(false);
    setSelectedArtwork(null);
  };

  // Get unique categories for tabs
  const categories = ["all", ...new Set(artworks.map((art) => art.category))];

  // Filter artworks based on active tab
  const filteredArtworks =
    activeTab === "all"
      ? artworks
      : artworks.filter((art) => art.category === activeTab);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Artwork Management</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Artwork
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        <TabsList className="flex flex-wrap justify-start mb-6 overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredArtworks.map((artwork) => (
                  <motion.div
                    key={artwork.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={() => handleEditArtwork(artwork)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={() => handleDeleteClick(artwork)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {artwork.status && (
                        <div className="absolute bottom-2 right-2">
                          <Badge
                            className={`${artwork.status === "available" ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : artwork.status === "sold" ? "bg-red-500/20 text-red-700 hover:bg-red-500/30" : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"}`}
                          >
                            {artwork.status.charAt(0).toUpperCase() +
                              artwork.status.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-1">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {artwork.medium}
                        {artwork.year && ` • ${artwork.year}`}
                      </p>
                      <p className="text-sm line-clamp-2 mb-3">
                        {artwork.description}
                      </p>
                      {artwork.tags && artwork.tags.length > 0 && (
                        <div className="mt-auto pt-2">
                          <div className="flex flex-wrap gap-1">
                            {artwork.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                              >
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag.name}
                              </Badge>
                            ))}
                            {artwork.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{artwork.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">
                No artworks found in this category.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Artwork
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload/Edit Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedArtwork ? "Edit Artwork" : "Upload New Artwork"}
            </DialogTitle>
          </DialogHeader>
          <ArtworkUploadForm
            onSuccess={handleUploadSuccess}
            onCancel={handleCancelUpload}
            existingArtwork={selectedArtwork || undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the artwork "{selectedArtwork?.title}
              " and remove it from the gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArtworkManagement;
