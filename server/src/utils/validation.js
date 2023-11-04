import fs from "fs";

export const validateParams = (input, keysToCheck) => {
	if (input === undefined || input === null || typeof input !== "object") {
		return false;
	}

	const inputKeys = Object.keys(input);

	// Check for missing or extra parameters
	if (
		inputKeys.length !== keysToCheck.length ||
		inputKeys.some((key) => !keysToCheck.includes(key))
	) {
		return false;
	}

	for (let i = 0; i < keysToCheck.length; i++) {
		if (
			input[keysToCheck[i]] === undefined ||
			input[keysToCheck[i]] === null ||
			input[keysToCheck[i]] === ""
		) {
			return false;
		}

		// validate field
		if (!validateField(input[keysToCheck[i]])) {
			return false;
		}
	}

	return true;
};

export const validateField = (field) => {
	if (field === undefined || field === null || field === "") {
		return false;
	} else {
		// only allow ascii
		const regex = /^[\x00-\x7F]*$/;
		if (!regex.test(field)) {
			return false;
		}

		const maxLength = 4096;
		if (field.length > maxLength) {
			return false;
		}

		// disallow emoji
		const emojiRegex =
			/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{2300}-\u{23FF}]/gu;
		if (emojiRegex.test(field)) {
			return false;
		}

		return true;
	}
};

export const checkPassword = async (password) => {
	// open txt file
	const commonPasswords = fs.readFileSync(
		"./10-million-password-list-top-1000.txt",
		"utf8"
	);
	// check if password is in file
	if (commonPasswords.includes(password)) {
		return false;
	}

	// password length
	const minLength = 12;
	const maxLength = 50;
	if (password.length < minLength || password.length > maxLength) {
		return false;
	}

	// only allow ascii
	const regex = /^[\x00-\x7F]*$/;
	if (!regex.test(password)) {
		return false;
	}

	return true;
};
