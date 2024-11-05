import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  type: z.enum(['meeting', 'presentation', 'interview', 'other']),
  date: z.date()
    .min(new Date(), "Event date must be in the future"),
  bookIds: z.array(z.string())
    .min(1, "Select at least one book"),
  context: z.object({
    goals: z.string()
      .min(1, "Goals are required")
      .max(500, "Goals must be less than 500 characters"),
    attendees: z.array(z.string()).optional(),
    location: z.string().optional(),
  }),
  memoPreferences: z.object({
    format: z.enum(['bullet', 'narrative', 'framework']),
    sendTime: z.number()
      .min(1, "Must be at least 1 hour before")
      .max(48, "Must be within 48 hours"),
  }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>; 