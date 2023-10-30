import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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
import { convertToDate, getCurrentTimeInUnix } from "../utils/time.js";
import { logger } from "../utils/logger.js";
import { validateParams } from "../utils/validation.js";

// Get Profile
router.get("/profile/:token", async (req, res) => {
	const { token } = req.params;

	if(!validateParams(req.params, ["token"])){
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		let user = [];

		if (userType !== "customer") {
			const sql = `SELECT * FROM admin WHERE email = ?`;
			const values = [email];
			[user] = await mysql_connection.promise().query(sql, values);
		} else {
			const sql = `SELECT * FROM user WHERE email = ?`;
			const values = [email];
			[user] = await mysql_connection.promise().query(sql, values);
		}

		// delete sensitive data
		delete user[0].password_hash;
		delete user[0].failed_tries;
		delete user[0].created_at;
		delete user[0].updated_at;
		delete user[0].role_id;

		return res.status(200).json({ user });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// edit profile
router.post("/edit", async (req, res) => {
	const { token, username, first_name, last_name } = req.body;

	if(!validateParams(req.body, ["token", "username", "first_name", "last_name"])){
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const updated_at = getCurrentTimeInUnix();

		if (userType !== "customer") {
			const sql = `UPDATE admin SET username = ?, updated_at = ? WHERE email = ?`;
			const values = [username, updated_at, email];
			await mysql_connection.promise().query(sql, values);
		} else {
			const sql = `UPDATE user SET username = ?, first_name = ?, last_name = ?, updated_at = ? WHERE email = ?`;
			const values = [username, first_name, last_name, updated_at, email];
			await mysql_connection.promise().query(sql, values);
		}

		return res.status(200).json({ message: "Profile updated" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// delete account (hard delete)
router.get("/delete/:token", async (req, res) => {
	const { token } = req.params;

	if(!validateParams(req.params, ["token"])){
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const { email, userType } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		if (userType !== "customer") {
			const sql = `DELETE FROM admin WHERE email = ?`;
			const values = [email];
			await mysql_connection.promise().query(sql, values);
		} else {
			const sql = `DELETE FROM user WHERE email = ?`;
			const values = [email];
			await mysql_connection.promise().query(sql, values);
		}

		await removeSession(email);

		return res.status(200).json({ message: "Account deleted" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// forget password
router.post("/forget-password", async (req, res) => {
	const { email } = req.body;

	if(!validateParams(req.body, ["email"])){
		return res.status(401).json({ error: "Invalid params" });
	}

	const sql = `SELECT * FROM user WHERE email = ?`;
	const values = [email];
	const [user] = await mysql_connection.promise().query(sql, values);

	if (user.length === 0) {
		return res.status(409).json({ error: "User does not exist" });
	}

	// Generate JWT token for password reset
	// Token expiry time: 1 hour
	const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

	nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: EMAIL,
			pass: EMAIL_PASSWORD,
		},
	});

	const emailBody = EMAIL_BODY_RESET_PASSWORD.replace(
		"{name}",
		toProperCase(user[0].first_name)
	).replace(/{token}/g, token);

	sendEmail(email, "Reset Password", emailBody).then((info) => {
		console.log("Email sent: " + info.response);
		logger.info("Email sent: " + info.response);
	});

	return res.status(200).json({
		message: "Please check your email for the password reset instruction",
	});
});

// reset password
router.post("/reset-password", async (req, res) => {
	const { token, password, newPassword } = req.body;
	console.log(req.body)

	if(!validateParams(req.body, ["token", "newPassword"])){
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		let user = [];
		const { email } = decoded;

		const sql = `SELECT * FROM user WHERE email = ?`;
		const values = [email];
		[user] = await mysql_connection.promise().query(sql, values);

		// check if user is admin
		if (user.length === 0) {
			const sql = `SELECT * FROM admin WHERE email = ?`;
			const values = [email];
			[user] = await mysql_connection.promise().query(sql, values);
		}

		if (password !== undefined) {
			const passwordCheck = await verifyAccountPassword(
				password,
				user[0].password_hash
			);

			if (!passwordCheck) {
				return res.status(409).json({ error: "Incorrect password" });
			}
		}

		// hash new password
		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		// update password
		let update_sql = "";
		if (user[0].admin_id !== undefined) {
			update_sql = `UPDATE admin SET password_hash = ? WHERE email = ?`;
		} else {
			update_sql = `UPDATE user SET password_hash = ? WHERE email = ?`;
		}
		const update_values = [newPasswordHash, user[0].email];
		await mysql_connection.promise().query(update_sql, update_values);

		// reset failed tries
		if (user[0].admin_id === undefined) {
			const reset_sql = `UPDATE user SET failed_tries = 0 WHERE email = ?`;
			const reset_values = [user[0].email];
			await mysql_connection.promise().query(reset_sql, reset_values);
		}

		return res.status(200).json({ message: "Password updated" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(409).json({ error: "Invalid token" });
	}
});

// verify account password
export async function verifyAccountPassword(password, passwordToCompare) {
	try {
		const result = await bcrypt.compare(password, passwordToCompare);
		// console.log(`password match :${result}`);
		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// get user id
export async function getUserId(email) {
	try {
		const sql = `SELECT * FROM user WHERE email = ?`;
		const values = [email];
		const [rows] = await mysql_connection.promise().query(sql, values);
		return rows[0].user_id;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export { router as accountRouter };
