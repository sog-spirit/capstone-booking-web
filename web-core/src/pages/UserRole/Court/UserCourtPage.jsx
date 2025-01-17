import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { useParams } from "react-router-dom";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { handleClickOutsideElement, handleInputChange } from "../../../utils/input/InputUtils";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import CourtBookingList from "./CourtBookingList";
import { formatDate, trimTime } from "../../../utils/formats/TimeFormats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { BOOKING_STATUS_CONSTS, getBookingStatusColor } from "../../../utils/consts/BookingStatusConsts";
import { addTime } from "../../../utils/time/TimeUtils";

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
        timeInterval: '',
    });

    const [courtDropdownState, setCourtDropdownState] = useState(false);
    const [courtDropdownList, setCourtDropdownList] = useState([]);
    const [courtDropdownSearchInput, setCourtDropdownSearchInput] = useState('');
    const [courtDropdownTextValue, setCourtDropdownTextValue] = useState('');
    const courtDropdownRef = useRef(null);

    const [centerInfo, setCenterInfo] = useState({
        openingTime: '',
        closingTime: '',
        name: '',
        courtFee: 0,
    });
    const [timeInterval, setTimeInterval] = useState([]);

    const [dayInterval, setDayInterval] = useState([]);

    const [courtTimeInterval, setCourtTimeInterval] = useState([]);

    useEffect(() => {
        loadCenterCourtList();
    }, [tokenState.accessToken, newBookingModalState]);

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
            setCourtList(data.map(item => item));
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
        if (!isContinuous()) {
            return;
        }

        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER;

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
        handleClickOutsideElement(courtDropdownRef, setCourtDropdownState);
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

    useEffect(() => {
        loadCenterInfo();
    }, [newBookingModalState]);

    async function loadCenterInfo() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.USER + API_URL.CENTER.INFO;
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
                courtFee: data.courtFee,
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

        setTimeInterval([...timeMarks]);
    }

    useEffect(() => {
        loadDayInterval();
    }, [newBookingModalState]);

    function loadDayInterval() {
        const dayArray = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            dayArray.push(currentDate.toISOString().split('T')[0]);
        }

        setDayInterval([...dayArray]);
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

    function calculateCourtFee() {
        if (isContinuous()) {
            const selectedSlots = courtTimeInterval.filter(item => item.status === BOOKING_STATUS_CONSTS.NAME.SELECT);
            return selectedSlots.length * centerInfo.courtFee;
        } else {
            return '0';
        }
    }

    return (
        <>
        <Header />
        <div className="user-court-page">
            <div className="user-court-page__container">
                <div className="user-court-page__container__header">
                    <div className="user-court-page__container__header__title">
                        <div className="user-court-page__container__header__title__label">
                            <h4>{centerInfo.name} court booking list</h4>
                        </div>
                    </div>
                    <div className="user-court-page__container__header__button-group">
                        <div className="user-court-page__container__header__button-group__booking-button" onClick={() => setNewBookingModalState(true)}>
                            <FontAwesomeIcon icon={faPlus} /> New booking 
                        </div>
                    </div>
                </div>
                <div className="user-court-page__container__court-list">
                    <div className="user-court-page__container__court-list__status-legend">
                        <div className="user-court-page__container__court-list__status-legend__available">
                            <div className="user-court-page__container__court-list__status-legend__available__label">
                                Available
                            </div>
                            <div className="user-court-page__container__court-list__status-legend__available__color"></div>
                        </div>
                        <div className="user-court-page__container__court-list__status-legend__is-booking">
                            <div className="user-court-page__container__court-list__status-legend__is-booking__label">
                                Is booking
                            </div>
                            <div className="user-court-page__container__court-list__status-legend__is-booking__color"></div>
                        </div>
                        <div className="user-court-page__container__court-list__status-legend__booked">
                            <div className="user-court-page__container__court-list__status-legend__booked__label">
                                Booked
                            </div>
                            <div className="user-court-page__container__court-list__status-legend__booked__color"></div>
                        </div>
                        <div className="user-court-page__container__court-list__status-legend__unavailable">
                            <div className="user-court-page__container__court-list__status-legend__unavailable__label">
                                Unavailable
                            </div>
                            <div className="user-court-page__container__court-list__status-legend__unavailable__color"></div>
                        </div>
                    </div>
                    {dayInterval.map(day => (
                        <>
                        <div className="user-court-page__container__court-list__title">
                            <h5>{formatDate(day)}</h5>
                        </div>
                        <div className="user-court-page__container__court-list__list">
                            <div className="user-court-page__container__court-list__list__detail" style={{gridTemplateColumns: `repeat(${timeInterval.length + 1}, 120px)`}}>
                                <div className="user-court-page__container__court-list__list__detail__item"></div>
                                    {timeInterval.map(timeInterval => (
                                        <div className="user-court-page__container__court-list__list__detail__item" key={timeInterval}>{timeInterval}</div>
                                    ))}
                                    {courtList.map(court => (
                                        <>
                                        <div className="user-court-page__container__court-list__list__detail__item" key={court.id}>
                                            {court.name}
                                        </div>
                                        <CourtBookingList courtId={court.id} date={day} newBookingModalState={newBookingModalState} />
                                        </>
                                    ))}
                            </div>
                        </div>
                        </>
                    ))}
                </div>
            </div>
            <div className="user-court-page__new-booking-modal" style={newBookingModalState ? {} : {display: 'none'}}>
                <div className="user-court-page__new-booking-modal__form">
                    <div className="user-court-page__new-booking-modal__form__header">
                        <div className="user-court-page__new-booking-modal__form__header__title">
                            <h5>New booking</h5>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__header__close-button" onClick={() => closeNewBookingModal()}>
                            <FontAwesomeIcon icon={faXmark} />
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
                        <div className="user-court-page__new-booking-modal__form__content__booking-legends">
                            <div className="user-court-page__new-booking-modal__form__content__booking-legends__available">
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__available__label">
                                    Available
                                </div>
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__available__color"></div>
                            </div>
                            <div className="user-court-page__new-booking-modal__form__content__booking-legends__is-booking">
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__is-booking__label">
                                    Is booking
                                </div>
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__is-booking__color"></div>
                            </div>
                            <div className="user-court-page__new-booking-modal__form__content__booking-legends__booked">
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__booked__label">
                                    Booked
                                </div>
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__booked__color"></div>
                            </div>
                            <div className="user-court-page__new-booking-modal__form__content__booking-legends__unavailable">
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__unavailable__label">
                                    Unavailable
                                </div>
                                <div className="user-court-page__new-booking-modal__form__content__booking-legends__unavailable__color"></div>
                            </div>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__content__usage-time">
                            {courtTimeInterval.map(item => (
                                <div className="user-court-page__new-booking-modal__form__content__usage-time__item" style={{backgroundColor: getBookingStatusColor(item.status), cursor: item.status !== BOOKING_STATUS_CONSTS.NAME.AVAILABLE && item.status !== BOOKING_STATUS_CONSTS.NAME.SELECT ? 'not-allowed' : ''}} onClick={() => onTimeSelect(item.time)}>
                                    {item.time}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="user-court-page__new-booking-modal__form__footer">
                        <div className="user-court-page__new-booking-modal__form__footer__left">
                            <div className="user-court-page__new-booking-modal__form__footer__left__usage-time">
                                Usage time: {newBookingFormData.usageTimeStart && newBookingFormData.usageTimeEnd ? `${newBookingFormData.usageTimeStart}-${newBookingFormData.usageTimeEnd}` : ``}
                            </div>
                            <div className="user-court-page__new-booking-modal__form__footer__left__court-fee">
                                Court fee: {calculateCourtFee()}₫
                            </div>
                        </div>
                        <div className="user-court-page__new-booking-modal__form__footer__right">
                            <div className="user-court-page__new-booking-modal__form__footer__right__add-button" onClick={() => submitAddNewBooking()}>
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