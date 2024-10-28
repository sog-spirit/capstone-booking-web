import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { BASE_API_URL, IMAGE_URL, PRODUCT_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

export default function ProductCenterOwnerPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        price: 0,
    });
    const [addNewInputState, setAddNewInputState] = useState({
        name: '',
        price: '',
    });
    const [addNewImage, setAddNewImage] = useState(null);
    const [addNewImagePreviewUrl, setAddNewImagePreviewUrl] = useState(null);

    const [productList, setProductList] = useState([]);

    const [editModalState, setEditModalState] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: 0,
        name: '',
        price: 0,
    });
    const [editInputState, setEditInputState] = useState({
        name: '',
        price: '',
    });

    useEffect(() => {
        loadProductList();
    }, [tokenState.accessToken, addNewModalState]);

    async function submitAddNewProduct() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const formData = new FormData();
        formData.append('name', addNewFormData.name);
        formData.append('price', addNewFormData.price);
        formData.append('photo', addNewImage);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewFormData(prevState => ({
                ...prevState,
                name: '',
                price: '',
            }));
            setAddNewInputState(prevState => ({
                ...prevState,
                name: '',
                price: '',
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

    function openEditModal(prodcutId) {
        let product = productList.find(item => item.id === prodcutId);
        setEditFormData(prevState => ({
            ...prevState,
            id: prodcutId,
            name: product.name,
            price: product.price,
        }));
        setEditModalState(true);
    }

    function closeEditModal() {
        setEditFormData(prevState => ({
            ...prevState,
            id: 0,
            name: '',
            price: 0,
        }));
        setEditModalState(false);
    }

    async function submitEditData() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(editFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setEditModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setEditFormData(prevState => ({
                ...prevState,
                id: 0,
                name: '',
                price: 0,
            }));
            setEditInputState(prevState => ({
                ...prevState,
                name: '',
                price: '',
            }));
            loadProductList();
        }
    }

    function handleImageChange(event) {
        const photoFile = event.target.files[0];
        if (photoFile) {
            setAddNewImage(photoFile);
            setAddNewImagePreviewUrl(URL.createObjectURL(photoFile));
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
                                    <img src={BASE_API_URL + IMAGE_URL.BASE + IMAGE_URL.PRODUCT + `?productId=${item.id}`} />
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
                            <div className="product-page__container__product-list__list__item__button-group">
                                <div className="product-page__container__product-list__list__item__button-group__edit-button" onClick={() => openEditModal(item.id)}>
                                    Edit
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
                        <div className="product-page__add-new-modal__form__content__photo">
                            <div className="product-page__add-new-modal__form__content__photo__label">Photo</div>
                            <input type="file" accept="image/*" onChange={event => handleImageChange(event)} className={`product-page__add-new-modal__form__content__photo__input ${addNewInputState.photo ? 'input-error' : ''}`} />
                            <div className="product-page__add-new-modal__form__content__photo__preview">
                                {addNewImagePreviewUrl && <img src={addNewImagePreviewUrl} alt="Add new photo preview" />}
                            </div>
                            <div className="product-page__add-new-modal__form__content__photo__error-message input-error-message">{addNewInputState.photo ? addNewInputState.photo : ''}</div>
                        </div>
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
            <div className="product-page__edit-modal" style={editModalState ? {} : {display: 'none'}}>
                <div className="product-page__edit-modal__form">
                    <div className="product-page__edit-modal__form__header">
                        <div className="product-page__edit-modal__form__header__title">
                            <h5>Edit product</h5>
                        </div>
                        <div className="product-page__edit-modal__form__header__close-button" onClick={() => closeEditModal()}>
                            Close
                        </div>
                    </div>
                    <div className="product-page__edit-modal__form__content">
                        <div className="product-page__edit-modal__form__content__name">
                            <div className="product-page__edit-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" value={editFormData.name} onChange={event => handleInputChange(event, setEditFormData)} className={`product-page__edit-modal__form__content__name__input ${editInputState.name ? 'input-error' : ''}`} />
                            <div className="product-page__edit-modal__form__content__name__error-message input-error-message">{editInputState.name ? editInputState.name : ''}</div>
                        </div>
                        <div className="product-page__edit-modal__form__content__price">
                            <div className="product-page__edit-modal__form__content__price__label">Price</div>
                            <input type="text" placeholder="Price" name="price" value={editFormData.price} onChange={event => handleInputChange(event, setEditFormData)} className={`product-page__edit-modal__form__content__price__input ${editInputState.price ? 'input-error' : ''}`} />
                            <div className="product-page__edit-modal__form__content__price__error-message input-error-message">{editInputState.price ? editInputState.price : ''}</div>
                        </div>
                    </div>
                    <div className="product-page__edit-modal__form__footer">
                        <div className="product-page__edit-modal__form__footer__save-button" onClick={() => submitEditData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}