import { useBookings } from "../hooks/useBookings";
import { getWeek } from "../utils/week";
import { buildZonedDate } from "../utils/datetime";
import { format, differenceInMinutes } from "date-fns";
import {
    CALENDAR_START_HOUR,
    CALENDAR_END_HOUR,
} from "../config/calendar";
const hours = Array.from(
    { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
    (_, i) => i + CALENDAR_START_HOUR
);
const ROOM_TIMEZONE = "Europe/Kiev";

export function WeeklyRoomCalendar() {
    const { bookings, loading } = useBookings();
    const week = getWeek(new Date());
    console.log("BOOKINGS:", bookings, Array.isArray(bookings));

    if (loading) return <p>Loading bookings…</p>;

    return (
        <div className="calendar">
            <div className="header">
                <div />
                {week.map(day => (
                    <div key={day.toISOString()} className="day-header">
                        {format(day, "EEE dd")}
                    </div>
                ))}
            </div>

            <div className="grid">
                {hours.map(hour => (
                    <div key={hour} className="row">
                        <div className="hour">
                            {String(hour).padStart(2, "0")}:00
                        </div>

                        {week.map(day => (
                            <div key={day.toISOString()} className="cell">
                                {bookings
                                    .filter(b => {
                                        const start = buildZonedDate(
                                            b.date,
                                            b.startTime,
                                            ROOM_TIMEZONE
                                        );

                                        return (
                                            start.getHours() === hour &&
                                            start.toDateString() === day.toDateString()
                                        );
                                    })
                                    .map(b => {
                                        const start = buildZonedDate(
                                            b.date,
                                            b.startTime,
                                            ROOM_TIMEZONE
                                        );
                                        const end = buildZonedDate(
                                            b.date,
                                            b.endTime,
                                            ROOM_TIMEZONE
                                        );

                                        const durationMinutes =
                                            (end.getTime() - start.getTime()) / 60000;

                                        return (
                                            <div
                                                key={b._id}
                                                className="booking"
                                                style={{
                                                    height: `${durationMinutes}px`,
                                                    padding: '10px'
                                                }}
                                            >
                                                <p style={{ margin: "0px" }}><strong>User:</strong> {b.user.email}</p>
                                                <br />
                                                <p style={{ margin: "0px" }}><strong>Room:</strong> {b.room.name}</p>
                                                <br />
                                                {b.startTime} – {b.endTime}
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                ))}

            </div>
        </div>
    );
}
