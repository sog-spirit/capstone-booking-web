import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { handleInputChange } from "../../utils/input/InputUtils";
import { refreshAccessToken } from "../../utils/jwt/JwtUtils";
import { TokenContext } from "../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../utils/consts/HttpRequestConsts";
import { BASE_API_URL, PRODUCT_URL } from "../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";

export default function ProductPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        price: '',
    });
    const [addNewInputState, setAddNewInputState] = useState({
        name: '',
        price: '',
    });

    const [productList, setProductList] = useState([]);

    useEffect(() => {
        loadProductList();
    }, [tokenState.accessToken]);

    async function submitAddNewProduct() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewFormData(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
            setAddNewInputState(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
        }
    }

    async function loadProductList() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE + PRODUCT_URL.LIST, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let productList = await response.json();
            setProductList(productList);
        }
    }

    return (
        <>
        <Header />
        <div className="product-page">
            <div className="product-page__container">
                <div className="product-page__container__header">
                    <div className="product-page__container__header__title">
                        <div className="product-page__container__header__title__label">
                            <h4>Product management</h4>
                        </div>
                        <div className="product-page__container__header__title__description">
                            Description
                        </div>
                    </div>
                    <div className="product-page__container__header__button-group">
                        <div className="product-page__container__header__button-group__refresh-button" onClick={() => loadProductList()}>
                            Refresh
                        </div>
                        <div className="product-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="product-page__container__product-list">
                    <div className="product-page__container__product-list__title">
                        <h5>Product list</h5>
                    </div>
                    <div className="product-page__container__product-list__list">
                        {productList.map(item => (
                        <div className="product-page__container__product-list__list__item" key={item.id}>
                            <div className="product-page__container__product-list__list__item__info">
                                <div className="product-page__container__product-list__list__item__info__img">
                                    <img src={'/no-image.jpg'} />
                                </div>
                            </div>
                            <div className="product-page__container__product-list__list__item__detail">
                                <div className="product-page__container__product-list__list__item__detail__name">
                                    {item.name}
                                </div>
                                <div className="product-page__container__product-list__list__item__detail__price">
                                    Price: {item.price}
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="product-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="product-page__add-new-modal__form">
                    <div className="product-page__add-new-modal__form__header">
                        <div className="product-page__add-new-modal__form__header__title">
                            <h5>Add new product</h5>
                        </div>
                        <div className="product-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="product-page__add-new-modal__form__content">
                        <div className="product-page__add-new-modal__form__content__name">
                            <div className="product-page__add-new-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" onChange={event => handleInputChange(event, setAddNewFormData)} className={`product-page__add-new-modal__form__content__name__input ${addNewInputState.name ? 'input-error' : ''}`} />
                            <div className="product-page__add-new-modal__form__content__name__error-message input-error-message">{addNewInputState.name ? addNewInputState : ''}</div>
                        </div>
                        <div className="product-page__add-new-modal__form__content__price">
                            <div className="product-page__add-new-modal__form__content__price__label">Price</div>
                            <input type="text" placeholder="Price" name="price" onChange={event => handleInputChange(event, setAddNewFormData)} className={`product-page__add-new-modal__form__content__price__input ${addNewInputState.price ? 'input-error' : ''}`} />
                            <div className="product-page__add-new-modal__form__content__price__error-message input-error-message">{addNewInputState.price ? addNewInputState : ''}</div>
                        </div>
                    </div>
                    <div className="product-page__add-new-modal__form__footer">
                        <div className="product-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewProduct()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}