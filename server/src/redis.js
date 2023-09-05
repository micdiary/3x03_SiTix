import { createClient } from "redis";

export const redis_connection = createClient({
    url: "redis://localhost:6379",
});

redis_connection.on("error", (err) => {
	console.log("Error " + err);
});
