import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

import {
	JWT_SECRET,
	INTERNAL_SERVER_ERROR,
	EMAIL,
	EMAIL_PASSWORD,
	EMAIL_BODY_RESET_PASSWORD,
} from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { redis_connection } from "../redis.js";
import { checkToken, refreshToken, removeSession, userExists } from "./auth.js";
import { sendEmail } from "../utils/email.js";
import { toProperCase } from "../utils/string.js";

// get all requests
router.get("/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);

		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "admin" && !(await isSuperAdmin(email))) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const sql = `SELECT a.username AS admin, e.event_id, e.event_name, v.venue_name, v.venue_id, r.approval_num
            FROM requests r
            JOIN admins a ON r.admin_id = a.admin_id
            JOIN events e ON r.event_id = e.event_id
            JOIN venues v ON e.venue_id = v.venue_id;`;

		const [rows] = await mysql_connection.promise().query(sql);
		const requests = rows;

		return res.status(200).json({ requests });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// create new request
export async function createRequest(admin_id, event_id) {
	const id = uuidv4();
	const sql = `INSERT INTO request (request_id,admin_id, event_id, approval_num, status) VALUES (?, ?, ?, ?, ?)`;
	const values = [id, admin_id, event_id, 0, 0];
	await mysql_connection.promise().query(sql, values);
}

export { router as requestRouter };
