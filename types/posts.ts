import { z } from "zod";

export const ListingSchema = z.object({
  id: z.string().optional(), // assuming bigint is serialized as string
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(255, { message: "Title must be 255 characters or fewer." }),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .nonnegative({ message: "Price must be a positive number." }),
  category: z
    .string()
    .min(1, { message: "Category is required." })
    .max(100, { message: "Category must be 100 characters or fewer." }),
  seller_email: z.string().email({ message: "Must be a valid email." }),
  // image_url: z.string().url({ message: "Must be a valid URL." }).optional(),
  location: z.string().optional(), // optional since there's a default in DB
  // created_at: z.string().optional(),
  // updated_at: z.string().optional(),
});

export type ListingSchemaType = z.infer<typeof ListingSchema>;
