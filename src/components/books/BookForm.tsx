'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addBook } from "@/src/lib/books";
import { bookFormSchema, type BookFormValues } from "@/src/lib/validations/book";
import { TagInput } from "@/src/components/books/TagInput";
import { useSubscription } from "@/src/hooks/useSubscription";
import { RichTextEditor } from "@/src/components/editor/RichTextEditor";

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

export function BookForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { canAddBooks, isFreeTier, remainingBooks } = useSubscription();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      tags: [],
      userNotes: "",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    if (!user) return;
    if (!canAddBooks) {
      toast({
        variant: "destructive",
        title: "Book limit reached",
        description: "Upgrade to premium to add unlimited books",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addBook(user.uid, data);
      
      toast({
        title: "Book added successfully",
        description: isFreeTier 
          ? `You can add ${remainingBooks - 1} more book${remainingBooks - 1 !== 1 ? 's' : ''}`
          : "Your book has been added to your library",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        variant: "destructive",
        title: "Error adding book",
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  tags={field.value}
                  onChange={field.onChange}
                  maxTags={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
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
              Adding Book...
            </>
          ) : (
            "Add Book"
          )}
        </Button>
      </form>
    </Form>
  );
} 