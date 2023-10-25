import { requestGet, requestPost } from "../utils/request";
import { REQUEST_API, UPDATE_REQUEST_API } from "../constants";
import { getToken } from "../utils/account";

export async function getRequest() {
    return requestGet(`${REQUEST_API}/${getToken()}`);
}

export async function updateRequest(req) {
    return requestPost(UPDATE_REQUEST_API, { req });
}
