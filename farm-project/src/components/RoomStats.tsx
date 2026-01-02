import { useState, useEffect } from "react";
import { Box, Paper, Typography, LinearProgress, Alert } from "@mui/material";

const API_URL = "http://localhost:5000";

interface RoomStat {
    _id: string;
    roomName: string;
    count: number;
}

export default function RoomStats() {
    const [stats, setStats] = useState<RoomStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/bookings/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const maxCount = stats.length > 0 ? Math.max(...stats.map(s => s.count)) : 0;

    if (loading) return <Typography>Loading stats...</Typography>;
    if (stats.length === 0) return <Alert severity="info">No booking data available yet.</Alert>;

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                🏆 Most Popular Rooms
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {stats.map((stat) => (
                    <Box key={stat._id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 0.5 }}>
                            <Typography variant="body2" fontWeight={500}>
                                {stat.roomName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.count} bookings
                            </Typography>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={(stat.count / maxCount) * 100}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e7ff",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#4f46e5"
                                }
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}