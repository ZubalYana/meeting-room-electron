import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
} from "@mui/material";

const API_URL = "http://localhost:5000/rooms";
const ACCENT = "#4f46e5";

interface Room {
    _id: string;
    name: string;
    capacity: number;
    location: string;
    description?: string;
    advantages?: string;
}

export default function RoomList({
    reloadTrigger,
}: {
    reloadTrigger?: boolean;
}) {
    const [rooms, setRooms] = useState<Room[]>([]);

    const loadRooms = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setRooms(Array.isArray(data) ? data : data.rooms ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRooms();
    }, [reloadTrigger]);

    return (
        <Box sx={{ py: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                }}
            >
                Rooms
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1.5fr 3fr 2fr",
                    px: 2,
                    py: 1,
                    color: "text.secondary",
                    fontSize: 13,
                    fontWeight: 500,
                }}
            >
                <span>Name</span>
                <span>Capacity</span>
                <span>Location</span>
                <span>Description</span>
                <span>Advantages</span>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {rooms.map(room => (
                    <Card
                        key={room._id}
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                borderColor: ACCENT,
                                boxShadow: `0 4px 12px ${ACCENT}22`,
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1.5fr 3fr 2fr",
                                alignItems: "center",
                                py: "12px !important",
                            }}
                        >
                            <Typography fontWeight={600}>
                                {room.name}
                            </Typography>

                            <Typography variant="body2">
                                {room.capacity}
                            </Typography>

                            <Typography variant="body2">
                                {room.location}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={room.description}
                            >
                                {room.description || "—"}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={room.advantages}
                            >
                                {room.advantages || "—"}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
