import * as z from "zod";

export const bookFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  author: z.string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  tags: z.array(z.string())
    .default([])
    .transform(tags => tags.filter(Boolean)), // Remove empty tags
  userNotes: z.string()
    .max(2000, "Notes must be less than 2000 characters")
    .optional()
    .default(""),
});

export type BookFormValues = z.infer<typeof bookFormSchema>; 