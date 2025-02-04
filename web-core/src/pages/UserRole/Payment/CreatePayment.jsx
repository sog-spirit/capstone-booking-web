import { useContext, useEffect } from "react";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { replace, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";

export default function CreatePayment() {
    const {tokenState, setTokenState} = useContext(TokenContext);
    const [queryParams] = useSearchParams();

    useEffect(() => {
        createPayment();
    }, []);

    async function createPayment() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + '/court-booking-payment/create-payment';
        let searchParams = new URLSearchParams();
        searchParams.append('amount', queryParams.get('amount') * 100);
        searchParams.append('returnUrl', `http://localhost:5173/${queryParams.get('returnUrl')}`);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            console.log(data);
            window.location.href = data.url;
        }
    }

    return (
        <>
        </>
    );
}