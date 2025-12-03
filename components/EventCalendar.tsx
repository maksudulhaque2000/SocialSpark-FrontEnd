'use client';

import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Event } from '@/types';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Image from 'next/image';

// Setup the localizer for react-big-calendar using date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}

interface EventCalendarProps {
  events: Event[];
  loading?: boolean;
}

export default function EventCalendar({ events, loading = false }: EventCalendarProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map((event) => {
      const eventDate = new Date(event.date);
      const [hours, minutes] = event.time.split(':').map(Number);
      eventDate.setHours(hours, minutes);

      return {
        id: event._id,
        title: event.title,
        start: eventDate,
        end: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), // Assume 2 hours duration
        resource: event,
      };
    });
  }, [events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    let backgroundColor = '#3B82F6'; // blue
    
    if (status === 'ongoing') {
      backgroundColor = '#10B981'; // green
    } else if (status === 'completed') {
      backgroundColor = '#6B7280'; // gray
    } else if (status === 'cancelled') {
      backgroundColor = '#EF4444'; // red
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-300 rounded w-1/3"></div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiCalendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Event Calendar</h2>
        </div>

        <div style={{ height: '600px' }} className="calendar-container">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            popup
            selectable
            style={{ height: '100%' }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-sm text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600">Ongoing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedEvent.bannerImage && (
              <Image
                src={selectedEvent.bannerImage}
                alt={selectedEvent.title}
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="text-blue-600" />
                <span>{format(new Date(selectedEvent.date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiClock className="text-green-600" />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="text-red-600" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers className="text-purple-600" />
                <span>
                  {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants} participants
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 line-clamp-3">{selectedEvent.description}</p>

            <button
              onClick={() => {
                router.push(`/events/${selectedEvent._id}`);
                setSelectedEvent(null);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View Event Details
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .calendar-container .rbc-calendar {
          font-family: inherit;
        }
        .calendar-container .rbc-header {
          padding: 10px 5px;
          font-weight: 600;
          background-color: #F3F4F6;
        }
        .calendar-container .rbc-today {
          background-color: #EFF6FF;
        }
        .calendar-container .rbc-toolbar {
          padding: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .calendar-container .rbc-toolbar button {
          padding: 8px 15px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          background-color: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .calendar-container .rbc-toolbar button:hover {
          background-color: #F3F4F6;
        }
        .calendar-container .rbc-toolbar button.rbc-active {
          background-color: #3B82F6;
          color: white;
          border-color: #3B82F6;
        }
        .calendar-container .rbc-event {
          padding: 2px 5px;
          font-size: 13px;
          cursor: pointer;
        }
        .calendar-container .rbc-event:hover {
          opacity: 1 !important;
        }
        .calendar-container .rbc-show-more {
          color: #3B82F6;
          font-weight: 500;
          cursor: pointer;
        }
        .calendar-container .rbc-month-view {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }
        .calendar-container .rbc-day-bg {
          border-color: #E5E7EB;
        }
        .calendar-container .rbc-off-range-bg {
          background-color: #F9FAFB;
        }
      `}</style>
    </div>
  );
}
