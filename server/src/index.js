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

import rateLimit from "express-rate-limit";
import { logger } from "./utils/logger.js";

const app = express();

// Use winston middleware for logging incoming requests with route information
app.use((req, res, next) => {
  	const method = req.method;
  	const url = req.originalUrl;

  // Log the route information
	logger.info(`Received ${method} request for ${url}`);
  	next();
});

app.use(express.json());
app.use(cors({ credentials: true, origin: "https://tix.busy-shannon.cloud" }));

// Define rate limiting middleware
const limiter = rateLimit({
	windowMs:  1000, // 1 sec
  	max: 5, // limit each IP to 5 request per second
  	message: "Too many requests, please wait to try again later.", // message to send back when rate-limited
  	headers: false, // not sending X-RateLimit-* headers with the rate limit and the number of requests
});

app.use(limiter);

// create upload route
const uploadDir = "uploads/";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// SSL certificate and key files
const serverOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

const server = https.createServer(serverOptions, app);

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
	if (err) {
		logger.error(`Error connecting to the database: ${err}`);
		console.error("Error connecting to the database:", err);
	}
	else{
		// logger.info("MySQL Connected!");
		console.log("MySQL Connected!");
	}
});

redis_connection.connect(
	console.log("Redis Connected on redis://busy-Shannon.cloud!"),
	// logger.info("Redis Connected on redis://busy-Shannon.cloud!")
);

redis_connection.on('error',(err) => {
  	logger.error(`Error connecting to Redis: ${err}`);
  	console.error("Error connecting to the database:", err);
});

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

//test to see if curl /test will get back response
app.get('/', (req, res) => {
	logger.info('Got get request');
	const responseData = "response from express";
	logger.info(`Response: ${responseData}`);
	//res.send('response from express');
	res.send(responseData);
}) 

//Error Handling with Winston
app.use((err, req, res, next) => {
	logger.error(err.stack);

	if (err.response) {
		logger.error(`Error Response: ${JSON.stringify(err.response.data)}`);
	}
	else {
		logger.error(`Error Object: ${JSON.stringify(err)}`);
	}

	res.status(500).send('Something went wrong!');
});

server.listen(PORT, () => {
	logger.info(`Server started on port ${PORT}`);
	console.log(`Server started on port ${PORT}`);
});

