import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../App";
import Header from "../../../components/Header";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";

export default function UserBookingOrderList() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [userBookingOrderList, setUserBookingOrderList] = useState([]);

    useEffect(() => {
        loadUserBookingOrderList();
    }, []);

    async function loadUserBookingOrderList() {
        refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.USER_ORDER, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserBookingOrderList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="user-booking-order-list">
            <div className="user-booking-order-list__container">
                <div className="user-booking-order-list__container__header">
                    <div className="user-booking-order-list__container__header__title">
                        <div className="user-booking-order-list__container__header__title__label">
                            <h4>Booking order list</h4>
                        </div>
                    </div>
                </div>
                <div className="user-booking-order-list__container__booking-order-list">
                    <div className="user-booking-order-list__container__booking-order-list__title">
                        List
                    </div>
                    <div className="user-booking-order-list__container__booking-order-list__list">
                        {userBookingOrderList.map(item => (
                        <div className="user-booking-order-list__container__booking-order-list__list__item" key={item.id}>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__order-id">
                                {item.id}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__center">
                                {item.centerName}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__court">
                                {item.courtName}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__create-timestamp">
                                {item.createTimestamp}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__usage-date">
                                {item.usageDate}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__usage-time-start">
                                {item.usageTimeStart}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__usage-time-end">
                                {item.usageTimeEnd}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__item__status">
                                {item.statusName}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}