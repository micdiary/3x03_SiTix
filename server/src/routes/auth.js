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
import { isValidEmailFormat, sendEmail } from "../utils/email.js";
import { verifyAccountPassword } from "./account.js";
import { checkPassword, validateParams } from "../utils/validation.js";
import { logger } from "../utils/logger.js";
import { getCurrentTimeInUnix } from "../utils/time.js";

// Register new user
router.post("/register", async (req, res) => {
	const { username, first_name, last_name, email, password } = req.body;

	if (
		!validateParams(req.body, [
			"username",
			"first_name",
			"last_name",
			"email",
			"password",
		])
	) {
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		// Checking if user exists
		if ((await emailExists(email)) || (await usernameExists(username))) {
			if (!(await userVerified(email, username))) {
				// delete user from db to allow re-register
				const sql = "DELETE FROM user WHERE email = ? AND username = ?";
				const values = [email, username];
				await mysql_connection.promise().query(sql, values);
			} else {
				return res.status(409).json({ error: "User already exists" });
			}
		}

		// email validation
		if (!isValidEmailFormat(email)) {
			return res.status(409).json({ error: "Invalid email format" });
		}

		// password validation
		if (!(await checkPassword(password))) {
			return res
				.status(409)
				.json({ error: "Password too weak / Invalid characters found" });
		}

		// Hashing password (brcrypt does not require salt to be stored separately as it is already included in the hashed password)
		const hashedPassword = await bcrypt.hash(password, 1024);

		// uuidv4
		const uuid = uuidv4();

		// Create new user
		const sql = `INSERT INTO user (user_id, username, first_name, last_name, email, password_hash, is_verified, created_at, failed_tries) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			uuid,
			username,
			first_name,
			last_name,
			email,
			hashedPassword,
			0,
			getCurrentTimeInUnix(),
			0,
		];
		await mysql_connection.promise().query(sql, values);

		// Token expiry time: 15 minutes
		const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });

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
			logger.info("Email sent: " + info.response);
		});

		return res.status(201).json({
			message: "Verify your email address to activate your SiTix account!",
		});
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// verify email
router.post("/verify-email", async (req, res) => {
	const { token } = req.body;

	if (!validateParams(req.body, ["token"])) {
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const { email } = decoded;

		const sql = `UPDATE user SET is_verified = 1 WHERE email = ?`;
		const values = [email];
		await mysql_connection.promise().query(sql, values);

		return res.status(200).json({ message: "User verified successfully" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(401).json({ error: "Invalid token" });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!validateParams(req.body, ["username", "password"])) {
		return res.status(401).json({ error: "Invalid params" });
	}

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

		if (user[0].failed_tries >= 5) {
			sendEmail(
				user[0].email,
				"Account Locked",
				"Your account has been locked due to too many failed login attempts. Please reset your password to unlock your account."
			);

			return res.status(401).json({
				error: "Account has been locked. Please check your email.",
			});
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
			if (user[0].failed_tries !== undefined) {
				const sql = `UPDATE user SET failed_tries = ? WHERE email = ?`;
				const values = [user[0].failed_tries + 1, user[0].email];
				await mysql_connection.promise().query(sql, values);
			}
			return res.status(401).json({ error: "Invalid credentials" });
		}

		let userType = user[0].admin_id !== undefined ? "admin" : "customer";

		if (user[0].role_id === 2) {
			userType = "superadmin";
		}

		// Create and assign token
		const tokenUnhash = jwt.sign(
			{ email: user[0].email, userType: userType },
			JWT_SECRET
		);

		// hash token
		const token = await handleTokenHashing(tokenUnhash);

		// Add token to redis for 15 minutes
		setTokenToRedis(token, tokenUnhash, user[0].email, 900);

		return res.status(200).json({
			token: token,
			userType: userType,
			message: "User logged in successfully",
		});
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// logout
router.get("/logout/:token", async (req, res) => {
	const { token } = req.params;

	if (!validateParams(req.params, ["token"])) {
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const jwtToken = await getJWTFromRedis(token);

		if (!jwtToken) {
			return res.status(409).json({ error: "Invalid token used" });
		}

		const decoded = jwt.verify(jwtToken, JWT_SECRET);
		const { email } = decoded;

		await redis_connection.del(token);

		return res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		console.log(err);
		logger.error(err);
		return res.status(401).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// refresh token
router.post("/refresh-token", async (req, res) => {
	const { token } = req.body;

	if (!validateParams(req.body, ["token"])) {
		return res.status(401).json({ error: "Invalid params" });
	}

	try {
		const jwtToken = await getJWTFromRedis(token);
		if (!jwtToken) {
			return res.status(401).json({ error: "Invalid token" });
		}
		const decoded = jwt.verify(jwtToken, JWT_SECRET);
		const { email } = decoded;

		const tokenToCompare = await redis_connection.get(email);

		if (tokenToCompare !== jwtToken) {
			return res.status(401).json({ error: "Invalid token" });
		}

		setTokenToRedis(token, jwtToken, email, 900);
		return res.status(200).json({ token: token, message: "Token refreshed" });
	} catch (err) {
		console.log(err);
		logger.error(err);
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

	const sql2 = `SELECT * FROM admin WHERE username = ?`;
	const values2 = [username];
	const [admin] = await mysql_connection.promise().query(sql2, values2);

	return user.length > 0 || admin.length > 0;
}

// is user verified
export async function userVerified(email, username) {
	const sql = `SELECT * FROM user WHERE email = ? AND username = ?`;
	const values = [email, username];
	const [user] = await mysql_connection.promise().query(sql, values);
	console.log(user[0]);
	if (user.length === 0) {
		return true;
	}
	return user[0].is_verified === 1;
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

export async function getJWTFromRedis(token) {
	return await redis_connection.get(token);
}

async function setTokenToRedis(token, jwt, email, timeout) {
	await redis_connection.set(token, jwt);
	await redis_connection.expire(token, timeout);
	await redis_connection.set(email, jwt);
	await redis_connection.expire(email, timeout);
}

async function handleTokenHashing(plainPassword) {
	let hashed = bcrypt.hashSync(plainPassword, 10);

	if (hashed.includes("/")) {
		hashed = handleTokenHashing(plainPassword);
	}

	return hashed;
}

export { router as authRouter };
