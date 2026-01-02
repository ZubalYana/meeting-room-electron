import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useBookings } from "../hooks/useBookings";
import "../main.css";

const ROOM_TIMEZONE = "Europe/Kiev";

export function WeeklyRoomCalendar() {
    const { bookings, loading } = useBookings();

    if (loading) return <p>Loading bookings...</p>;

    const events = bookings.map((b) => {
        const datePart = b.date.split("T")[0];
        const start = `${datePart}T${b.startTime}:00`;
        const end = `${datePart}T${b.endTime}:00`;

        return {
            id: b._id,
            title: b.room.name || "Booked Room",
            start: start,
            end: end,
            extendedProps: {
                roomName: b.room.name
            }
        };
    });

    return (
        <div className="weekly-room-calendar">
            <h2 className="calendar-title">Weekly room schedule</h2>

            <FullCalendar
                plugins={[timeGridPlugin]}
                timeZone={ROOM_TIMEZONE}
                initialView="timeGridWeek"
                headerToolbar={false}

                firstDay={1}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                slotDuration="00:30:00"

                events={events}
                height="auto"

                eventContent={(arg) => {
                    return (
                        <div className="calendar-event">
                            <div className="calendar-event-content">
                                <div className="calendar-event-title">
                                    {arg.event.title}
                                </div>
                                <div className="calendar-event-time">
                                    {arg.timeText}
                                </div>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
}