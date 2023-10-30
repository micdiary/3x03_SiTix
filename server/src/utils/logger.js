import winston from "winston"; //Add winston import

//Configure Winston to log to file
export const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({filename: 'src/Server.log'}),
	]
});