import { useState, useEffect } from "react";
import { Box, TextField, Button, Alert, MenuItem } from "@mui/material";

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
    const [inviteList, setInviteList] = useState("");

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

        const attendees = inviteList
            .split(",")
            .map(email => email.trim())
            .filter(email => email !== "");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ roomId, date, startTime, endTime, attendees })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error booking room");

            setSuccess("Room booked and invitations sent!");
            setRoomId(""); setDate(""); setStartTime(""); setEndTime(""); setInviteList("");

            if (onBookingCreated) onBookingCreated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, margin: "20px auto" }}>
            <h4 style={{ margin: "0", fontSize: "1.3rem" }}>Book a Room</h4>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField select label="Room" value={roomId} onChange={e => setRoomId(e.target.value)}>
                {rooms.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
            </TextField>

            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={e => setDate(e.target.value)} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField sx={{ flex: 1 }} label="Start Time" type="time" InputLabelProps={{ shrink: true }} value={startTime} onChange={e => setStartTime(e.target.value)} />
                <TextField sx={{ flex: 1 }} label="End Time" type="time" InputLabelProps={{ shrink: true }} value={endTime} onChange={e => setEndTime(e.target.value)} />
            </Box>

            <TextField
                label="Invite Guests (comma separated emails)"
                placeholder="colleague@example.com, boss@example.com"
                multiline
                rows={2}
                value={inviteList}
                onChange={e => setInviteList(e.target.value)}
            />

            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#4f46e5" }}>Book & Invite</Button>
        </Box>
    );
}