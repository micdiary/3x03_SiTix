import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { checkToken } from "./auth.js";
import { getAdminId, isSuperAdmin } from "./admin.js";

const maxMB = 5; // Set file size limit to 5MB

const uploadDir = 'uploads/';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Set up storage engine with Multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname); // use the extension from the original file
	},
});

// Create Multer instance with the storage engine
const upload = multer({
	storage: storage,
	limits: {
		fileSize: maxMB * 1024 * 1024, // Set file size limit
	},
});

// Custom error handling function for multer
const handleMulterError = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				error:
					"File size limit exceeded. Maximum file size allowed is" +
					maxMB +
					"MB.",
			});
		}
		// Handle other multer errors if needed
		return res.status(500).json({ error: "File upload error" });
	}
	next(err);
};

// Get Venues
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

		const sql = `SELECT * FROM venue`;

		const [rows] = await mysql_connection.promise().query(sql);

		const venues = rows;

		// get img from uploads folder
		for (let i = 0; i < venues.length; i++) {
			const venue = venues[i];
			const img = venue.venue_address;
			const imgPath = `uploads/${img}`;

			if (fs.existsSync(imgPath)) {
				venues[i].img = imgPath;
			} else {
				venues[i].img = "";
			}
		}

		return res.status(200).json({ venues });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Add Venue
// sample seat type format
// seat_type = [{"type_name": "VIP", "description":"VIP seats"}, {"type_name": "Regular", "description":"Regular seats"}]
router.post("/add", upload.single("file"), async (req, res) => {
	const { token, venue_name, seat_type } = req.body;

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

		const sql = `INSERT INTO venue (venue_id, venue_name, img, updated_by) VALUES (?, ?, ?, ?)`;
		const [rows] = await mysql_connection
			.promise()
			.query(sql, [uuid, venue_name, img, admin_id]);

		for (const seat of JSON.parse(seat_type)) {

			if (seat.type_name === null || !seat.hasOwnProperty('type_name') || seat.description === null || !seat.hasOwnProperty('description')) {
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
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Update Venue
// seat_type = [{"seat_type_id":"1" ,"type_name": "VIP", "description":"VIP seats"}, {"seat_type_id":"2" ,"type_name": "Regular", "description":"Regular seats"}]
router.post("/update", upload.single("file"), async (req, res) => {
	const { token, venue_id, venue_name, seat_type } = req.body;

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

		let sql = "";

		if (!req.file) {
			sql = `UPDATE venue SET venue_name = ? WHERE venue_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [venue_name, venue_id]);
		} else {
			const img = req.file.originalname;
			sql = `UPDATE venue SET venue_name = ?, img = ? WHERE venue_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [venue_name, img, venue_id]);
		}

		for (const seat of JSON.parse(seat_type)) {
			if (seat.type_name === "" || seat.description === "") {
				return res.status(409).json({ error: "Invalid seat type" });
			}

			const sql = `UPDATE seat_type SET type_name = ?, description = ? WHERE seat_type_id = ?`;
			const [rows] = await mysql_connection
				.promise()
				.query(sql, [seat.type_name, seat.description, seat.seat_type_id]);
		}

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

router.use(handleMulterError);

export { router as venueRouter };
