import { EMAIL, EMAIL_PASSWORD } from "../constants.js";
import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, body) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: EMAIL,
			pass: EMAIL_PASSWORD,
		},
	});
	const mailOptions = {
		from: EMAIL,
		to: email,
		subject: subject,
		html: body,
	};
	return await transporter.sendMail(mailOptions);
};
