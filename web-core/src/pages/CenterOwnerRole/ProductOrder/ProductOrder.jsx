import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function ProductOrder() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productOrderList, setProductOrderList] = useState([]);

    useEffect(() => {
        loadProductOrderList();
    }, []);

    async function loadProductOrderList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.PRODUCT_ORDER.BASE + API_URL.PRODUCT_ORDER.CENTER_OWNER + API_URL.PRODUCT_ORDER.LIST;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductOrderList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="product-order">
            <div className="product-order__container">
                <div className="product-order__container__header">
                    <div className="product-order__container__header__search-input">
                        Search
                    </div>
                    <div className="product-order__container__header__button-group">
                        <div className="product-order__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                    </div>
                </div>
                <div className="product-order__container__list">
                    <div className="product-order__container__list__header">
                        <div className="product-order__container__list__header__id">
                            Id
                        </div>
                        <div className="product-order__container__list__header__user">
                            User
                        </div>
                        <div className="product-order__container__list__header__create-timestamp">
                            Create timestamp
                        </div>
                        <div className="product-order__container__list__header__total">
                            Total
                        </div>
                        <div className="product-order__container__list__header__center">
                            Center
                        </div>
                        <div className="product-order__container__list__header__status">
                            Status
                        </div>
                    </div>
                    <div className="product-order__container__list__content">
                        {productOrderList.map(item => (
                        <div className="product-order__container__list__content__item" key={item.id}>
                            <div className="product-order__container__list__content__item__id">
                                {item.id}
                            </div>
                            <div className="product-order__container__list__content__item__user">
                                {item.user.username}
                            </div>
                            <div className="product-order__container__list__content__item__create-timestamp">
                                {item.createTimestamp}
                            </div>
                            <div className="product-order__container__list__content__item__total">
                                {item.total}
                            </div>
                            <div className="product-order__container__list__content__item__center">
                                {item.center.name}
                            </div>
                            <div className="product-order__container__list__content__item__status">
                                {item.status.name}
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