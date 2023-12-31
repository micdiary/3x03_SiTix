import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";

const router = express.Router();

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { checkToken, getJWTFromRedis } from "./auth.js";
import { getAdminId, isSuperAdmin } from "./admin.js";
import { getCurrentTimeInUnix } from "../utils/time.js";
import { fileFilter, handleMulterError, maxMB } from "../utils/file.js";
import { logger } from "../utils/logger.js";
import { validateParams } from "../utils/validation.js";

const uploadDir = "uploads/venue";

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

// Get Venues
router.get("/:token", async (req, res) => {
	const { token } = req.params;

	if(!validateParams(req.params, ["token"])){
		return res.status(409).json({ error: "Missing parameters" });
	}

	try {
		const jwtToken = await getJWTFromRedis(token);

		if (!jwtToken) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const { email, userType } = jwt.verify(jwtToken, JWT_SECRET);

		if (!(await checkToken(email, jwtToken))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "admin" && !(await isSuperAdmin(email))) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const sql = `SELECT * FROM venue`;

		const [rows] = await mysql_connection.promise().query(sql);

		const venues = rows;

		// get img from uploads folder 
		for (let i = 0; i < venues.length; i++) {
			const venue = venues[i];
			const img = venue.img;
			const imgPath = `${uploadDir}/${img}`;

			if (fs.existsSync(imgPath)) {
				// Read the file from the file system
				const fileData = fs.readFileSync(imgPath);
				// Convert it to a base64 string
				const base64Image = new Buffer.from(fileData).toString("base64");
				// Attach it to your response object
				venues[i].img = base64Image;
			} else {
				venues[i].img = "";
			}

			const sql = `SELECT * FROM seat_type WHERE venue_id = ?`;
			const values = [venue.venue_id];
			const [rows] = await mysql_connection.promise().query(sql, values);
			venues[i].seat_type = rows;
		}

		return res.status(200).json({ venues });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Add Venue
// sample seat type format
// seat_type = [{"type_name": "VIP", "description":"VIP seats"}, {"type_name": "Regular", "description":"Regular seats"}]
router.post("/add", upload.single("file"), async (req, res) => {
	const { token, venue_name, seat_type } = req.body;

	if(!validateParams(req.body, ["token", "venue_name", "seat_type"])){
		return res.status(409).json({ error: "Missing parameters" });
	}

	try {
		const jwtToken = await getJWTFromRedis(token);

		if (!jwtToken) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const { email, userType } = jwt.verify(jwtToken, JWT_SECRET);

		if (!(await checkToken(email, jwtToken))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "admin" && !(await isSuperAdmin(email))) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		if (await venueExists(venue_name)) {
			return res.status(409).json({ error: "Venue already exists" });
		}

		if (!req.file) {
			return res.status(409).json({ error: "No image uploaded" });
		}

		const img = req.file.originalname;
		// generate uuid
		const uuid = uuidv4();

		const admin_id = await getAdminId(email);

		await mysql_connection.promise().beginTransaction();

		const sql = `INSERT INTO venue (venue_id, venue_name, img, created_at ,updated_by) VALUES (?, ?, ?, ?, ?)`;
		const [rows] = await mysql_connection
			.promise()
			.query(sql, [uuid, venue_name, img, getCurrentTimeInUnix() ,admin_id]);

		for (const seat of JSON.parse(seat_type)) {
			if (
				seat.type_name === null ||
				!seat.hasOwnProperty("type_name") ||
				seat.description === null ||
				!seat.hasOwnProperty("description")
			) {
				await mysql_connection.promise().rollback(); // Rollback the transaction if there's an error
				return res.status(409).json({ error: "Invalid seat type" });
			}

			const sql = `INSERT INTO seat_type (venue_id, type_name, description) VALUES (?,?,?)`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [uuid, seat.type_name, seat.description]);
		}

		// If everything is successful, commit the transaction
		await mysql_connection.promise().commit();

		return res.status(200).json({ message: "Venue added successfully" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Update Venue
// seat_type = [{"seat_type_id":"1" ,"type_name": "VIP", "description":"VIP seats"}, {"seat_type_id":"2" ,"type_name": "Regular", "description":"Regular seats"}]
router.post("/update", upload.single("file"), async (req, res) => {
	const { token, venue_id, venue_name, seat_type } = req.body;

	if(!validateParams(req.body, ["token", "venue_id", "venue_name", "seat_type"])){
		return res.status(409).json({ error: "Missing parameters" });
	}

	try {
		const jwtToken = await getJWTFromRedis(token);

		if (!jwtToken) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const { email, userType } = jwt.verify(jwtToken, JWT_SECRET);

		if (!(await checkToken(email, jwtToken))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "admin" && !(await isSuperAdmin(email))) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		let sql = "";

		await mysql_connection.promise().beginTransaction();

		const admin_id = await getAdminId(email);

		const updated_at = getCurrentTimeInUnix();

		if (!req.file) {
			sql = `UPDATE venue SET venue_name = ?, updated_by = ?, updated_at = ? WHERE venue_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [venue_name, admin_id, updated_at, venue_id]);
		} else {
			const img = req.file.originalname;
			sql = `UPDATE venue SET venue_name = ?, img = ?, updated_by = ?, updated_at = ? WHERE venue_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [venue_name, img, admin_id, updated_at, venue_id]);
		}

		for (const seat of JSON.parse(seat_type)) {
			if (
				seat.type_name === null ||
				!seat.hasOwnProperty("type_name") ||
				seat.description === null ||
				!seat.hasOwnProperty("description") ||
				seat.seat_type_id === null ||
				!seat.hasOwnProperty("seat_type_id")
			) {
				await mysql_connection.promise().rollback(); // Rollback the transaction if there's an error
				return res.status(409).json({ error: "Invalid seat type" });
			}

			const sql = `UPDATE seat_type SET type_name = ?, description = ? WHERE seat_type_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [seat.type_name, seat.description, seat.seat_type_id]);
		}

		// If everything is successful, commit the transaction
		await mysql_connection.promise().commit();

		return res.status(200).json({ message: "Venue updated successfully" });
	} catch (err) {}
});

async function venueExists(venue_name) {
	const sql = `SELECT * FROM venue WHERE venue_name = ?`;
	const [rows] = await mysql_connection.promise().query(sql, [venue_name]);
	if (rows.length > 0) {
		return true;
	}
	return false;
}

// get all seat types
export const getSeatTypes = async () => {
	try {
		const sql = `SELECT * FROM seat_type`;
		const [rows] = await mysql_connection.promise().query(sql);
		return rows;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const isVenueValid = async (venue_id) => {
	try {
		const sql = `SELECT * FROM venue WHERE venue_id = ?`;
		const values = [venue_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		if (rows.length === 0) {
			return false;
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

// check seat types
export const seatTypeExists = async (seat_type_id, venue_id) => {
	try {
		const sql = `SELECT * FROM seat_type WHERE seat_type_id = ? AND venue_id = ?`;
		const values = [seat_type_id, venue_id];
		const [rows] = await mysql_connection.promise().query(sql, values);
		if (rows.length === 0) {
			return false;
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

router.use(handleMulterError);

export { router as venueRouter };
