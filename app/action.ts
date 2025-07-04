"use server";

import { ListingSchema, ListingSchemaType } from "@/types/posts";
import { createClient } from "@/utils/supabase/server";

export async function createNewPost(formData: FormData) {
  // Extract values from FormData
  const rawData: Partial<ListingSchemaType> = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    seller_email: formData.get("seller_email") as string,
  };

  const file = formData.get("file") as File | null;

  // Validate using Zod
  const result = ListingSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  // Insert post
  const { data: postData, error: postError } = await supabase
    .from("listings")
    .insert(result.data)
    .select("id")
    .single();

  if (postError) {
    throw new Error(postError.message);
  }

  // Upload image if present
  if (file && file.size > 0) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${postData.id}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("wall-photos")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("wall-photos").getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("listings")
      .update({ image_url: publicUrl })
      .eq("id", postData.id);

    if (updateError) {
      console.error("Error updating post with image URL:", updateError);
    }
  }

  return postData;
}
