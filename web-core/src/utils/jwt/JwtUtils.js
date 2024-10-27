import { BASE_API_URL, JWT_URL } from "../consts/APIConsts";
import { ACCESS_TOKEN, HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, REFRESH_TOKEN } from "../consts/HttpRequestConsts";
import { HTTP_STATUS } from "../consts/HttpStatusCode";

export async function refreshAccessToken(setTokenState) {
    if (localStorage.getItem(ACCESS_TOKEN) === null || localStorage.getItem(REFRESH_TOKEN) === null) {
        return;
    }

    const refreshVerifyRequestBody = {
        accessToken: localStorage.getItem(ACCESS_TOKEN),
    };

    const refreshVerfifyRequestHeaders = new Headers();
    refreshVerfifyRequestHeaders.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

    const refreshVerfifyResponse = await fetch(BASE_API_URL + JWT_URL.BASE + JWT_URL.VERIFY, {
        method: HTTP_REQUEST_METHOD.POST,
        headers: refreshVerfifyRequestHeaders,
        body: JSON.stringify(refreshVerifyRequestBody),
    });

    if (refreshVerfifyResponse.status === HTTP_STATUS.OK) {
        return;
    } else if (refreshVerfifyResponse.status === HTTP_STATUS.UNAUTHORIZED) {
        getNewAccessToken(setTokenState);
    }
}

async function getNewAccessToken(setTokenState) {
    const newAccessTokenRequetsBody = {
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
    };

    const newAccessTokenRequestHeaders = new Headers();
    newAccessTokenRequestHeaders.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

    const newAccessTokenResponse = await fetch(BASE_API_URL + JWT_URL.BASE + JWT_URL.REFRESH, {
        method: HTTP_REQUEST_METHOD.POST,
        headers: newAccessTokenRequestHeaders,
        body: JSON.stringify(newAccessTokenRequetsBody),
    });

    if (newAccessTokenResponse.status === HTTP_STATUS.OK) {
        let data = await newAccessTokenResponse.json();
        localStorage.setItem(ACCESS_TOKEN, data?.accessToken);
        setTokenState(prevState => ({
            ...prevState,
            accessToken: data?.accessToken,
        }));
    }
}