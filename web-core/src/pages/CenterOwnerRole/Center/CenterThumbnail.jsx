import { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../utils/consts/APIConsts";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { TokenContext } from "../../../App";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function CenterThumbnail(props) {
    const {centerId, rerender} = props;

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerThumbnailId, setCenterThumbnailId] = useState(null);

    useEffect(() => {
        loadCenterThumbnail();
    }, [rerender]);

    async function loadCenterThumbnail() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + API_URL.IMAGE.THUMBNAIL_INFO;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterThumbnailId(data);
        }
    }

    return (
        <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + `?id=${centerThumbnailId?.id}`} onError={(e) => e.target.src = '/no-image.jpg'} />
    );
}