import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { handleClickOutsideElement, handleInputChange, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";

export default function EmployeeManagementPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
    });
    const [addNewInputState, setAddNewInputState] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
    });

    const [employeeList, setEmployeeList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        username: false,
        firstName: false,
        lastName: false,
        phone: false,
        email: false,
    });

    const [employeeListSortOrder, setEmployeeListSortOrder] = useState({
        username: null,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage ,setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [usernameFilterDropdownState, setUsernameFilterDropdownState] = useState(false);
    const usernameFilterDropdownListRef = useRef(null);
    const [usernameFilterSearchQuery, setUsernameFilterSearchQuery] = useState('');

    const [firstNameFilterDropdownState, setFirstNameFilterDropdownState] = useState(false);
    const firstNameFilterDropdownListRef = useRef(null);
    const [firstNameFilterSearchQuery, setFirstNameFilterSearchQuery] = useState('');

    const [lastNameFilterDropdownState, setLastNameFilterDropdownState] = useState(false);
    const lastNameFilterDropdownListRef = useRef(null);
    const [lastNameFilterSearchQuery, setLastNameFilterSearchQuery] = useState('');

    const [phoneFilterDropdownState, setPhoneFilterDropdownState] = useState(false);
    const phoneFilterDropdownListRef = useRef(null);
    const [phoneFilterSearchQuery, setPhoneFilterSearchQuery] = useState('');

    const [emailFilterDropdownState, setEmailFilterDropdownState] = useState(false);
    const emailFilterDropdownListRef = useRef(null);
    const [emailFilterSearchQuery, setEmailFilterSearchQuery] = useState('');

    async function submitAddNewEmployee() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const formData = new FormData();
        formData.append('username', addNewFormData.username);
        formData.append('firstName', addNewFormData.firstName);
        formData.append('lastName', addNewFormData.lastName);
        formData.append('phone', addNewFormData.phone);
        formData.append('email', addNewFormData.email);
        formData.append('password', addNewFormData.password);

        let url = API_URL.BASE + API_URL.EMPLOYEE_MANAGEMENT.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: formData,
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            closeAddNewModal();
        }
    }

    function closeAddNewModal() {
        setAddNewModalState(false);
        setAddNewFormData(prevState => ({
            ...prevState,
            username: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
        }));
        setAddNewInputState(prevState => ({
            ...prevState,
            username: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
        }));
    }

    useEffect(() => {
        loadEmployeeList();
    }, [tokenState.accessToken,
        addNewModalState,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        employeeListSortOrder.username,
        employeeListSortOrder.firstName,
        employeeListSortOrder.lastName,
        employeeListSortOrder.phone,
        employeeListSortOrder.email
    ]);

    async function loadEmployeeList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.EMPLOYEE_MANAGEMENT.BASE + API_URL.EMPLOYEE_MANAGEMENT.CENTER_OWNER + API_URL.EMPLOYEE_MANAGEMENT.LIST;
        let searchParams = new URLSearchParams();
        if (employeeListSortOrder.username) {
            searchParams.append('usernameSortOrder', employeeListSortOrder.username);
        }
        if (employeeListSortOrder.firstName) {
            searchParams.append('firstNameSortOrder', employeeListSortOrder.firstName);
        }
        if (employeeListSortOrder.lastName) {
            searchParams.append('lastNameSortOrder', employeeListSortOrder.lastName);
        }
        if (employeeListSortOrder.phone) {
            searchParams.append('phoneSortOrder', employeeListSortOrder.phone);
        }
        if (employeeListSortOrder.email) {
            searchParams.append('emailSortOrder', employeeListSortOrder.email);
        }

        if (filterDropdownCheckboxState.username && usernameFilterSearchQuery) {
            searchParams.append('username', usernameFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.firstName && firstNameFilterSearchQuery) {
            searchParams.append('firstName', firstNameFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.lastName && lastNameFilterSearchQuery) {
            searchParams.append('lastName', lastNameFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.phone && phoneFilterSearchQuery) {
            searchParams.append('phone', phoneFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.email && emailFilterSearchQuery) {
            searchParams.append('email', emailFilterSearchQuery);
        }

        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setEmployeeList(data.employeeList);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState);
    }, []);

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    useEffect(() => {
        handleClickOutsideElement(usernameFilterDropdownListRef, setUsernameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(firstNameFilterDropdownListRef, setFirstNameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(lastNameFilterDropdownListRef, setLastNameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(phoneFilterDropdownListRef, setPhoneFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(emailFilterDropdownListRef, setEmailFilterDropdownState);
    }, []);

    return (
        <>
        <Header />
        <div className="employee-management-page">
            <div className="employee-management-page__container">
                <div className="employee-management-page__container__header">
                    <div className="employee-management-page__container__header__title">
                        <h5>Employee list</h5>
                    </div>
                    <div className="employee-management-page__container__header__button-group">
                        <div className="employee-management-page__container__header__button-group__left">
                            <div className="employee-management-page__container__header__button-group__left__filter-button">
                                <div className="employee-management-page__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>
                                    Filters
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="employee-management-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="username" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Username
                                    </label>
                                    <label className="employee-management-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="firstName" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> First name
                                    </label>
                                    <label className="employee-management-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="lastName" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Last name
                                    </label>
                                    <label className="employee-management-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="phone" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Phone
                                    </label>
                                    <label className="employee-management-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="email" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Email
                                    </label>
                                </div>
                            </div>
                            <div className="employee-management-page__container__header__button-group__left__username-filter" style={filterDropdownCheckboxState.username ? {} : {display: 'none'}}>
                                <div className="employee-management-page__container__header__button-group__left__username-filter__button" onClick={() => setUsernameFilterDropdownState(true)}>
                                    Ussername filter
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__username-filter__filter-option" style={usernameFilterDropdownState ? {} : {display: 'none'}} ref={usernameFilterDropdownListRef}>
                                    <input type="text" placeholder="Username" onChange={event => setUsernameFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="employee-management-page__container__header__button-group__left__first-name-filter" style={filterDropdownCheckboxState.firstName ? {} : {display: 'none'}}>
                                <div className="employee-management-page__container__header__button-group__left__first-name-filter__button" onClick={() => setFirstNameFilterDropdownState(true)}>
                                    First name filter
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__first-name-filter__filter-option" style={firstNameFilterDropdownState ? {} : {display: 'none'}} ref={firstNameFilterDropdownListRef}>
                                    <input type="text" placeholder="First name" onChange={event => setFirstNameFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="employee-management-page__container__header__button-group__left__last-name-filter" style={filterDropdownCheckboxState.lastName ? {} : {display: 'none'}}>
                                <div className="employee-management-page__container__header__button-group__left__last-name-filter__button" onClick={() => setLastNameFilterDropdownState(true)}>
                                    Last name filter
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__last-name-filter__filter-option" style={lastNameFilterDropdownState ? {} : {display: 'none'}} ref={lastNameFilterDropdownListRef}>
                                    <input type="text" placeholder="Last name" onChange={event => setLastNameFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="employee-management-page__container__header__button-group__left__phone-filter" style={filterDropdownCheckboxState.phone ? {} : {display: 'none'}}>
                                <div className="employee-management-page__container__header__button-group__left__phone-filter__button" onClick={() => setPhoneFilterDropdownState(true)}>
                                    Phone filter
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__phone-filter__filter-option" style={phoneFilterDropdownState ? {} : {display: 'none'}} ref={phoneFilterDropdownListRef}>
                                    <input type="text" placeholder="Phone" onChange={event => setPhoneFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="employee-management-page__container__header__button-group__left__email-filter" style={filterDropdownCheckboxState.email ? {} : {display: 'none'}}>
                                <div className="employee-management-page__container__header__button-group__left__email-filter__button" onClick={() => setEmailFilterDropdownState(true)}>
                                    Email filter
                                </div>
                                <div className="employee-management-page__container__header__button-group__left__email-filter__filter-option" style={emailFilterDropdownState ? {} : {display: 'none'}} ref={emailFilterDropdownListRef}>
                                    <input type="text" placeholder="Email" onChange={event => setEmailFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="employee-management-page__container__header__button-group__right">
                            <div className="employee-management-page__container__header__button-group__right__refresh-button" onClick={() => loadEmployeeList()}>
                                Refresh
                            </div>
                            <div className="employee-management-page__container__header__button-group__right__add-new-button" onClick={() => setAddNewModalState(true)}>
                                Add new
                            </div>
                        </div>
                    </div>
                </div>
                <div className="employee-management-page__container__list">
                    <div className="employee-management-page__container__list__view">
                        <div className="employee-management-page__container__list__view__header">
                            <div className="employee-management-page__container__list__view__header__username" onClick={() => onChangeSortOrder('username', setEmployeeListSortOrder)}>
                                Username {employeeListSortOrder.username ? (employeeListSortOrder.username === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="employee-management-page__container__list__view__header__first-name" onClick={() => onChangeSortOrder('firstName', setEmployeeListSortOrder)}>
                                First name {employeeListSortOrder.firstName ? (employeeListSortOrder.firstName === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="employee-management-page__container__list__view__header__last-name" onClick={() => onChangeSortOrder('lastName', setEmployeeListSortOrder)}>
                                Last name {employeeListSortOrder.lastName ? (employeeListSortOrder.lastName === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="employee-management-page__container__list__view__header__phone" onClick={() => onChangeSortOrder('phone', setEmployeeListSortOrder)}>
                                Phone {employeeListSortOrder.phone ? (employeeListSortOrder.phone === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="employee-management-page__container__list__view__header__email" onClick={() => onChangeSortOrder('email', setEmployeeListSortOrder)}>
                                Email {employeeListSortOrder.email ? (employeeListSortOrder.email === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                        </div>
                        <div className="employee-management-page__container__list__view__content">
                            {employeeList.map(item => (
                                <div className="employee-management-page__container__list__view__content__item" key={item.id}>
                                    <div className="employee-management-page__container__list__view__content__item__username">
                                        {item.employee.username}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__first-name">
                                        {item.employee.firstName}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__last-name">
                                        {item.employee.lastName}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__phone">
                                        {item.employee.phone}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__email">
                                        {item.employee.email}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="employee-management-page__container__pagination">
                    <div className="employee-management-page__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="employee-management-page__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`booking-order-management__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="booking-order-management__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="employee-management-page__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
            <div className="employee-management-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="employee-management-page__add-new-modal__form">
                    <div className="employee-management-page__add-new-modal__form__header">
                        <div className="employee-management-page__add-new-modal__form__header__title">
                            <h5>Add new employee</h5>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__header__close-button" onClick={() => closeAddNewModal()}>
                            Close
                        </div>
                    </div>
                    <div className="employee-management-page__add-new-modal__form__content">
                        <div className="employee-management-page__add-new-modal__form__content__name">
                            <div className="employee-management-page__add-new-modal__form__content__name__first-name">
                                <div className="employee-management-page__add-new-modal__form__content__name__first-name__label">First name</div>
                                <input type="text" placeholder="First name" name="firstName" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__name__first-name__input ${addNewInputState.firstName ? 'input-error' : ''}`} />
                                <div className="employee-management-page__add-new-modal__form__content__name__first-name__error-message input-error-message">{addNewInputState.firstName ? addNewInputState.firstName : ''}</div>
                            </div>
                            <div className="employee-management-page__add-new-modal__form__content__name__last-name">
                                <div className="employee-management-page__add-new-modal__form__content__name__last-name__label">Last name</div>
                                <input type="text" placeholder="Last name" name="lastName" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__name__last-name__input ${addNewInputState.lastName ? 'input-error' : ''}`} />
                                <div className="employee-management-page__add-new-modal__form__content__name__last-name__error-message input-error-message">{addNewInputState.lastName ? addNewInputState.lastName : ''}</div>
                            </div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__username">
                            <div className="employee-management-page__add-new-modal__form__content__username__label">Username</div>
                            <input type="text" placeholder="Username" name="username" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__username__input ${addNewInputState.username ? 'input-error' : ''}`} />
                            <div className="employee-management-page__add-new-modal__form__content__username__error-message input-error-message">{addNewInputState.username ? addNewInputState.username : ''}</div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__email">
                            <div className="employee-management-page__add-new-modal__form__content__email__label">Email</div>
                            <input type="text" placeholder="Email" name="email" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__email__input ${addNewInputState.email ? 'input-error' : ''}`} />
                            <div className="employee-management-page__add-new-modal__form__content__email__error-message input-error-message">{addNewInputState.email ? addNewInputState.email : ''}</div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__phone">
                            <div className="employee-management-page__add-new-modal__form__content__phone__label">Phone</div>
                            <input type="text" placeholder="Phone" name="phone" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__phone__input ${addNewInputState.phone ? 'input-error' : ''}`} />
                            <div className="employee-management-page__add-new-modal__form__content__phone__error-message input-error-message">{addNewInputState.phone ? addNewInputState.phone : ''}</div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__password">
                            <div className="employee-management-page__add-new-modal__form__content__password__label">Password</div>
                            <input type="password" placeholder="Password" name="password" onChange={event => handleInputChange(event, setAddNewFormData)} className={`employee-management-page__add-new-modal__form__content__password__input ${addNewInputState.password ? 'input-error' : ''}`} />
                            <div className="employee-management-page__add-new-modal__form__content__password__error-message input-error-message">{addNewInputState.password ? addNewInputState.password : ''}</div>
                        </div>
                    </div>
                    <div className="employee-management-page__add-new-modal__form__footer">
                        <div className="employee-management-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewEmployee()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}