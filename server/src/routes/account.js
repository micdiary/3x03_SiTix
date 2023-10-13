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
import { checkToken, refreshToken, userExists } from "./auth.js";
import { sendEmail } from "../utils/email.js";
import { toProperCase } from "../utils/string.js";

// Get Profile
router.get("/profile/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const { email } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const sql = `SELECT * FROM user WHERE email = ?`;
		const values = [email];
		const [rows] = await mysql_connection.promise().query(sql, values);

		const user = rows[0];
		delete user.password_hash;
		delete user.failed_tries;
		delete user.updated_at;

		return res.status(200).json({ user });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// edit profile
router.post("/edit", async (req, res) => {
	const { token, username, first_name, last_name } = req.body;

	try {
		const { email } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const sql = `UPDATE user SET username = ?, first_name = ?, last_name = ? WHERE email = ?`;
		const values = [username, first_name, last_name, email];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "Profile updated" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// delete account (hard delete)
router.get("/delete/:token", async (req, res) => {
	const { token } = req.params;

	try {
		const { email } = jwt.verify(token, JWT_SECRET);
		if (!(await checkToken(email, token))) {
			return res
				.status(409)
				.json({ error: "Invalid token used. Please relogin" });
		}

		const sql = `DELETE FROM user WHERE email = ?`;
		const values = [email];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "Account deleted" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// forget password
router.post("/forget-password", async (req, res) => {
	const { email } = req.body;

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
	});

	return res.status(200).json({
		message: "Please check your email for the password reset instruction",
	});
});

// reset password
router.post("/reset-password", async (req, res) => {
	const { token, password, newPassword } = req.body;

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
			const hashedPassword = await bcrypt.hash(password, 10);
			const passwordCheck = await verifyAccountPassword(
				hashedPassword,
				user[0].password_hash
			);

			if (!passwordCheck) {
				return res.status(409).json({ error: "Incorrect password" });
			}
		}

		// hash new password
		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		// update password
		const update_sql = `UPDATE user SET password_hash = ? WHERE email = ?`;
		const update_values = [newPasswordHash, user[0].email];
		await mysql_connection.promise().query(update_sql, update_values);

		return res.status(200).json({ message: "Password updated" });
	} catch (err) {
		console.log(err);
		return res.status(409).json({ error: "Invalid token" });
	}
});

// verify account password
async function verifyAccountPassword(password, passwordToCompare) {
	try {
		const result = await bcrypt.compare(password, passwordToCompare);
		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export { router as accountRouter };
