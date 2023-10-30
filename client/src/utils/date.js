export function formatDate(eventDate) {
    const date = eventDate.toLocaleDateString("en-US");
    const day = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
    });
    const time = eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return { date, day, time };
}
