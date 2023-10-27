import { requestGet, requestPost } from "../utils/request";
import { ADD_ADMINS_API, ADMINS_API, DELETE_ADMINS_API } from "../constants";
import { getToken } from "../utils/account";

export async function getAdmins() {
    return requestGet(`${ADMINS_API}/${getToken()}`);
}

export async function addNewAdmin(req) {
    return requestPost(ADD_ADMINS_API, { req });
}

export async function deleteAdmin(req) {
    return requestPost(DELETE_ADMINS_API, { req });
}
