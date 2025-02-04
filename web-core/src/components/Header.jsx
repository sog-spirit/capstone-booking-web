import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/consts/APIConsts";
import { HTTP_STATUS } from "../utils/consts/HttpStatusCode";
import { defaultErrorToastNotification, defaultSuccessToastNotification } from "../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, LOGIN_STATE_CONSTS } from "../utils/consts/HttpRequestConsts";
import { LoginContext, TokenContext } from "../App";
import { PAGE_URL } from "../utils/consts/PageURLConsts";
import { USER_ROLE } from "../utils/consts/UserRoleConsts";
import { refreshAccessToken } from "../utils/jwt/JwtUtils";
import { handleClickOutsideElement, handleInputChange } from "../utils/input/InputUtils";
import { faL, faSoccerBall } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
    const [dropdownState, setDropdownState] = useState({
        dropdown1: false,
    });
    const [navButtonFocusIndexState, setNavButtonFocusIndexState] = useState(1);
    const navigate = useNavigate();
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [userMenuState, setUserMenuState] = useState(false);
    const userMenuRef = useRef(null);

    const [userInfoModalState, setUserInfoModalState] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [userInfoEditData, setUserInfoEditData] = useState({
        firstName: '',
        lastName: '',
    });

    const [editPasswordModalState, setEditPasswordModalState] = useState(false);
    const [editPasswordFormData, setEditPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })

    async function handleLogout() {
        let bodyData = {
            refreshToken: localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN),
        };
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.JWT.BASE + API_URL.JWT.LOG_OUT;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(bodyData),
        });
    
        if (response.status === HTTP_STATUS.BAD_REQUEST) {
            defaultErrorToastNotification(MESSAGE_CONSTS.INVALID_ACTION);
            return;
        }

        localStorage.removeItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN);
        localStorage.removeItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN);
        localStorage.removeItem(LOGIN_STATE_CONSTS.ROLE);
        setLoginState(prevState => ({
            ...prevState,
            isLogin: false,
            username: '',
            userRole: '',
        }));
        setTokenState(prevState => ({
            ...prevState,
            accessToken: '',
            refreshToken: '',
        }));
        defaultSuccessToastNotification(MESSAGE_CONSTS.LOGOUT_SUCCESS);
        navigate(PAGE_URL.HOME);
    }

    function navigateUserCenterPage() {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE);
    }

    function navigateUserCenterReviewPage() {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_REVIEW);
    }

    function navigateUserBookingOrderListPage() {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.BOOKING_ORDER_LIST);
    }

    function navigateCenterOwnerCenterPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE);
    }

    function navigateCenterOwnerProductPage () {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_PAGE);
    }

    function navigateCenterOwnerProductInventoryPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_INVENTORY_PAGE);
    }

    function navigateCenterOwnerEmployeeManagementPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.EMPLOYEE_MANAGEMENT_PAGE);
    }

    function navigateCenterOwnerBookingOrderManagementPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.BOOKING_ORDER_MANAGEMENT);
    }

    function navigateCenterOwnerCenterReviewPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_REVIEW);
    }

    function navigateCenterOwnerProductOrderPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_ORDER);
    }

    function navigateCenterOwnerStatisticsPage() {
        navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.STATISTICS);
    }

    function navigateAdminAccountManagement() {
        navigate(PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.ACCOUNT_MANAGEMENT);
    }

    function navigateAdminContentManagement() {
        navigate(PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.CONTENT_MANAGEMENT);
    }

    function navigateAdminReportManagement() {
        navigate(PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.REPORT_MANAGEMENT);
    }

    useEffect(() => {
        loadUserInfo();
    }, [userInfoModalState]);

    async function loadUserInfo() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.USER.BASE + API_URL.USER.INFO;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserInfo(data);
            setUserInfoEditData({
                firstName: data.firstName,
                lastName: data.lastName,
            });
        }
    }

    async function submitEditUserData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.USER.BASE + API_URL.USER.INFO;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(userInfoEditData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setUserInfoModalState(false);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(userMenuRef, setUserMenuState);
    }, []);

    async function submitPasswordEditData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.USER.BASE + API_URL.USER.PASSWORD;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(editPasswordFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setEditPasswordModalState(false);
        }
    }

    return (
        <div className="header">
            <div className="header__container">
                <div className="header__container__left-group">
                    <div className="header__container__left-group__icon" onClick={() => navigate(PAGE_URL.HOME)}>
                        <FontAwesomeIcon icon={faSoccerBall} />
                    </div>
                    {loginState.userRole === USER_ROLE.USER && <>
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown1: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown1: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 1 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(1)}>
                            User
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown1 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateUserCenterPage()}>
                                Center
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateUserCenterReviewPage()}>
                                Center review
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateUserBookingOrderListPage()}>
                                Booking order list
                            </div>
                        </div>
                    </div>
                    </>
                    }
                    {loginState.userRole === USER_ROLE.ADMIN && <>
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown1: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown1: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 1 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(1)}>
                            Admin
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown1 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateAdminAccountManagement()}>
                                Account management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateAdminContentManagement()}>
                                Content management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateAdminReportManagement()}>
                                Report management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigate(PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.STATISTICS)}>
                                Statistics
                            </div>
                        </div>
                    </div>
                    </>
                    }
                    {loginState.userRole === USER_ROLE.CENTER_OWNER && <>
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown1: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown1: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 1 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(1)}>
                            Center owner
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown1 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerBookingOrderManagementPage()}>
                                Booking order management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerCenterPage()}>
                                Center
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerCenterReviewPage()}>
                                Center review
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerProductInventoryPage()}>
                                Product inventory
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerProductOrderPage()}>
                                Product order
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerProductPage()}>
                                Product page
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item" onClick={() => navigateCenterOwnerStatisticsPage()}>
                                Statistics
                            </div>
                        </div>
                    </div>
                    </>
                    }
                </div>
                <div className="header__container__right-group">
                    {
                    loginState.isLogin
                    ?
                    (
                    <>
                    <div className="header__container__right-group__user">
                        <div className="header__container__right-group__user__button" onClick={() => setUserMenuState(true)}>
                            Welcome, {loginState.username}
                        </div>
                        <div className="header__container__right-group__user__option" style={userMenuState ? {} : {display: 'none'}} ref={userMenuRef}>
                            <div className="header__container__right-group__user__option__item" onClick={() => setUserInfoModalState(true)}>
                                User details
                            </div>
                            <div className="header__container__right-group__user__option__item" onClick={() => setEditPasswordModalState(true)}>
                                Change password
                            </div>
                        </div>
                    </div>
                    <div className="header__container__right-group__logout-button" onClick={() => handleLogout()}>
                        Logout
                    </div>
                    </>)
                    :
                    (<>
                    <div className="header__container__right-group__login-button" onClick={() => navigate(PAGE_URL.LOGIN)}>
                        Login
                    </div>
                    <div className="header__container__right-group__register-button" onClick={() => navigate(PAGE_URL.REGISTER)}>
                        Register
                    </div>
                    </>)
                    }
                </div>
            </div>
            <div className="header__user-info-modal" style={userInfoModalState ? {} : {display: 'none'}}>
                <div className="header__user-info-modal__form">
                    <div className="header__user-info-modal__form__header">
                        <div className="header__user-info-modal__form__header__title">
                            <h5>User detail</h5>
                        </div>
                        <div className="header__user-info-modal__form__header__close-button" onClick={() => setUserInfoModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="header__user-info-modal__form__content">
                        <div className="header__user-info-modal__form__content__username">
                            <div className="header__user-info-modal__form__content__username__label">
                                Username:
                            </div>
                            <div className="header__user-info-modal__form__content__username__content">
                                {userInfo.username}
                            </div>
                        </div>
                        <div className="header__user-info-modal__form__content__name">
                            <div className="header__user-info-modal__form__content__name__last-name">
                                <div className="header__user-info-modal__form__content__name__last-name__label">
                                    Last name:
                                </div>
                                <div className="header__user-info-modal__form__content__name__last-name__content">
                                    <input type="text" placeholder="Last name" value={userInfoEditData.lastName} name="lastName" onChange={event => handleInputChange(event, setUserInfoEditData)} />
                                </div>
                            </div>
                            <div className="header__user-info-modal__form__content__name__first-name">
                                <div className="header__user-info-modal__form__content__name__first-name__label">
                                    First name:
                                </div>
                                <div className="header__user-info-modal__form__content__name__last-name__content">
                                    <input type="text" placeholder="First name" value={userInfoEditData.firstName} name="firstName" onChange={event => handleInputChange(event, setUserInfoEditData)} />
                                </div>
                            </div>
                        </div>
                        <div className="header__user-info-modal__form__content__email">
                            <div className="header__user-info-modal__form__content__email__label">
                                Email:
                            </div>
                            <div className="header__user-info-modal__form__content__email__content">
                                {userInfo.email}
                            </div>
                        </div>
                        <div className="header__user-info-modal__form__content__phone">
                            <div className="header__user-info-modal__form__content__phone__label">
                                Phone:
                            </div>
                            <div className="header__user-info-modal__form__content__phone__content">
                                {userInfo.phone}
                            </div>
                        </div>
                    </div>
                    <div className="header__user-info-modal__form__footer">
                        <div className="header__user-info-modal__form__footer__save-button" onClick={() => submitEditUserData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
            <div className="header__change-password-modal" style={editPasswordModalState ? {} : {display: 'none'}}>
                <div className="header__change-password-modal__form">
                    <div className="header__change-password-modal__form__header">
                        <div className="header__change-password-modal__form__header__title">
                            <h5>Change password</h5>
                        </div>
                        <div className="header__change-password-modal__form__header__close-button" onClick={() => setEditPasswordModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="header__change-password-modal__form__content">
                        <div className="header__change-password-modal__form__content__current-password">
                            <div className="header__change-password-modal__form__content__current-password__label">
                                Current password
                            </div>
                            <div className="header__change-password-modal__form__content__current-password__value">
                                <input type="password" placeholder="Current password" name="currentPassword" onChange={event => handleInputChange(event, setEditPasswordFormData)} />
                            </div>
                        </div>
                        <div className="header__change-password-modal__form__content__new-password">
                            <div className="header__change-password-modal__form__content__new-password__label">
                                New password
                            </div>
                            <div className="header__change-password-modal__form__content__new-password__value">
                                <input type="password" placeholder="New password" name="newPassword" onChange={event => handleInputChange(event, setEditPasswordFormData)} />
                            </div>
                        </div>
                        <div className="header__change-password-modal__form__content__confirm-new-password">
                            <div className="header__change-password-modal__form__content__confirm-new-password__label">
                                Confirm new password
                            </div>
                            <div className="header__change-password-modal__form__content__confirm-new-password__value">
                                <input type="password" placeholder="Confirm new password" name="confirmNewPassword" onChange={event => handleInputChange(event, setEditPasswordFormData)} />
                            </div>
                        </div>
                    </div>
                    <div className="header__change-password-modal__form__footer">
                        <div className="header__change-password-modal__form__footer__save-button" onClick={() => submitPasswordEditData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}