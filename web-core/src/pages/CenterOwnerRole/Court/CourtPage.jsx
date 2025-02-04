import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { handleClickOutsideElement, handleInputChange } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { useParams } from "react-router-dom";
import CourtBookingItem from "./CourtBookingItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { BOOKING_STATUS_CONSTS, getBookingStatusColor } from "../../../utils/consts/BookingStatusConsts";
import { addTime } from "../../../utils/time/TimeUtils";

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

    const [centerInfo, setCenterInfo] = useState({
        openingTime: '',
        closingTime: '',
        name: '',
    });
    const [timeInterval, setTimeInterval] = useState([]);

    const [dayInterval, setDayInterval] = useState([]);

    const [addNewCourtBookingModalState, setAddNewCourtBookingModalState] = useState(false);
    const [newBookingFormData, setNewBookingFormData] = useState({
        centerId: centerId,
        courtId: 0,
        usageDate: '',
        usageTimeStart: '',
        usageTimeEnd: '',
    });

    const [courtDropdownState, setCourtDropdownState] = useState(false);
    const [courtDropdownList, setCourtDropdownList] = useState([]);
    const [courtDropdownSearchInput, setCourtDropdownSearchInput] = useState('');
    const [courtDropdownTextValue, setCourtDropdownTextValue] = useState('');
    const courtDropdownRef = useRef(null);

    const [courtTimeInterval, setCourtTimeInterval] = useState([]);

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE;

        console.log(addNewFormData);
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
    }, [tokenState.accessToken, addNewCourtBookingModalState]);

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
            setCourtListState([...data.courtList]);
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

    async function submitDeleteData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE;

        let formData = {
            id: editFormData.id,
        }

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData), 
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
        loadCenterInfo();
    }, [tokenState.accessToken, addNewCourtBookingModalState]);

    async function loadCenterInfo() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.CENTER_OWNER + API_URL.CENTER.INFO;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            
            setCenterInfo({
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                name: data.name,
            });

            createTimeIntervalArray(data.openingTime, data.closingTime);
        }
    }

    function createTimeIntervalArray(openingTime, closingTime, intervalMinute = 60) {
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
            currentDate.setMinutes(currentDate.getMinutes() + intervalMinute);
            const nextHours = currentDate.getHours().toString().padStart(2, '0');
            const nextMinutes = currentDate.getMinutes().toString().padStart(2, '0');
            timeMarks.push(`${hours}:${minutes}-${nextHours}:${nextMinutes}`);
        }

        setTimeInterval(timeMarks);
    }

    async function submitAddNewBooking() {
        if (!isContinuous()) {
            return;
        }

        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER;

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

    function closeNewBookingModal() {
        setCourtDropdownTextValue('');
        setNewBookingFormData(prevState => ({
            ...prevState,
            courtId: 0,
            usageDate: '',
            usageTimeStart: '',
            usageTimeEnd: '',
        }));
        setAddNewCourtBookingModalState(false);
    }

    useEffect(() => {
        loadDayInterval();
    }, []);

    function loadDayInterval() {
        const dayArray = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            dayArray.push(currentDate.toISOString().split('T')[0]);
        }

        setDayInterval(dayArray);
    }

    useEffect(() => {
        handleClickOutsideElement(courtDropdownRef, setCourtDropdownState);
    }, []);

    useEffect(() => {
        loadCourtDropdownList()
    }, [tokenState.accessToken, courtDropdownSearchInput, courtDropdownState]);

    async function loadCourtDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT.BASE + API_URL.COURT.CENTER_OWNER + API_URL.COURT.DROPDOWN + API_URL.COURT.LIST;
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

    useEffect(() => {
        loadCourtTimeInterval();
    }, [newBookingFormData.courtId, newBookingFormData.usageDate]);

    async function loadCourtTimeInterval() {
        if (!newBookingFormData.courtId || !newBookingFormData.usageDate) {
            return;
        }

        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.COURT + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.DATE;
        let searchParams = new URLSearchParams();
        searchParams.append('courtId', newBookingFormData.courtId);
        searchParams.append('usageDate', newBookingFormData.usageDate);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtTimeInterval([...data.timeMarks]);
        }
    }

    function onTimeSelect(time) {
        setCourtTimeInterval(courtTimeInterval.map(item => {
            if (item.time === time) {
                if (item.status === BOOKING_STATUS_CONSTS.NAME.AVAILABLE) {
                    return {...item, status: BOOKING_STATUS_CONSTS.NAME.SELECT};
                } else if (item.status === BOOKING_STATUS_CONSTS.NAME.SELECT) {
                    return {...item, status: BOOKING_STATUS_CONSTS.NAME.AVAILABLE};
                }
            } else {
                return item;
            }
        }));
    }

    function isContinuous() {
        const timeToMinutes = (item) => {
            const [hours, minutes] = item.time.split('-')[0].split(':').map(Number);
            return hours * 60 + minutes;
        }

        const slotMinutes = courtTimeInterval.map(timeToMinutes).sort((a, b) => a - b);

        for (let i = 1; i < slotMinutes.length; i++) {
            if (slotMinutes[i] - slotMinutes[i - 1] !== 60) {
                return false;
            }
        }

        return true;
    }

    useEffect(() => {
        getTimeSlot();
    }, [JSON.stringify(courtTimeInterval)]);

    function getTimeSlot() {
        const selectedSlots = courtTimeInterval.filter(item => item.status === BOOKING_STATUS_CONSTS.NAME.SELECT);
        setNewBookingFormData(prevState => ({
            ...prevState,
            usageTimeStart: selectedSlots[0]?.time.split('-')[0],
            usageTimeEnd: selectedSlots[selectedSlots.length - 1]?.time.split('-')[0] ? addTime(selectedSlots[selectedSlots.length - 1]?.time.split('-')[0], 0, 60) : selectedSlots[selectedSlots.length - 1]?.time.split('-')[0],
        }));
    }

    return(
        <>
        <Header />
        <div className="center-detail-page">
            <div className="center-detail-page__container">
                <div className="center-detail-page__container__header">
                    <div className="center-detail-page__container__header__title">
                        <div className="center-detail-page__container__header__title__label">
                            <h4>{centerInfo.name} detail</h4>
                        </div>
                    </div>
                    <div className="center-detail-page__container__header__button-group">
                        <div className="center-detail-page__container__header__button-group__refresh-button" onClick={() => loadCourtList()}>
                            <FontAwesomeIcon icon={faArrowsRotate} />
                        </div>
                        <div className="center-detail-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Court
                        </div>
                        <div className="center-detail-page__container__header__button-group__add-new-button" onClick={() => setAddNewCourtBookingModalState(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Court booking
                        </div>
                    </div>
                </div>
                <div className="center-detail-page__container__court-list">
                    <div className="center-detail-page__container__court-list__status-legend">
                        <div className="center-detail-page__container__court-list__status-legend__available">
                            <div className="center-detail-page__container__court-list__status-legend__available__label">
                                Available
                            </div>
                            <div className="center-detail-page__container__court-list__status-legend__available__color">

                            </div>
                        </div>
                        <div className="center-detail-page__container__court-list__status-legend__is-booking">
                            <div className="center-detail-page__container__court-list__status-legend__is-booking__label">
                                Is booking
                            </div>
                            <div className="center-detail-page__container__court-list__status-legend__is-booking__color">

                            </div>
                        </div>
                        <div className="center-detail-page__container__court-list__status-legend__booked">
                            <div className="center-detail-page__container__court-list__status-legend__booked__label">
                                Booked
                            </div>
                            <div className="center-detail-page__container__court-list__status-legend__booked__color">

                            </div>
                        </div>
                        <div className="center-detail-page__container__court-list__status-legend__unavailable">
                            <div className="center-detail-page__container__court-list__status-legend__unavailable__color">
                                Unavailable
                            </div>
                            <div className="center-detail-page__container__court-list__status-legend__unavailable__label">

                            </div>
                        </div>
                    </div>
                    {dayInterval.map(day => (
                        <>
                        <div className="center-detail-page__container__court-list__list__date">
                            <h5>{day}</h5>
                        </div>
                        <div className="center-detail-page__container__court-list__list">
                            <div className="center-detail-page__container__court-list__list__detail" style={{gridTemplateColumns: `repeat(${timeInterval.length + 1}, 120px)`}}>
                                <div className="center-detail-page__container__court-list__list__detail__item"></div>
                                {timeInterval.map(time => (
                                    <div className="center-detail-page__container__court-list__list__detail__item" key={time}>{time}</div>
                                ))}
                                {courtListState.map(court => (
                                    <>
                                    <div className="center-detail-page__container__court-list__list__detail__item hoverable" key={court.id} onClick={() => openEditModal(court.id)}>
                                        {court.name}
                                    </div>
                                    <CourtBookingItem
                                        courtId={court.id}
                                        day={day}
                                        addNewCourtBookingModalState={addNewCourtBookingModalState}
                                    />
                                    </>
                                ))}
                            </div>
                        </div>
                        </>
                    ))}
                </div>
            </div>
            <div className="center-detail-page__add-new-modal" style={addNewModalState ? {} : {display: "none"}}>
                <div className="center-detail-page__add-new-modal__form">
                    <div className="center-detail-page__add-new-modal__form__header">
                        <div className="center-detail-page__add-new-modal__form__header__title">
                            <h5>Add new court</h5>
                        </div>
                        <div className="center-detail-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            <FontAwesomeIcon icon={faXmark} />
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
                            <FontAwesomeIcon icon={faXmark} />
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
                        <div className="center-detail-page__edit-modal__form__footer__delete-button" onClick={() => submitDeleteData()}>
                            Delete
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-detail-page__new-booking-modal" style={addNewCourtBookingModalState ? {} : {display: 'none'}}>
                <div className="center-detail-page__new-booking-modal__form">
                    <div className="center-detail-page__new-booking-modal__form__header">
                        <div className="center-detail-page__new-booking-modal__form__header__title">
                            <h5>New booking</h5>
                        </div>
                        <div className="center-detail-page__new-booking-modal__form__header__close-button" onClick={() => setAddNewCourtBookingModalState(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    <div className="center-detail-page__new-booking-modal__form__content">
                        <div className="center-detail-page__new-booking-modal__form__content__court">
                            <div className="center-detail-page__new-booking-modal__form__content__court__label">Court</div>
                            <div className="center-detail-page__new-booking-modal__form__content__court__select">
                                <div className="center-detail-page__new-booking-modal__form__content__court__select__select-button" onClick={() => setCourtDropdownState(true)}>
                                    {courtDropdownTextValue ? courtDropdownTextValue : 'Select a court'}
                                </div>
                                <div className={`center-detail-page__new-booking-modal__form__content__court__select__select-option `} style={courtDropdownState ? {} : {display: 'none'}} ref={courtDropdownRef}>
                                    <input type="text" placeholder="Court" onChange={event => setCourtDropdownSearchInput(event.target.value)} />
                                    {courtDropdownList.map(item => (
                                    <div className="center-detail-page__new-booking-modal__form__content__court__select__select-option__item" key={item.id} onClick={() => selectCourtDropdownItem(item.id)}>
                                        {item.name}
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className="center-detail-page__new-booking-modal__form__content__court__error-message input-error-message"></div>
                        </div>
                        <div className="center-detail-page__new-booking-modal__form__content__usage-date">
                            <div className="center-detail-page__new-booking-modal__form__content__usage-date__label">Usage date</div>
                            <input type="date" name="usageDate" onChange={event => handleInputChange(event, setNewBookingFormData)} className={`center-detail-page__new-booking-modal__form__content__usage-date__input`} />
                            <div className="center-detail-page__new-booking-modal__form__content__usage-date__error-message input-error-message"></div>
                        </div>
                        <div className="center-detail-page__new-booking-modal__form__content__booking-legends">
                            <div className="center-detail-page__new-booking-modal__form__content__booking-legends__available">
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__available__label">
                                    Available
                                </div>
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__available__color"></div>
                            </div>
                            <div className="center-detail-page__new-booking-modal__form__content__booking-legends__is-booking">
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__is-booking__label">
                                    Is booking
                                </div>
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__is-booking__color"></div>
                            </div>
                            <div className="center-detail-page__new-booking-modal__form__content__booking-legends__booked">
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__booked__label">
                                    Booked
                                </div>
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__booked__color"></div>
                            </div>
                            <div className="center-detail-page__new-booking-modal__form__content__booking-legends__unavailable">
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__unavailable__label">
                                    Unavailable
                                </div>
                                <div className="center-detail-page__new-booking-modal__form__content__booking-legends__unavailable__color"></div>
                            </div>
                        </div>
                        <div className="center-detail-page__new-booking-modal__form__content__usage-time">
                            {courtTimeInterval.map(item => (
                                <div className="center-detail-page__new-booking-modal__form__content__usage-time__item" style={{backgroundColor: getBookingStatusColor(item.status), cursor: item.status !== BOOKING_STATUS_CONSTS.NAME.AVAILABLE && item.status !== BOOKING_STATUS_CONSTS.NAME.SELECT ? 'not-allowed' : ''}} onClick={() => onTimeSelect(item.time)}>
                                    {item.time}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="center-detail-page__new-booking-modal__form__footer">
                        <div className="center-detail-page__new-booking-modal__form__footer__left">
                            <div className="center-detail-page__new-booking-modal__form__footer__left__usage-time">
                                Usage time: {newBookingFormData.usageTimeStart && newBookingFormData.usageTimeEnd ? `${newBookingFormData.usageTimeStart}-${newBookingFormData.usageTimeEnd}` : ``}
                            </div>
                        </div>
                        <div className="center-detail-page__new-booking-modal__form__footer__right">
                            <div className="center-detail-page__new-booking-modal__form__footer__right__add-button" onClick={() => submitAddNewBooking()}>
                                Add
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}