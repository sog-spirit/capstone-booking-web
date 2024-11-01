import { useContext, useEffect, useState } from "react";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { TokenContext } from "../../../App";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function CourtBookingList(props) {
    const {centerId, courtId} = props;
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [courtBookingList, setCourtBookingList] = useState([]);

    useEffect(() => {
        loadCourtBookingList();
    }, []);

    async function loadCourtBookingList() {
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.LIST + `?centerId=${centerId}&courtId=${courtId}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingList(data);
        }
    }

    return (
        <div className="user-court-page__container__court-list__list__item__booking-list">
            {courtBookingList.map(item => (
            <div className="user-court-page__container__court-list__list__item__booking-list__item" key={item.id}>
                {item.usageTimeStart}-{item.usageTimeEnd}
            </div>
            ))}
        </div>
    );
}