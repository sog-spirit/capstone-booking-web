import { API_URL } from "../consts/APIConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, LOGIN_STATE_CONSTS } from "../consts/HttpRequestConsts";
import { HTTP_STATUS } from "../consts/HttpStatusCode";

export async function refreshAccessToken(setTokenState) {
    if (localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN) === null || localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN) === null) {
        return;
    }

    const refreshVerifyRequestBody = {
        accessToken: localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN),
    };

    const refreshVerfifyRequestHeaders = new Headers();
    refreshVerfifyRequestHeaders.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

    const refreshVerfifyResponse = await fetch(API_URL.BASE + API_URL.JWT.BASE + API_URL.JWT.VERIFY, {
        method: HTTP_REQUEST_METHOD.POST,
        headers: refreshVerfifyRequestHeaders,
        body: JSON.stringify(refreshVerifyRequestBody),
    });

    if (refreshVerfifyResponse.status === HTTP_STATUS.OK) {
        return localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN);
    } else if (refreshVerfifyResponse.status === HTTP_STATUS.UNAUTHORIZED) {
        return getNewAccessToken(setTokenState);
    }
}

async function getNewAccessToken(setTokenState) {
    const newAccessTokenRequetsBody = {
        refreshToken: localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN),
    };

    const newAccessTokenRequestHeaders = new Headers();
    newAccessTokenRequestHeaders.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

    const newAccessTokenResponse = await fetch(API_URL.BASE + API_URL.JWT.BASE + API_URL.JWT.REFRESH, {
        method: HTTP_REQUEST_METHOD.POST,
        headers: newAccessTokenRequestHeaders,
        body: JSON.stringify(newAccessTokenRequetsBody),
    });

    if (newAccessTokenResponse.status === HTTP_STATUS.OK) {
        let data = await newAccessTokenResponse.json();
        localStorage.setItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN, data?.accessToken);
        setTokenState(prevState => ({
            ...prevState,
            accessToken: data?.accessToken,
        }));
        return data?.accessToken;
    }
}