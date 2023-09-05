import mysql from "mysql2";
import {
	MYSQL_HOST,
	MYSQL_PORT,
	MYSQL_DATABASE,
	MYSQL_USER,
	MYSQL_PASSWORD,
} from "./constants.js";

export const mysql_connection = mysql.createConnection({
	host: MYSQL_HOST,
	port: MYSQL_PORT,
	database: MYSQL_DATABASE,
	user: MYSQL_USER,
	password: MYSQL_PASSWORD,
});
