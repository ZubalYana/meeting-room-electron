import { startOfWeek, addDays } from "date-fns";

export function getWeek(startDate: Date) {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
