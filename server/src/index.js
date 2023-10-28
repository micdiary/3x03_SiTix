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
app.use("/account", accountRouter);
app.use("/admin", adminRouter);
app.use("/venue", venueRouter);
app.use("/event", eventRouter);
app.use("/request", requestRouter);
app.use("/order", orderRouter);

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

// Define rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 request per minute
  message: "Too many requests, please try again later.",
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
