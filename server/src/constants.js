import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
export const MYSQL_HOST = process.env.MYSQL_HOST;
export const MYSQL_PORT = process.env.MYSQL_PORT;
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
export const JWT_SECRET = process.env.JWT_SECRET;

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const EMAIL = process.env.PROJECT_EMAIL;
export const EMAIL_PASSWORD = process.env.PROJECT_EMAIL_PASSWORD;

// Common variables
export const PORT = 3001;

// Error message
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

// Email message
export const EMAIL_SUBJECT = "Email Verification";
export const EMAIL_BODY = `
Hi {name}! <br><br>

Thank you for registering on our website. Please click on the link below to verify your email address: <br><br>

To activate your account, click on the button below:<br>
<p>
  <a href="http://localhost:3000/user-verification?token={token}" style="display:inline-block; background-color:#007bff; color:#fff; padding:10px 20px; text-decoration:none; border-radius: 4px;">
    Activate account
  </a>
</p>

Alternatively, you can click on this <a href="http://localhost:3000/user-verification?token={token}">link.</a><br><br>

If you did not sign up for an account, please ignore this email.
`;
