'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { updateEvent } from "@/src/lib/events";
import { eventFormSchema, type EventFormValues } from "@/src/lib/validations/event";
import { Event } from "@/src/types/event";
import { PencilIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";

interface EditEventDialogProps {
  event: Event;
  onUpdate: () => void;
}

export function EditEventDialog({ event, onUpdate }: EditEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      type: event.type,
      date: event.date.toDate(),
      bookIds: event.bookIds,
      context: event.context,
      memoPreferences: event.memoPreferences,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      await updateEvent(event.id, {
        ...data,
        date: Timestamp.fromDate(data.date),
      });
      
      toast({
        title: "Event updated",
        description: "Your changes have been saved",
      });
      
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        variant: "destructive",
        title: "Error updating event",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        {/* Reuse the EventForm component here */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields (same as EventForm) */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 