import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { formatTimestamp } from "../../../utils/formats/TimeFormats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { handleClickOutsideElement, handleInputChange, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { BOOKING_STATUS_CONSTS } from "../../../utils/consts/BookingStatusConsts";
import { COURT_BOOKING_PRODUCT_ORDER_CONSTS } from "../../../utils/consts/CourtBookingProductOrderConsts";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

export default function ProductOrder() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productOrderList, setProductOrderList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterCheckboxState, setFilterCheckboxState] = useState({
        id: false,
        courtBookingId: false,
        productInventoryId: false,
        user: false,
        createTimestamp: false,
        quantity: false,
        fee: false,
        status: false,
    });

    const [productOrderListSortOrder, setProductOrderListSortOrder] = useState({
        id: null,
        courtBookingId: null,
        productInventoryId: null,
        user: null,
        createTimestamp: null,
        quantity: null,
        fee: null,
        status: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [idFilterDropdownState, setIdFilterDropdownState] = useState(false);
    const idFilterDropdownListRef = useRef(null);
    const [idFilterSearchQuery, setIdFilterSearchQuery] = useState('');

    const [courtBookingIdFilterDropdownState, setCourtBookingIdFilterDropdownState] = useState(false);
    const courtBookingIdFilterDropdownListRef = useRef(null);
    const [courtBookingIdFilterSearchQuery, setCourtBookingIdFilterSearchQuery] = useState('');

    const [productInventoryIdFilterDropdownState, setProductInventoryIdFilterDropdownState] = useState(false);
    const productInventoryIdFilterDropdownListRef = useRef(null);
    const [productInventoryIdFilterSearchQuery, setProductInventoryIdFilterSearchQuery] = useState('');

    const [userFilterDropdownState, setUserFilterDropdownState] = useState(false);
    const [userFilterItemList, setUserFilterItemList] = useState([]);
    const userFilterDropdownListRef = useRef(null);
    const [userFilterSearchQuery, setUserFilterSearchQuery] = useState('');
    const [userCurrentFilterItem, setUserCurrentFilterItem] = useState({
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

    const [quantityFilterDropdownState, setQuantityFilterDropdownState] = useState(false);
    const quantityFilterDropdownListRef = useRef(null);
    const [quantityFilterSearchQuery, setQuantityFilterSearchQuery] = useState({
        from: '',
        to: '',
    });

    const [feeFilterDropdownState, setFeeFilterDropdownState] = useState(false);
    const feeFilterDropdownListRef = useRef(null);
    const [feeFilterSearchQuery, setFeeFilterSearchQuery] = useState({
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
        loadProductOrderList();
    }, [tokenState.accessToken,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        productOrderListSortOrder.id,
        productOrderListSortOrder.courtBookingId,
        productOrderListSortOrder.productInventoryId,
        productOrderListSortOrder.user,
        productOrderListSortOrder.createTimestamp,
        productOrderListSortOrder.quantity,
        productOrderListSortOrder.fee,
        productOrderListSortOrder.status
    ]);

    async function loadProductOrderList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.LIST;
        let searchParams = new URLSearchParams();
        if (productOrderListSortOrder.id) {
            searchParams.append('idSortOrder', productOrderListSortOrder.id);
        }
        if (productOrderListSortOrder.courtBookingId) {
            searchParams.append('courtBookingIdSortOrder', productOrderListSortOrder.courtBookingId);
        }
        if (productOrderListSortOrder.productInventoryId) {
            searchParams.append('productInventoryIdSortOrder', productOrderListSortOrder.productInventoryId);
        }
        if (productOrderListSortOrder.user) {
            searchParams.append('userSortOrder', productOrderListSortOrder.user);
        }
        if (productOrderListSortOrder.createTimestamp) {
            searchParams.append('createTimestampSortOrder', productOrderListSortOrder.createTimestamp);
        }
        if (productOrderListSortOrder.quantity) {
            searchParams.append('quantitySortOrder', productOrderListSortOrder.quantity);
        }
        if (productOrderListSortOrder.fee) {
            searchParams.append('feeSortOrder', productOrderListSortOrder.fee);
        }
        if (productOrderListSortOrder.status) {
            searchParams.append('statusSortOrder', productOrderListSortOrder.status);
        }

        if (filterCheckboxState.id && idFilterSearchQuery) {
            searchParams.append('id', idFilterSearchQuery);
        }
        if (filterCheckboxState.courtBookingId && courtBookingIdFilterSearchQuery) {
            searchParams.append('courtBookingId', courtBookingIdFilterSearchQuery);
        }
        if (filterCheckboxState.productInventoryId && productInventoryIdFilterSearchQuery) {
            searchParams.append('productInventoryId', productInventoryIdFilterSearchQuery);
        }
        if (filterCheckboxState.user && userCurrentFilterItem.id) {
            searchParams.append('userId', userCurrentFilterItem.id);
        }
        if (filterCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateFrom && createTimestampFilterSearchQuery.timeFrom) {
            searchParams.append('createTimestampFrom', `${createTimestampFilterSearchQuery.dateFrom}T${createTimestampFilterSearchQuery.timeFrom}`);
        }
        if (filterCheckboxState.createTimestamp && createTimestampFilterSearchQuery.dateTo && createTimestampFilterSearchQuery.timeTo) {
            searchParams.append('createTimestampTo', `${createTimestampFilterSearchQuery.dateTo}T${createTimestampFilterSearchQuery.timeTo}`);
        }
        if (filterCheckboxState.quantity && quantityFilterSearchQuery.from) {
            searchParams.append('quantityFrom', quantityFilterSearchQuery.from)
        }
        if (filterCheckboxState.quantity && quantityFilterSearchQuery.to) {
            searchParams.append('quantityTo', quantityFilterSearchQuery.to)
        }
        if (filterCheckboxState.fee && feeFilterSearchQuery.from) {
            searchParams.append('feeFrom', feeFilterSearchQuery.from)
        }
        if (filterCheckboxState.fee && feeFilterSearchQuery.to) {
            searchParams.append('feeTo', feeFilterSearchQuery.to)
        }
        if (filterCheckboxState.status && statusCurrentFilterItem.id) {
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
            setProductOrderList(data.productOrderList);
            setTotalPage(data.totalPage);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState);
    }, []);

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    useEffect(() => {
        handleClickOutsideElement(idFilterDropdownListRef, setIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(userFilterDropdownListRef, setUserFilterDropdownState);
    }, []);

    useEffect(() => {
        loadUserFilterDropdownList();
    }, [userFilterSearchQuery]);

    async function loadUserFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.PRODUCT_ORDER.BASE + API_URL.PRODUCT_ORDER.CENTER_OWNER + API_URL.PRODUCT_ORDER.USER + API_URL.PRODUCT_ORDER.FILTER + API_URL.PRODUCT_ORDER.LIST;
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

    useEffect(() => {
        handleClickOutsideElement(createTimestampFilterDropdownListRef, setCreateTimestampFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(courtBookingIdFilterDropdownListRef, setCourtBookingIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(productInventoryIdFilterDropdownListRef, setProductInventoryIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(statusFilterDropdownListRef, setStatusFilterDropdownState);
    }, []);

    useEffect(() => {
        loadStatusFilterList();
    }, []);

    async function loadStatusFilterList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.PRODUCT_ORDER_STATUS.BASE + API_URL.PRODUCT_ORDER_STATUS.LIST;

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
            id: index,
        });
    }

    async function cancelProductOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.CANCEL;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadProductOrderList();
        }
    }

    async function checkoutProductOrder(id) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.CENTER_OWNER + API_URL.COURT_BOOKING_PRODUCT_ORDER.CHECKOUT;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadProductOrderList();
        }
    }

    return (
        <>
        <Header />
        <div className="product-order">
            <div className="product-order__container">
                <div className="product-order__container__header">
                    <div className="product-order__container__header__title">
                        <h5>Product order</h5>
                    </div>
                    <div className="product-order__container__header__button-group">
                        <div className="product-order__container__header__button-group__left">
                            <div className="product-order__container__header__button-group__left__add-filters">
                                <div className="product-order__container__header__button-group__left__add-filters__label" onClick={() => setFilterDropdownState(true)}>
                                    Filters
                                </div>
                                <div className="product-order__container__header__button-group__left__add-filters__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="id" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Id
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="courtBookingId" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Court booking id
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="productInventoryId" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Product inventory id
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="user" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> User
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="createTimestamp" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Create timestamp
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="quantity" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Total
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="fee" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Center
                                    </label>
                                    <label className="product-order__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="status" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Status
                                    </label>
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__id-filter" style={filterCheckboxState.id ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__id-filter__button" onClick={() => setIdFilterDropdownState(true)}>
                                    Id{idFilterSearchQuery ? `: ${idFilterSearchQuery}` : ``}
                                </div>
                                <div className="product-order__container__header__button-group__left__id-filter__filter-option" style={idFilterDropdownState ? {} : {display: 'none'}} ref={idFilterDropdownListRef}>
                                    <input type="text" placeholder="Id" onChange={event => setIdFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__court-booking-id-filter" style={filterCheckboxState.courtBookingId ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__court-booking-id-filter__button" onClick={() => setCourtBookingIdFilterDropdownState(true)}>
                                    Court booking id{courtBookingIdFilterSearchQuery ? `: ${courtBookingIdFilterSearchQuery}` : ``}
                                </div>
                                <div className="product-order__container__header__button-group__left__court-booking-id-filter__filter-option" style={courtBookingIdFilterDropdownState ? {} : {display: 'none'}} ref={courtBookingIdFilterDropdownListRef}>
                                    <input type="text" placeholder="Court booking id" onChange={event => setCourtBookingIdFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__id-filter" style={filterCheckboxState.productInventoryId ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__id-filter__button" onClick={() => setProductInventoryIdFilterDropdownState(true)}>
                                    Product inventory id{productInventoryIdFilterSearchQuery ? `: ${productInventoryIdFilterSearchQuery}` : ``}
                                </div>
                                <div className="product-order__container__header__button-group__left__id-filter__filter-option" style={productInventoryIdFilterDropdownState ? {} : {display: 'none'}} ref={productInventoryIdFilterDropdownListRef}>
                                    <input type="text" placeholder="Id" onChange={event => setProductInventoryIdFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__user-filter" style={filterCheckboxState.user ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__user-filter__button" onClick={() => setUserFilterDropdownState(true)}>
                                    User{userCurrentFilterItem.name ? `: ${userCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="product-order__container__header__button-group__left__user-filter__filter-option" style={userFilterDropdownState ? {} : {display: 'none'}} ref={userFilterDropdownListRef}>
                                    <input type="text" placeholder="User" onChange={event => setUserFilterSearchQuery(event.target.value)} />
                                    {userFilterItemList.map(item => (
                                        <div className="product-order__container__header__button-group__left__user-filter__filter-option__item" key={item.user.id} onClick={() => onUserFilterItemSelect(item.user.id)}>
                                            {item.user.username}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__create-timestamp-filter" style={filterCheckboxState.createTimestamp ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__create-timestamp-filter__button" onClick={() => setCreateTimestampFilterDropdownState(true)}>
                                    Create timestamp
                                </div>
                                <div className="product-order__container__header__button-group__left__create-timestamp-filter__filter-option" style={createTimestampFilterDropdownState ? {} : {display: 'none'}} ref={createTimestampFilterDropdownListRef}>
                                    From:
                                    <input type="date" name="dateFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                    <input type="time" name="timeFrom" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                    To:
                                    <input type="date" name="dateTo" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                    <input type="time" name="timeTo" onChange={event => handleInputChange(event, setCreateTimestampFilterSearchQuery)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__quantity-filter" style={filterCheckboxState.quantity ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__quantity-filter__button" onClick={() => setQuantityFilterDropdownState(true)}>
                                    Quantity
                                </div>
                                <div className="product-order__container__header__button-group__left__quantity-filter__filter-option" style={quantityFilterDropdownState ? {} : {display: 'none'}} ref={quantityFilterDropdownListRef}>
                                    From:
                                    <input type="text" name="from" onChange={event => handleInputChange(event, setQuantityFilterSearchQuery)} />
                                    To:
                                    <input type="text" name="to" onChange={event => handleInputChange(event, setQuantityFilterSearchQuery)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__fee-filter" style={filterCheckboxState.fee ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__fee-filter__button" onClick={() => setFeeFilterDropdownState(true)}>
                                    Fee
                                </div>
                                <div className="product-order__container__header__button-group__left__fee-filter__filter-option" style={feeFilterDropdownState ? {} : {display: 'none'}} ref={feeFilterDropdownListRef}>
                                    From:
                                    <input type="text" name="from" onChange={event => handleInputChange(event, setFeeFilterSearchQuery)} />
                                    To:
                                    <input type="text" name="to" onChange={event => handleInputChange(event, setFeeFilterSearchQuery)} />
                                </div>
                            </div>
                            <div className="product-order__container__header__button-group__left__status-filter" style={filterCheckboxState.status ? {} : {display: 'none'}}>
                                <div className="product-order__container__header__button-group__left__status-filter__button" onClick={() => setStatusFilterDropdownState(true)}>
                                    Status{statusCurrentFilterItem.name ? `: ${statusCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="product-order__container__header__button-group__left__status-filter__filter-option" style={statusFilterDropdownState ? {} : {display: 'none'}} ref={statusFilterDropdownListRef}>
                                    {BOOKING_STATUS_CONSTS.INDEX.map((item, index) => (
                                        <div className="product-order__container__header__button-group__left__status-filter__filter-option__item" key={index} onClick={() => onStatusFilterItemSelect(index)}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="product-order__container__header__button-group__right">
                            <div className="product-order__container__header__button-group__right__refresh-button" onClick={() => loadProductOrderList()}>
                                Refresh
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-order__container__list">
                    <div className="product-order__container__list__header">
                        <div className="product-order__container__list__header__id" onClick={() => onChangeSortOrder('id', setProductOrderListSortOrder)}>
                            Id {productOrderListSortOrder.id ? (productOrderListSortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__court-booking-id" onClick={() => onChangeSortOrder('courtBookingId', setProductOrderListSortOrder)}>
                            Court booking id {productOrderListSortOrder.courtBookingId ? (productOrderListSortOrder.courtBookingId === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__product-inventory-id" onClick={() => onChangeSortOrder('productInventoryId', setProductOrderListSortOrder)}>
                            Product inventory id {productOrderListSortOrder.productInventoryId ? (productOrderListSortOrder.productInventoryId === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__user" onClick={() => onChangeSortOrder('user', setProductOrderListSortOrder)}>
                            User {productOrderListSortOrder.user ? (productOrderListSortOrder.user === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__create-timestamp" onClick={() => onChangeSortOrder('createTimestamp', setProductOrderListSortOrder)}>
                            Create timestamp {productOrderListSortOrder.createTimestamp ? (productOrderListSortOrder.createTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__quantity" onClick={() => onChangeSortOrder('quantity', setProductOrderListSortOrder)}>
                            Quantity {productOrderListSortOrder.quantity ? (productOrderListSortOrder.quantity === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__fee" onClick={() => onChangeSortOrder('fee', setProductOrderListSortOrder)}>
                            Fee {productOrderListSortOrder.fee ? (productOrderListSortOrder.fee === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__status" onClick={() => onChangeSortOrder('status', setProductOrderListSortOrder)}>
                            Status {productOrderListSortOrder.status ? (productOrderListSortOrder.status === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-order__container__list__header__action">
                            Action
                        </div>
                    </div>
                    <div className="product-order__container__list__content">
                        {productOrderList.map(item => (
                        <div className="product-order__container__list__content__item" key={item.id}>
                            <div className="product-order__container__list__content__item__id">
                                {item.id}
                            </div>
                            <div className="product-order__container__list__content__item__court-booking-id">
                                {item.courtBooking.id}
                            </div>
                            <div className="product-order__container__list__content__item__product-inventory-id">
                                {item.productInventory.id}
                            </div>
                            <div className="product-order__container__list__content__item__user">
                                {item.user.username}
                            </div>
                            <div className="product-order__container__list__content__item__create-timestamp">
                                {formatTimestamp(item.createTimestamp)}
                            </div>
                            <div className="product-order__container__list__content__item__quantity">
                                {item.quantity}
                            </div>
                            <div className="product-order__container__list__content__item__fee">
                                {item.fee}
                            </div>
                            <div className="product-order__container__list__content__item__status">
                                {COURT_BOOKING_PRODUCT_ORDER_CONSTS.INDEX[item.status]}
                            </div>
                            <div className="product-order__container__list__content__item__action">
                                {item.status === COURT_BOOKING_PRODUCT_ORDER_CONSTS.PENDING && (
                                    <>
                                    <div className="product-order__container__list__content__item__action__cancel-button" onClick={() => cancelProductOrder(item.id)}>
                                        Cancel
                                    </div>
                                    <div className="product-order__container__list__content__item__action__checkout-button" onClick={() => checkoutProductOrder(item.id)}>
                                        Checkout
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="product-order__container__pagination">
                    <div className="product-order__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="product-order__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`product-order__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="product-order__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="product-order__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}