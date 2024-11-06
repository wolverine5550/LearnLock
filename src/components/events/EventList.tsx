'use client';

import { useEvents } from "@/src/hooks/useEvents";
import { useBooks } from "@/src/hooks/useBooks";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, BookOpenIcon, Users2Icon, MapPinIcon, Loader2Icon, BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditEventDialog } from "@/src/components/events/EditEventDialog";
import { DeleteEventDialog } from "@/src/components/events/DeleteEventDialog";
import { CalendarSync } from "@/src/components/events/CalendarSync";
import { useCalendarSync } from "@/src/hooks/useCalendarSync";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/src/components/events/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReminders } from "@/src/hooks/useReminders";
import { NotificationPreferences } from "@/src/components/events/NotificationPreferences";
import { MemoPreview } from "@/src/components/memos/MemoPreview";
import { useMemos } from "@/src/hooks/useMemos";

export function EventList() {
  const { events, loading, refetch } = useEvents();
  const { books } = useBooks();
  const { isSyncing, syncEvent, removeEvent } = useCalendarSync();
  const { isScheduling, scheduleEventReminder } = useReminders();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground text-center">
            No upcoming events. Add your first event to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="list" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <NotificationPreferences />
          </div>
          <TabsContent value="list">
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <CalendarSync />
                </div>
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(event.date.toDate(), "PPP 'at' p")}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => scheduleEventReminder(event)}
                              disabled={isScheduling}
                            >
                              {isScheduling ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                              ) : (
                                <BellIcon className="h-4 w-4" />
                              )}
                            </Button>
                            <EditEventDialog event={event} onUpdate={refetch} />
                            <DeleteEventDialog
                              eventId={event.id}
                              eventTitle={event.title}
                              onDelete={() => {
                                removeEvent(event.id);
                                refetch();
                              }}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <BookOpenIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Referenced Books:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {event.bookIds.map(bookId => {
                                  const book = books.find(b => b.id === bookId);
                                  return book ? (
                                    <Badge key={bookId} variant="secondary">
                                      {book.title}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>

                          {event.context.attendees && event.context.attendees.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Users2Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Attendees:</p>
                                <p className="text-sm text-muted-foreground">
                                  {event.context.attendees.join(', ')}
                                </p>
                              </div>
                            </div>
                          )}

                          {event.context.location && (
                            <div className="flex items-start gap-2">
                              <MapPinIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Location:</p>
                                <p className="text-sm text-muted-foreground">
                                  {event.context.location}
                                </p>
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium">Goals:</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.context.goals}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Memo Preferences:</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.memoPreferences.format} format, {event.memoPreferences.sendTime} hours before
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <MemoPreview
                            event={event}
                            books={books.filter(book => 
                              event.bookIds.includes(book.id)
                            )}
                            format={event.memoPreferences.format}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 