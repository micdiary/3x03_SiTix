import { requestGet, requestPost } from "../utils/request";
import { ADD_EVENT_API, EVENT_API, EVENT_DETAILS_API } from "../constants";
import { getToken } from "../utils/account";

export async function getEvent() {
    return requestGet(`${EVENT_API}/${getToken()}`);
}

export async function getEventDetails(req) {
    return requestGet(`${EVENT_DETAILS_API}/${getToken()}/${req.event_id}`);
}

export async function addEvent(req) {
    const token = getToken();
    const formData = new FormData();
    formData.append("token", token);
    formData.append("venue_id", req.venue_id);
    formData.append("event_name", req.event_name);
    formData.append("date", req.date);
    formData.append("description", req.description);
    formData.append("category", req.category);
    formData.append("seat_type", req.seat_type);
    if (req.file) {
        formData.append("file", req.file);
    }
    return requestPost(ADD_EVENT_API, { req: formData }, "multipart/form-data");
}
