import { createClient } from "redis";
import { REDIS_PASSWORD } from "./constants.js";

export const redis_connection = createClient({
	url: "redis://redis:6379",
    password: REDIS_PASSWORD,
});

redis_connection.on("error", (err) => {
	console.log("Error " + err);
});
