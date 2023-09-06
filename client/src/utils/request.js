// helper
async function requestHandler( // no = means must, got = means optional
    api,
    body = {},
    method = "GET",
    contentType = "application/json"
) {
    let requestOptions = {};

    //anything that is not GET
    if (method !== "GET" && contentType === "application/json") {
        // non media inputs
        requestOptions = {
            method: method,
            credentials: "include",
            mode: "cors",
            headers: {
                //lamp post thing
                "Content-Type": contentType,
            },
            body: JSON.stringify(body.req), // lamp post thing
        };
    }
    if (contentType === "multipart/form-data") {
        // media inputs
        requestOptions = {
            method: method,
            credentials: "include",
            mode: "cors",
            body: body.req,
        };
    }
    // catch throw err
    const response = await fetch(api, requestOptions);
    const res = await response.json();
    if (!response.ok) {
        throw new Error(res.error);
    }
    return res;
}

export async function requestGet(api) {
    // get data only
    return requestHandler(api);
}

export async function requestPost(api, body, contentType) {
    return requestHandler(api, body, "POST", contentType);
}

export async function requestPut(api, body) {
    // something like update
    return requestHandler(api, { req: body }, "PUT");
}

export async function requestDelete(api, body) {
    return requestHandler(api, body, "DELETE");
}
