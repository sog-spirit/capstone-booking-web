import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { API_URL } from "../../../utils/consts/APIConsts";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPlus, faShoppingCart, faSubtract, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UserProductOrder() {
    const {courtBookingId} = useParams();

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productList, setProductList] = useState([]);

    const [cartList, setCartList] = useState([]);
    const [cartPriceTotal, setCartPriceTotal] = useState(0);

    const [cartModalState, setCartModalState] = useState(false);

    const [centerIdState, setCenterIdState] = useState(0);

    async function loadCenterId() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.CENTER + API_URL.COURT_BOOKING.ID;
        let searchParams = new URLSearchParams();
        searchParams.append('courtBookingId', courtBookingId);


        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterIdState(data.courtCenterId);
            return data.courtCenterId;
        }
    }

    useEffect(() => {
        loadProductList();
    }, [tokenState.accessToken]);

    async function loadProductList() {
        let accessToken = await refreshAccessToken(setTokenState);
        let centerId = await loadCenterId();

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.PRODUCT_INVENTORY.BASE + API_URL.PRODUCT_INVENTORY.USER + API_URL.PRODUCT_INVENTORY.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let list = await response.json();
            setProductList(list);
        }
    }

    function addProductToCart(productInventoryId) {
        let cartIem = cartList.find(item => item.id === productInventoryId);

        if (cartIem) {
            addQuantity(productInventoryId);
        } else {
            let productInventoryItem = productList.find(item => item.id === productInventoryId);
            let newCartItem = {
                ...productInventoryItem,
                quantity: 1,
            };
            setCartList(prevState => [...prevState, newCartItem]);
            setCartPriceTotal(prevState => prevState + newCartItem.productPrice);
        }

        setProductList(productList.map(item => {
            if (item.id === productInventoryId) {
                return {...item, quantity: item.quantity - 1};
            } else {
                return item;
            }
        }));
    }

    function addQuantity(productInventoryId) {
        setCartList(cartList.map(item => {
            if (item.id === productInventoryId) {
                setCartPriceTotal(prevState => prevState + item.productPrice);
                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            } else {
                return item;
            }
        }).filter(item => item.quantity > 0));
    }

    function subtractQuantity(productInventoryId) {
        setCartList(cartList.map(item => {
            if (item.id === productInventoryId) {
                setCartPriceTotal(prevState => prevState - item.productPrice);
                return {
                    ...item,
                    quantity: item.quantity - 1,
                };
            } else {
                return item;
            }
        }).filter(item => item.quantity > 0));

        setProductList(productList.map(item => {
            if (item.id === productInventoryId) {
                return {...item, quantity: item.quantity + 1};
            } else {
                return item;
            }
        }));
    }

    function removeCartIem(productInventoryId) {
        let cartListItem = cartList.find(item => item.id === productInventoryId);

        setCartList(cartList.filter(item => {
            if (item.id !== productInventoryId) {
                return true;
            } else {
                setCartPriceTotal(prevState => prevState - (item.productPrice * item.quantity));
                return false;
            }
        }));

        setProductList(productList.map(item => {
            if (item.id === productInventoryId) {
                return {...item, quantity: item.quantity + cartListItem.quantity};
            } else {
                return item;
            }
        }));
    }

    function closeCartModal() {
        setCartModalState(false);
    }

    function clearCart() {
        setCartList([]);
        setCartPriceTotal(0);
    }

    async function submitCartCheckoutData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let cartItemList = cartList.map(item => {
            return {
                productInventoryId: item.id,
                quantity: item.quantity,
            };
        });

        let bodyData = {
            total: cartPriceTotal,
            centerId: centerIdState,
            cart: cartItemList,
            courtBookingId: courtBookingId,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(bodyData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            closeCartModal();
            clearCart();
        }

        loadProductList();
    }

    return (
        <>
        <Header />
        <div className="user-product-order">
            <div className="user-product-order__container">
                <div className="user-product-order__container__header">
                    <div className="user-product-order__container__header__title">
                        <div className="user-product-order__container__header__title__label">
                            <h4>Court booking id {courtBookingId} product order</h4>
                        </div>
                    </div>
                    <div className="user-product-order__container__header__button-group">
                        <div className="user-product-order__container__header__button-group__view-cart-button" onClick={() => setCartModalState(true)}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </div>
                    </div>
                </div>
                <div className="user-product-order__container__product-list">
                    <div className="user-product-order__container__product-list__title">
                        <h5>Product list</h5>
                    </div>
                    <div className="user-product-order__container__product-list__list">
                        {productList.map(item => (
                        <div className="user-product-order__container__product-list__list__item" key={item.id}>
                            <div className="user-product-order__container__product-list__list__item__info">
                                <div className="user-product-order__container__product-list__list__item__info__img">
                                    <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.PRODUCT + `?productId=${item.productId}`} />
                                </div>
                            </div>
                            <div className="user-product-order__container__product-list__list__list__item__detail">
                                <div className="user-product-order__container__product-list__list__item__detail__name">
                                    {item.productName}
                                </div>
                                <div className="user-product-order__container__product-list__list__item__detail__price">
                                    Price: {item.productPrice}₫
                                </div>
                                <div className="user-product-order__container__product-list__list__list__item__detail__quantity">
                                    Remaining stock: {item.quantity}
                                </div>
                            </div>
                            <div className="user-product-order__container__product-list__list__item__button-group">
                                <div className="user-product-order__container__product-list__list__item__button-group__add-to-cart-button" onClick={() => addProductToCart(item.id)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="user-product-order__cart-modal" style={cartModalState ? {} : {display: 'none'}}>
                <div className="user-product-order__cart-modal__form">
                    <div className="user-product-order__cart-modal__form__header">
                        <div className="user-product-order__cart-modal__form__header__title">
                            <h5>Cart detail</h5>
                        </div>
                        <div className="user-product-order__cart-modal__form__header__close-button" onClick={() => closeCartModal()}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    <div className="user-product-order__cart-modal__form__cart-detail">
                        {cartList.map(item => (
                        <div className="user-product-order__cart-modal__form__cart-detail__item" key={item.id}>
                            <div className="user-product-order__cart-modal__form__cart-detail__item__detail">
                                <div className="user-product-order__cart-modal__form__cart-detail__item__detail__img">
                                <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.PRODUCT + `?productId=${item.productId}`} />
                                </div>
                                <div className="user-product-order__cart-modal__form__cart-detail__item__detail__info">
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__detail__info__name">
                                        {item.productName}
                                    </div>
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__detail__info__price">
                                        {item.productPrice}
                                    </div>
                                </div>
                            </div>
                            <div className="user-product-order__cart-modal__form__cart-detail__item__button-group">
                                <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__first">
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__first__remove-button" onClick={() => removeCartIem(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </div>
                                <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__quantity">
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__quantity__subtract-button" onClick={() => subtractQuantity(item.id)}>
                                        <FontAwesomeIcon icon={faSubtract} />
                                    </div>
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__quantity__label">
                                        {item.quantity}
                                    </div>
                                    <div className="user-product-order__cart-modal__form__cart-detail__item__button-group__quantity__add-button" onClick={() => addQuantity(item.id)}>
                                        <FontAwesomeIcon icon={faAdd} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="user-product-order__cart-modal__form__footer">
                        <div className="user-product-order__cart-modal__form__footer__total">
                            Total: {cartPriceTotal}
                        </div>
                        <div className="user-product-order__cart-modal__form__footer__checkout">
                            <div className="user-product-order__cart-modal__form__footer__checkout__checkout-button" onClick={() => submitCartCheckoutData()}>
                                Add
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}