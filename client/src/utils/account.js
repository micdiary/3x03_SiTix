// TOKEN
export function getToken() {
	return localStorage.getItem("token");
}

export function setToken(token) {
	localStorage.setItem("token", token);
}

export function removeToken() {
	localStorage.removeItem("token");
}

// USER TYPE
export function getUserType() {
	return localStorage.getItem("userType");
}

export function setUserType(userType) {
	localStorage.setItem("userType", userType);
}

export function removeUserType() {
	localStorage.removeItem("userType");
}
