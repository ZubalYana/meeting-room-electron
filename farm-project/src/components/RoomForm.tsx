import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const API_URL = "http://localhost:5000/api/rooms";

export default function RoomForm({ onRoomCreated }: { onRoomCreated: () => void }) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState<number | "">("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        if (!name || !capacity || !location) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, capacity, location, description }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error creating room");
            setName(""); setCapacity(""); setLocation(""); setDescription("");
            onRoomCreated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, margin: "20px auto" }}>
            <Typography variant="h6">Create New Room</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField label="Capacity" type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} fullWidth />
            <TextField label="Location" value={location} onChange={e => setLocation(e.target.value)} fullWidth />
            <TextField label="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handleSubmit}>Create Room</Button>
        </Box>
    );
}
