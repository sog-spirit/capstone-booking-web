import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { BOOKING_STATUS_CONSTS, getBookingStatusColor } from "../../../utils/consts/BookingStatusConsts";
import { formatTimestamp, trimTime } from "../../../utils/formats/TimeFormats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { COURT_BOOKING_PRODUCT_ORDER_CONSTS } from "../../../utils/consts/CourtBookingProductOrderConsts";

export default function CourtBookingItem(props) {
    const {
        courtId,
        day,
        addNewCourtBookingModalState,
    } = props;

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [timeInterval, setTimeInterval] = useState([]);

    const [courtBookingDetailModalState, setCourtBookingDetailModalState] = useState(false);
    const [courtBookingDetail, setCourtBookingDetail] = useState({
        courtBookingId: 0,
        createTimestamp: '',
        courtFee: 0,
        usageTimeStart: '',
        usageTimeEnd: '',
        productFee: 0,
        username: '',
        status: 0,
    });

    const [productOrderList, setProductOrderList] = useState([]);

    useEffect(() => {
        loadCourtBookingList();
    }, [tokenState.accessToken, addNewCourtBookingModalState]);

    async function loadCourtBookingList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.COURT + API_URL.COURT_BOOKING.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('courtId', courtId);
        searchParams.append('usageDate', day);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTimeInterval(data.timeMarks);
        }
    }

    function openCourtBookingDetailModal(courtBookingId) {
            setCourtBookingDetailModalState(true);
            loadCourtBookingDetail(courtBookingId);
        }
    
    async function loadCourtBookingDetail(courtBookingId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.DETAIL;
        let searchParams = new URLSearchParams();
        searchParams.append('courtBookingId', courtBookingId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();

            setCourtBookingDetail({
                courtBookingId: courtBookingId,
                createTimestamp: data.createTimestamp,
                usageTimeStart: data.usageTimeStart,
                usageTimeEnd: data.usageTimeEnd,
                courtFee: data.courtFee,
                status: data.status,
                productFee: data.productFee,
                username: data.userUsername,
            });

            loadProductOrderList(courtBookingId);
        }
    }

    async function loadProductOrderList(courtBookingId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.COURT_BOOKING + API_URL.COURT_BOOKING_PRODUCT_ORDER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('courtBookingId', courtBookingId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductOrderList(data);
        }
    }

    async function checkoutCourtBooking(id) {
        let accessToken = await refreshAccessToken(setTokenState);
                
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.CHECKOUT;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setCourtBookingDetailModalState(false);
            loadCourtBookingList();
        }
    }

    async function cancelCourtBooking(id) {
        let accessToken = await refreshAccessToken(setTokenState);
                
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setCourtBookingDetailModalState(false);
            loadCourtBookingList();
        }
    }

    async function cancelCourtBookingProductOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadProductOrderList(courtBookingDetail.courtBookingId);
        }
    }

    async function checkoutCourtBookingProductOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.CHECKOUT;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCourtBookingDetail(courtBookingDetail.courtBookingId);
        }
    }

    return (
        <>
        {timeInterval.map(item => (
            <div className={`center-detail-page__container__court-list__list__detail__item ${item?.courtBookingId ? `hoverable` : ``}`} style={{gridColumn: `span ${item.span}`, backgroundColor: getBookingStatusColor(item.status)}} onClick={item?.courtBookingId ? () => openCourtBookingDetailModal(item?.courtBookingId) : undefined}></div>
        ))}
        <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal" style={courtBookingDetailModalState ? {} : {display: 'none'}}>
            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form">
                <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__header">
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__header__title">
                        <h5>Order {courtBookingDetail.courtBookingId} detail</h5>
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__header__close-button" onClick={() => setCourtBookingDetailModalState(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content">
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__create-timestamp">
                        Created at: {formatTimestamp(courtBookingDetail.createTimestamp)}
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__username">
                        By: {courtBookingDetail.username}
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__court-fee">
                        Court fee: {courtBookingDetail.courtFee}₫
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-fee">
                        Product fee: {courtBookingDetail.productFee}₫
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__total">
                        Total: {courtBookingDetail.courtFee + courtBookingDetail.productFee}₫
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__usage-time">
                        Usage time: {courtBookingDetail.usageTimeStart && courtBookingDetail.usageTimeEnd ? `${trimTime(courtBookingDetail.usageTimeStart)}-${trimTime(courtBookingDetail.usageTimeEnd)}` : ``}
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons">
                        {courtBookingDetail.status === BOOKING_STATUS_CONSTS.PENDING && (
                            <>
                            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons__checkout" onClick={() => checkoutCourtBooking(courtBookingDetail.courtBookingId)}>
                                Checkout
                            </div>
                            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons__cancel" onClick={() => cancelCourtBooking(courtBookingDetail.courtBookingId)}>
                                Cancel
                            </div>
                            </>
                        )}
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list-label">
                        <h5>Product order list</h5>
                    </div>
                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list">
                        {productOrderList.map(item => (
                            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item">
                                <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__label">
                                    <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.PRODUCT + `?productId=${item.productInventoryProductId}`} />
                                </div>
                                <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info">
                                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__create-timestamp">
                                        Create timestamp: {formatTimestamp(item.createTimestamp)}
                                    </div>
                                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__quantity">
                                        Quantity: {item.quantity}
                                    </div>
                                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__fee">
                                        Fee: {item.fee}
                                    </div>
                                    <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group">
                                        {item.status === COURT_BOOKING_PRODUCT_ORDER_CONSTS.PENDING && (
                                            <>
                                            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group__checkout" onClick={() => checkoutCourtBookingProductOrder(item.id)}>
                                                Checkout
                                            </div>
                                            <div className="center-detail-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group__cancel" onClick={() => cancelCourtBookingProductOrder(item.id)}>
                                                Cancel
                                            </div>
                                            </>
                                        )}
                                    </div>
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