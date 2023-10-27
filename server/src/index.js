import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";

import { PORT } from "./constants.js";
import { authRouter } from "./routes/auth.js";
import { mysql_connection } from "./mysql_db.js";
import { redis_connection } from "./redis.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin.js";
import { venueRouter } from "./routes/venue.js";
import { eventRouter } from "./routes/event.js";
import { requestRouter } from "./routes/request.js";
import { orderRouter } from "./routes/order.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "https://tix.busy-shannon.cloud" }));

// create upload route
const uploadDir = "uploads/";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Routes
const prefix = "/api";
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/account`, accountRouter);
app.use(`${prefix}/admin`, adminRouter);
app.use(`${prefix}/venue`, venueRouter);
app.use(`${prefix}/event`, eventRouter);
app.use(`${prefix}/request`, requestRouter);
app.use(`${prefix}/order`, orderRouter);

mysql_connection.connect((err) => {
	if (err) console.error("Error connecting to the database:", err);
	console.log("MySQL Connected!");
});

redis_connection.connect(
	console.log("Redis Connected on redis://www.busy-Shannon.cloud:8080!")
);

const server = https.createServer(app);

app.get("/set-cookie", (req, res) => {
	res.cookie("name", "value", {
		secure: true, // set to true if your using https
		httpOnly: true,
		// This attribute can help prevent cross-site request forgery (CSRF) attacks. In many cases, it's beneficial to set this attribute to "Strict."
		sameSite: "Strict", // None, Lax, or Strict
		path: "/", // specify cookie path
		expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
	});

	res.send("Cookie is set");
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
