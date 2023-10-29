import express from "express";
import jwt from "jsonwebtoken";
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
import { checkToken, refreshToken, removeSession } from "./auth.js";
import { sendEmail } from "../utils/email.js";
import { toProperCase } from "../utils/string.js";
import { getAdminId, getNumAdmins, isSuperAdmin } from "./admin.js";
import { getEventSeatType, setEventSeatTypeNum, startEvent } from "./event.js";

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

		const sql = `SELECT r.request_id , a.admin_id, a.username AS admin, e.event_id, e.event_name, v.venue_name, v.venue_id, r.approval_num
            FROM request r
            JOIN admin a ON r.admin_id = a.admin_id
            JOIN event e ON r.event_id = e.event_id
            JOIN venue v ON e.venue_id = v.venue_id
			WHERE r.status = "pending"
			`;

		const [rows] = await mysql_connection.promise().query(sql);
		const requests = rows;

		// hide requests that the admin has already responded to
		const admin_id = await getAdminId(email);
		for (let i = 0; i < requests.length; i++) {
			const request = requests[i];
			const request_id = request.request_id;

			const accepted = await redis_connection.lRange(
				`${request_id}/accepted`,
				0,
				-1
			);

			const rejected = await redis_connection.lRange(
				`${request_id}/rejected`,
				0,
				-1
			);

			if (accepted.includes(admin_id) || rejected.includes(admin_id)) {
				requests.splice(i, 1);
				i--;
			}

			// hide their own request
			if (request.admin_id === admin_id) {
				requests.splice(i, 1);
				i--;
			}
		}

		return res.status(200).json({ requests });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// accept/reject request
router.post("/update", async (req, res) => {
	const { token, request_id, status } = req.body;

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

		if (status !== "accepted" && status !== "rejected") {
			return res.status(409).json({ error: "Invalid status" });
		}

		const admin_id = await getAdminId(email);

		if (status === "accepted") {
			await redis_connection.rPush(`${request_id}/accepted`, admin_id);

			const sql = `UPDATE request SET approval_num = approval_num + 1 WHERE request_id = ?`;
			const values = [request_id];
			const [rows] = await mysql_connection.promise().query(sql, values);
		} else {
			await redis_connection.rPush(`${request_id}/rejected`, admin_id);
		}

		const sql = `SELECT approval_num FROM request WHERE request_id = ?`;
		const values = [request_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		const approval_num = rows[0].approval_num;

		const numAdmins = await getNumAdmins();
		if (
			approval_num >= numAdmins / 2 &&
			(await redis_connection.lLen(`${request_id}/accepted`)) >= numAdmins / 2
		) {
			const response = await startEvent(request_id);
			if (response) {
				const sql = `UPDATE request SET status = "accepted" WHERE request_id = ?`;
				const values = [request_id];
				const [rows] = await mysql_connection.promise().query(sql, values);

				const sql2 = `SELECT event_id FROM request WHERE request_id = ?`;
				const values2 = [request_id];
				const [rows2] = await mysql_connection.promise().query(sql2, values2);
				const event_id = rows2[0].event_id;

				const event_seat_types = await getEventSeatType(event_id);
				for (let i = 0; i < event_seat_types.length; i++) {
					const event_seat_type = event_seat_types[i];
					await setEventSeatTypeNum(
						event_seat_type.event_id,
						event_seat_type.seat_type_id,
						event_seat_type.available_seats
					);
				}

				return res.status(200).json({ message: "Event started!" });
			} else {
				return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
			}
		}
		return res.status(200).json({ message: "Request updated" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// create new request
export async function createRequest(admin_id, event_id) {
	const id = uuidv4();
	const sql = `INSERT INTO request (request_id,admin_id, event_id, approval_num, status) VALUES (?, ?, ?, ?, ?)`;
	const values = [id, admin_id, event_id, 0, "pending"];
	await mysql_connection.promise().query(sql, values);
}

export { router as requestRouter };
