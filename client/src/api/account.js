// service for account related
import { requestGet, requestPost } from "../utils/request";
import { REGISTER_API } from "../constants.js";
// import { getToken } from "../utils/account";

export async function register(req) {
    return requestPost(REGISTER_API, { req });
}

// export async function login(req) {
//     return requestPost(LOGIN_API, { req });
// }

// export async function getUserType() {
//     const token = getToken();
//     return requestGet(`${USER_TYPE_API}/${token}`);
// }

// export async function resetPassword(req) {
//     let { token, password, newPassword } = req;
//     if (token === undefined || token === null || token === "") {
//         token = getToken();
//     }
//     return requestPost(RESET_PASSWORD_API, {
//         req: { token: token, password, newPassword },
//     });
// }

// export async function forgetPassword(req) {
//     return requestPost(FORGOT_PASSWORD_API, { req });
// }
