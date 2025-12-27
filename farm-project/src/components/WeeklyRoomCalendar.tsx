import { useBookings } from "../hooks/useBookings";
import { getWeek } from "../utils/week";
import { buildZonedDate } from "../utils/datetime";
import { format, differenceInMinutes } from "date-fns";

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
                {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="row">
                        <div className="hour">{hour}:00</div>

                        {week.map(day => (
                            <div key={day.toISOString()} className="cell">
                                {bookings
                                    .filter(b =>
                                        format(new Date(b.date), "yyyy-MM-dd") ===
                                        format(day, "yyyy-MM-dd")
                                    )
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

                                        if (start.getHours() !== hour) return null;

                                        const duration =
                                            differenceInMinutes(end, start);

                                        return (
                                            <div
                                                key={b._id}
                                                className="booking"
                                                style={{
                                                    height: `${duration}px`,
                                                }}
                                            >
                                                <strong>User:</strong> {b.user}
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
