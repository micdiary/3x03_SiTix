import winston from "winston"; //Add winston import
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = 'logs'; //Create folder named logs to store logs in project

// Creates logs folder if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
  }

const transport = new DailyRotateFile({
	dirname: logDir,
	filename: 'server-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m',
  	maxFiles: '14d', // Retain logs for 14 days
})

//Configure Winston to log to file
export const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [transport],
});
