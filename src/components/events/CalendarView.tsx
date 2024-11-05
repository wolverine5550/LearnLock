'use client';

import { useEvents } from "@/src/hooks/useEvents";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Card } from "@/components/ui/card";
import { Spinner } from "@/src/components/ui/spinner";

export function CalendarView() {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date.toDate(),
    end: new Date(event.date.toDate().getTime() + 60 * 60 * 1000), // 1 hour duration
    extendedProps: {
      type: event.type,
      goals: event.context.goals,
      location: event.context.location,
    },
  }));

  return (
    <Card className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
        eventDisplay="block"
        eventClassNames={(arg) => [
          'cursor-pointer',
          `event-type-${arg.event.extendedProps.type}`
        ]}
        eventContent={(arg) => (
          <div className="p-1 text-xs">
            <div className="font-medium">{arg.event.title}</div>
            {arg.event.extendedProps.location && (
              <div className="text-muted-foreground">
                📍 {arg.event.extendedProps.location}
              </div>
            )}
          </div>
        )}
      />
    </Card>
  );
} 