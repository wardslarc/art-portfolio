export interface Tag {
  id: string;
  name: string;
}

export interface Artwork {
  id: string;
  title: string;
  image: string;
  category: string;
  medium: string;
  description: string;
  year?: string;
  dimensions?: string;
  artist?: string;
  status?: "available" | "sold" | "reserved";
  price?: string;
  tags?: Tag[];
  created_at?: string;
}

export interface ArtworkFormData {
  title: string;
  image: File | null;
  category: string;
  medium: string;
  description: string;
  year?: string;
  dimensions?: string;
  artist?: string;
  status?: "available" | "sold" | "reserved";
  price?: string;
  tags: string[];
}
