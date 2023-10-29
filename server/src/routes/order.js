import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { checkToken, refreshToken, removeSession } from "./auth.js";
import { sendEmail } from "../utils/email.js";
import { toProperCase } from "../utils/string.js";
import { getAdminId, getNumAdmins, isSuperAdmin } from "./admin.js";
import {
	JWT_SECRET,
	INTERNAL_SERVER_ERROR,
	EMAIL,
	EMAIL_PASSWORD,
	EMAIL_BODY_RESET_PASSWORD,
} from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { redis_connection } from "../redis.js";
import { getUserId } from "./account.js";
import {
	checkEventAvailability,
	getSeatTypePrice,
	reduceEventAvailability,
} from "./event.js";

const router = express.Router();

// get orders by customer
router.get("/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);

		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "customer") {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const user_id = await getUserId(email);

		const sql = "SELECT * FROM `order` WHERE user_id = ?";
		const values = [user_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		const orders = rows;

		return res.status(200).json({ orders });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// checkout
router.post("/checkout", async (req, res) => {
	const { token, event_id, seat_type_id, venue_id, total_price, credit_card } =
		req.body;

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);

		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "customer") {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const payment_success = await simulatePayment(credit_card);
		if (!payment_success) {
			return res.status(409).json({ error: "Payment failed" });
		}

		if (!checkEventAvailability(event_id, seat_type_id)) {
			return res.status(409).json({ error: "Seat type not available" });
		}

		if (
			!reduceEventAvailability(
				event_id,
				seat_type_id,
				getSeatTypePrice(event_id, seat_type_id)
			)
		) {
			return res.status(409).json({ error: "Seat type not available" });
		}

		const user_id = await getUserId(email);

		const sql = `INSERT INTO \`order\` (order_id, user_id, event_id, seat_type_id, venue_id, total_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			uuidv4(),
			user_id,
			event_id,
			seat_type_id,
			venue_id,
			total_price,
			getCurrentTimeInUnix(),
		];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "Order created" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// simulate payment
const simulatePayment = async (credit_card) => {
	// validate credit card
	if (!/^\d{16}$/.test(credit_card)) {
		return false;
	}
	await new Promise((resolve) => setTimeout(resolve, 3000));

	return Math.random() > 0.2;
};

export { router as orderRouter };
