import { useContext, useEffect, useRef, useState } from "react";
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
        photo: '',
    });
    const [addNewImage, setAddNewImage] = useState(null);
    const [addNewImagePreviewUrl, setAddNewImagePreviewUrl] = useState(null);
    const addNewImageRef = useRef();

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
        photo: '',
    });
    const [editImage, setEditImage] = useState(null);
    const [editImagePreviewUrl, setEditImagePreviewUrl] = useState(null);
    const editImageRef = useRef();

    useEffect(() => {
        loadProductList();
    }, [tokenState.accessToken, addNewModalState, editModalState]);

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
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            closeAddNewModal();
        }
    }

    function closeAddNewModal() {
        setAddNewModalState(false);
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
        setAddNewImage(null);
        setAddNewImagePreviewUrl(null);
        addNewImageRef.current.value = null;
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
        setAddNewImage(null);
        setAddNewImagePreviewUrl(null);
    }

    function closeEditModal() {
        setEditModalState(false);
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
        setEditImage(null);
        setEditImagePreviewUrl(null);
        editImageRef.current.value = null;
    }

    async function submitEditData() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const formData = new FormData();
        formData.append('id', editFormData.id);
        formData.append('name', editFormData.name);
        formData.append('price', editFormData.price);
        formData.append('photo', editImage);

        const response = await fetch(BASE_API_URL + PRODUCT_URL.BASE, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            closeEditModal();
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
        }
    }

    function handleAddNewImageChange(event) {
        const photoFile = event.target.files[0];
        if (photoFile) {
            setAddNewImage(photoFile);
            setAddNewImagePreviewUrl(URL.createObjectURL(photoFile));
        }
    }

    function handleEditImageChange(event) {
        const photoFile = event.target.files[0];
        if (photoFile) {
            setEditImage(photoFile);
            setEditImagePreviewUrl(URL.createObjectURL(photoFile));
        }
    }

    function clearEditImageInput() {
        editImageRef.current.value = null;
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
                        <div className="product-page__add-new-modal__form__header__close-button" onClick={() => closeAddNewModal()}>
                            Close
                        </div>
                    </div>
                    <div className="product-page__add-new-modal__form__content">
                        <div className="product-page__add-new-modal__form__content__photo">
                            <div className="product-page__add-new-modal__form__content__photo__label">Photo</div>
                            <input type="file" ref={addNewImageRef} accept="image/*" onChange={event => handleAddNewImageChange(event)} className={`product-page__add-new-modal__form__content__photo__input ${addNewInputState.photo ? 'input-error' : ''}`} />
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
                        <div className="product-page__edit-modal__form__content__photo">
                            <div className="product-page__edit-modal__form__content__photo__label">Photo</div>
                            <input type="file" ref={editImageRef} accept="image/*" onChange={event => handleEditImageChange(event)} className={`product-page__edit-modal__form__content__photo__input ${editInputState.photo ? 'input-error' : ''}`} />
                            <div className="product-page__edit-modal__form__content__photo__preview">
                                {editImagePreviewUrl ? <img src={editImagePreviewUrl} alt="Edit photo preview" /> : <img src={BASE_API_URL + IMAGE_URL.BASE + IMAGE_URL.PRODUCT + `?productId=${editFormData.id}`} alt="Edit photo preview" />}
                            </div>
                            <div className="product-page__edit-modal__form__content__photo__error-message input-error-message">{editInputState.photo ? editInputState.photo : ''}</div>
                        </div>
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