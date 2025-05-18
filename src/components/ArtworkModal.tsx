import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Tag as TagIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Artwork as ArtworkType } from "../types/artwork";

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    id: string;
    title: string;
    imageUrl: string;
    medium: string;
    description: string;
    year?: string;
    dimensions?: string;
    artist?: string;
    status?: "available" | "sold" | "reserved";
    price?: string;
    tags?: { id: string; name: string }[];
    category?: string;
  };
  onPrevious: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ArtworkModal = ({
  isOpen = false,
  onClose = () => {},
  artwork = {
    id: "1",
    title: "Sample Artwork",
    imageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
    medium: "Digital Illustration",
    description:
      "A beautiful digital illustration showcasing vibrant colors and intricate details.",
    year: "2023",
    dimensions: "3000 x 2000 px",
    status: "available" as const,
    price: "$250",
  },
  onPrevious = () => {},
  onNext = () => {},
  hasNext = true,
  hasPrevious = true,
}: ArtworkModalProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Reset states when artwork changes
    setIsImageLoaded(false);
    setShowInfo(false);
  }, [artwork.id]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    // Here you would also make an API call to update the like status in your database
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    // If comments are being shown, you might want to fetch the latest comments here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background border-none overflow-hidden">
        <div className="relative w-full h-full flex flex-col bg-background">
          {/* Top navigation bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-black/20"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLikeClick}
                      className="text-white hover:bg-black/20"
                    >
                      <Heart
                        className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span className="ml-1 text-xs">{likeCount}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? "Unlike" : "Like"} this artwork</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleComments}
                      className="text-white hover:bg-black/20"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="ml-1 text-xs">{commentCount}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View comments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleInfo}
                      className="text-white hover:bg-black/20"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Artwork Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main image container */}
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={artwork.id}
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-w-full max-h-[85vh] object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onLoad={handleImageLoad}
              />
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 p-4">
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 p-4">
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>

          {/* Artwork info panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md text-white p-6"
              >
                <h2 className="text-2xl font-bold mb-2">{artwork.title}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3 text-sm">
                  {artwork.artist && (
                    <p>
                      <span className="text-gray-300">Artist:</span>{" "}
                      {artwork.artist}
                    </p>
                  )}
                  <p>
                    <span className="text-gray-300">Medium:</span>{" "}
                    {artwork.medium}
                  </p>
                  {artwork.category && (
                    <p>
                      <span className="text-gray-300">Category:</span>{" "}
                      <span className="capitalize">{artwork.category}</span>
                    </p>
                  )}
                  {artwork.year && (
                    <p>
                      <span className="text-gray-300">Year:</span>{" "}
                      {artwork.year}
                    </p>
                  )}
                  {artwork.dimensions && (
                    <p>
                      <span className="text-gray-300">Dimensions:</span>{" "}
                      {artwork.dimensions}
                    </p>
                  )}
                </div>

                <p className="text-gray-200 mb-4">{artwork.description}</p>

                {/* Tags */}
                {artwork.tags && artwork.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="bg-white/10 hover:bg-white/20 text-white"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status and price */}
                {artwork.status && (
                  <div className="flex justify-end items-center">
                    <div className="flex flex-col items-end">
                      {artwork.price && (
                        <p className="text-white font-semibold">
                          {artwork.price}
                        </p>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${artwork.status === "available" ? "bg-green-500/20 text-green-300" : artwork.status === "sold" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}
                      >
                        {artwork.status.charAt(0).toUpperCase() +
                          artwork.status.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md text-white p-6 max-h-[60vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Comments ({commentCount})
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleComments}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Comment input */}
                <div className="flex gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                  <div className="flex-1 bg-white/10 rounded-lg p-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Post
                  </Button>
                </div>

                {/* Sample comments */}
                {commentCount > 0 ? (
                  <div className="space-y-4">
                    {[...Array(Math.min(3, commentCount))].map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">User {index + 1}</p>
                            <span className="text-xs text-gray-400">
                              {index === 0
                                ? "Just now"
                                : `${index + 1} days ago`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200">
                            {index === 0
                              ? "Beautiful work! I love the colors and composition."
                              : index === 1
                                ? "This piece really speaks to me. The technique is amazing!"
                                : "Incredible detail. How long did this take you to create?"}
                          </p>
                        </div>
                      </div>
                    ))}

                    {commentCount > 3 && (
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      >
                        View all {commentCount} comments
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 my-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkModal;
