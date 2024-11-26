import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";

export default function BookingOrderManagement() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [courtBookingList, setCourtBookingList] = useState([]);

    useEffect(() => {
        loadCourtBookingList();
    }, []);

    async function loadCourtBookingList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.LIST;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="booking-order-management">
            <div className="booking-order-management__container">
                <div className="booking-order-management__container__header">
                    <div className="booking-order-management__container__header__search-input">
                        Search
                    </div>
                    <div className="booking-order-management__container__header__button-group">
                        <div className="booking-order-management__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                    </div>
                </div>
                <div className="booking-order-management__container__list">
                    <div className="booking-order-management__container__list__header">
                        <div className="booking-order-management__container__list__header__order-id">
                            Id
                        </div>
                        <div className="booking-order-management__container__list__header__create-timestamp">
                            Create timestamp
                        </div>
                        <div className="booking-order-management__container__list__header__center">
                            Center
                        </div>
                        <div className="booking-order-management__container__list__header__court">
                            Court
                        </div>
                        <div className="booking-order-management__container__list__header__user">
                            User
                        </div>
                        <div className="booking-order-management__container__list__header__usage-date">
                            Usage date
                        </div>
                        <div className="booking-order-management__container__list__header__usage-time-start">
                            Usage time start
                        </div>
                        <div className="booking-order-management__container__list__header__usage-time-end">
                            Usage time end
                        </div>
                        <div className="booking-order-management__container__list__header__status">
                            Status
                        </div>
                    </div>
                    <div className="booking-order-management__container__list__content">
                        {courtBookingList.map(item => (
                        <div className="booking-order-management__container__list__content__item" key={item.id}>
                            <div className="booking-order-management__container__list__content__item__order-id">
                                {item.id}
                            </div>
                            <div className="booking-order-management__container__list__content__item__create-timestamp">
                                {item.createTimestamp}
                            </div>
                            <div className="booking-order-management__container__list__content__item__center">
                                {item.centerName}
                            </div>
                            <div className="booking-order-management__container__list__content__item__court">
                                {item.courtName}
                            </div>
                            <div className="booking-order-management__container__list__content__item__user">
                                {item.userUsername}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-date">
                                {item.usageDate}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-time-start">
                                {item.usageTimeStart}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-time-end">
                                {item.usageTimeEnd}
                            </div>
                            <div className="booking-order-management__container__list__content__item__status">
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