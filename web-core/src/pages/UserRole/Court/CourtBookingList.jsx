import { useContext, useEffect, useState } from "react";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { LoginContext, TokenContext } from "../../../App";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { BOOKING_STATUS_CONSTS, getBookingStatusColor } from "../../../utils/consts/BookingStatusConsts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp, trimTime } from "../../../utils/formats/TimeFormats";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { COURT_BOOKING_PRODUCT_ORDER_CONSTS } from "../../../utils/consts/CourtBookingProductOrderConsts";
import CourtBookingProductOrderDetail from "./CourtBookingProductOrderDetail";

export default function CourtBookingList(props) {
    const {courtId, date, newBookingModalState} = props;

    const {tokenState, setTokenState} = useContext(TokenContext);
    const {loginState, setLoginState} = useContext(LoginContext);

    const navigate = useNavigate();

    const [courtBookingList, setCourtBookingList] = useState([]);

    const [courtBookingDetailModalState, setCourtBookingDetailModalState] = useState(false);
    const [courtBookingDetail, setCourtBookingDetail] = useState({
        courtBookingId: 0,
        createTimestamp: '',
        courtFee: 0,
        usageTimeStart: '',
        usageTimeEnd: '',
        productFee: 0,
        status: 0,
    });

    const [productOrderList, setProductOrderList] = useState([]);

    useEffect(() => {
        loadCenterCourtBookingList();
    }, [tokenState.accessToken,
        newBookingModalState,
        courtBookingDetailModalState,
    ]);

    async function loadCenterCourtBookingList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.COURT + API_URL.COURT_BOOKING.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('courtId', courtId);
        searchParams.append('date', date);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingList(data.timeMarks);
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

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.DETAIL;
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
            });

            loadProductOrderList(courtBookingId);
        }
    }

    function navigateToProductOrderPage(courtBookingId) {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.COURT_BOOKING + `/${courtBookingId}` + PAGE_URL.USER.PRODUCT_ORDER);
    }

    async function loadProductOrderList(courtBookingId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.USER + API_URL.COURT_BOOKING_PRODUCT_ORDER.COURT_BOOKING + API_URL.COURT_BOOKING_PRODUCT_ORDER.LIST;
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

    async function cancelCourtBookingOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setCourtBookingDetailModalState(false);
        }
    }

    function checkoutCourtBookingOrder(id) {
        const returnUrl = `court-booking-payment/${id}`;
        navigate(`/payment?returnUrl=${returnUrl}&amount=${courtBookingDetail.courtFee}`);
    }

    async function cancelCourtBookingProductOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCenterCourtBookingList(courtBookingDetail.courtBookingId);
        }
    }

    function checkoutCourtBookingProductOrder(id) {
        let item = productOrderList.find(item => item.id === id);
        const returnUrl = `product-order-payment/${id}`;
        navigate(`/payment?returnUrl=${returnUrl}&amount=${item.fee}`);
    }

    return (
        <>
        {courtBookingList.map(item => (
            <div className={`user-court-page__container__court-list__list__detail__item ${item?.courtBookingId ? `hoverable` : ``}`} style={{gridColumn: `span ${item.span}`, backgroundColor: getBookingStatusColor(item.status)}} onClick={item?.courtBookingId ? () => openCourtBookingDetailModal(item?.courtBookingId) : undefined}></div>
        ))}
        <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal" style={courtBookingDetailModalState ? {} : {display: 'none'}}>
            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form">
                <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__header">
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__header__title">
                        <h5>Order {courtBookingDetail.courtBookingId} detail</h5>
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__header__close-button" onClick={() => setCourtBookingDetailModalState(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content">
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__create-timestamp">
                        Created at: {formatTimestamp(courtBookingDetail.createTimestamp)}
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__court-fee">
                        Court fee: {courtBookingDetail.courtFee}₫
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-fee">
                        Product fee: {courtBookingDetail.productFee}₫
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__total">
                        Total: {courtBookingDetail.courtFee + courtBookingDetail.productFee}₫
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__usage-time">
                        Usage time: {courtBookingDetail.usageTimeStart && courtBookingDetail.usageTimeEnd ? `${trimTime(courtBookingDetail.usageTimeStart)}-${trimTime(courtBookingDetail.usageTimeEnd)}` : ``}
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons">
                        {BOOKING_STATUS_CONSTS.INDEX[courtBookingDetail.status] === BOOKING_STATUS_CONSTS.NAME.IS_BOOKING && (
                            <>
                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons__checkout" onClick={() => checkoutCourtBookingOrder(courtBookingDetail.courtBookingId)}>
                                Checkout
                            </div>
                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons__cancel" onClick={() => cancelCourtBookingOrder(courtBookingDetail.courtBookingId)}>
                                Cancel
                            </div>
                            </>
                        )}

                        {BOOKING_STATUS_CONSTS.INDEX[courtBookingDetail.status] === BOOKING_STATUS_CONSTS.NAME.BOOKED && (
                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__buttons__order" onClick={() => navigateToProductOrderPage(courtBookingDetail.courtBookingId)}>
                                Order
                            </div>
                        )}
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list-title">
                        <h5>Product order list</h5>
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list">
                        {productOrderList.map(item => (
                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item">
                                <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__label">
                                    <h5>Product order id {item.id}</h5>
                                </div>
                                <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info">
                                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__create-timestamp">
                                        Create timestamp: {formatTimestamp(item.createTimestamp)}
                                    </div>
                                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__fee">
                                        Total fee: {item.fee}₫
                                    </div>
                                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__status">
                                        Status: {COURT_BOOKING_PRODUCT_ORDER_CONSTS.INDEX[item.status]}
                                    </div>
                                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group">
                                        {item.status === COURT_BOOKING_PRODUCT_ORDER_CONSTS.PENDING && (
                                            <>
                                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group__checkout" onClick={() => checkoutCourtBookingProductOrder(item.id)}>
                                                Checkout
                                            </div>
                                            <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__button-group__cancel" onClick={() => cancelCourtBookingProductOrder(item.id)}>
                                                Cancel
                                            </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list">
                                        <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__label">
                                            Product order list
                                        </div>
                                        <CourtBookingProductOrderDetail productOrderId={item.id} />
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