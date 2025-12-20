import { useState } from "react";
import RoomForm from "../components/RoomForm";
import RoomList from "../components/RoomList";
import BookRoom from "../components/BookRoom";
import { Button, Dialog, DialogContent } from "@mui/material";

export default function Dashboard() {
    const [reloadRooms, setReloadRooms] = useState(false);

    const [openRoomForm, setOpenRoomForm] = useState(false);
    const handleOpenRoomForm = () => setOpenRoomForm(true);
    const handleCloseRoomForm = () => setOpenRoomForm(false);

    const [openBookRoom, setOpenBookRoom] = useState(false);
    const handleOpenBookRoom = () => setOpenBookRoom(true);
    const handleCloseBookRoom = () => setOpenBookRoom(false);

    return (
        <div style={{ padding: "15px" }}>
            <h2>Meeting Rooms</h2>

            <Button
                variant="contained"
                onClick={handleOpenRoomForm}
                sx={{ marginRight: 2, marginBottom: 2 }}
            >
                Create New Room
            </Button>

            <Button
                variant="contained"
                onClick={handleOpenBookRoom}
                sx={{ marginBottom: 2 }}
            >
                Book a Room
            </Button>

            <Dialog open={openRoomForm} onClose={handleCloseRoomForm} fullWidth maxWidth="sm">
                <DialogContent>
                    <RoomForm
                        onRoomCreated={() => {
                            setReloadRooms(prev => !prev);
                            handleCloseRoomForm();
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={openBookRoom} onClose={handleCloseBookRoom} fullWidth maxWidth="sm">
                <DialogContent>
                    <BookRoom onBookingCreated={handleCloseBookRoom} />
                </DialogContent>
            </Dialog>

            <RoomList reloadTrigger={reloadRooms} />
        </div>
    );
}
