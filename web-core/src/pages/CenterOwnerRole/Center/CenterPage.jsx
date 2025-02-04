import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { LoginContext, TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDongSign, faLocationDot, faMoneyBill, faXmark } from "@fortawesome/free-solid-svg-icons";
import { trimTime } from "../../../utils/formats/TimeFormats";
import CenterThumbnail from "./CenterThumbnail";

export default function CenterCenterOnwerPage() {
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);

    const navigate = useNavigate();

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        address: '',
        courtFee: 0,
        openingTime: '',
        closingTime: '',
    });
    const [addNewInputStatus, setAddNewInputStatus] = useState({
        name: '',
        address: '',
        courtFee: 0,
        openingTime: '',
        closingTime: '',
    });

    const [editModalState, setEditModalState] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: 0,
        name: '',
        address: '',
        courtFee: 0,
        openingTime: '',
        closingTime: '',
    });
    const [editInputStatus, setEditInputStatus] = useState({
        name: '',
        address: '',
    });

    const [centerList, setCenterList] = useState([]);

    const [currentPageNumberState, setCurrentPageNumberState] = useState(1);
    const [totalPageState, setTotalPageState] = useState(1);
    const [numericIndicatorState, setNumericIndicatorState] = useState([]);

    const [thumbnaiImage, setThumbnailImage] = useState(null);
    const [thumbnaiImagePreviewUrl, setThumbnaiImagePreviewUrl] = useState(null);
    const thumbnaiImageRef = useRef();

    const [showcaseImages, setShowcaseImages] = useState([]);
    const [showcaseImagesPreviewUrls, setShowcaseImagesPreviewUrls] = useState([]);
    const showcaseImagesRef = useRef();

    const [editThumbnailImage, setEditThumbnailImage] = useState(null);
    const [editThumbnailImagePreviewUrl, setEditThumbnaiImagePreviewUrl] = useState(null);
    const editThumbnailImageRef = useRef();

    const [editShowcaseImages, setEditShowcaseImages] = useState([]);
    const [editShowcaseImagesPreviewUrls, setEditShowcaseImagesPreviewUrls] = useState([]);
    const editShowcaseImagesRef = useRef();

    const [centerImages, setCenterImages] = useState([]);

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        if (!editModalState) {
            setEditFormData(prevState => ({
                ...prevState,
                id: 0,
                name: '',
                address: ''
            }));
            setEditInputStatus(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
            setThumbnailImage(null);
            setThumbnaiImagePreviewUrl(null);
            setShowcaseImages([]);
            setShowcaseImagesPreviewUrls([]);
        }
    }, [editModalState]);

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE;

        const formData = new FormData();
        formData.append('name', addNewFormData.name);
        formData.append('address', addNewFormData.address);
        formData.append('thumbnailPhoto', thumbnaiImage);
        formData.append('courtFee', addNewFormData.courtFee);
        formData.append('openingTime', addNewFormData.openingTime);
        formData.append('closingTime', addNewFormData.closingTime);
        showcaseImages.forEach((photo) => {
            formData.append('showcasePhotos', photo);
        });

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewFormData({
                name: '',
                address: '',
            });
            setAddNewInputStatus(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
            loadCenterList();
            setRerender(prevState => !prevState);
        }
    }

    function openEditModal(centerId) {
        let centerRecord = centerList.find(item => item.id === centerId);
        setEditFormData(prevState => ({
            ...prevState,
            id: centerRecord?.id,
            name: centerRecord?.name,
            address: centerRecord?.address,
            courtFee: centerRecord?.courtFee,
            openingTime: centerRecord?.openingTime,
            closingTime: centerRecord?.closingTime,
        }));
        loadCenterImages(centerId);
        setEditModalState(true);
    }

    async function loadCenterImages(centerId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + API_URL.IMAGE.INFO + API_URL.IMAGE.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterImages(data);
        }
    }

    useEffect(() => {
        if (!editModalState) {
            setEditFormData(prevState => ({
                ...prevState,
                id: 0,
                name: '',
                address: ''
            }));
            setEditInputStatus(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
            setEditThumbnailImage(null);
            setEditThumbnaiImagePreviewUrl(null);
            setEditShowcaseImages([]);
            setEditShowcaseImagesPreviewUrls([]);
        }
    }, [editModalState]);

    async function submitEditData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE;

        const formData = new FormData();
        formData.append('id', editFormData.id);
        formData.append('name', editFormData.name);
        formData.append('address', editFormData.address);
        formData.append('courtFee', editFormData.courtFee);
        formData.append('openingTime', editFormData.openingTime);
        formData.append('closingTime', editFormData.closingTime);
        centerImages.forEach((item, index) => {
            formData.append(`oldPhotos[${index}].id`, item.id);
            formData.append(`oldPhotos[${index}].type`, item.type);
            formData.append(`oldPhotos[${index}].delete`, item.delete ? true : false);
        });
        if (editThumbnailImage) {
            formData.append('newThumbnail', editThumbnailImage);
        }
        if (editShowcaseImages.length !== 0) {
            editShowcaseImages.forEach(photo => {
                formData.append('newShowcasePhotos', photo);
            });
        }

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            setEditModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCenterList();
            setRerender(prevState => !prevState);
        }
    }

    async function submitDeleteData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.CENTER_OWNER + API_URL.CENTER.CLOSED;

        const formData = new FormData();
        formData.append('id', editFormData.id);

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            setEditModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCenterList();
            setRerender(prevState => !prevState);
        }
    }

    useEffect(() => {
        loadCenterList();
    }, [tokenState.accessToken,
        currentPageNumberState,
        totalPageState,
        numericIndicatorState.length,
    ]);

    async function loadCenterList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.CENTER_OWNER + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('pageNo', currentPageNumberState - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTotalPageState(data.totalPage);
            setCenterList([...data.centerList]);
        }
    }

    function navigateDetailPage(centerId) {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE + `/${centerId}` + PAGE_URL.CENTER_OWNER.COURT_PAGE);
    }

    useEffect(() => {
        setNumericIndicatorState(paginate(currentPageNumberState, totalPageState));
    }, [currentPageNumberState, totalPageState, numericIndicatorState.length]);

    function handleAddThumbnail(event) {
        const image = event.target.files[0];
        if (image) {
            setThumbnailImage(image);
            setThumbnaiImagePreviewUrl(URL.createObjectURL(image));
        }
    }

    function handleRemoveThumbnail() {
        setThumbnailImage(null);
        setThumbnaiImagePreviewUrl(null);
        thumbnaiImageRef.current.value = null;
    }

    function handleAddShowcase(event) {
        const image = event.target.files[0];
        if (image) {
            setShowcaseImages(prevState => [...prevState, image]);
            setShowcaseImagesPreviewUrls(prevState => [...prevState, URL.createObjectURL(image)]);
        }
    }

    function handleRemoveShowcase(index) {
        setShowcaseImages(prevState => prevState.filter((item, i) => i !== index));
        setShowcaseImagesPreviewUrls(prevState => prevState.filter((item, i) => i !== index));
        showcaseImagesRef.current.value = null;
    }

    function handleAddNewEditThumbnail(event) {
        const image = event.target.files[0];
        if (image) {
            setEditThumbnailImage(image);
            setEditThumbnaiImagePreviewUrl(URL.createObjectURL(image));
            handleRemoveOldEditThumbnail();
        }
    }

    function handleRemoveOldEditThumbnail() {
        setCenterImages(prevState => prevState.map(item => item.type === 1 ? {...item, delete: true} : item));
    }

    function handleRemoveNewEditThumbnail() {
        setEditThumbnailImage(null);
        setEditThumbnaiImagePreviewUrl(null);
        editThumbnailImageRef.current.value = null;
    }

    function handleAddNewEditShowcase(event) {
        const image = event.target.files[0];
        if (image) {
            setEditShowcaseImages(prevState => [...prevState, image]);
            setEditShowcaseImagesPreviewUrls(prevState => [...prevState, URL.createObjectURL(image)]);
        }
    }

    function handleRemoveNewEditShowcase(index) {
        setEditShowcaseImages(prevState => prevState.filter((item, i) => i !== index));
        setEditShowcaseImagesPreviewUrls(prevState => prevState.filter((item, i) => i !== index));
        editShowcaseImagesRef.current.value = null;
    }

    function handleRemoveOldEditShowcase(id) {
        setCenterImages(prevState => prevState.map(item => item.id === id ? {...item, delete: true} : item));
    }

    return (
        <>
        <Header />
        <div className="center-management-page">
            <div className="center-management-page__container">
                <div className="center-management-page__container__header">
                    <div className="center-management-page__container__header__title">
                        <div className="center-management-page__container__header__title__label">
                            <h4>Center management</h4>
                        </div>
                    </div>
                    <div className="center-management-page__container__header__button-group">
                        <div className="center-management-page__container__header__button-group__refresh-button" onClick={() => loadCenterList()}>
                            Refresh
                        </div>
                        <div className="center-management-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="center-management-page__container__center-list">
                    <div className="center-management-page__container__center-list__title">
                        <h5>Center list</h5>
                    </div>
                    <div className="center-management-page__container__center-list__list">
                        {centerList.map(item => (
                        <div className="center-management-page__container__center-list__list__item" key={item?.id}>
                            <div className="center-management-page__container__center-list__list__item__info">
                                <div className="center-management-page__container__center-list__list__item__info__img">
                                    <CenterThumbnail centerId={item?.id} rerender={rerender} />
                                </div>
                                <div className="center-management-page__container__center-list__list__item__info__detail">
                                    <div className="center-management-page__container__center-list__list__item__info__detail__name">
                                        <h5>{item?.name}</h5>
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__address">
                                        <FontAwesomeIcon icon={faLocationDot} /> {item?.address}
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__court-fee">
                                        <FontAwesomeIcon icon={faMoneyBill} /> {item?.courtFee}₫
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__working-time">
                                        <FontAwesomeIcon icon={faClock} /> {trimTime(item?.openingTime)}-{trimTime(item?.closingTime)}
                                    </div>
                                </div>
                            </div>
                            <div className="center-management-page__container__center-list__list__item__button-group">
                                <div className="center-management-page__container__center-list__list__item__button-group__edit-button" onClick={() => openEditModal(item.id)}>
                                    Edit
                                </div>
                                <div className="center-management-page__container__center-list__list__item__button-group__detail-button" onClick={() => navigateDetailPage(item.id)}>
                                    Detail
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="center-management-page__container__center-list__pagination">
                        <div className="center-management-page__container__center-list__pagination__previous" onClick={() => previousPage(currentPageNumberState, setCurrentPageNumberState)}>
                            Previous
                        </div>
                        <div className="center-management-page__container__center-list__pagination__numeric-indicator">
                            {numericIndicatorState.map(item => Number.isInteger(item) ?
                                (<div className={`center-management-page__container__center-list__pagination__numeric-indicator__item${item === currentPageNumberState ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumberState(item)}>
                                    {item}
                                </div>)
                            : (<div className={`center-management-page__container__center-list__pagination__numeric-indicator__item`} key={item}>
                                    {item}
                                </div>)
                            )}
                        </div>
                        <div className="center-management-page__container__center-list__pagination__next" onClick={() => nextPage(currentPageNumberState, setCurrentPageNumberState, totalPageState)}>
                            Next
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-management-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="center-management-page__add-new-modal__form">
                    <div className="center-management-page__add-new-modal__form__header">
                        <div className="center-management-page__add-new-modal__form__header__title">
                            <h5>Add new center</h5>
                        </div>
                        <div className="center-management-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-management-page__add-new-modal__form__content">
                        <div className="center-management-page__add-new-modal__form__content__name">
                            <div className="center-management-page__add-new-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-management-page__add-new-modal__form__content__name__input ${addNewInputStatus.name ? 'input-error' : ''}`} />
                            <div className="center-management-page__add-new-modal__form__content__name__error-message input-error-message">{addNewInputStatus.name ? addNewInputStatus.name : ''}</div>
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__address">
                            <div className="center-management-page__add-new-modal__form__content__address__label">Address</div>
                            <input type="text" placeholder="Address" name="address" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-management-page__add-new-modal__form__content__address__input ${addNewInputStatus.address ? 'input-error' : ''}`} />
                            <div className="center-management-page__add-new-modal__form__content__address__error-message input-error-message">{addNewInputStatus.address ? addNewInputStatus.address : ''}</div>
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__opening-time">
                            <div className="center-management-page__add-new-modal__form__content__opening-time__label">Opening time</div>
                            <input type="time" placeholder="Opening time" name="openingTime" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-management-page__add-new-modal__form__content__opening-time__input ${addNewInputStatus.openingTime ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__closing-time">
                            <div className="center-management-page__add-new-modal__form__content__closing-time__label">Closing time</div>
                            <input type="time" placeholder="Closing time" name="closingTime" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-management-page__add-new-modal__form__content__closing-time__input ${addNewInputStatus.closingTime ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__court-fee">
                            <div className="center-management-page__add-new-modal__form__content__court-fee__label">Court fee</div>
                            <input type="text" placeholder="Court fee" name="courtFee" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-management-page__add-new-modal__form__content__court-fee__input ${addNewInputStatus.courtFee ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__thumbnail-photo">
                            <div className="center-management-page__add-new-modal__form__content__thumbnail-photo__label">Thumbnail photo</div>
                            <input type="file" ref={thumbnaiImageRef} accept="image/*" onChange={event => handleAddThumbnail(event)} />
                            <div className="center-management-page__add-new-modal__form__content__thumbnail-photo__preview">
                                {thumbnaiImagePreviewUrl &&
                                    <div className="center-management-page__add-new-modal__form__content__thumbnail-photo__preview__item">
                                        <img src={thumbnaiImagePreviewUrl} alt="Thumbnail photo preview" />
                                        <div className="center-management-page__add-new-modal__form__content__thumbnail-photo__preview__item__close" onClick={() => handleRemoveThumbnail()}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__showcase-photo">
                            <div className="center-management-page__add-new-modal__form__content__showcase-photo__label">Showcase photo</div>
                            <input type="file" ref={showcaseImagesRef} accept="image/*" onChange={event => handleAddShowcase(event)} />
                            <div className="center-management-page__add-new-modal__form__content__showcase-photo__preview">
                                {showcaseImagesPreviewUrls.map((item, index) => {
                                    if (item) {
                                        return <div className="center-management-page__add-new-modal__form__content__showcase-photo__preview__item">
                                                <img src={item} alt="Thumbnail photo preview" />
                                                <div className="center-management-page__add-new-modal__form__content__showcase-photo__preview__item__close" onClick={() => handleRemoveShowcase(index)}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </div>
                                            </div>; 
                                    } else {
                                        return <></>;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="center-management-page__add-new-modal__form__footer">
                        <div className="center-management-page__add-new-modal__form__footer__create-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-management-page__edit-modal" style={editModalState ? {} : {display: 'none'}}>
                <div className="center-management-page__edit-modal__form">
                    <div className="center-management-page__edit-modal__form__header">
                        <div className="center-management-page__edit-modal__form__header__title">
                            <h5>Edit center</h5>
                        </div>
                        <div className="center-management-page__edit-modal__form__header__close-button" onClick={() => setEditModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-management-page__edit-modal__form__content">
                        <div className="center-management-page__edit-modal__form__content__name">
                            <div className="center-management-page__edit-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" value={editFormData.name} onChange={event => handleInputChange(event, setEditFormData)} className={`center-management-page__edit-modal__form__content__name ${editInputStatus.name ? 'input-error' : ''}`} />
                            <div className="center-management-page__edit-modal__form__content__name__error-message input-error-message"></div>
                        </div>
                        <div className="center-management-page__edit-modal__form__content__address">
                            <div className="center-management-page__edit-modal__form__content__address__label">Address</div>
                            <input type="text" placeholder="Address" name="address" value={editFormData.address} onChange={event => handleInputChange(event, setEditFormData)} className={`center-management-page__edit-modal__form__content__address ${editInputStatus.address ? 'input-error' : ''}`} />
                            <div className="center-management-page__edit-modal__form__content__address__error-message input-error-message"></div>
                        </div>
                        <div className="center-management-page__edit-modal__form__content__opening-time">
                            <div className="center-management-page__edit-modal__form__content__opening-time__label">Opening time</div>
                            <input type="time" placeholder="Opening time" name="openingTime" value={editFormData.openingTime} onChange={event => handleInputChange(event, setEditFormData)} className={`center-management-page__edit-modal__form__content__opening-time__input ${addNewInputStatus.openingTime ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__edit-modal__form__content__closing-time">
                            <div className="center-management-page__edit-modal__form__content__closing-time__label">Closing time</div>
                            <input type="time" placeholder="Closing time" name="closingTime" value={editFormData.closingTime} onChange={event => handleInputChange(event, setEditFormData)} className={`center-management-page__edit-modal__form__content__closing-time__input ${addNewInputStatus.closingTime ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__edit-modal__form__content__court-fee">
                            <div className="center-management-page__edit-modal__form__content__court-fee__label">Court fee</div>
                            <input type="text" placeholder="Court fee" name="courtFee" value={editFormData.courtFee} onChange={event => handleInputChange(event, setEditFormData)} className={`center-management-page__edit-modal__form__content__court-fee__input ${addNewInputStatus.courtFee ? 'input-error' : ''}`} />
                        </div>
                        <div className="center-management-page__edit-modal__form__content__thumbnail-photo">
                            <div className="center-management-page__edit-modal__form__content__thumbnail-photo__label">Thumbnail photo</div>
                            <input type="file" ref={thumbnaiImageRef} accept="image/*" onChange={event => handleAddNewEditThumbnail(event)} />
                            <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview">
                                {centerImages.map(item => {
                                    if (item.type === 1 && !item.delete) {
                                        return (
                                        <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item">
                                            <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + `?id=${item.id}`} alt="Thumbnail photo preview" />
                                            <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item__close" onClick={() => handleRemoveOldEditThumbnail()}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                        </div>);
                                    } else {
                                        return <></>;
                                    }
                                })}
                                {editThumbnailImagePreviewUrl &&
                                    <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item">
                                        <img src={editThumbnailImagePreviewUrl} alt="Thumbnail photo preview" />
                                        <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item__close" onClick={() => handleRemoveNewEditThumbnail()}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        <div className="center-management-page__edit-modal__form__content__showcase-photo">
                            <div className="center-management-page__edit-modal__form__content__showcase-photo__label">Showcase photo</div>
                            <input type="file" ref={editShowcaseImagesRef} accept="image/*" onChange={event => handleAddNewEditShowcase(event)} />
                            <div className="center-management-page__edit-modal__form__content__showcase-photo__preview">
                                {centerImages.map(item => {
                                    if (item.type !== 1 && !item.delete) {
                                        return (
                                        <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item">
                                            <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + `?id=${item.id}`} alt="Thumbnail photo preview" />
                                            <div className="center-management-page__edit-modal__form__content__thumbnail-photo__preview__item__close" onClick={() => handleRemoveOldEditShowcase(item.id)}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                        </div>);
                                    } else {
                                        return <></>;
                                    }
                                })}
                                {editShowcaseImagesPreviewUrls.map((item, index) => {
                                    if (item) {
                                        return <div className="center-management-page__edit-modal__form__content__showcase-photo__preview__item">
                                                <img src={item} alt="Thumbnail photo preview" />
                                                <div className="center-management-page__edit-modal__form__content__showcase-photo__preview__item__close" onClick={() => handleRemoveNewEditShowcase(index)}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </div>
                                            </div>; 
                                    } else {
                                        return <></>;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="center-management-page__edit-modal__form__footer">
                        <div className="center-management-page__edit-modal__form__footer__save-button" onClick={() => submitEditData()}>
                            Save
                        </div>
                        <div className="center-management-page__edit-modal__form__footer__delete-button" onClick={() => submitDeleteData()}>
                            Delete
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}