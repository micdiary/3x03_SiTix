import { createClient } from "redis";
import { REDIS_PASSWORD } from "./constants.js";

export const redis_connection = createClient({
	url: "redis://www.busy-Shannon.cloud:8080",
    password: REDIS_PASSWORD,
});

redis_connection.on("error", (err) => {
	console.log("Error " + err);
});
