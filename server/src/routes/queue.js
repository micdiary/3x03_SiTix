import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { redis_connection } from "../redis.js";
import { checkToken, userExists } from "./auth.js";

// Add queue
router.post("/add", async (req, res) => {
	const { queue_id } = req.body;

	await redis_connection.set(queue_id, "queue");
	return res.status(200).json({ message: "Queue added" });
});

// Join queue
router.post("/join", async (req, res) => {
	const { token, queue_id } = req.body;
	try {
		// Checking if user exists
		const { email } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		// Checking if queue exists
		if (!(await queueExists(queue_id))) {
			return res.status(409).json({ error: "Queue does not exist" });
		}

		// Add user to queue
		await redis_connection.rPush(queue_id, token);

		// Checking if user is already in queue
		if (await userFirstInQueue(token, queue_id)) {
			return res
				.status(200)
				.json({ messsage: "Please proceed to purchase your tickets" });
		}

		return res.status(200).json({ message: "User added to queue" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// check if queue exists
export const queueExists = async (queue_id) => {
	const queue = await redis_connection.get(queue_id);
	return queue !== null;
};

// check if user front of queue
export const userFirstInQueue = async (token, queue_id) => {
	const queue = await redis_connection.lRange(queue_id, 0, -1);
	return queue[0] === token;
};

export { router as queueRouter };
