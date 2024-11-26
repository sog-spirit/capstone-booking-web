import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { useParams } from "react-router-dom";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import CourtBookingList from "./CourtBookingList";

export default function UserCourtPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const {centerId} = useParams();

    const [courtList, setCourtList] = useState([]);

    const [newBookingModalState, setNewBookingModalState] = useState(false);
    const [newBookingFormData, setNewBookingFormData] = useState({
        centerId: centerId,
        courtId: 0,
        usageDate: '',
        usageTimeStart: '',
        usageTimeEnd: '',
    });
    const [newBookingInputState, setNewBookingInputState] = useState({
        courtId: '',
        usageDate: '',
        usageTimeStart: '',
        usageTimeEnd: '',
    });

    const [courtDropdownState, setCourtDropdownState] = useState(false);
    const [courtDropdownList, setCourtDropdownList] = useState([]);
    const [courtDropdownSearchInput, setCourtDropdownSearchInput] = useState('');
    const [courtDropdownTextValue, setCourtDropdownTextValue] = useState('');
    const courtDropdownRef = useRef(null);

    useEffect(() => {
        loadCenterCourtList();
    }, [tokenState.accessToken]);

    async function loadCenterCourtList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headerss = new Headers();
        headerss.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE + API_URL.COURT.USER + API_URL.COURT.CENTER + API_URL.COURT.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headerss,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtList(data);
        }
    }

    function closeNewBookingModal() {
        setCourtDropdownTextValue('');
        setNewBookingFormData(prevState => ({
            ...prevState,
            courtId: 0,
            usageDate: '',
            usageTimeStart: '',
            usageTimeEnd: '',
        }));
        setNewBookingInputState(prevState => ({
            ...prevState,
            courtId: '',
            usageDate: '',
            usageTimeStart: '',
            usageTimeEnd: '',
        }));
        setNewBookingModalState(false);
    }

    async function submitAddNewBooking() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(newBookingFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            closeNewBookingModal();
        }
    }

    useEffect(() => {
        function handler(event) {
            if (!courtDropdownRef.current.contains(event.target)) {
                setCourtDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        loadCourtDropdownList()
    }, [tokenState.accessToken, courtDropdownSearchInput, courtDropdownState]);

    async function loadCourtDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE + API_URL.COURT.USER + API_URL.COURT.DROPDOWN + API_URL.COURT.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);
        searchParams.append('query', courtDropdownSearchInput);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtDropdownList(data);
        }
    }

    function selectCourtDropdownItem(courtId) {
        let court = courtDropdownList.find(item => item.id === courtId);
        setCourtDropdownTextValue(court.name);
        setNewBookingFormData(prevState => ({
            ...prevState,
            courtId: court.id,
        }));
        setCourtDropdownState(false);
    }

    return (
        <>
        <Header />
        <div className="user-court-page">
            <div className="user-court-page__container">
                <div className="user-court-page__container__header">
                    <div className="user-court-page__container__header__title">
                        <div className="user-court-page__container__header__title__label">
                            <h4>Center detail</h4>
                        </div>
                    </div>
                    <div className="user-court-page__container__header__button-group">
                        <div className="user-court-page__container__header__button-group__booking-button" onClick={() => setNewBookingModalState(true)}>
                            New booking
                        </div>
                    </div>
                </div>
                <div className="user-court-page__container__court-list">
                    <div className="user-court-page__container__court-list__title">
                        <h5>Court list</h5>
                    </div>
                    <div className="user-court-page__container__court-list__list">
                        {courtList.map(item => (
                        <div className="user-court-page__container__court-list__list__item" key={item.id}>
                            <div className="user-court-page__container__court-list__list__item__header">
                                <div className="user-court-page__container__court-list__list__item__header__label-group">
                                    <div className="user-court-page__container__court-list__list__item__header__label-group__name">
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                            <div className="user-court-page__container__court-list__list__item__booking-list">
                                <CourtBookingList centerId={centerId} courtId={item.id} />
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="user-court-page__new-booking-modal" style={newBookingModalState ? {} : {display: 'none'}}>
                <div className="user-court-page__new-booking-modal__form">
                    <div className="user-court-page__new-booking-modal__form__header">
                        <div className="user-court-page__new-booking-modal__form__header__title">
                            <h5>New booking</h5>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__header__close-button" onClick={() => closeNewBookingModal()}>
                            Close
                        </div>
                    </div>
                    <div className="user-court-page__new-booking-modal__form__content">
                        <div className="user-court-page__new-booking-modal__form__content__court">
                            <div className="user-court-page__new-booking-modal__form__content__court__label">Court</div>
                            <div className="user-court-page__new-booking-modal__form__content__court__select">
                                <div className="user-court-page__new-booking-modal__form__content__court__select__select-button" onClick={() => setCourtDropdownState(true)}>
                                    {courtDropdownTextValue ? courtDropdownTextValue : 'Select a court'}
                                </div>
                                <div className={`user-court-page__new-booking-modal__form__content__court__select__select-option ${newBookingInputState.courtId ? 'input-error' : ''}`} style={courtDropdownState ? {} : {display: 'none'}} ref={courtDropdownRef}>
                                    <input type="text" placeholder="Court" onChange={event => setCourtDropdownSearchInput(event.target.value)} />
                                    {courtDropdownList.map(item => (
                                    <div className="user-court-page__new-booking-modal__form__content__court__select__select-option__item" key={item.id} onClick={() => selectCourtDropdownItem(item.id)}>
                                        {item.name}
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className="user-court-page__new-booking-modal__form__content__court__error-message input-error-message">{newBookingInputState.courtId ? newBookingInputState.courtId : ''}</div>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__content__usage-date">
                            <div className="user-court-page__new-booking-modal__form__content__usage-date__label">Usage date</div>
                            <input type="date" name="usageDate" onChange={event => handleInputChange(event, setNewBookingFormData)} className={`user-court-page__new-booking-modal__form__content__usage-date__input ${newBookingInputState.usageDate ? 'input-error' : ''}`} />
                            <div className="user-court-page__new-booking-modal__form__content__usage-date__error-message input-error-message">{newBookingInputState.usageDate ? newBookingInputState.usageDate : ''}</div>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__content__usage-time-start">
                            <div className="user-court-page__new-booking-modal__form__content__usage-time-start__label">Usage time start</div>
                            <input type="time" name="usageTimeStart" onChange={event => handleInputChange(event, setNewBookingFormData)} className={`user-court-page__new-booking-modal__form__content__usage-time-start__input ${newBookingInputState.usageTimeStart ? 'input-error' : ''}`} />
                            <div className="user-court-page__new-booking-modal__form__content__usage-time-start__error-message input-error-message">{newBookingInputState.usageTimeStart ? newBookingInputState.usageTimeStart : ''}</div>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__content__usage-time-end">
                            <div className="user-court-page__new-booking-modal__form__content__usage-time-end__label">Usage time end</div>
                            <input type="time" name="usageTimeEnd" onChange={event => handleInputChange(event, setNewBookingFormData)} className={`user-court-page__new-booking-modal__form__content__usage-time-end__input ${newBookingInputState.usageTimeEnd ? 'input-error' : ''}`} />
                            <div className="user-court-page__new-booking-modal__form__content__usage-time-end__error-message input-error-message">{newBookingInputState.usageTimeEnd ? newBookingInputState.usageTimeEnd : ''}</div>
                        </div>
                    </div>
                    <div className="user-court-page__new-booking-modal__form__footer">
                        <div className="user-court-page__new-booking-modal__form__footer__add-button" onClick={() => submitAddNewBooking()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}