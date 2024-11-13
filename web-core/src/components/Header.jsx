import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/consts/APIConsts";
import { HTTP_STATUS } from "../utils/consts/HttpStatusCode";
import { defaultErrorToastNotification, defaultSuccessToastNotification } from "../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, LOGIN_STATE_CONSTS } from "../utils/consts/HttpRequestConsts";
import { LoginContext, TokenContext } from "../App";
import { PAGE_URL } from "../utils/consts/PageURLConsts";
import { USER_ROLE } from "../utils/consts/UserRoleConsts";

export default function Header() {
    const [dropdownState, setDropdownState] = useState({
        dropdown1: false,
    });
    const [navButtonFocusIndexState, setNavButtonFocusIndexState] = useState(1);
    const navigate = useNavigate();
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);

    async function handleLogout() {
        let bodyData = {
            refreshToken: localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN),
        };
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const response = await fetch(API_URL.BASE + API_URL.JWT.BASE + API_URL.JWT.LOG_OUT, {
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

    return (
        <div className="header">
            <div className="header__container">
                <div className="header__container__left-group">
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
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #1
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
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Booking order management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Center
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Center review
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Court
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Employee management
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Product inventory
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Product order
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Product page
                            </div>
                        </div>
                    </div>
                    </>
                    }
                    {loginState.userRole === USER_ROLE.EMPLOYEE && <>
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown1: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown1: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 1 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(1)}>
                            Employee
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown1 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #1
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
                    <div className="header__container__right-group__user-button">
                        Welcome, {loginState.username}
                    </div>
                    <div className="header__container__right-group__logout-button" onClick={() => handleLogout()}>
                        Logout
                    </div>
                    </>)
                    :
                    (<>
                    <div className="header__container__right-group__login-button" onClick={() => navigate(PAGE_URL.LOGIN)}>
                        Log in
                    </div>
                    <div className="header__container__right-group__register-button" onClick={() => navigate(PAGE_URL.REGISTER)}>
                        Register
                    </div>
                    </>)
                    }
                </div>
            </div>
        </div>
    );
}