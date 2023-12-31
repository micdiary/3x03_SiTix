import { requestGet, requestPost } from "../utils/request";
import { ADD_VENUE_API, UPDATE_VENUE_API, VENUE_API } from "../constants";
import { getToken } from "../utils/account";

export async function getVenue() {
    return requestGet(`${VENUE_API}/${getToken()}`);
}

export async function addVenue(req) {
    const token = getToken();
    const formData = new FormData();
    formData.append("token", token);
    formData.append("venue_name", req.venue_name);
    formData.append("seat_type", req.seat_type);
    if (req.file) {
        formData.append("file", req.file);
    }
    return requestPost(ADD_VENUE_API, { req: formData }, "multipart/form-data");
}

export async function updateVenue(req) {
    const token = getToken();
    const formData = new FormData();
    formData.append("token", token);
    formData.append("venue_id", req.venue_id);
    formData.append("venue_name", req.venue_name);
    formData.append("seat_type", req.seat_type);
    if (req.file) {
        formData.append("file", req.file);
    }
    return requestPost(
        UPDATE_VENUE_API,
        { req: formData },
        "multipart/form-data"
    );
}
