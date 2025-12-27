import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert, MenuItem } from "@mui/material";

const API_URL = "http://localhost:5000";

interface Room {
    _id: string;
    name: string;
}

export default function BookRoom({ onBookingCreated }: { onBookingCreated?: () => void }) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomId, setRoomId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadRooms = async () => {
            const res = await fetch(`${API_URL}/rooms`);
            const data = await res.json();
            setRooms(data);
        };
        loadRooms();
    }, []);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        if (!roomId || !date || !startTime || !endTime) {
            setError("All fields are required");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ roomId, date, startTime, endTime })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error booking room");

            setSuccess("Room booked successfully!");
            setRoomId(""); setDate(""); setStartTime(""); setEndTime("");

            if (onBookingCreated) onBookingCreated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, margin: "20px auto" }}>
            <Typography variant="h6">Book a Room</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField select label="Room" value={roomId} onChange={e => setRoomId(e.target.value)}>
                {rooms.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
            </TextField>
            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={e => setDate(e.target.value)} />
            <TextField label="Start Time" type="time" InputLabelProps={{ shrink: true }} value={startTime} onChange={e => setStartTime(e.target.value)} />
            <TextField label="End Time" type="time" InputLabelProps={{ shrink: true }} value={endTime} onChange={e => setEndTime(e.target.value)} />
            <Button variant="contained" onClick={handleSubmit}>Book Room</Button>

        </Box>
    );
}
