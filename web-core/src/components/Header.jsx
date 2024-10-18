import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL, JWT_URL, USER_URL } from "../utils/consts/APIConsts";
import { LoginContext } from "../App";
import { HTTP_STATUS } from "../utils/consts/HttpStatusCode";
import { defaultErrorToastNotification, defaultSuccessToastNotification } from "../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER, HTTP_REQUEST_METHOD, REFRESH_TOKEN, ROLE_NAME } from "../utils/consts/HttpRequestConsts";
import { PAGE_URL } from "../utils/consts/PageURLConsts";

export default function Header() {
    useEffect(() => {
        getAccessToken();
    }, []);

    const [dropdownState, setDropdownState] = useState({
        dropdown1: false,
        dropdown2: false,
    });

    const [navButtonFocusIndexState, setNavButtonFocusIndexState] = useState(1);

    const navigate = useNavigate();

    const loginContext = useContext(LoginContext);

    async function handleLogout() {
        let bodyData = {
            refreshToken: localStorage.getItem(REFRESH_TOKEN),
        };
        const response = await fetch(BASE_API_URL + JWT_URL.BASE + JWT_URL.LOG_OUT, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
            body: JSON.stringify(bodyData),
        });
    
        if (response.status === HTTP_STATUS.BAD_REQUEST) {
            defaultErrorToastNotification(MESSAGE_CONSTS.INVALID_ACTION);
            return;
        }

        loginContext.setLoginState({
            accessToken: '',
        });
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ROLE_NAME);
        defaultSuccessToastNotification(MESSAGE_CONSTS.LOGOUT_SUCCESS);
    }

    async function getAccessToken() {
        let submitData = {
            refreshToken: localStorage.getItem(REFRESH_TOKEN),
        };
        const response = await fetch(BASE_API_URL + JWT_URL.BASE + JWT_URL.REFRESH, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
            body: JSON.stringify(submitData),
        });
        if (response.status === HTTP_STATUS.OK) {
            const data = await response.json();
            console.log(data);
            loginContext.setLoginState({
                accessToken: data?.accessToken,
            });
        } else {
            navigate(PAGE_URL.HOME);
        }
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
                    loginContext.loginState.accessToken
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
                    <div className="header__container__right-group__login-button" onClick={() => navigate(USER_URL.LOGIN)}>
                        Log in
                    </div>
                    <div className="header__container__right-group__register-button" onClick={() => navigate(USER_URL.REGISTER)}>
                        Register
                    </div>
                    </>)
                    }
                </div>
            </div>
        </div>
    );
}