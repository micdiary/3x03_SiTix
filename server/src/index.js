import express from "express";
import cors from "cors";

import { PORT } from "./constants.js";
import { authRouter } from "./routes/auth.js";
import { mysql_connection } from "./mysql_db.js";
import { redis_connection } from "./redis.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Routes
app.use("/auth", authRouter);

mysql_connection.connect((err) => {
	if (err) console.error("Error connecting to the database:", err);
	console.log("MySQL Connected!");
});

await redis_connection.connect();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
