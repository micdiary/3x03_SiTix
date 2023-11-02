import express from "express";
import cors from "cors";
import http from "http";
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
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Define rate limiting middleware
const limiter = rateLimit({
	windowMs:  1000, // 1 sec
  	max: 15, // limit each IP to 15 request per second
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

// Routes
app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/admin", adminRouter);
app.use("/venue", venueRouter);
app.use("/event", eventRouter);
app.use("/request", requestRouter);
app.use("/order", orderRouter);

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

const server = http.createServer(app);

app.get("/set-cookie", (req, res) => {
  	res.cookie("name", "value", {
    	secure: true, // set to true if your using https
    	httpOnly: true,
    	// This attribute can help prevent cross-site request forgery (CSRF) attacks. In many cases, it's beneficial to set this attribute to "Strict."
    	sameSite: "Strict", // None, Lax, or Strict
    	path: "/", // specify cookie path
    	expires: new Date(Date.now() +  900000), // cookie will be removed after 15 minutes
  });

  res.send("Cookie is set");
});

// Use winston middleware for logging response information with route information
app.use((req, res, next) => {

// Log request information
	const requestInfo = `${req.method} ${req.url} ${req.protocol}/${req.httpVersion}`;
	logger.info(`Request: ${requestInfo}`);

// // Log the response route information
// 	logger.info(`Response for ${req.method} ${req.url}: ${res.statusCode}`);
	
	//capture response body:
	const chunks = [];
	const originalWrite = res.write;
  	const originalEnd = res.end;

  	res.write = (...args) => {
    	chunks.push(Buffer.from(args[0]));
    	originalWrite.apply(res, args);
  	};

  	res.end = (...args) => {
    	if (args[0]) {
      	chunks.push(Buffer.from(args[0]));
    }

    //Log response information
	const responseInfo = `${res.statusCode} ${res.statusMessage}`;
	const responseBody = Buffer.concat(chunks).toString('utf-8');
    logger.info(`Response for ${req.method} ${req.url}: ${responseInfo}`);
    logger.info(`Response Body: ${responseBody}`);
	originalEnd.apply(res, args);
  	};

	next();
});

//Default route for testing
app.get('/', (req, res) => {
	logger.info('Request: Got get request');
	const responseData = "Got get response";
	logger.info(`Response: ${responseData}`);
	//res.send('response from express');
	res.send(responseData);
}) 

//Error Handling with Winston
app.use((err, req, res, next) => {
	logger.error(err.stack);

	if (err.response) {
		//log error response details
		logger.error(`Error Response: ${JSON.stringify(err.response.data)}`);
	}
	else {
		//log error response details
		logger.error(`Error Object: ${JSON.stringify(err)}`);
	}

	res.status(500).send('Something went wrong!');
});

server.listen(PORT, () => {
	logger.info(`Server started on port ${PORT}`);
	console.log(`Server started on port ${PORT}`);
});

