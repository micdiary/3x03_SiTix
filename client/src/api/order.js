import { CREATE_ORDER_API, ORDER_API } from "../constants";
import { getToken } from "../utils/account";
import { requestGet, requestPost } from "../utils/request";

export async function getOrder() {
    return requestGet(`${ORDER_API}/${getToken()}`);
}

export async function createOrder(req) {
    return requestPost(CREATE_ORDER_API, { req });
}
