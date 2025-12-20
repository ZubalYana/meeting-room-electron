import { useState } from "react";
import RoomForm from "../components/RoomForm";
import RoomList from "../components/RoomList";
import { Button, Dialog, DialogContent } from "@mui/material";

export default function Dashboard() {
    const [reloadRooms, setReloadRooms] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const handleOpen = () => setOpenForm(true);
    const handleClose = () => setOpenForm(false);

    return (
        <div style={{ padding: "15px" }}>
            <h2>Meeting Rooms</h2>

            <Button variant="contained" onClick={handleOpen} sx={{ marginBottom: 2 }}>
                Create New Room
            </Button>

            <Dialog open={openForm} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <RoomForm
                        onRoomCreated={() => {
                            setReloadRooms(prev => !prev);
                            handleClose();
                        }}
                    />
                </DialogContent>
            </Dialog>

            <RoomList reloadTrigger={reloadRooms} />
        </div>
    );
}
