import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { API_URL } from "../../../utils/consts/APIConsts";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

export default function UserCenterReview() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerDropdownState, setCenterDropdownState] = useState(false);
    const [centerDropdownList, setCenterDropdownList] = useState([]);
    const [centerDropdownSearchInput, setCenterDropdownSearchInput] = useState('');
    const [centerDropdownTextValue, setCenterDropdownTextValue] = useState('');
    const centerDropdownRef = useRef(null);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        content: '',
        centerId: 0,
    });
    const [addNewInputState, setAddNewInputStatus] = useState({
        content: '',
        centerId: '',
    });

    const [userReviewList, setUserReviewList] = useState([]);

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
        loadCenterFromUserOrderAsDropdownList();
    }, [addNewModalState, centerDropdownSearchInput, tokenState.accessToken]);

    async function loadCenterFromUserOrderAsDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.CENTER_LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', centerDropdownSearchInput);

        const response = await fetch(url + `?${query}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let centerList = await response.json();
            setCenterDropdownList(centerList);
        }
    }

    function selectCenterDropdownItem(centerId) {
        let center = centerDropdownList.find(item => item.centerId === centerId);
        setCenterDropdownTextValue(center.centerName);
        setAddNewFormData(prevState => ({
            ...prevState,
            centerId: center.centerId,
        }));
        setCenterDropdownState(false);
    }

    function closeAddNewModal() {
        setAddNewModalState(false);
        setAddNewFormData(prevState => ({
            ...prevState,
            content: '',
            centerId: 0,
        }));
        setAddNewInputStatus(prevState => ({
            ...prevState,
            content: '',
            centerId: '',
        }));
    }

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            closeAddNewModal();
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
        }
    }

    useEffect(() => {
        loadUserReviewList();
    }, [tokenState.accessToken]);

    async function loadUserReviewList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.USER + API_URL.CENTER_REVIEW.LIST;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserReviewList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="user-center-review">
            <div className="user-center-review__container">
                <div className="user-center-review__container__header">
                    <div className="user-center-review__container__header__title">
                        <div className="user-center-review__container__header__title__label">
                            <h4>Reviews</h4>
                        </div>
                    </div>
                    <div className="user-center-review__container__header__button-group">
                        <div className="user-center-review__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                        <div className="user-center-review__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="user-center-review__container__review-list">
                    <div className="user-center-review__container__review-list__list">
                        <div className="user-center-review__container__review-list__list__header">
                            <div className="user-center-review__container__review-list__list__header__id">
                                Id
                            </div>
                            <div className="user-center-review__container__review-list__list__header__center">
                                Center
                            </div>
                            <div className="user-center-review__container__review-list__list__header__content">
                                Content
                            </div>
                        </div>
                        <div className="user-center-review__container__review-list__list__content">
                            {userReviewList.map(item => (
                            <div className="user-center-review__container__review-list__list__content__item" key={item.id}>
                                <div className="user-center-review__container__review-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__center">
                                    {item.center.name}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__content">
                                    {item.content}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-center-review__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="user-center-review__add-new-modal__form">
                    <div className="user-center-review__add-new-modal__form__header">
                        <div className="user-center-review__add-new-modal__form__header__title">
                            <h5>Add new review</h5>
                        </div>
                        <div className="user-center-review__add-new-modal__form__header__close-button" onClick={() => closeAddNewModal()}>
                            Close
                        </div>
                    </div>
                    <div className="user-center-review__add-new-modal__form__content">
                        <div className="user-center-review__add-new-modal__form__content__center">
                            <div className="user-center-review__add-new-modal__form__content__center__label">Center</div>
                            <div className="user-center-review__add-new-modal__form__content__center__select">
                                <div className="user-center-review__add-new-modal__form__content__center__select__select-button" onClick={() => setCenterDropdownState(true)}>
                                    {centerDropdownTextValue ? centerDropdownTextValue : 'Select a center'}
                                </div>
                                <div className={`user-center-review__add-new-modal__form__content__center__select__select-option ${addNewInputState.centerId ? 'input-error' : ''}`} style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                    <div className="user-center-review__add-new-modal__form__content__center__select__select-option__item" key={item.centerId} onClick={() => selectCenterDropdownItem(item.centerId)}>{item.centerName}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="user-center-review__add-new-modal__form__content__center__error-message input-error-message">{addNewInputState.centerId ? addNewInputState.centerId : ''}</div>
                        </div>
                        <div className="user-center-review__add-new-modal__form__content__content">
                            <div className="user-center-review__add-new-modal__form__content__content__label">Content</div>
                            <textarea name="content" onChange={event => handleInputChange(event, setAddNewFormData)} className={`user-center-review__add-new-modal__form__content__content__textarea ${addNewInputState.content ? 'input-error' : ''}`}></textarea>
                            <div className="user-center-review__add-new-modal__form__content__content__error-message input-error-message">{addNewInputState.content ? addNewInputState.content : ''}</div>
                        </div>
                    </div>
                    <div className="user-center-review__add-new-modal__form__footer">
                        <div className="user-center-review__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}