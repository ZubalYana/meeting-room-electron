import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Paper, Typography, CircularProgress, Alert } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const API_URL = "http://localhost:5000";

interface RoomStat {
    _id: string;
    roomName: string;
    count: number;
}

export default function RoomStatsChart() {
    const [stats, setStats] = useState<RoomStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/bookings/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
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

    if (loading) return <CircularProgress />;
    if (stats.length === 0) return <Alert severity="info">No booking data yet.</Alert>;

    const chartData = {
        labels: stats.map((s) => s.roomName),
        datasets: [
            {
                label: "Bookings",
                data: stats.map((s) => s.count),
                backgroundColor: "rgba(79, 70, 229, 0.8)",
                hoverBackgroundColor: "#4338ca",
                borderRadius: 6,
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#1f2937",
                padding: 12,
                titleFont: { family: "Montserrat", size: 13 },
                bodyFont: { family: "Montserrat", size: 13 },
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: "Montserrat" },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#f3f4f6",
                    borderDash: [5, 5],
                },
                ticks: {
                    stepSize: 1,
                    font: { family: "Montserrat" },
                },
            },
        },
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: 'Montserrat' }}>
                Popularity Statistics
            </Typography>

            <Box sx={{ height: 300, width: "100%" }}>
                <Bar data={chartData} options={options} />
            </Box>
        </Paper>
    );
}