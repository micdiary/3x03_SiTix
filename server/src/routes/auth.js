import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";
import { mysql_connection } from "../mysql_db.js";
import { redis_connection } from "../redis.js";

// Register new user
router.post("/register", async (req, res) => {
	const { username, first_name, last_name, email, password } = req.body;
	try {
		// Checking if user exists
		if (await userExists(email)) {
			return res.status(409).json({ error: "User already exists" });
		}

		// Hashing password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const sql = `INSERT INTO user (username, first_name, last_name, email, password_hash, is_verified, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			username,
			first_name,
			last_name,
			email,
			hashedPassword,
			false,
			"user",
		];
		await mysql_connection.promise().query(sql, values);

		// send email to user to check if they are real

		return res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		// Checking if user exists
		const sql = `SELECT * FROM user WHERE username = ?`;
		const values = [username];
		const [user] = await mysql_connection.promise().query(sql, values);
		if (user.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Checking if password is correct
		const passwordMatch = await bcrypt.compare(password, user[0].password_hash);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Create and assign token
		const token = jwt.sign({ user_id: user[0].user_id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

        // Add token to redis
        await redis_connection.set(token, user[0].user_id);

		return res.status(200).json({ message: "User logged in successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
	}
});

// User Exists
async function userExists(email) {
	const sql = `SELECT * FROM user WHERE email = ?`;
	const values = [email];
	const [user] = await mysql_connection.promise().query(sql, values);
	return user.length > 0;
}

export { router as authRouter };
