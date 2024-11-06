import * as z from "zod";
import { MemoFormat } from "@/src/types/memo";

export const memoFormSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  format: z.enum(['bullet', 'narrative', 'framework'] as const, {
    required_error: "Format is required",
  }),
  bookIds: z.array(z.string()).min(1, "Select at least one book"),
  viewed: z.boolean().default(false),
  shared: z.boolean().default(false),
});

export const memoUpdateSchema = z.object({
  content: z.string().optional(),
  format: z.enum(['bullet', 'narrative', 'framework'] as const).optional(),
  status: z.enum(['pending', 'generated', 'failed'] as const).optional(),
  viewed: z.boolean().optional(),
  shared: z.boolean().optional(),
});

export type MemoFormValues = z.infer<typeof memoFormSchema>;
export type MemoUpdateValues = z.infer<typeof memoUpdateSchema>; 