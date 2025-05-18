import { supabase } from "./supabase";
import { Artwork, ArtworkFormData, Tag } from "../types/artwork";

// Generate a unique filename for uploaded images
const generateUniqueFileName = (file: File) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Fetch all artworks
export const fetchArtworks = async (): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*, artwork_tags(tag_id, tags(id, name))")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Process the data to format tags correctly
    return data.map((artwork: any) => {
      const tags =
        artwork.artwork_tags?.map((tagRelation: any) => tagRelation.tags) || [];
      return {
        ...artwork,
        tags,
        artwork_tags: undefined, // Remove the join table data
      };
    });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};

// Fetch artwork by ID
export const fetchArtworkById = async (id: string): Promise<Artwork | null> => {
  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*, artwork_tags(tag_id, tags(id, name))")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Process tags
    const tags =
      data.artwork_tags?.map((tagRelation: any) => tagRelation.tags) || [];
    return {
      ...data,
      tags,
      artwork_tags: undefined,
    };
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return null;
  }
};

// Fetch all tags
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

// Create a new tag
export const createTag = async (name: string): Promise<Tag | null> => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
};

// Upload artwork image to Supabase storage
export const uploadArtworkImage = async (
  file: File,
): Promise<string | null> => {
  try {
    const filename = generateUniqueFileName(file);
    const { data, error } = await supabase.storage
      .from("artwork-images")
      .upload(filename, file);

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("artwork-images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Create artwork with tags
export const createArtwork = async (
  formData: ArtworkFormData,
): Promise<Artwork | null> => {
  try {
    // 1. Upload image if provided
    let imageUrl = null;
    if (formData.image) {
      imageUrl = await uploadArtworkImage(formData.image);
      if (!imageUrl) throw new Error("Failed to upload image");
    }

    // 2. Create artwork record
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .insert([
        {
          title: formData.title,
          image: imageUrl,
          category: formData.category,
          medium: formData.medium,
          description: formData.description,
          year: formData.year,
          dimensions: formData.dimensions,
          artist: formData.artist,
          status: formData.status || "available",
          price: formData.price,
        },
      ])
      .select()
      .single();

    if (artworkError) throw artworkError;

    // 3. Process tags - create new ones if needed and link to artwork
    if (formData.tags && formData.tags.length > 0) {
      // Get existing tags
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", formData.tags);

      const existingTagNames = existingTags?.map((tag) => tag.name) || [];
      const newTagNames = formData.tags.filter(
        (tag) => !existingTagNames.includes(tag),
      );

      // Create new tags
      let newTags: Tag[] = [];
      if (newTagNames.length > 0) {
        const { data: createdTags } = await supabase
          .from("tags")
          .insert(newTagNames.map((name) => ({ name })))
          .select();

        if (createdTags) newTags = createdTags;
      }

      // Combine existing and new tags
      const allTags = [...(existingTags || []), ...newTags];

      // Create artwork-tag relationships
      if (allTags.length > 0) {
        await supabase.from("artwork_tags").insert(
          allTags.map((tag) => ({
            artwork_id: artwork.id,
            tag_id: tag.id,
          })),
        );
      }
    }

    // 4. Return the created artwork with tags
    return await fetchArtworkById(artwork.id);
  } catch (error) {
    console.error("Error creating artwork:", error);
    return null;
  }
};

// Update artwork
export const updateArtwork = async (
  id: string,
  formData: Partial<ArtworkFormData>,
): Promise<Artwork | null> => {
  try {
    // 1. Upload new image if provided
    let imageUrl = undefined;
    if (formData.image) {
      imageUrl = await uploadArtworkImage(formData.image);
      if (!imageUrl) throw new Error("Failed to upload image");
    }

    // 2. Update artwork record
    const updateData: any = { ...formData, image: imageUrl };
    delete updateData.tags; // Handle tags separately
    delete updateData.image; // We've already processed the image
    if (imageUrl) updateData.image = imageUrl;

    const { error: artworkError } = await supabase
      .from("artworks")
      .update(updateData)
      .eq("id", id);

    if (artworkError) throw artworkError;

    // 3. Update tags if provided
    if (formData.tags && formData.tags.length > 0) {
      // Delete existing tag relationships
      await supabase.from("artwork_tags").delete().eq("artwork_id", id);

      // Get existing tags
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", formData.tags);

      const existingTagNames = existingTags?.map((tag) => tag.name) || [];
      const newTagNames = formData.tags.filter(
        (tag) => !existingTagNames.includes(tag),
      );

      // Create new tags
      let newTags: Tag[] = [];
      if (newTagNames.length > 0) {
        const { data: createdTags } = await supabase
          .from("tags")
          .insert(newTagNames.map((name) => ({ name })))
          .select();

        if (createdTags) newTags = createdTags;
      }

      // Combine existing and new tags
      const allTags = [...(existingTags || []), ...newTags];

      // Create artwork-tag relationships
      if (allTags.length > 0) {
        await supabase.from("artwork_tags").insert(
          allTags.map((tag) => ({
            artwork_id: id,
            tag_id: tag.id,
          })),
        );
      }
    }

    // 4. Return the updated artwork with tags
    return await fetchArtworkById(id);
  } catch (error) {
    console.error("Error updating artwork:", error);
    return null;
  }
};

// Delete artwork
export const deleteArtwork = async (id: string): Promise<boolean> => {
  try {
    // 1. Get artwork to find image URL
    const artwork = await fetchArtworkById(id);

    // 2. Delete artwork record (cascade will handle tag relationships)
    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) throw error;

    // 3. Delete image from storage if it exists
    if (artwork?.image) {
      const imagePath = artwork.image.split("/").pop();
      if (imagePath) {
        await supabase.storage.from("artwork-images").remove([imagePath]);
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return false;
  }
};
