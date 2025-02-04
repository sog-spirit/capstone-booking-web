import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { formatDate, formatTimestamp, trimTime } from "../../../utils/formats/TimeFormats";
import { handleClickOutsideElement, handleInputChange, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { BOOKING_STATUS_CONSTS } from "../../../utils/consts/BookingStatusConsts";

export default function BookingOrderManagement() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [courtBookingList, setCourtBookingList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        id: false,
        createTimestamp: false,
        center: false,
        court: false,
        user: false,
        usageDate: false,
        usageTimeStart: false,
        usageTimeEnd: false,
        status: false,
    });

    const [courtBookingListSortOrder, setCourtBookingListSortOrder] = useState({
        id: null,
        createTimestamp: null,
        center: null,
        court: null,
        user: null,
        usageDate: null,
        usageTimeStart: null,
        usageTimeEnd: null,
        status: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [idFilterDropdownState, setIdFilterDropdownState] = useState(false);
    const idFilterDropdownListRef = useRef(null);
    const [idFilterSearchQuery, setIdFilterSearchQuery] = useState('');

    const [createTimestampFilterDropdownState, setCreateTimestampFilterDropdownState] = useState(false);
    const createTimestampFilterDropdownListRef = useRef(null);
    const [createTimestampFilterSearchQuery, setCreateTimestampFilterSearchQuery] = useState({
        dateFrom: '',
        timeFrom: '',
        dateTo: '',
        timeTo: '',
    });

    const [centerFilterDropdownState, setCenterFilterDropdownState] = useState(false);
    const [centerFilterItemList, setCenterFilterItemList] = useState([]);
    const centerFilterDropdownListRef = useRef(null);
    const [centerFilterSearchQuery, setCenterFilterSearchQuery] = useState('');
    const [centerCurrentFilterItem, setCenterCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [courtFilterDropdownState, setCourtFilterDropdownState] = useState(false);
    const [courtFilterItemList, setCourtFilterItemList] = useState([]);
    const courtFilterDropdownListRef = useRef(null);
    const [courtFilterSearchQuery, setCourtFilterSearchQuery] = useState('');
    const [courtCurrentFilterItem, setCourtCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [userFilterDropdownState, setUserFilterDropdownState] = useState(false);
    const [userFilterItemList, setUserFilterItemList] = useState([]);
    const userFilterDropdownListRef = useRef(null);
    const [userFilterSearchQuery, setUserFilterSearchQuery] = useState('');
    const [userCurrentFilterItem, setUserCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [usageDateFilterDropdownState, setUsageDateFilterDropdownState] = useState(false);
    const usageDateFilterDropdownListRef = useRef(null);
    const [usageDateFilterSearchQuery, setUsageDateFilterSearchQuery] = useState({
        from: '',
        to: '',
    });

    const [usageTimeStartFilterDropdownState, setUsageTimeStartFilterDropdownState] = useState(false);
    const usageTimeStartFilterDropdownListRef = useRef(null);
    const [usageTimeStartFilterSearchQuery, setUsageTimeStartFilterSearchQuery] = useState({
        from: '',
        to: '',
    });

    const [usageTimeEndFilterDropdownState, setUsageTimeEndFilterDropdownState] = useState(false);
    const usageTimeEndFilterDropdownListRef = useRef(null);
    const [usageTimeEndFilterSearchQuery, setUsageTimeEndFilterSearchQuery] = useState({
        from: '',
        to: '',
    });

    const [statusFilterDropdownState, setStatusFilterDropdownState] = useState(false);
    const statusFilterDropdownListRef = useRef(null);
    const [statusCurrentFilterItem, setStatusCurrentFilterItem] = useState({
        id: 0,
    });

    useEffect(() => {
        loadCourtBookingList();
    }, [totalPage,
        currentPageNumber,
        pageNumberButtonList.length,
        tokenState.accessToken,
        courtBookingListSortOrder.id,
        courtBookingListSortOrder.createTimestamp,
        courtBookingListSortOrder.center,
        courtBookingListSortOrder.court,
        courtBookingListSortOrder.user,
        courtBookingListSortOrder.usageDate,
        courtBookingListSortOrder.usageTimeStart,
        courtBookingListSortOrder.usageTimeEnd,
        courtBookingListSortOrder.status,
    ]);

    async function loadCourtBookingList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.LIST;
        let searchParams = new URLSearchParams();
        if (courtBookingListSortOrder.id) {
            searchParams.append('idSortOrder', courtBookingListSortOrder.id);
        }
        if (courtBookingListSortOrder.createTimestamp) {
            searchParams.append('createTimestampSortOrder', courtBookingListSortOrder.createTimestamp);
        }
        if (courtBookingListSortOrder.center) {
            searchParams.append('centerSortOrder', courtBookingListSortOrder.center);
        }
        if (courtBookingListSortOrder.court) {
            searchParams.append('courtSortOrder', courtBookingListSortOrder.court);
        }
        if (courtBookingListSortOrder.user) {
            searchParams.append('userSortOrder', courtBookingListSortOrder.user);
        }
        if (courtBookingListSortOrder.usageDate) {
            searchParams.append('usageDateSortOrder', courtBookingListSortOrder.usageDate);
        }
        if (courtBookingListSortOrder.usageTimeStart) {
            searchParams.append('usageTimeStartSortOrder', courtBookingListSortOrder.usageTimeStart);
        }
        if (courtBookingListSortOrder.usageTimeEnd) {
            searchParams.append('usageTimeEndSortOrder', courtBookingListSortOrder.usageTimeEnd);
        }
        if (courtBookingListSortOrder.status) {
            searchParams.append('statusSortOrder', courtBookingListSortOrder.status);
        }

        if (filterDropdownCheckboxState.id && idFilterSearchQuery) {
            searchParams.append('id', idFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateFrom && createTimestampFilterSearchQuery.timeFrom) {
            searchParams.append('createTimestampFrom', `${createTimestampFilterSearchQuery.dateFrom}T${createTimestampFilterSearchQuery.timeFrom}`);
        }
        if (filterDropdownCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateTo && createTimestampFilterSearchQuery.timeTo) {
            searchParams.append('createTimestampTo', `${createTimestampFilterSearchQuery.dateTo}T${createTimestampFilterSearchQuery.timeTo}`);
        }
        if (filterDropdownCheckboxState.center && centerCurrentFilterItem.id) {
            searchParams.append('centerId', centerCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.court && courtCurrentFilterItem.id) {
            searchParams.append('courtId', courtCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.user && userCurrentFilterItem.id) {
            searchParams.append('userId', userCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.usageDate && usageDateFilterSearchQuery.from) {
            searchParams.append('usageDateFrom', usageDateFilterSearchQuery.from);
        }
        if (filterDropdownCheckboxState.usageDate && usageDateFilterSearchQuery.to) {
            searchParams.append('usageDateTo', usageDateFilterSearchQuery.to);
        }
        if (filterDropdownCheckboxState.usageTimeStart && usageTimeStartFilterSearchQuery.from) {
            searchParams.append('usageTimeStartFrom', usageTimeStartFilterSearchQuery.from);
        }
        if (filterDropdownCheckboxState.usageTimeStart && usageTimeStartFilterSearchQuery.to) {
            searchParams.append('usageTimeStartTo', usageTimeStartFilterSearchQuery.to);
        }
        if (filterDropdownCheckboxState.usageTimeEnd && usageTimeEndFilterSearchQuery.from) {
            searchParams.append('usageTimeEndFrom', usageTimeEndFilterSearchQuery.from);
        }
        if (filterDropdownCheckboxState.usageTimeEnd && usageTimeEndFilterSearchQuery.to) {
            searchParams.append('usageTimeEndTo', usageTimeEndFilterSearchQuery.to);
        }
        if (filterDropdownCheckboxState.status && statusCurrentFilterItem.id) {
            searchParams.append('statusId', statusCurrentFilterItem.id);
        }

        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingList(data.courtBookingList);
            setTotalPage(data.totalPage);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState)
    }, []);

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    useEffect(() => {
        handleClickOutsideElement(idFilterDropdownListRef, setIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(createTimestampFilterDropdownListRef, setCreateTimestampFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(centerFilterDropdownListRef, setCenterFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(courtFilterDropdownListRef, setCourtFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(userFilterDropdownListRef, setUserFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(usageDateFilterDropdownListRef, setUsageDateFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(usageTimeStartFilterDropdownListRef, setUsageTimeStartFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(usageTimeEndFilterDropdownListRef, setUsageTimeEndFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(statusFilterDropdownListRef, setStatusFilterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFilterItemList();
    }, [centerFilterSearchQuery]);

    async function loadCenterFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.FILTER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.CENTER;
        let searchParams = new URLSearchParams();
        searchParams.append('query', centerFilterSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterFilterItemList(data);
        }
    }

    function onCenterFilterItemSelect(id) {
        let item = centerFilterItemList.find(item => item.center.id === id);
        setCenterCurrentFilterItem({
            id: item.center.id,
            name: item.center.name,
        });
    }

    useEffect(() => {
        loadCourtFilterItemList();
    }, [courtFilterSearchQuery]);

    async function loadCourtFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.FILTER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.COURT;
        let searchParams = new URLSearchParams();
        searchParams.append('query', courtFilterSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtFilterItemList(data);
        }
    }

    function onCourtFilterItemSelect(id) {
        let item = courtFilterItemList.find(item => item.court.id === id);
        setCourtCurrentFilterItem({
            id: item.court.id,
            name: item.court.name,
        });
    }

    useEffect(() => {
        loadUserFilterItemList();
    }, [userFilterSearchQuery]);

    async function loadUserFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.FILTER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.USER;
        let searchParams = new URLSearchParams();
        searchParams.append('query', userFilterSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserFilterItemList(data);
        }
    }

    function onUserFilterItemSelect(id) {
        let item = userFilterItemList.find(item => item.user.id === id);
        setUserCurrentFilterItem({
            id: item.user.id,
            name: item.user.username,
        });
    }

    function onStatusFilterItemSelect(index) {
        setStatusCurrentFilterItem({
            id: index,
        });
    }

    async function checkoutCourtBooking(id) {
            let accessToken = await refreshAccessToken(setTokenState);
                    
            const headers = new Headers();
            headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
            headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
    
            const formData = {
                id: id,
            };
    
            let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.CHECKOUT;
    
            const response = await fetch(url, {
                method: HTTP_REQUEST_METHOD.PUT,
                headers: headers,
                body: JSON.stringify(formData),
            });
    
            if (response.status === HTTP_STATUS.OK) {
                defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
                setCourtBookingDetailModalState(false);
                loadCourtBookingList();
            }
        }
    
        async function cancelCourtBooking(id) {
            let accessToken = await refreshAccessToken(setTokenState);
                    
            const headers = new Headers();
            headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
            headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
    
            const formData = {
                id: id,
            };
    
            let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.CANCEL;
    
            const response = await fetch(url, {
                method: HTTP_REQUEST_METHOD.DELETE,
                headers: headers,
                body: JSON.stringify(formData),
            });
    
            if (response.status === HTTP_STATUS.OK) {
                defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
                setCourtBookingDetailModalState(false);
                loadCourtBookingList();
            }
        }

    return (
        <>
        <Header />
        <div className="booking-order-management">
            <div className="booking-order-management__container">
                <div className="booking-order-management__container__header">
                    <div className="booking-order-management__container__header__button-group">
                        <div className="booking-order-management__container__header__button-group__left">
                            <div className="booking-order-management__container__header__button-group__left__filter-button">
                                <div className="booking-order-management__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>Add filters</div>
                                <div className="booking-order-management__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="id" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Id
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="createTimestamp" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Create timestamp
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="center" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Center
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="court" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Court
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="user" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> User
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="usageDate" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage date
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="usageTimeStart" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage time start
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="usageTimeEnd" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage time end
                                    </label>
                                    <label className="booking-order-management__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="status" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Status
                                    </label>
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__id-filter" style={filterDropdownCheckboxState.id ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__id-filter__button" onClick={() => setIdFilterDropdownState(true)}>
                                    Id filter{idFilterSearchQuery ? `: ${idFilterSearchQuery}` : ''}
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__id-filter__filter-option" style={idFilterDropdownState ? {} : {display: 'none'}} ref={idFilterDropdownListRef}>
                                    <input type="text" placeholder="Id" value={idFilterSearchQuery} onChange={event => setIdFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__create-timestamp-filter" style={filterDropdownCheckboxState.createTimestamp ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__create-timestamp-filter__button" onClick={() => setCreateTimestampFilterDropdownState(true)}>
                                    Create timestamp filter
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__create-timestamp-filter__filter-option" style={createTimestampFilterDropdownState ? {} : {display: 'none'}} ref={createTimestampFilterDropdownListRef}>
                                    <div className="booking-order-management__container__header__button-group__left__create-timestamp-filter__filter-option__from">
                                        From:
                                        <input type="date" name="dateFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                        <input type="time" name="timeFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                    </div>
                                    <div className="booking-order-management__container__header__button-group__left__create-timestamp-filter__filter-option__to">
                                        To:
                                        <input type="date" name="dateTo" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                        <input type="time" name="timeTo" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                    </div>
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__center-filter" style={filterDropdownCheckboxState.center ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__center-filter__button" onClick={() => setCenterFilterDropdownState(true)}>
                                    Center filter{centerCurrentFilterItem.name ? `: ${centerCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__center-filter__filter-option" style={centerFilterDropdownState ? {} : {display: 'none'}} ref={centerFilterDropdownListRef}>
                                    <input type="text" placeholder="Center" value={centerFilterSearchQuery} onChange={event => setCenterFilterSearchQuery(event.target.value)} />
                                    {centerFilterItemList.map(item => (
                                        <div className="booking-order-management__container__header__button-group__left__center-filter__filter-option__item" key={item.court.center.id} onClick={() => onCenterFilterItemSelect(item.center.id)}>
                                            {item.court.center.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__court-filter" style={filterDropdownCheckboxState.court ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__court-filter__button" onClick={() => setCourtFilterDropdownState(true)}>
                                    Court filter{courtCurrentFilterItem.name ? `: ${courtCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__court-filter__filter-option" style={courtFilterDropdownState ? {} : {display: 'none'}} ref={courtFilterDropdownListRef}>
                                    <input type="text" placeholder="Court" value={courtFilterSearchQuery} onChange={event => setCourtFilterSearchQuery(event.target.value)} />
                                    {courtFilterItemList.map(item => (
                                        <div className="booking-order-management__container__header__button-group__left__court-filter__filter-option__item" key={item.court.id} onClick={() => onCourtFilterItemSelect(item.court.id)}>
                                            {item.court.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__user-filter" style={filterDropdownCheckboxState.user ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__user-filter__button" onClick={() => setUserFilterDropdownState(true)}>
                                    User filter{userCurrentFilterItem.name ? `: ${userCurrentFilterItem.name}` :``}
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__user-filter__filter-option" style={userFilterDropdownState ? {} : {display: 'none'}} ref={userFilterDropdownListRef}>
                                    <input type="text" placeholder="User" value={userFilterSearchQuery} onChange={event => setUserFilterSearchQuery(event.target.value)} />
                                    {userFilterItemList.map(item => (
                                        <div className="booking-order-management__container__header__button-group__left__user-filter__filter-option__item" key={item.user.id} onClick={() => onUserFilterItemSelect(item.user.id)}>
                                            {item.user.username}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__usage-date-filter" style={filterDropdownCheckboxState.usageDate ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__usage-date-filter__button" onClick={() => setUsageDateFilterDropdownState(true)}>
                                    Usage date filter
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__usage-date-filter__filter-option" style={usageDateFilterDropdownState ? {} : {display: 'none'}} ref={usageDateFilterDropdownListRef}>
                                    <div className="booking-order-management__container__header__button-group__left__usage-date-filter__filter-option__from">
                                        From:
                                        <input type="date" name="from" onChange={event => handleInputChange(event, setUsageDateFilterSearchQuery)} />
                                    </div>
                                    <div className="booking-order-management__container__header__button-group__left__usage-date-filter__filter-option__to">
                                        To:
                                        <input type="date" name="to" onChange={event => handleInputChange(event, setUsageDateFilterSearchQuery)} />
                                    </div>
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__usage-time-start-filter" style={filterDropdownCheckboxState.usageTimeStart ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__usage-time-start-filter__button" onClick={() => setUsageTimeStartFilterDropdownState(true)}>
                                    Usage time start filter
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__usage-time-start-filter__filter-option" style={usageTimeStartFilterDropdownState ? {} : {display: 'none'}} ref={usageTimeStartFilterDropdownListRef}>
                                    <div className="booking-order-management__container__header__button-group__left__usage-time-start-filter__filter-option__from">
                                        From:
                                        <input type="time" name="from" onChange={event => handleInputChange(event, setUsageTimeStartFilterSearchQuery)} />
                                    </div>
                                    <div className="booking-order-management__container__header__button-group__left__usage-time-start-filter__filter-option__to">
                                        To:
                                        <input type="time" name="to" onChange={event => handleInputChange(event, setUsageTimeStartFilterSearchQuery)} />
                                    </div>
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__usage-time-end-filter" style={filterDropdownCheckboxState.usageTimeEnd ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__usage-time-end-filter__button" onClick={() => setUsageTimeEndFilterDropdownState(true)}>
                                    Usage time end filter
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__usage-time-end-filter__filter-option" style={usageTimeEndFilterDropdownState ? {} : {display: 'none'}} ref={usageTimeEndFilterDropdownListRef}>
                                    <div className="booking-order-management__container__header__button-group__left__usage-time-end-filter__filter-option__from">
                                        From:
                                        <input type="time" name="from" onChange={event => handleInputChange(event, setUsageTimeEndFilterSearchQuery)} />
                                    </div>
                                    <div className="booking-order-management__container__header__button-group__left__usage-time-end-filter__filter-option__to">
                                        To:
                                        <input type="time" name="to" onChange={event => handleInputChange(event, setUsageTimeEndFilterSearchQuery)} />
                                    </div>
                                </div>
                            </div>
                            <div className="booking-order-management__container__header__button-group__left__status-filter" style={filterDropdownCheckboxState.status ? {} : {display: 'none'}}>
                                <div className="booking-order-management__container__header__button-group__left__status-filter__button" onClick={() => setStatusFilterDropdownState(true)}>
                                    Status filter{statusCurrentFilterItem.id ? `: ${BOOKING_STATUS_CONSTS.INDEX[statusCurrentFilterItem.id]}` : ``}
                                </div>
                                <div className="booking-order-management__container__header__button-group__left__status-filter__filter-option" style={statusFilterDropdownState ? {} : {display: 'none'}} ref={statusFilterDropdownListRef}>
                                    {BOOKING_STATUS_CONSTS.INDEX.map((item, index) => (
                                        <div className="booking-order-management__container__header__button-group__left__status-filter__filter-option__item" key={index} onClick={() => onStatusFilterItemSelect(index)}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="booking-order-management__container__header__button-group__right">
                            <div className="booking-order-management__container__header__button-group__right__refresh-button" onClick={() => loadCourtBookingList()}>
                                Refresh
                            </div>
                        </div>
                    </div>
                </div>
                <div className="booking-order-management__container__list">
                    <div className="booking-order-management__container__list__header">
                        <div className="booking-order-management__container__list__header__order-id" onClick={() => onChangeSortOrder('id', setCourtBookingListSortOrder)}>
                            Id {courtBookingListSortOrder.id ? (courtBookingListSortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__create-timestamp" onClick={() => onChangeSortOrder('createTimestamp', setCourtBookingListSortOrder)}>
                            Create timestamp {courtBookingListSortOrder.createTimestamp ? (courtBookingListSortOrder.createTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__center" onClick={() => onChangeSortOrder('center', setCourtBookingListSortOrder)}>
                            Center {courtBookingListSortOrder.center ? (courtBookingListSortOrder.center === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__court" onClick={() => onChangeSortOrder('court', setCourtBookingListSortOrder)}>
                            Court {courtBookingListSortOrder.court ? (courtBookingListSortOrder.court === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__user" onClick={() => onChangeSortOrder('user', setCourtBookingListSortOrder)}>
                            User {courtBookingListSortOrder.user ? (courtBookingListSortOrder.user === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__usage-date" onClick={() => onChangeSortOrder('usageDate', setCourtBookingListSortOrder)}>
                            Usage date {courtBookingListSortOrder.usageDate ? (courtBookingListSortOrder.usageDate === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__usage-time-start" onClick={() => onChangeSortOrder('usageTimeStart', setCourtBookingListSortOrder)}>
                            Usage time start {courtBookingListSortOrder.usageTimeStart ? (courtBookingListSortOrder.usageTimeStart === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__usage-time-end" onClick={() => onChangeSortOrder('usageTimeEnd', setCourtBookingListSortOrder)}>
                            Usage time end {courtBookingListSortOrder.usageTimeEnd ? (courtBookingListSortOrder.usageTimeEnd === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__status" onClick={() => onChangeSortOrder('status', setCourtBookingListSortOrder)}>
                            Status {courtBookingListSortOrder.status ? (courtBookingListSortOrder.status === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="booking-order-management__container__list__header__action">
                            Action
                        </div>
                    </div>
                    <div className="booking-order-management__container__list__content">
                        {courtBookingList.map(item => (
                        <div className="booking-order-management__container__list__content__item" key={item.id}>
                            <div className="booking-order-management__container__list__content__item__order-id">
                                {item.id}
                            </div>
                            <div className="booking-order-management__container__list__content__item__create-timestamp">
                                {formatTimestamp(item.createTimestamp)}
                            </div>
                            <div className="booking-order-management__container__list__content__item__center">
                                {item.court.center.name}
                            </div>
                            <div className="booking-order-management__container__list__content__item__court">
                                {item.court.name}
                            </div>
                            <div className="booking-order-management__container__list__content__item__user">
                                {item.user.username}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-date">
                                {formatDate(item.usageDate)}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-time-start">
                                {trimTime(item.usageTimeStart)}
                            </div>
                            <div className="booking-order-management__container__list__content__item__usage-time-end">
                                {trimTime(item.usageTimeEnd)}
                            </div>
                            <div className="booking-order-management__container__list__content__item__status">
                                {BOOKING_STATUS_CONSTS.INDEX[item.status]}
                            </div>
                            <div className="booking-order-management__container__list__content__item__action">
                                {item.status === BOOKING_STATUS_CONSTS.PENDING && (
                                    <>
                                    <div className="booking-order-management__container__list__content__item__action__checkout-button" onClick={() => checkoutCourtBooking(item.id)}>
                                        Checkout
                                    </div>
                                    <div className="booking-order-management__container__list__content__item__action__cancel-button" onClick={() => cancelCourtBooking(item.id)}>
                                        Cancel
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="booking-order-management__container__pagination">
                    <div className="booking-order-management__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="booking-order-management__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`booking-order-management__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="booking-order-management__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="booking-order-management__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}