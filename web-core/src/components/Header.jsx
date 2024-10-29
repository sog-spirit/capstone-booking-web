import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/consts/APIConsts";
import { HTTP_STATUS } from "../utils/consts/HttpStatusCode";
import { defaultErrorToastNotification, defaultSuccessToastNotification } from "../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../utils/consts/MessageConsts";
import { ACCESS_TOKEN, HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, REFRESH_TOKEN, ROLE_NAME } from "../utils/consts/HttpRequestConsts";
import { LoginContext, TokenContext } from "../App";
import { PAGE_URL } from "../utils/consts/PageURLConsts";

export default function Header() {
    const [dropdownState, setDropdownState] = useState({
        dropdown1: false,
        dropdown2: false,
    });
    const [navButtonFocusIndexState, setNavButtonFocusIndexState] = useState(1);
    const navigate = useNavigate();
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);

    async function handleLogout() {
        let bodyData = {
            refreshToken: localStorage.getItem(REFRESH_TOKEN),
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

        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ROLE_NAME);
        setLoginState(prevState => ({
            ...prevState,
            isLogin: false,
        }));
        setTokenState(prevState => ({
            ...prevState,
            accessToken: '',
            refreshToken: '',
        }));
        defaultSuccessToastNotification(MESSAGE_CONSTS.LOGOUT_SUCCESS);
        navigate(PAGE_URL.HOME);
    }

    return (
        <div className="header">
            <div className="header__container">
                <div className="header__container__left-group">
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown1: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown1: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 1 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(1)}>
                            Dropdown #1
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown1 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #1
                            </div>
                        </div>
                    </div>
                    <div className="header__container__left-group__dropdown-group"
                    onMouseEnter={() => setDropdownState(prevState => ({...prevState, dropdown2: true}))}
                    onMouseLeave={() => setDropdownState(prevState => ({...prevState, dropdown2: false}))}>
                        <div className={`header__container__left-group__dropdown-group__button${navButtonFocusIndexState === 2 ? '--active' : ''}`}
                            onClick={() => setNavButtonFocusIndexState(2)}>
                            Dropdown #2
                        </div>
                        <div className={`header__container__left-group__dropdown-group__list${dropdownState.dropdown2 ? '--active' : ''}`}>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #1
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #2
                            </div>
                            <div className="header__container__left-group__dropdown-group__list__item">
                                Dropdown item #3
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header__container__right-group">
                    {
                    loginState.isLogin
                    ?
                    (
                    <>
                    <div className="header__container__right-group__user-button">
                        Welcome, user
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