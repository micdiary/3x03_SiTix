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
} from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { checkToken, emailExists, getJWTFromRedis } from "./auth.js";
import { isValidEmailFormat, sendEmail } from "../utils/email.js";
import { toProperCase } from "../utils/string.js";
import { convertToDate, getCurrentTimeInUnix } from "../utils/time.js";
import { validateParams } from "../utils/validation.js";
import { logger } from "../utils/logger.js";

// Get Admins
router.get("/:token", async (req, res) => {
	const { token } = req.params;

	if(!validateParams(req.params, ["token"])){
		return res.status(401).json({ error: "Invalid params" });
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

		const sql = `SELECT * FROM admin where role_id = 1`;
		const [rows] = await mysql_connection.promise().query(sql);

		const admins = rows;
		for (const admin of admins) {
			admin.created_at = convertToDate(admin.created_at);
			delete admin.password_hash;
		}
		return res.status(200).json({ admins });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Add Admin
router.post("/add", async (req, res) => {
	const { token, username, admin_email } = req.body;

	if(!validateParams(req.body, ["token", "username", "admin_email"])){
		return res.status(401).json({ error: "Invalid params" });
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

		// check if email valid
		if (!isValidEmailFormat(admin_email)) {
			return res.status(409).json({ error: "Invalid email format" });
		}

		if (await adminEmailExists(admin_email) || await emailExists(admin_email)) {
			return res.status(409).json({ error: "Email already exists" });
		}

		// generate password
		const password = generatePassword();
		const hashedPassword = await bcrypt.hash(password, 1024);

		// generate uuid
		const uuid = uuidv4();
		// Create new user
		const sql = `INSERT INTO admin (admin_id,role_id, username, email, password_hash, created_at) VALUES ( ?,?, ?, ?, ?, ?)`;
		const values = [uuid, 1, username, admin_email, hashedPassword, getCurrentTimeInUnix()];
		await mysql_connection.promise().query(sql, values);

		// send email to admin with login details
		nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: EMAIL,
				pass: EMAIL_PASSWORD,
			},
		});

		const emailBody = `Hi ${toProperCase(
			username
		)},<br><br>Your account has been created on the SiTix Management System.<br><br>Your login details are:<br>Username: ${username}<br>Password: ${password}<br><br>Please login to your account and change your password.<br><br>Regards,<br>SiTix Management System`;

		sendEmail(admin_email, "Account Created", emailBody).then((info) => {
			console.log("Email sent: " + info.response);
			logger.info("Email sent: " + info.response)
		});

		return res.status(200).json({ message: "Admin added successfully" });
	} catch (err) {
		console.log(err);
		logger.info(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// delete admin account
router.post("/delete", async (req, res) => {
	const { token, admin_id } = req.body;

	if(!validateParams(req.body, ["token", "admin_id"])){
		return res.status(401).json({ error: "Invalid params" });
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

		const sql = `DELETE FROM admin WHERE admin_id = ?`;
		const values = [admin_id];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "Admin deleted successfully" });
	} catch (err) {
		console.log(err);
		logger.info(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// generate password for account creation
const generatePassword = () => {
	const length = 12;
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let retVal = "";
	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
};

// check email exists
const adminEmailExists = async (email) => {
	try {
		const sql = `SELECT * FROM admin WHERE email = ?`;
		const values = [email];
		const [rows] = await mysql_connection.promise().query(sql, values);

		if (rows.length === 0) {
			return false;
		} else {
			return true;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
};

// get admin id
export const getAdminId = async (email) => {
	try {
		const sql = `SELECT * FROM admin WHERE email = ?`;
		const values = [email];
		const [rows] = await mysql_connection.promise().query(sql, values);
		return rows[0].admin_id;
	} catch (err) {
		console.log(err);
		return false;
	}
};

// check if superadmin
export const isSuperAdmin = async (email) => {
	try {
		const sql = `SELECT * FROM admin WHERE email = ?`;
		const values = [email];
		const [rows] = await mysql_connection.promise().query(sql, values);

		if (rows.length === 0) {
			return false;
		}

		if (rows[0].role_id === 2) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
};

// get total number of admins
export const getNumAdmins = async () => {
	try {
		const sql = `SELECT * FROM admin WHERE role_id = 1`;
		const [rows] = await mysql_connection.promise().query(sql);
		return rows.length;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export { router as adminRouter };
