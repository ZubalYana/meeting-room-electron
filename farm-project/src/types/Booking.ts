export interface Booking {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    user: {
        _id: string;
        email: string;
    };
    room: {
        _id: string;
        name: string;
    };
}
