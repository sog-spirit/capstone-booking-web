import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function CourtBookingProductOrderDetail(props) {
    const {productOrderId} = props;
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productOrderDetailList, setProductOrderDetailList] = useState([]);

    useEffect(() => {
        loadCourtBookingProductOrderDetail();
    }, []);

    async function loadCourtBookingProductOrderDetail() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + '/court_booking_product_order_detail/list';
        let searchParams = new URLSearchParams();
        searchParams.append('courtBookingProductOrderId', productOrderId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductOrderDetailList(data);
        }
    }

    return (
        <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list">
            {productOrderDetailList.map(item => (
                <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list__item">
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list__item__image">
                        <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.PRODUCT + `?productId=${item.productInventoryProductId}`} />
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list__item__name">
                        {item.productInventoryProductName}
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list__item__quantity">
                        Quantity: {item.quantity}
                    </div>
                    <div className="user-court-page__container__court-list__list__detail__court-booking-info-modal__form__content__product-order-list__item__info__product-order-detail-list__list__item__fee">
                        Fee: {item.fee}₫
                    </div>
                </div>
            ))}
        </div>
    );
}