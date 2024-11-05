'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addEvent } from "@/src/lib/events";
import { eventFormSchema, type EventFormValues } from "@/src/lib/validations/event";
import { useBooks } from "@/src/hooks/useBooks";
import { Badge, CalendarIcon, XIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Timestamp } from "firebase/firestore";

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { books } = useBooks();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      type: "meeting",
      bookIds: [],
      context: {
        goals: "",
        attendees: [],
        location: "",
      },
      memoPreferences: {
        format: "bullet",
        sendTime: 24,
      },
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await addEvent(user.uid, {
        ...data,
        date: Timestamp.fromDate(data.date),
      });
      
      toast({
        title: "Event created",
        description: "Your event has been scheduled",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error creating event",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bookIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Books</FormLabel>
              <Select
                onValueChange={(value) => field.onChange([...field.value, value])}
                value=""
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose books to reference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {books
                    .filter(book => !field.value.includes(book.id))
                    .map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map(bookId => {
                  const book = books.find(b => b.id === bookId);
                  return book ? (
                    <Badge
                      key={bookId}
                      className="flex items-center gap-1"
                    >
                      {book.title}
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value.filter(id => id !== bookId))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="context.goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Goals</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What do you want to achieve in this event?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="context.location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memoPreferences.sendTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Memo</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="When to send memo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 hour before</SelectItem>
                    <SelectItem value="2">2 hours before</SelectItem>
                    <SelectItem value="24">24 hours before</SelectItem>
                    <SelectItem value="48">48 hours before</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="memoPreferences.format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memo Format</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose memo format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="framework">Framework</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Creating Event...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  );
} 