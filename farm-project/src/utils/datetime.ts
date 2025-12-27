import { toZonedTime } from "date-fns-tz";

export function buildZonedDate(
    dateISO: string,
    time: string,
    timezone: string
): Date {
    const [hours, minutes] = time.split(":").map(Number);

    const utcDate = new Date(dateISO);
    utcDate.setUTCHours(hours, minutes, 0, 0);

    return toZonedTime(utcDate, timezone);
}
