// service for account related
import { requestPost } from "../utils/request";
import {
    REGISTER_API,
    LOGIN_API,
    VERIFY_EMAIL_API,
    REFRESH_TOKEN_API,
} from "../constants.js";

export async function register(req) {
    return requestPost(REGISTER_API, { req });
}

export async function login(req) {
    return requestPost(LOGIN_API, { req });
}

export async function verifyEmail(req) {
    return requestPost(VERIFY_EMAIL_API, { req });
}

export async function refreshToken(req) {
    return requestPost(REFRESH_TOKEN_API, { req });
}
