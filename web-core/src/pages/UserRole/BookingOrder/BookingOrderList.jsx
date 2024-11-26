import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../App";
import Header from "../../../components/Header";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
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
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.LIST;

        const response = await fetch(url, {
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
                    <div className="user-booking-order-list__container__booking-order-list__list">
                        <div className="user-booking-order-list__container__booking-order-list__list__header">
                            <div className="user-booking-order-list__container__booking-order-list__list__header__id">
                                Id
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__center">
                                Center name
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__court">
                                Court name
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__create-timestamp">
                                Create timestamp
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-date">
                                Usage date
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-time-start">
                                Usage time start
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-time-end">
                                Usage time end
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__status">
                                Status
                            </div>
                        </div>
                        <div className="user-booking-order-list__container__booking-order-list__list__content">
                            {userBookingOrderList.map(item => (
                            <div className="user-booking-order-list__container__booking-order-list__list__content__item" key={item.id}>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__center">
                                    {item.center.name}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__court">
                                    {item.court.name}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__create-timestamp">
                                    {item.createTimestamp}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-date">
                                    {item.usageDate}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-time-start">
                                    {item.usageTimeStart}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-time-end">
                                    {item.usageTimeEnd}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__status">
                                    {item.status.name}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}