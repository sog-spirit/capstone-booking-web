import { useContext, useEffect, useRef, useState } from "react";
import { TokenContext } from "../../../App";
import Header from "../../../components/Header";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { handleClickOutsideElement, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";

export default function AdminAccountManagement() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [userDetailList, setUserDetailList] = useState([]);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [userInfoSortOrder, setUserInfoSortOrder] = useState({
        username: null,
        phone: null,
        email: null,
        firstName: null,
        lastName: null,
    });

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterCheckboxState, setFilterCheckboxState] = useState({
        username: false,
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
    });

    const [usernameFilterDropdownState, setUsernameFilterDropdownState] = useState(false);
    const usernameFilterDropdownRef = useRef(null);
    const [usernameFilterDropdownSearchQuery, setUsernameFilterDropdownSearchQuery] = useState('');

    const [emailFilterDropdownState, setEmailFilterDropdownState] = useState(false);
    const emailFilterDropdownRef = useRef(null);
    const [emailFilterDropdownSearchQuery, setEmailFilterDropdownSearchQuery] = useState('');

    const [phoneFilterDropdownState, setPhoneFilterDropdownState] = useState(false);
    const phoneFilterDropdownRef = useRef(null);
    const [phoneFilterDropdownSearchQuery, setPhoneFilterDropdownSearchQuery] = useState('');

    const [firstNameFilterDropdownState, setFirstNameFilterDropdownState] = useState(false);
    const firstNameFilterDropdownRef = useRef(null);
    const [firstNameFilterDropdownSearchQuery, setFirstNameFilterDropdownSearchQuery] = useState('');

    const [lastNameFilterDropdownState, setLastNameFilterDropdownState] = useState(false);
    const lastNameFilterDropdownRef = useRef(null);
    const [lastNameFilterDropdownSearchQuery, setLastNameFilterDropdownSearchQuery] = useState('');

    useEffect(() => {
        loadUserList();
    }, [
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        userInfoSortOrder.username,
        userInfoSortOrder.email,
        userInfoSortOrder.phone,
        userInfoSortOrder.firstName,
        userInfoSortOrder.lastName,
    ]);

    async function loadUserList() {
        const accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.USER.BASE + API_URL.USER.ADMIN + API_URL.USER.LIST;
        let searchParams = new URLSearchParams();
        if (filterCheckboxState.username && usernameFilterDropdownSearchQuery) {
            searchParams.append('usernameFilter', usernameFilterDropdownSearchQuery);
        }
        if (filterCheckboxState.email && emailFilterDropdownSearchQuery) {
            searchParams.append('emailFilter', emailFilterDropdownSearchQuery);
        }
        if (filterCheckboxState.phone && phoneFilterDropdownSearchQuery) {
            searchParams.append('phoneFilter', phoneFilterDropdownSearchQuery);
        }
        if (filterCheckboxState.firstName && firstNameFilterDropdownSearchQuery) {
            searchParams.append('firstNameFilter', firstNameFilterDropdownSearchQuery);
        }
        if (filterCheckboxState.lastName && lastNameFilterDropdownSearchQuery) {
            searchParams.append('lastNameFilter', lastNameFilterDropdownSearchQuery);
        }
        if (userInfoSortOrder.username) {
            searchParams.append('usernameSortOrder', userInfoSortOrder.username);
        }
        if (userInfoSortOrder.email) {
            searchParams.append('emailSortOrder', userInfoSortOrder.email);
        }
        if (userInfoSortOrder.phone) {
            searchParams.append('phoneSortOrder', userInfoSortOrder.phone);
        }
        if (userInfoSortOrder.firstName) {
            searchParams.append('firstNameSortOrder', userInfoSortOrder.firstName);
        }
        if (userInfoSortOrder.lastName) {
            searchParams.append('lastNameSortOrder', userInfoSortOrder.lastName);
        }
        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserDetailList(data.userList);
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
        handleClickOutsideElement(usernameFilterDropdownRef, setUsernameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(emailFilterDropdownRef, setEmailFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(phoneFilterDropdownRef, setPhoneFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(firstNameFilterDropdownRef, setFirstNameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(lastNameFilterDropdownRef, setLastNameFilterDropdownState);
    }, []);

    return (
        <>
        <Header />
        <div className="admin-account-management">
            <div className="admin-account-management__container">
                <div className="admin-account-management__container__header">
                    <div className="admin-account-management__container__header__button-group">
                        <div className="admin-account-management__container__header__button-group__left">
                            <div className="admin-account-management__container__header__button-group__left__add-filters">
                                <div className="admin-account-management__container__header__button-group__left__add-filters__label" onClick={() => setFilterDropdownState(true)}>
                                    Add filters
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__add-filters__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="admin-account-management__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="username" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Username
                                    </label>
                                    <label className="admin-account-management__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="email" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Email
                                    </label>
                                    <label className="admin-account-management__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="phone" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Phone
                                    </label>
                                    <label className="admin-account-management__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="firstName" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> First name
                                    </label>
                                    <label className="admin-account-management__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" name="lastName" onChange={event => handleInputCheckboxChange(event, setFilterCheckboxState)} /> Last name
                                    </label>
                                </div>
                            </div>
                            <div className="admin-account-management__container__header__button-group__left__username-filter" style={filterCheckboxState.username ? {} : {display: 'none'}}>
                                <div className="admin-account-management__container__header__button-group__left__username-filter__button" onClick={() => setUsernameFilterDropdownState(true)}>
                                    Username
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__username-filter__option" style={usernameFilterDropdownState ? {} : {display: 'none'}} ref={usernameFilterDropdownRef}>
                                    <input type="text" placeholder="Username" onChange={event => setUsernameFilterDropdownSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="admin-account-management__container__header__button-group__left__email-filter" style={filterCheckboxState.email ? {} : {display: 'none'}}>
                                <div className="admin-account-management__container__header__button-group__left__email-filter__button" onClick={() => setEmailFilterDropdownState(true)}>
                                    Email
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__email-filter__option" style={emailFilterDropdownState ? {} : {display: 'none'}} ref={emailFilterDropdownRef}>
                                    <input type="text" placeholder="Email" onChange={event => setEmailFilterDropdownSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="admin-account-management__container__header__button-group__left__phone-filter" style={filterCheckboxState.phone ? {} : {display: 'none'}}>
                                <div className="admin-account-management__container__header__button-group__left__phone-filter__button" onClick={() => setPhoneFilterDropdownState(true)}>
                                    Phone
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__phone-filter__option" style={phoneFilterDropdownState ? {} : {display: 'none'}} ref={phoneFilterDropdownRef}>
                                    <input type="text" placeholder="Phone" onChange={event => setPhoneFilterDropdownSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="admin-account-management__container__header__button-group__left__first-name-filter" style={filterCheckboxState.firstName ? {} : {display: 'none'}}>
                                <div className="admin-account-management__container__header__button-group__left__first-name-filter__button" onClick={() => setFirstNameFilterDropdownState(true)}>
                                    First name
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__first-name-filter__option" style={firstNameFilterDropdownState ? {} : {display: 'none'}} ref={firstNameFilterDropdownRef}>
                                    <input type="text" placeholder="First name" onChange={event => setFirstNameFilterDropdownSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="admin-account-management__container__header__button-group__left__last-name-filter" style={filterCheckboxState.lastName ? {} : {display: 'none'}}>
                                <div className="admin-account-management__container__header__button-group__left__last-name-filter__button" onClick={() => setLastNameFilterDropdownState(true)}>
                                    Last name
                                </div>
                                <div className="admin-account-management__container__header__button-group__left__last-name-filter__option" style={lastNameFilterDropdownState ? {} : {display: 'none'}} ref={lastNameFilterDropdownRef}>
                                    <input type="text" placeholder="Last name" onChange={event => setLastNameFilterDropdownSearchQuery(event.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="admin-account-management__container__header__button-group__right">
                            <div className="admin-account-management__container__header__button-group__right__refresh-button" onClick={() => loadUserList()}>
                                Refresh
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin-account-management__container__list">
                    <div className="admin-account-management__container__list__header">
                        <div className="admin-account-management__container__list__header__username" onClick={() => onChangeSortOrder('username', setUserInfoSortOrder)}>
                            Username {userInfoSortOrder.username ? (userInfoSortOrder.username === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="admin-account-management__container__list__header__email" onClick={() => onChangeSortOrder('email', setUserInfoSortOrder)}>
                            Email {userInfoSortOrder.email ? (userInfoSortOrder.email === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="admin-account-management__container__list__header__phone" onClick={() => onChangeSortOrder('phone', setUserInfoSortOrder)}>
                            Phone {userInfoSortOrder.phone ? (userInfoSortOrder.phone === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="admin-account-management__container__list__header__last-name" onClick={() => onChangeSortOrder('lastName', setUserInfoSortOrder)}>
                            Last name {userInfoSortOrder.lastName ? (userInfoSortOrder.lastName === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="admin-account-management__container__list__header__first-name" onClick={() => onChangeSortOrder('firstName', setUserInfoSortOrder)}>
                            First name {userInfoSortOrder.firstName ? (userInfoSortOrder.firstName === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                    </div>
                    <div className="admin-account-management__container__list__content">
                        {userDetailList.map(item => (
                            <div className="admin-account-management__container__list__content__item" key={item.id}>
                                <div className="admin-account-management__container__list__content__item__username">
                                    {item.username}
                                </div>
                                <div className="admin-account-management__container__list__content__item__email">
                                    {item.email}
                                </div>
                                <div className="admin-account-management__container__list__content__item__phone">
                                    {item.phone}
                                </div>
                                <div className="admin-account-management__container__list__content__item__last-name">
                                    {item.lastName}
                                </div>
                                <div className="admin-account-management__container__list__content__item__first-name">
                                    {item.firstName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="product-inventory-page__container__pagination">
                    <div className="product-inventory-page__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="product-inventory-page__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`product-inventory-page__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="product-inventory-page__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="product-inventory-page__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}