import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { BASE_API_URL, CENTER_URL } from "../../utils/consts/APIConsts";
import { ACCESS_TOKEN, HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { LoginContext, TokenContext } from "../../App";
import { refreshAccessToken } from "../../utils/jwt/JwtUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../utils/pagination/PaginationUtils";
import { handleInputChange } from "../../utils/input/InputUtils";

export default function CenterManagement() {
    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        address: '',
        accessToken: '',
    });
    const [addNewInputStatus, setAddNewInputState] = useState({
        name: '',
        address: '',
    });
    const [centerList, setCenterList] = useState([]);
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);
    const [currentPageNumberState, setCurrentPageNumberState] = useState(1);
    const [totalPageState, setTotalPageState] = useState(1);
    const [numericIndicatorState, setNumericIndicatorState] = useState([]);

    useEffect(() => {
        loadCenterList();
    }, [tokenState.accessToken, tokenState.refreshToken, currentPageNumberState]);

    useEffect(() => {
        setNumericIndicatorState(paginate(currentPageNumberState, totalPageState));
    }, [currentPageNumberState, totalPageState, numericIndicatorState.length]);

    async function submitAddNewData() {
        refreshAccessToken(setTokenState);

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
        }
    }

    async function loadCenterList() {
        refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(BASE_API_URL + CENTER_URL.BASE + CENTER_URL.LIST + `?pageNo=${currentPageNumberState - 1}&pageSize=${DEFAULT_PAGE_SIZE}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            console.log(data);
            setTotalPageState(data.totalPage);
            setCenterList(data.centerList);
        }
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
                        <div className="center-management-page__container__header__button-group__refresh-button">
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
                                <div className="center-management-page__container__center-list__list__item__button-group__edit-button">
                                    Edit
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
                            Create
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}