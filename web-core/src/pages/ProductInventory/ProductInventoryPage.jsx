import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { refreshAccessToken } from "../../utils/jwt/JwtUtils";
import { TokenContext } from "../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../utils/consts/HttpRequestConsts";
import { BASE_API_URL, CENTER_URL, PRODUCT_INVENTORY_URL, PRODUCT_URL } from "../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { handleInputChange } from "../../utils/input/InputUtils";

export default function ProductInventoryPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productDropdownState, setProductDropdownState] = useState(false);
    const [productDropdownList, setProductDropdownList] = useState([]);
    const [productDropdownSearchInput, setProductDropdownSearchInput] = useState('');
    const [productDropdownTextValue, setProductDropdownTextValue] = useState('');
    const productDropdownRef = useRef(null);

    const [centerDropdownState, setCenterDropdownState] = useState(false);
    const [centerDropdownList, setCenterDropdownList] = useState([]);
    const [centerDropdownSearchInput, setCenterDropdownSearchInput] = useState('');
    const [centerDropdownTextValue, setCenterDropdownTextValue] = useState('');
    const centerDropdownRef = useRef(null);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        productId: 0,
        centerId: 0,
        quantity: 0,
    });
    const [addNewInputStatus, setAddNewInputStatus] = useState({
        product: '',
        center: '',
        quantity: '',
    });

    const [productInvetoryList, setProductInventoryList] = useState([]);

    useEffect(() => {
        function handler(event) {
            if (!productDropdownRef.current.contains(event.target)) {
                setProductDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        function handler(event) {
            if (!centerDropdownRef.current.contains(event.target)) {
                setCenterDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        loadProductDropdownList();
    }, [addNewModalState, productDropdownSearchInput, tokenState.accessToken]);

    useEffect(() => {
        loadCenterDropdownList();
    }, [addNewModalState, centerDropdownSearchInput, tokenState.accessToken]);

    useEffect(() => {
        loadProductInventoryList();
    }, [tokenState.accessToken]);

    async function loadProductDropdownList() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE + PRODUCT_URL.LIST + `?query=${productDropdownSearchInput}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let productList = await response.json();
            setProductDropdownList(productList);
        }
    }

    function selectProductDropdownItem(productId) {
        let product = productDropdownList.find(item => item.id === productId);
        setProductDropdownTextValue(product.name);
        setAddNewFormData(prevState => ({
            ...prevState,
            productId: productId,
        }));
        setProductDropdownState(false);
    }

    async function loadCenterDropdownList() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + CENTER_URL.BASE + CENTER_URL.LIST + `?query=${centerDropdownSearchInput}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterDropdownList(data);
        }
    }

    function selectCenterDropdownItem(centerId) {
        let center = centerDropdownList.find(item => item.id === centerId);
        setCenterDropdownTextValue(center.name);
        setAddNewFormData(prevState => ({
            ...prevState,
            centerId: centerId,
        }));
        setCenterDropdownState(false);
    }

    async function submitAddNewData() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_INVENTORY_URL.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setProductDropdownTextValue('');
            setCenterDropdownTextValue('');
            setAddNewFormData(prevState => ({
                ...prevState,
                productId: 0,
                centerId: 0,
                quantity: 0,
            }));
            setAddNewInputStatus(prevstate => ({
                ...prevstate,
                product: '',
                center: '',
                quantity: '',
            }));
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewModalState(false);
        }
    }

    async function loadProductInventoryList() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_INVENTORY_URL.BASE + PRODUCT_INVENTORY_URL.LIST, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductInventoryList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="product-inventory-page">
            <div className="product-inventory-page__container">
                <div className="product-inventory-page__container__header">
                    <div className="product-inventory-page__container__header__search-input">
                        Search
                    </div>
                    <div className="product-inventory-page__container__header__button-group">
                        <div className="product-inventory-page__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                        <div className="product-inventory-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="product-inventory-page__container__list">
                    <div className="product-inventory-page__container__list__header">
                        <div className="product-inventory-page__container__list__header__product">
                            Product
                        </div>
                        <div className="product-inventory-page__container__list__header__center">
                            Center
                        </div>
                        <div className="product-inventory-page__container__list__header__quantity">
                            Quantity
                        </div>
                    </div>
                    <div className="product-inventory-page__container__list__content">
                        {productInvetoryList.map(item => (
                        <div className="product-inventory-page__container__list__content__item" key={item.id}>
                            <div className="product-inventory-page__container__list__content__item__product">
                                {item.product.name}
                            </div>
                            <div className="product-inventory-page__container__list__content__item__center">
                                {item.center.name}
                            </div>
                            <div className="product-inventory-page__container__list__content__item__quantity">
                                {item.quantity}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="product-inventory-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="product-inventory-page__add-new-modal__form">
                    <div className="product-inventory-page__add-new-modal__form__header">
                        <div className="product-inventory-page__add-new-modal__form__header__title">
                            <h5>Add new product</h5>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="product-inventory-page__add-new-modal__form__content">
                        <div className="product-inventory-page__add-new-modal__form__content__product">
                            <div className="product-inventory-page__add-new-modal__form__content__product__label">Product</div>
                            <div className="product-inventory-page__add-new-modal__form__content__product__select">
                                <div className="product-inventory-page__add-new-modal__form__content__product__select__select-button" onClick={() => setProductDropdownState(true)}>
                                    {productDropdownTextValue ? productDropdownTextValue : 'Select a product'}
                                </div>
                                <div className={`product-inventory-page__add-new-modal__form__content__product__select__select-option ${addNewInputStatus.product ? 'input-error' : ''}`} style={productDropdownState ? {} : {display: 'none'}} ref={productDropdownRef}>
                                    <input type="text" placeholder="Product" onChange={event => setProductDropdownSearchInput(event.target.value)} />
                                    {productDropdownList.map(item => (
                                    <div className="product-inventory-page__add-new-modal__form__content__product__select__select-option__item" key={item.id} onClick={() => selectProductDropdownItem(item.id)}>{item.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-inventory-page__add-new-modal__form__content__product__error-message input-error-message">{addNewInputStatus.product ? addNewInputStatus.product : ''}</div>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__content__center">
                            <div className="product-inventory-page__add-new-modal__form__content__center__label">Center</div>
                            <div className="product-inventory-page__add-new-modal__form__content__center__select">
                                <div className="product-inventory-page__add-new-modal__form__content__center__select__select-button" onClick={() => setCenterDropdownState(true)}>
                                    {centerDropdownTextValue ? centerDropdownTextValue : 'Select a center'}
                                </div>
                                <div className={`product-inventory-page__add-new-modal__form__content__center__select__select-option ${addNewInputStatus.center ? 'input-error' : ''}`} style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                    <div className="product-inventory-page__add-new-modal__form__content__center__select__select-option__item" key={item.id} onClick={() => selectCenterDropdownItem(item.id)}>{item.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-inventory-page__add-new-modal__form__content__center__error-message input-error-message">{addNewInputStatus.center ? addNewInputStatus.center : ''}</div>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__content__quantity">
                            <div className="product-inventory-page__add-new-modal__form__content__quantity__label">Quantity</div>
                            <input type="text" placeholder="Quantity" name="quantity" onChange={event => handleInputChange(event, setAddNewFormData)} className={`product-inventory-page__add-new-modal__form__content__quantity_input ${addNewInputStatus.quantity ? 'input-error': ''}`} />
                            <div className="product-inventory-page__add-new-modal__form__content__quantity__error-message input-error-message">{addNewInputStatus.quantity ? addNewInputStatus.quantity : ''}</div>
                        </div>
                    </div>
                    <div className="product-inventory-page__add-new-modal__form__footer">
                        <div className="product-inventory-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}