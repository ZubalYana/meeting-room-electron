import { useEffect, useState } from "react";
import { Booking } from "../types/Booking";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Missing auth token");
            setLoading(false);
            return;
        }

        fetch("http://localhost:5000/bookings", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(err || res.statusText);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                } else if (Array.isArray(data.bookings)) {
                    setBookings(data.bookings);
                } else {
                    throw new Error("Invalid bookings payload");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load bookings");
                setBookings([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return { bookings, loading, error };
}
