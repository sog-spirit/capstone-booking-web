import { useContext, useEffect, useRef, useState } from "react";
import { TokenContext } from "../../../App";
import Header from "../../../components/Header";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleClickOutsideElement, handleInputChange, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { formatDate, formatTimestamp, trimTime } from "../../../utils/formats/TimeFormats";
import { BOOKING_STATUS_CONSTS } from "../../../utils/consts/BookingStatusConsts";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

export default function UserBookingOrderList() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [userBookingOrderList, setUserBookingOrderList] = useState([]);

    const [userBookingOrderListSortOrder, setUserBookingOrderListSortOrder] = useState({
        id: null,
        center: null,
        court: null,
        createTimestamp: null,
        usageDate: null,
        usageTimeStart: null,
        usageTimeEnd: null,
        status: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        id: false,
        center: false,
        court: false,
        createTimestamp: false,
        usageDate: false,
        usageTimeStart: false,
        usageTimeEnd: false,
        status: false,
    });

    const [idFilterDropdownState, setIdFilterDropdownState] = useState(false);
    const idFilterDropdownListRef = useRef(null);
    const [idFilterSearchQuery, setIdFilterSearchQuery] = useState('');

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

    const [createTimestampFilterDropdownState, setCreateTimestampFilterDropdownState] = useState(false);
    const createTimestampFilterDropdownListRef = useRef(null);
    const [createTimestampFilterSearchQuery, setCreateTimestampFilterSearchQuery] = useState({
        dateFrom: '',
        timeFrom: '',
        dateTo: '',
        timeTo: '',
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
    const [statusFilterItemList, setStatusFilterItemList] = useState([]);
    const statusFilterDropdownListRef = useRef(null);
    const [statusCurrentFilterItem, setStatusCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    useEffect(() => {
        loadUserBookingOrderList();
    }, [tokenState.accessToken,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        userBookingOrderListSortOrder.id,
        userBookingOrderListSortOrder.center,
        userBookingOrderListSortOrder.court,
        userBookingOrderListSortOrder.createTimestamp,
        userBookingOrderListSortOrder.usageDate,
        userBookingOrderListSortOrder.usageTimeStart,
        userBookingOrderListSortOrder.usageTimeEnd,
        userBookingOrderListSortOrder.status,
    ]);

    async function loadUserBookingOrderList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.LIST;
        let searchParams = new URLSearchParams();
        if (userBookingOrderListSortOrder.id) {
            searchParams.append('idSortOrder', userBookingOrderListSortOrder.id);
        }
        if (userBookingOrderListSortOrder.center) {
            searchParams.append('centerSortOrder', userBookingOrderListSortOrder.center);
        }
        if (userBookingOrderListSortOrder.court) {
            searchParams.append('courtSortOrder', userBookingOrderListSortOrder.court);
        }
        if (userBookingOrderListSortOrder.createTimestamp) {
            searchParams.append('createTimestampSortOrder', userBookingOrderListSortOrder.createTimestamp);
        }
        if (userBookingOrderListSortOrder.usageDate) {
            searchParams.append('usageDateSortOrder', userBookingOrderListSortOrder.usageDate);
        }
        if (userBookingOrderListSortOrder.usageTimeStart) {
            searchParams.append('usageTimeStartSortOrder', userBookingOrderListSortOrder.usageTimeStart);
        }
        if (userBookingOrderListSortOrder.usageTimeEnd) {
            searchParams.append('usageTimeEndSortOrder', userBookingOrderListSortOrder.usageTimeEnd);
        }
        if (userBookingOrderListSortOrder.status) {
            searchParams.append('statusSortOrder', userBookingOrderListSortOrder.status);
        }

        if (filterDropdownCheckboxState.id && idFilterSearchQuery) {
            searchParams.append('id', idFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.center && centerCurrentFilterItem.id) {
            searchParams.append('centerId', centerCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.court && courtCurrentFilterItem.id) {
            searchParams.append('courtId', courtCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateFrom && createTimestampFilterSearchQuery.timeFrom) {
            searchParams.append('createTimestampFrom', `${createTimestampFilterSearchQuery.dateFrom}T${createTimestampFilterSearchQuery.timeFrom}`)
        }
        if (filterDropdownCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateTo && createTimestampFilterSearchQuery.timeTo) {
            searchParams.append('createTimestampTo', `${createTimestampFilterSearchQuery.dateTo}T${createTimestampFilterSearchQuery.timeTo}`)
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
            setUserBookingOrderList([...data.courtBookingList]);
            setTotalPage(data.totalPage);
        }
    }

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(idFilterDropdownListRef, setIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(centerFilterDropdownListRef, setCenterFilterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFilterItemList();
    }, [centerFilterSearchQuery]);

    async function loadCenterFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.FILTER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.CENTER;
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
        let item = centerFilterItemList.find(item => item.court.center.id === id);
        setCenterCurrentFilterItem({
            id: item.court.center.id,
            name: item.court.center.name,
        });
    }

    useEffect(() => {
        handleClickOutsideElement(courtFilterDropdownListRef, setCourtFilterDropdownState);
    }, []);

    useEffect(() => {
        loadCourtFilterItemList();
    }, [courtFilterSearchQuery]);

    async function loadCourtFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.FILTER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.COURT;
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
        handleClickOutsideElement(createTimestampFilterDropdownListRef, setCreateTimestampFilterDropdownState);
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
        loadBookingOrderStatusList();
    }, []);

    async function loadBookingOrderStatusList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.BOOKING_ORDER_STATUS.BASE + API_URL.BOOKING_ORDER_STATUS.LIST;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setStatusFilterItemList(data);
        }
    }

    function onStatusFilterItemSelect(index) {
        setStatusCurrentFilterItem({
            value: index,
        });
    }

    async function cancelCourtBookingOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadUserBookingOrderList();
        }
    }

    return (
        <>
        <Header />
        <div className="user-booking-order-list">
            <div className="user-booking-order-list__container">
                <div className="user-booking-order-list__container__header">
                    <div className="user-booking-order-list__container__header__title">
                        <div className="user-booking-order-list__container__header__title__label">
                            <h4>Booking order list</h4>
                        </div>
                        <div className="user-booking-order-list__container__header__button-group">
                            <div className="user-booking-order-list__container__header__button-group__left">
                                <div className="user-booking-order-list__container__header__button-group__left__filter-button">
                                    <div className="user-booking-order-list__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>
                                        Filters
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="id" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Id
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="center" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Center
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="court" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Court
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="createTimestamp" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Create timestamp
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="usageDate" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage date
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="usageTimeStart" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage time start
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="usageTimeEnd" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Usage time end
                                        </label>
                                        <label className="user-booking-order-list__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="status" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Status
                                        </label>
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__id-filter" style={filterDropdownCheckboxState.id ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__id-filter__button" onClick={() => setIdFilterDropdownState(true)}>
                                        Id
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__id-filter__filter-option" style={idFilterDropdownState ? {} : {display: 'none'}} ref={idFilterDropdownListRef}>
                                        <input type="text" placeholder="Id" onChange={event => setIdFilterSearchQuery(event.target.value)} />
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__center-filter" style={filterDropdownCheckboxState.center ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__center-filter__button" onClick={() => setCenterFilterDropdownState(true)}>
                                        Center{centerCurrentFilterItem.name ? `: ${centerCurrentFilterItem.name}` : ``}
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__center-filter__filter-option" style={centerFilterDropdownState ? {} : {display: 'none'}} ref={centerFilterDropdownListRef}>
                                        <input type="text" placeholder="Center" onChange={event => setCenterFilterSearchQuery(event.target.value)} />
                                        {centerFilterItemList.map(item => (
                                            <div className="user-booking-order-list__container__header__button-group__left__center-filter__filter-option__item" key={item.court.center.id} onClick={() => onCenterFilterItemSelect(item.court.center.id)}>
                                                {item.court.center.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__court-filter" style={filterDropdownCheckboxState.court ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__court-filter__button" onClick={() => setCourtFilterDropdownState(true)}>
                                        Court{courtCurrentFilterItem.name ? `: ${courtCurrentFilterItem.name}` : ``}
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__court-filter__filter-option" style={courtFilterDropdownState ? {} : {display: 'none'}} ref={courtFilterDropdownListRef}>
                                        <input type="text" placeholder="Court" onChange={event => setCourtFilterSearchQuery(event.target.value)} />
                                        {courtFilterItemList.map(item => (
                                            <div className="user-booking-order-list__container__header__button-group__left__court-filter__filter-option__item" key={item.court.id} onClick={() => onCourtFilterItemSelect(item.court.id)}>
                                                {item.court.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__create-timestamp-filter" style={filterDropdownCheckboxState.createTimestamp ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__create-timestamp-filter__button" onClick={() => setCreateTimestampFilterDropdownState(true)}>
                                        Create timestamp
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__create-timestamp-filter__filter-option" style={createTimestampFilterDropdownState ? {} : {display: 'none'}} ref={createTimestampFilterDropdownListRef}>
                                        <div className="user-booking-order-list__container__header__button-group__left__create-timestamp-filter__filter-option__from">
                                            From:
                                            <input type="date" name="dateFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                            <input type="time" name="timeFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                        </div>
                                        <div className="user-booking-order-list__container__header__button-group__left__create-timestamp-filter__filter-option__to">
                                            To:
                                            <input type="date" name="dateTo" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                            <input type="time" name="dateFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__usage-date-filter" style={filterDropdownCheckboxState.usageDate ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-date-filter__button" onClick={() => setUsageDateFilterDropdownState(true)}>
                                        Usage date
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-date-filter__filter-option" style={usageDateFilterDropdownState ? {} : {display: 'none'}} ref={usageDateFilterDropdownListRef}>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-date-filter__filter-option__from">
                                            From:
                                            <input type="date" name="from" onChange={event => handleInputChange(event, setUsageDateFilterSearchQuery)} />
                                        </div>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-date-filter__filter-option__to">
                                            To:
                                            <input type="date" name="to" onChange={event => handleInputChange(event, setUsageDateFilterSearchQuery)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__usage-time-start-filter" style={filterDropdownCheckboxState.usageTimeStart ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-time-start-filter__button" onClick={() => setUsageTimeStartFilterDropdownState(true)}>
                                        Usage time start
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-time-start-filter__filter-option" style={usageTimeStartFilterDropdownState ? {} : {display: 'none'}} ref={usageTimeStartFilterDropdownListRef}>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-time-start-filter__filter-option__from">
                                            From:
                                            <input type="time" name="from" onChange={event => handleInputChange(event, setUsageTimeStartFilterSearchQuery)} />
                                        </div>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-time-start-filter__filter-option__to">
                                            To:
                                            <input type="time" name="to" onChange={event => handleInputChange(event, setUsageTimeStartFilterSearchQuery)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__usage-time-end-filter" style={filterDropdownCheckboxState.usageTimeEnd ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-time-end-filter__button" onClick={() => setUsageTimeEndFilterDropdownState(true)}>
                                        Usage time end
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__usage-time-end-filter__filter-option" style={usageTimeEndFilterDropdownState ? {} : {display: 'none'}} ref={usageTimeEndFilterDropdownListRef}>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-time-end-filter__filter-option__from">
                                            From:
                                            <input type="time" name="from" onChange={event => handleInputChange(event, setUsageTimeEndFilterSearchQuery)} />
                                        </div>
                                        <div className="user-booking-order-list__container__header__button-group__left__usage-time-end-filter__filter-option__to">
                                            To:
                                            <input type="time" name="to" onChange={event => handleInputChange(event, setUsageTimeEndFilterSearchQuery)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="user-booking-order-list__container__header__button-group__left__status-filter" style={filterDropdownCheckboxState.status ? {} : {display: 'none'}}>
                                    <div className="user-booking-order-list__container__header__button-group__left__status-filter__button" onClick={() => setStatusFilterDropdownState(true)}>
                                        Status{statusCurrentFilterItem.name ? `: ${statusCurrentFilterItem.name}` : ``}
                                    </div>
                                    <div className="user-booking-order-list__container__header__button-group__left__status-filter__filter-option" style={statusFilterDropdownState ? {} : {display: 'none'}} ref={statusFilterDropdownListRef}>
                                        {BOOKING_STATUS_CONSTS.INDEX.map((item, index) => (
                                            <div className="user-booking-order-list__container__header__button-group__left__status-filter__filter-option__item" key={item} onClick={() => onStatusFilterItemSelect(index)}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="user-booking-order-list__container__header__button-group__right">
                                <div className="user-booking-order-list__container__header__button-group__right__refresh-button" onClick={() => loadUserBookingOrderList()}>
                                    Refresh
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-booking-order-list__container__booking-order-list">
                    <div className="user-booking-order-list__container__booking-order-list__list">
                        <div className="user-booking-order-list__container__booking-order-list__list__header">
                            <div className="user-booking-order-list__container__booking-order-list__list__header__id" onClick={() =>onChangeSortOrder('id', setUserBookingOrderListSortOrder)}>
                                Id {userBookingOrderListSortOrder.id ? (userBookingOrderListSortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__center" onClick={() =>onChangeSortOrder('center', setUserBookingOrderListSortOrder)}>
                                Center name {userBookingOrderListSortOrder.center ? (userBookingOrderListSortOrder.center === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__court" onClick={() =>onChangeSortOrder('court', setUserBookingOrderListSortOrder)}>
                                Court name {userBookingOrderListSortOrder.court ? (userBookingOrderListSortOrder.court === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__create-timestamp" onClick={() =>onChangeSortOrder('createTimestamp', setUserBookingOrderListSortOrder)}>
                                Create timestamp {userBookingOrderListSortOrder.createTimestamp ? (userBookingOrderListSortOrder.createTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-date" onClick={() =>onChangeSortOrder('usageDate', setUserBookingOrderListSortOrder)}>
                                Usage date {userBookingOrderListSortOrder.usageDate ? (userBookingOrderListSortOrder.usageDate === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-time-start" onClick={() =>onChangeSortOrder('usageTimeStart', setUserBookingOrderListSortOrder)}>
                                Usage time start {userBookingOrderListSortOrder.usageTimeStart ? (userBookingOrderListSortOrder.usageTimeStart === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__usage-time-end" onClick={() =>onChangeSortOrder('usageTimeEnd', setUserBookingOrderListSortOrder)}>
                                Usage time end {userBookingOrderListSortOrder.usageTimeEnd ? (userBookingOrderListSortOrder.usageTimeEnd === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__status" onClick={() =>onChangeSortOrder('status', setUserBookingOrderListSortOrder)}>
                                Status {userBookingOrderListSortOrder.status ? (userBookingOrderListSortOrder.status === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-booking-order-list__container__booking-order-list__list__header__action">
                                Action
                            </div>
                        </div>
                        <div className="user-booking-order-list__container__booking-order-list__list__content">
                            {userBookingOrderList.map(item => (
                            <div className="user-booking-order-list__container__booking-order-list__list__content__item" key={item.id}>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__center">
                                    {item.court.center.name}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__court">
                                    {item.court.name}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__create-timestamp">
                                    {formatTimestamp(item.createTimestamp)}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-date">
                                    {formatDate(item.usageDate)}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-time-start">
                                    {trimTime(item.usageTimeStart)}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__usage-time-end">
                                    {trimTime(item.usageTimeEnd)}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__status">
                                    {BOOKING_STATUS_CONSTS.INDEX[item.status]}
                                </div>
                                <div className="user-booking-order-list__container__booking-order-list__list__content__item__action">
                                    {item.status === BOOKING_STATUS_CONSTS.PENDING && (
                                        <div className="user-booking-order-list__container__booking-order-list__list__content__item__action__cancel-button" onClick={() => cancelCourtBookingOrder(item.id)}>
                                            Cancel
                                        </div>
                                    )}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="user-booking-order-list__container__pagination">
                        <div className="user-booking-order-list__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                            Previous
                        </div>
                        <div className="user-booking-order-list__container__pagination__page-number-button-list">
                            {pageNumberButtonList.map(item => Number.isInteger(item) ?
                                (<div className={`user-booking-order-list__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                    {item}
                                </div>)
                            : (<div className="user-booking-order-list__container__pagination__page-number-button-list__item" key={item}>
                                    {item}
                            </div>)
                            )}
                        </div>
                        <div className="user-booking-order-list__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                            Next
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}