import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs";
import multer from "multer";
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
import { getSeatTypes, isVenueValid, seatTypeExists } from "./venue.js";
import { getAdminId, isSuperAdmin } from "./admin.js";
import { getCurrentTime } from "../utils/time.js";
import { createRequest } from "./request.js";
import { fileFilter, handleMulterError, maxMB } from "../utils/file.js";

const uploadDir = "uploads/event";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Set up storage engine with Multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname); // use the extension from the original file
	},
});

// Create Multer instance with the storage engine
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		files: 1, // Allow only 1 file per request
		fileSize: maxMB * 1024 * 1024, // Set file size limit
	},
});

// get all events
router.get("/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);

		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const sql = `SELECT * FROM event where status = "active"`; // only show active events
		const [rows] = await mysql_connection.promise().query(sql);
		const events = rows;

		// get events image
		for (const event of events) {
			const img = event.banner_img;
			const imgPath = `${uploadDir}/${img}`;
			if (fs.existsSync(imgPath)) {
				// Read the file from the file system
				const fileData = fs.readFileSync(imgPath);
				// Convert it to a base64 string
				const base64Image = new Buffer.from(fileData).toString("base64");
				// Attach it to your response object
				event.banner_img = base64Image;
			} else {
				event.banner_img = "";
			}
			delete event.created_at;
			delete event.updated_at;
			delete event.updated_by;
		}

		return res.status(200).json({ events });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// get event details (venue + event seat type)
router.get("/details/:token/:event_id", async (req, res) => {
	const { token, event_id } = req.params;

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);

		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const sql = `SELECT * FROM event WHERE event_id = ?`;
		const values = [event_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		const event = rows[0];

		const img = event.banner_img;
		const imgPath = `${uploadDir}/${img}`;
		if (fs.existsSync(imgPath)) {
			// Read the file from the file system
			const fileData = fs.readFileSync(imgPath);
			// Convert it to a base64 string
			const base64Image = new Buffer.from(fileData).toString("base64");
			// Attach it to your response object
			event.banner_img = base64Image;
		} else {
			event.banner_img = "";
		}

		delete event.created_at;
		delete event.updated_at;
		delete event.updated_by;

		if (!event) {
			return res.status(409).json({ error: "Event does not exist" });
		}

		const sql2 = `SELECT * FROM venue WHERE venue_id = ?`;
		const values2 = [event.venue_id];
		const [rows2] = await mysql_connection.promise().query(sql2, values2);
		const venue = rows2[0];

		const venueImgPath = `${uploadDir}/${img}`;

		if (fs.existsSync(venueImgPath)) {
			// Read the file from the file system
			const fileData = fs.readFileSync(venueImgPath);
			// Convert it to a base64 string
			const base64Image = new Buffer.from(fileData).toString("base64");
			// Attach it to your response object
			venue[i].img = base64Image;
		} else {
			venue[i].img = "";
		}

		delete venue.created_at;
		delete venue.updated_at;
		delete venue.updated_by;

		const sql3 = `SELECT * FROM event_seat_type WHERE event_id = ?`;
		const values3 = [event_id];
		const [rows3] = await mysql_connection.promise().query(sql3, values3);
		const seat_type = rows3;

		const sql4 = `SELECT * FROM seat_type WHERE venue_id = ?`;
		const values4 = [event.venue_id];
		const [rows4] = await mysql_connection.promise().query(sql4, values4);
		const venue_seat_type = rows4;

		event.venue = venue;
		event.seat_type = seat_type;
		event.venue_seat_type = venue_seat_type;

		return res.status(200).json({ event });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// add event
// seat_type = [{"seat_type_id": 1, "price": 1000, "available_seats": 30}, {"seat_type_id": 2, "price": 500,"available_seats": 40}}]
router.post("/add", upload.single("file"), async (req, res) => {
	const {
		token,
		venue_id,
		event_name,
		date,
		description,
		category,
		seat_type,
	} = req.body;

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

		// check if venue exists
		if (!(await isVenueValid(venue_id))) {
			return res.status(409).json({ error: "Venue does not exist" });
		}

		// check if seat type exists
		const seat_types = JSON.parse(seat_type);
		for (const seat of seat_types) {
			if (
				seat.seat_type_id === null ||
				!seat.hasOwnProperty("seat_type_id") ||
				seat.price === null ||
				!seat.hasOwnProperty("price")
			) {
				return res.status(409).json({ error: "Invalid seat type" });
			}
		}

		if (!req.file) {
			return res.status(409).json({ error: "Image not found" });
		}

		// check if event date is valid (at least 7 days from today)
		const today = new Date();
		const event_date = new Date(date);
		const diffTime = Math.abs(event_date - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		if (diffDays < 7) {
			return res.status(409).json({ error: "Invalid event date" });
		}

		// generate uuid
		const uuid = uuidv4();

		// get current time
		const created_at = getCurrentTime();

		// get admin id
		const admin_id = await getAdminId(email);

		const img = req.file.originalname;

		await mysql_connection.promise().beginTransaction();

		// insert event
		const sql = `INSERT INTO event (event_id, venue_id, event_name, date, description, category, banner_img, created_at ,updated_by, status) VALUES ( ?, ?, ?, ?,?, ?, ?, ?, ?, ?)`;
		const values = [
			uuid,
			venue_id,
			event_name,
			new Date(date),
			description,
			category,
			img,
			created_at,
			admin_id,
			"pending",
		];
		await mysql_connection.promise().query(sql, values);

		// insert event seat type
		for (const seat of JSON.parse(seat_type)) {
			if (
				seat.seat_type_id === null ||
				!seat.hasOwnProperty("seat_type_id") ||
				seat.price === null ||
				!seat.hasOwnProperty("price") ||
				seat.available_seats === null ||
				!seat.hasOwnProperty("available_seats")
			) {
				await mysql_connection.promise().rollback(); // Rollback the transaction if there's an error
				return res.status(409).json({ error: "Invalid seat type" });
			}

			if (!(await seatTypeExists(seat.seat_type_id, venue_id))) {
				await mysql_connection.promise().rollback(); // Rollback the transaction if there's an error
				return res.status(409).json({ error: "Seat type mismatch" });
			}

			const sql = `INSERT INTO event_seat_type (event_id, seat_type_id, price, available_seats) VALUES (?,?,?,?)`;
			const values = [
				uuid,
				seat.seat_type_id,
				seat.price,
				seat.available_seats,
			];
			await mysql_connection.promise().query(sql, values);
		}
		await createRequest(admin_id, uuid);
		await mysql_connection.promise().commit();

		return res.status(200).json({ message: "Event added successfully" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// start event
export async function startEvent(request_id) {
	try {
		const sql = `SELECT * FROM request WHERE request_id = ?`;
		const values = [request_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		const request = rows[0];

		const sql2 = `UPDATE event SET status = "active" WHERE event_id = ?`;
		const values2 = [request.event_id];
		const [rows2] = await mysql_connection.promise().query(sql2, values2);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

// get event seat type
export async function getEventSeatType(event_id) {
	try {
		const sql = `SELECT * FROM event_seat_type WHERE event_id = ?`;
		const values = [event_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		return rows;
	} catch (err) {
		console.log(err);
		return false;
	}
}

// get event seat type price
export async function getSeatTypePrice(event_id, seat_type_id) {
	try {
		const sql = `SELECT * FROM event_seat_type WHERE event_id = ? AND seat_type_id = ?`;
		const values = [event_id, seat_type_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		return rows[0].price;
	} catch (err) {
		console.log(err);
		return false;
	}
}

// insert event & seat type number to redis
export async function setEventSeatTypeNum(event_id, seat_type_id, num) {
	await redis_connection.set(`${event_id}/${seat_type_id}`, num);
}

// check event availability in redis
export async function checkEventAvailability(event_id, seat_type_id) {
	const num = await redis_connection.get(`${event_id}/${seat_type_id}`);
	if (num === null || num < 0) {
		return false;
	}
	return true;
}

// reduce event availability in redis
export async function reduceEventAvailability(event_id, seat_type_id, number) {
	const num = await redis_connection.get(`${event_id}/${seat_type_id}`);
	if (num === null || num < 0) {
		return false;
	}
	await redis_connection.decrBy(`${event_id}/${seat_type_id}`, number);

	return true;
}

router.use(handleMulterError);

export { router as eventRouter };
