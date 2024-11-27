import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function CourtBookingItem(props) {
    const {
        courtId,
    } = props;

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [timeInterval, setTimeInterval] = useState([]);

    useEffect(() => {
        loadCourtBookingList();
    }, []);

    async function loadCourtBookingList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.COURT + API_URL.COURT_BOOKING.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('courtId', courtId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTimeInterval(data.timeMarks);
        }
    }

    return (
        timeInterval.map(item => (
            <div className="center-detail-page__container__court-list__list__detail__item" style={{gridColumn: `span ${item.span}`}}></div>
        ))
    );
}