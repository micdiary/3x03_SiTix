// service for account related
import { requestGet, requestPost } from "../utils/request";
import {
    REGISTER_API,
    LOGIN_API,
    VERIFY_EMAIL_API,
    REFRESH_TOKEN_API,
    PROFILE_API,
    EDIT_PROFILE_API,
    RESET_PASSWORD_API,
    FORGET_PASSWORD_API,
    LOGOUT_API,
    DELETE_ACCOUNT_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function register(req) {
    return requestPost(REGISTER_API, { req });
}

export async function login(req) {
    return requestPost(LOGIN_API, { req });
}

export async function logout() {
    return requestGet(`${LOGOUT_API}/${getToken()}`);
}

export async function verifyEmail(req) {
    return requestPost(VERIFY_EMAIL_API, { req });
}

export async function refreshToken(req) {
    return requestPost(REFRESH_TOKEN_API, { req });
}

export async function getProfile() {
    return requestGet(`${PROFILE_API}/${getToken()}`);
}

export async function editProfile(req) {
    return requestPost(EDIT_PROFILE_API, { req });
}

export async function deleteUserAccount() {
    return requestGet(`${DELETE_ACCOUNT_API}/${getToken()}`);
}

export async function resetPassword(req) {
    return requestPost(RESET_PASSWORD_API, { req });
}

export async function forgetPassword(req) {
    return requestPost(FORGET_PASSWORD_API, { req });
}
