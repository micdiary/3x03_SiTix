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
	EMAIL_BODY_ACTIVATE_ACCOUNT,
} from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { redis_connection } from "../redis.js";
import { toProperCase } from "../utils/string.js";
import { sendEmail } from "../utils/email.js";
import { verifyAccountPassword } from "./account.js";

// Register new user
router.post("/register", async (req, res) => {
	const { username, first_name, last_name, email, password } = req.body;
	try {
		// Checking if user exists
		if (await emailExists(email)) {
			return res.status(409).json({ error: "User already exists" });
		}

		if (await usernameExists(username)) {
			return res.status(409).json({ error: "Username already exists" });
		}

		// Hashing password (brcrypt does not require salt to be stored separately as it is already included in the hashed password)
		const hashedPassword = await bcrypt.hash(password, 10);

		// uuidv4
		const uuid = uuidv4();

		// Create new user
		const sql = `INSERT INTO user (user_id, username, first_name, last_name, email, password_hash, is_verified, failed_tries) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			uuid,
			username,
			first_name,
			last_name,
			email,
			hashedPassword,
			0,
			0,
		];
		await mysql_connection.promise().query(sql, values);

		// Token expiry time: 20 minutes
		const token = jwt.sign({ email }, JWT_SECRET);

		// send email to user to check if they are real
		nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: EMAIL,
				pass: EMAIL_PASSWORD,
			},
		});

		const emailBody = EMAIL_BODY_ACTIVATE_ACCOUNT.replace(
			"{name}",
			toProperCase(first_name)
		).replace(/{token}/g, token);

		sendEmail(email, "Email Verification", emailBody).then((info) => {
			console.log("Email sent: " + info.response);
		});

		return res.status(201).json({
			message: "Verify your email address to activate your SiTix account!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// verify email
router.post("/verify-email", async (req, res) => {
	const { token } = req.body;
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const { email } = decoded;

		const sql = `UPDATE user SET is_verified = 1 WHERE email = ?`;
		const values = [email];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "User verified successfully" });
	} catch (err) {
		console.log(err);
		return res.status(401).json({ error: "Invalid token" });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		let user = [];
		// Checking if user exists
		const sql = `SELECT * FROM user WHERE username = ?`;
		const values = [username];
		[user] = await mysql_connection.promise().query(sql, values);
		if (user.length === 0) {
			const adminSql = `SELECT * FROM admin WHERE username = ?`;
			const adminValues = [username];
			[user] = await mysql_connection.promise().query(adminSql, adminValues);

			if (user.length === 0) {
				return res.status(401).json({ error: "Invalid credentials" });
			}
		}

		if (user[0].is_verified === 0) {
			return res.status(401).json({ error: "User not verified" });
		}

		// Checking if password is correct
		const passwordMatch = await verifyAccountPassword(
			password,
			user[0].password_hash
		);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		let userType = user[0].admin_id !== undefined ? "admin" : "customer";

		if (user[0].role_id === 2) {
			userType = "superadmin";
		}

		// Create and assign token
		const token = jwt.sign(
			{ email: user[0].email, userType: userType },
			JWT_SECRET
		);

		// Add token to redis for 4 hours
		setTokenToRedis(user[0].email, token, 14400);

		return res.status(200).json({
			token: token,
			userType: userType,
			message: "User logged in successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// logout
router.get("/logout/:token", async (req, res) => {
	const { token } = req.params;
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const { email } = decoded;

		await redis_connection.del(email);

		return res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		console.log(err);
		return res.status(401).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// refresh token
router.post("/refresh-token", async (req, res) => {
	const { token } = req.body;
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const { email } = decoded;

		const tokenToCompare = await redis_connection.get(email);

		if (tokenToCompare !== token) {
			return res.status(401).json({ error: "Invalid token" });
		}

		setTokenToRedis(email, token, 14400);
		return res.status(200).json({ token: token, message: "Token refreshed" });
	} catch (err) {
		console.log(err);
		return res.status(401).json({ error: "Invalid token" });
	}
});

// Email Exists
export async function emailExists(email) {
	const sql = `SELECT * FROM user WHERE email = ?`;
	const values = [email];
	const [user] = await mysql_connection.promise().query(sql, values);
	return user.length > 0;
}

// Username Exists
export async function usernameExists(username) {
	const sql = `SELECT * FROM user WHERE username = ?`;
	const values = [username];
	const [user] = await mysql_connection.promise().query(sql, values);
	return user.length > 0;
}

// refresh token
export async function refreshToken(email, token) {
	if (checkToken(email, token)) {
		setTokenToRedis(email, token, 14400);
	}
}

// check if token exist
export async function checkToken(email, token) {
	const tokenToCompare = await redis_connection.get(email);
	return tokenToCompare === token;
}

// remove session from redis
export async function removeSession(email) {
	await redis_connection.del(email);
}

async function setTokenToRedis(email, token, timeout) {
	await redis_connection.set(email, token);
	await redis_connection.expire(email, timeout);
}

export { router as authRouter };
