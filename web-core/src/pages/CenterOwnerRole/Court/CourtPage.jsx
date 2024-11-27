import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { useParams } from "react-router-dom";
import CourtBookingItem from "./CourtBookingItem";

export default function CourtCenterOwnerPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const {centerId} = useParams();

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        centerId: centerId,
    });
    const [addNewInputState, setAddNewInputState] = useState({
        name: '',
    });

    const [courtListState, setCourtListState] = useState([]);

    const [editModalState, setEditModalState] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        id: 0,
    });
    const [editInputState, setEditInputState] = useState({
        name: '',
    });

    const [centerWorkingTime, setCenterWorkingTime] = useState({
        openingTime: '',
        closingTime: '',
    });
    const [timeInterval, setTimeInterval] = useState([]);

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE;

        const response = await fetch(url, {
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
            }));
            setAddNewInputState(prevState => ({
                ...prevState,
                name: '',
            }));
            loadCourtList();
        }
    }

    useEffect(() => {
        loadCourtList();
    }, [tokenState.accessToken]);

    async function loadCourtList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE + API_URL.COURT.CENTER_OWNER + API_URL.COURT.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtListState(data.courtList);
        }
    }

    function openEditModal(courtId) {
        let courtRecord = courtListState.find(item => item.id === courtId);
        setEditFormData(prevState => ({
            ...prevState,
            id: courtRecord?.id,
            name: courtRecord?.name,
        }));
        setEditModalState(true);
    }

    async function submitEditData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE;

        const response = await fetch(url, {
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
            }));
            setEditInputState(prevState => ({
                ...prevState,
                name: '',
            }));
            loadCourtList();
        }
    }

    useEffect(() => {
        loadCenterWorkingTime();
    }, []);

    async function loadCenterWorkingTime() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.CENTER_OWNER + API_URL.CENTER.WORKING_TIME;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            
            setCenterWorkingTime({
                openingTime: data.openingTime,
                closingTime: data.closingTime,
            });

            createTimeIntervalArray(data.openingTime, data.closingTime);
        }
    }

    function createTimeIntervalArray(openingTime, closingTime, intervalMinute = 15) {
        let timeMarks = [];
        let [startHour, startMinute] = openingTime.split(':').map(Number);
        let [endHour, endMinute] = closingTime.split(':').map(Number);

        let currentDate = new Date();
        currentDate.setHours(startHour, startMinute, 0, 0);

        const endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);

        while (currentDate <= endDate) {
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            timeMarks.push(`${hours}:${minutes}`);

            currentDate.setMinutes(currentDate.getMinutes() + intervalMinute);
        }

        setTimeInterval(timeMarks);
    }

    return(
        <>
        <Header />
        <div className="center-detail-page">
            <div className="center-detail-page__container">
                <div className="center-detail-page__container__header">
                    <div className="center-detail-page__container__header__title">
                        <div className="center-detail-page__container__header__title__label">
                            <h4>Center detail</h4>
                        </div>
                        <div className="center-detail-page__container__header__title__description">
                            Description
                        </div>
                    </div>
                    <div className="center-detail-page__container__header__button-group">
                        <div className="center-detail-page__container__header__button-group__refresh-button" onClick={() => loadCourtList()}>
                            Refresh
                        </div>
                        <div className="center-detail-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="center-detail-page__container__court-list">
                    <div className="center-detail-page__container__court-list__list__date">
                        Date
                    </div>
                    <div className="center-detail-page__container__court-list__list">
                        <div className="center-detail-page__container__court-list__list__detail" style={{gridTemplateColumns: `repeat(${timeInterval.length + 1}, 100px)`}}>
                            <div className="center-detail-page__container__court-list__list__detail__item"></div>
                            {timeInterval.map(item => (
                                <div className="center-detail-page__container__court-list__list__detail__item" key={item}>{item}</div>
                            ))}
                            {courtListState.map(item => (
                                <>
                                <div className="center-detail-page__container__court-list__list__detail__item" key={item.id}>
                                    {item.name}
                                </div>
                                <CourtBookingItem
                                    courtId={item.id}
                                />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-detail-page__add-new-modal" style={addNewModalState ? {} : {display: "none"}}>
                <div className="center-detail-page__add-new-modal__form">
                    <div className="center-detail-page__add-new-modal__form__header">
                        <div className="center-detail-page__add-new-modal__form__header__title">
                            <h5>Add new court</h5>
                        </div>
                        <div className="center-detail-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-detail-page__add-new-modal__form__content">
                        <div className="center-detail-page__add-new-modal__form__content__name">
                            <div className="center-detail-page__add-new-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-detail-page__add-new-modal__form__content__name__input ${addNewInputState.name ? 'input-error' : ''}`} />
                            <div className="center-detail-page__add-new-modal__form__content__name__error-message input-error-message">{addNewInputState.name ? addNewInputState.name : ''}</div>
                        </div>
                    </div>
                    <div className="center-detail-page__add-new-modal__form__footer">
                        <div className="center-detail-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-detail-page__edit-modal" style={editModalState ? {} : {display: "none"}}>
                <div className="center-detail-page__edit-modal__form">
                    <div className="center-detail-page__edit-modal__form__header">
                        <div className="center-detail-page__edit-modal__form__header__title">
                            <h5>Edit center</h5>
                        </div>
                        <div className="center-detail-page__edit-modal__form__header__close-button" onClick={() => setEditModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-detail-page__edit-modal__form__content">
                        <div className="center-detail-page__edit-modal__form__content__name">
                            <div className="center-detail-page__edit-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" value={editFormData.name} onChange={event => handleInputChange(event, setEditFormData)} className={`center-detail-page__edit-modal__form__content__name__input ${editInputState.name ? 'input-error' : ''}`} />
                            <div className="center-detail-page__edit-modal__form__content__name__error-message input-error-message">{editInputState.name ? editInputState.name : ''}</div>
                        </div>
                    </div>
                    <div className="center-detail-page__edit-modal__form__footer">
                        <div className="center-detail-page__edit-modal__form__footer__save-button" onClick={() => submitEditData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}