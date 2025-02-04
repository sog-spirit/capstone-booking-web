import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { handleClickOutsideElement, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp } from "../../../utils/formats/TimeFormats";
import { CENTER_REVIEW_CONSTS } from "../../../utils/consts/CenterReviewConsts";
import { CENTER_REVIEW_RATING_CONSTS } from "../../../utils/consts/CenterReviewRatingConsts";

export default function CenterReview() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [reviewList, setReviewList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        id: false,
        user: false,
        center: false,
    });

    const [centerReviewListSortOrder, setCenterReviewListSortOrder] = useState({
        id: null,
        user: null,
        center: null,
        createTimestamp: null,
        updateTimestamp: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage ,setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [idFilterDropdownState, setIdFilterDropdownState] = useState(false);
    const idFilterDropdownListRef = useRef(null);
    const [idFilterSearchQuery, setIdFilterSearchQuery] = useState('');

    const [userFilterDropdownState, setUserFilterDropdownState] = useState(false);
    const [userFilterItemList, setUserFilterItemList] = useState([]);
    const userFilterDropdownListRef = useRef(null);
    const [userFilterSearchQuery, setUserFilterSearchQuery] = useState('');
    const [userCurrentFilterItem, setUserCurrentFilterItem] = useState({
        id: null,
        name: ''
    });

    const [centerFilterDropdownState, setCenterFilterDropdownState] = useState(false);
    const [centerFilterItemList, setCenterFilterItemList] = useState([]);
    const centerFilterDropdownListRef = useRef(null);
    const [centerFilterSearchQuery, setCenterFilterSearchQuery] = useState('');
    const [centerCurrentFilterItem, setCenterCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    useEffect(() => {
        loadReviewList();
    }, [tokenState.accessToken,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        centerReviewListSortOrder.id,
        centerReviewListSortOrder.user,
        centerReviewListSortOrder.center,
        centerReviewListSortOrder.createTimestamp,
        centerReviewListSortOrder.updateTimestamp,
    ]);

    async function loadReviewList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.CENTER_OWNER + API_URL.CENTER_REVIEW.LIST;
        let searchParams = new URLSearchParams();
        if (centerReviewListSortOrder.id) {
            searchParams.append('idSortOrder', centerReviewListSortOrder.id);
        }
        if (centerReviewListSortOrder.user) {
            searchParams.append('userSortOrder', centerReviewListSortOrder.user);
        }
        if (centerReviewListSortOrder.center) {
            searchParams.append('centerSortOrder', centerReviewListSortOrder.center);
        }
        if (centerReviewListSortOrder.createTimestamp) {
            searchParams.append('createTimestampSortOrder', centerReviewListSortOrder.createTimestamp);
        }
        if (centerReviewListSortOrder.updateTimestamp) {
            searchParams.append('updateTimestampSortOrder', centerReviewListSortOrder.updateTimestamp);
        }

        if (filterDropdownCheckboxState.id && idFilterSearchQuery) {
            searchParams.append('id', idFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.center && centerCurrentFilterItem.id) {
            searchParams.append('centerId', centerCurrentFilterItem.id);
        }
        if (filterDropdownCheckboxState.user && userCurrentFilterItem.id) {
            searchParams.append('userId', userCurrentFilterItem.id);
        }

        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setReviewList(data.centerReviewList);
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
    }, []);

    async function loadUserFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.CENTER_OWNER + API_URL.CENTER_REVIEW.USER + API_URL.CENTER_REVIEW.FILTER + API_URL.CENTER_REVIEW.LIST;
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
        handleClickOutsideElement(centerFilterDropdownListRef, setCenterFilterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFilterDropdownList();
    }, []);

    async function loadCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.CENTER_OWNER + API_URL.CENTER_REVIEW.CENTER + API_URL.CENTER_REVIEW.FILTER + API_URL.CENTER_REVIEW.LIST;
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

    return (
        <>
        <Header />
        <div className="center-review">
            <div className="center-review__container">
                <div className="center-review__container__header">
                    <div className="center-review__container__header__title">
                        <div className="center-review__container__header__title__label">
                            <h4>Center reviews</h4>
                        </div>
                    </div>
                    <div className="center-review__container__header__button-group">
                        <div className="center-review__container__header__button-group__left">
                            <div className="center-review__container__header__button-group__left__filter-button">
                                <div className="center-review__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>
                                    Filters
                                </div>
                                <div className="center-review__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="center-review__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="id" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Id
                                    </label>
                                    <label className="center-review__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="user" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> User
                                    </label>
                                    <label className="center-review__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="center" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Center
                                    </label>
                                </div>
                            </div>
                            <div className="center-review__container__header__button-group__left__id-filter" style={filterDropdownCheckboxState.id ? {} : {display: 'none'}}>
                                <div className="center-review__container__header__button-group__left__id-filter__button" onClick={() => setIdFilterDropdownState(true)}>
                                    Id filter
                                </div>
                                <div className="center-review__container__header__button-group__left__id-filter__filter-option" style={idFilterDropdownState ? {} : {display: 'none'}} ref={idFilterDropdownListRef}>
                                    <input type="text" placeholder="Id" onChange={event => setIdFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="center-review__container__header__button-group__left__user-filter" style={filterDropdownCheckboxState.user ? {} : {display: 'none'}}>
                                <div className="center-review__container__header__button-group__left__user-filter__button" onClick={() => setUserFilterDropdownState(true)}>
                                    User filter{userCurrentFilterItem.name ? `: ${userCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="center-review__container__header__button-group__left__user-filter__filter-option" style={userFilterDropdownState ? {} : {display: 'none'}} ref={userFilterDropdownListRef}>
                                    <input type="text" placeholder="User" onChange={event => setUserFilterSearchQuery(event.target.value)} />
                                    {userFilterItemList.map(item => (
                                        <div className="center-review__container__header__button-group__left__user-filter__filter-option__item" key={item.user.id} onClick={() => onUserFilterItemSelect(item.user.id)}>
                                            {item.user.username}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="center-review__container__header__button-group__left__center-filter" style={filterDropdownCheckboxState.center ? {} : {display: 'none'}}>
                                <div className="center-review__container__header__button-group__left__center-filter__button" onClick={() => setCenterFilterDropdownState(true)}>
                                    Center filter{centerCurrentFilterItem.name ? `: ${centerCurrentFilterItem.name}` : ``}
                                </div>
                                <div className="center-review__container__header__button-group__left__center-filter__filter-option" style={centerFilterDropdownState ? {} : {display: 'none'}} ref={centerFilterDropdownListRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterFilterSearchQuery(event.target.value)} />
                                    {centerFilterItemList.map(item => (
                                        <div className="center-review__container__header__button-group__left__center-filter__filter-option__item" key={item.center.id} onClick={() => onCenterFilterItemSelect(item.center.id)}>
                                            {item.center.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="center-review__container__header__button-group__right">
                            <div className="center-review__container__header__button-group__right__refresh-button" onClick={() => loadReviewList()}>
                                Refresh
                            </div>
                        </div>
                    </div>
                </div>
                <div className="center-review__container__review-list">
                    <div className="center-review__container__review-list__list">
                        <div className="center-review__container__review-list__list__header">
                            <div className="center-review__container__review-list__list__header__id" onClick={() => onChangeSortOrder('id', setCenterReviewListSortOrder)}>
                                Id {centerReviewListSortOrder.id ? (centerReviewListSortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="center-review__container__review-list__list__header__user" onClick={() => onChangeSortOrder('user', setCenterReviewListSortOrder)}>
                                User {centerReviewListSortOrder.user ? (centerReviewListSortOrder.user === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="center-review__container__review-list__list__header__center" onClick={() => onChangeSortOrder('center', setCenterReviewListSortOrder)}>
                                Center {centerReviewListSortOrder.center ? (centerReviewListSortOrder.center === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="center-review__container__review-list__list__header__content">
                                Content
                            </div>
                            <div className="center-review__container__review-list__list__header__rating">
                                Rating
                            </div>
                            <div className="center-review__container__review-list__list__header__create-timestamp" onClick={() => onChangeSortOrder('createTimestamp', setCenterReviewListSortOrder)}>
                                Create timestamp {centerReviewListSortOrder.createTimestamp ? (centerReviewListSortOrder.createTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="center-review__container__review-list__list__header__update-timestamp" onClick={() => onChangeSortOrder('updateTimestamp', setCenterReviewListSortOrder)}>
                                Update timestamp {centerReviewListSortOrder.updateTimestamp ? (centerReviewListSortOrder.updateTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="center-review__container__review-list__list__header__status">
                                Status
                            </div>
                        </div>
                        <div className="center-review__container__review-list__list__content">
                            {reviewList.map(item => (
                            <div className="center-review__container__review-list__list__content__item" key={item.id}>
                                <div className="center-review__container__review-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__user">
                                    {item.user.username}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__center">
                                    {item.center.name}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__content">
                                    {item.content}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__rating">
                                    {CENTER_REVIEW_RATING_CONSTS.INDEX[item.rating]}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__create-timestamp">
                                    {formatTimestamp(item.createTimestamp)}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__update-timestamp">
                                    {formatTimestamp(item.updateTimestamp)}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__status">
                                    {CENTER_REVIEW_CONSTS.INDEX[item.status]}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="center-review__container__pagination">
                    <div className="center-review__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="center-review__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`center-review__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="center-review__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="center-review__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}