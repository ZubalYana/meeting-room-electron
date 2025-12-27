import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const API_URL = "http://localhost:5000/rooms";

interface Room {
    _id: string;
    name: string;
    capacity: number;
    location: string;
    description?: string;
}

export default function RoomList({ reloadTrigger }: { reloadTrigger?: boolean }) {
    const [rooms, setRooms] = useState<Room[]>([]);

    const loadRooms = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRooms();
    }, [reloadTrigger]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, margin: "20px" }}>
            <Typography variant="h6">Rooms</Typography>
            {rooms.map(room => (
                <Card key={room._id}>
                    <CardContent>
                        <Typography variant="subtitle1">{room.name}</Typography>
                        <Typography variant="body2">Capacity: {room.capacity}</Typography>
                        <Typography variant="body2">Location: {room.location}</Typography>
                        {room.description && <Typography variant="body2">Description: {room.description}</Typography>}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
