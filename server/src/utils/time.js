export const getCurrentTimeInUnix = () => {
	const date = new Date();
	const unixTime = Math.floor(date.getTime() / 1000);
	return unixTime;
};

export const convertToDate = (unixTime) => {
	const date = new Date(unixTime * 1000);
	return date;
};

export const convertToUnixTime = (date) => {
	const dateObj = new Date(date); // Adding 'UTC' to consider the date as UTC
	return Math.floor(dateObj.getTime() / 1000); // Convert milliseconds to seconds
};
