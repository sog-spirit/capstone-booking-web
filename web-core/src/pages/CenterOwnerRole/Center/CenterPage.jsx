import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { BASE_API_URL, CENTER_URL } from "../../../utils/consts/APIConsts";
import { ACCESS_TOKEN, HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { LoginContext, TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";

export default function CenterCenterOnwerPage() {
    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        address: '',
    });
    const [addNewInputStatus, setAddNewInputState] = useState({
        name: '',
        address: '',
    });

    const [editModalState, setEditModalState] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: 0,
        name: '',
        address: '',
    });
    const [editInputStatus, setEditInputState] = useState({
        name: '',
        address: '',
    });

    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerList, setCenterList] = useState([]);
    const [currentPageNumberState, setCurrentPageNumberState] = useState(1);
    const [totalPageState, setTotalPageState] = useState(1);
    const [numericIndicatorState, setNumericIndicatorState] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadCenterList();
    }, [tokenState.accessToken, tokenState.refreshToken, currentPageNumberState]);

    useEffect(() => {
        setNumericIndicatorState(paginate(currentPageNumberState, totalPageState));
    }, [currentPageNumberState, totalPageState, numericIndicatorState.length]);

    async function submitAddNewData() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + CENTER_URL.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewFormData({
                name: '',
                address: '',
            });
            setAddNewInputState(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
        }
    }

    async function loadCenterList() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + CENTER_URL.BASE + CENTER_URL.LIST + `?pageNo=${currentPageNumberState - 1}&pageSize=${DEFAULT_PAGE_SIZE}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTotalPageState(data.totalPage);
            setCenterList(data.centerList);
        }
    }

    function openEditModal(postId) {
        let centerRecord = centerList.find(item => item.id === postId);
        setEditFormData(prevState => ({
            ...prevState,
            id: centerRecord?.id,
            name: centerRecord?.name,
            address: centerRecord?.address,
        }))
        setEditModalState(true);
    }

    async function submitEditData() {
        await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + CENTER_URL.BASE, {
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
                address: ''
            }));
            setEditInputState(prevState => ({
                ...prevState,
                name: '',
                address: '',
            }));
            loadCenterList();
        }
    }

    function navigateDetailPage(centerId) {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE + `/${centerId}` + PAGE_URL.CENTER_OWNER.COURT_PAGE);
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
                        <div className="center-management-page__container__header__title__description">
                            Description
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
                                    <img src={'/no-image.jpg'} />
                                </div>
                                <div className="center-management-page__container__center-list__list__item__info__detail">
                                    <div className="center-management-page__container__center-list__list__item__info__detail__name">
                                        {item?.name}
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__address">
                                        {item?.address}
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
                    </div>
                    <div className="center-management-page__edit-modal__form__footer">
                        <div className="center-management-page__edit-modal__form__footer__save-button" onClick={() => submitEditData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}