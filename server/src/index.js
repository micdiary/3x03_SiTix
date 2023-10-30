import express from "express";
import cors from "cors";
import http from "http";
import fs from "fs";
import { Server } from "socket.io";

import { PORT } from "./constants.js";
import { authRouter } from "./routes/auth.js";
import { queueRouter } from "./routes/queue.js";
import { mysql_connection } from "./mysql_db.js";
import { redis_connection } from "./redis.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin.js";
import { venueRouter } from "./routes/venue.js";
import { eventRouter } from "./routes/event.js";
import { requestRouter } from "./routes/request.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// create upload route
const uploadDir = "uploads/";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Routes
app.use("/auth", authRouter);
app.use("/queue", queueRouter);
app.use("/account", accountRouter);
app.use("/admin", adminRouter);
app.use("/venue", venueRouter);
app.use("/event", eventRouter);
app.use("/request", requestRouter);

mysql_connection.connect((err) => {
	if (err) console.error("Error connecting to the database:", err);
	console.log("MySQL Connected!");
});

redis_connection.connect(
	console.log("Redis Connected on redis://busy-Shannon.cloud!")
);

const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

export let sequenceNumberByClient = new Map();

io.on("connection", (socket) => {
	console.log(`User connected with socket id: ${socket.id}`);

	// initialize this client's sequence number
	sequenceNumberByClient.set(socket, sequenceNumberByClient.size);

	socket.on("queueUpdate", (message) => {
		// Send a message to a specific client or broadcast it to all clients
		socket.emit("queueUpdate", message); // To a specific client
		// io.emit('queueUpdate', message); // Broadcast to all connected clients
	});

	socket.on("disconnect", () => {
		sequenceNumberByClient.delete(socket);
		console.log("User disconnected");
	});
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
