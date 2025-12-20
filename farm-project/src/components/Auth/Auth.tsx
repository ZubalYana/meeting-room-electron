import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import "./Auth.css";

const API_URL = "http://localhost:5000";

type AuthProps = {
    onSuccess: () => void;
};

export default function Auth({ onSuccess }: AuthProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");

    const handleSubmit = async () => {
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Request failed");
            }

            if (mode === "login") {
                localStorage.setItem("token", data.token);
                onSuccess();
            } else {
                alert("Account created, please log in");
                setMode("login");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <Box className="auth-card">
                <Typography variant="h5" className="auth-title">
                    {mode === "login" ? "Login" : "Sign up"}
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                >
                    {mode === "login" ? "Login" : "Create account"}
                </Button>

                <Button
                    variant="text"
                    fullWidth
                    onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                    }
                >
                    {mode === "login"
                        ? "No account? Sign up"
                        : "Already have an account? Login"}
                </Button>
            </Box>
        </div>
    );
}
