import multer from "multer";

export const maxMB = 5; // Set file size limit to 5MB

// Custom error handling function for multer
export const handleMulterError = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				error:
					"File size limit exceeded. Maximum file size allowed is" +
					maxMB +
					"MB.",
			});
		}
		// Handle other multer errors if needed
		if (err.code === "LIMIT_FILE_COUNT") {
			return res.status(400).json({
				error: "File count limit exceeded. Maximum file count allowed is 1.",
			});
		}
		return res.status(500).send("Server Error");
	} else if (err.status) {
		// This is a custom error that we defined in our fileFilter
		res.status(err.status).json({ error: err.message });
	} else {
		// An unknown error occurred.
		console.error(err); // or log with your preferred logging solution
		res.status(500).json({ error: "An unknown error occurred." });
	}
	next(err);
};

const validateFileName = (name) => {
	// This regex example would allow alphanumeric, underscore, and dash, with a length between 3 and 255
	// Adjust based on your needs
	const fileFormat = /^[a-zA-Z0-9_-]{3,255}$/;

	return fileFormat.test(name);
};

// Custom file filter for multer
export const fileFilter = (req, file, cb) => {
	// Allowed ext
	const filetypes = /jpeg|jpg|png/;
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (!mimetype) {
		return cb(
			createError(
				400,
				"Invalid file type. Only jpg, jpeg, png image files are allowed."
			),
			false
		);
	}

	if (!validateFileName(file.originalname)) {
		return cb(
			createError(
				400,
				"Invalid file name. Only alphanumeric, underscore, and dash, with a length between 3 and 255 are allowed."
			),
			false
		);
	}

	return cb(null, true);
};

function createError(status, message) {
	const err = new Error(message);
	err.status = status;
	return err;
}
