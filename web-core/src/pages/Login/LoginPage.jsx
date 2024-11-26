import { useContext, useState } from "react";
import { API_URL } from "../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../utils/consts/PageURLConsts";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD, LOGIN_STATE_CONSTS } from "../../utils/consts/HttpRequestConsts";
import Header from "../../components/Header";
import { LoginContext, TokenContext } from "../../App";
import { handleInputChange } from "../../utils/input/InputUtils";

export default function LoginPage() {
    const {loginState, setLoginState} = useContext(LoginContext);
    const {tokenState, setTokenState} = useContext(TokenContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [inputStatus, setInputStatus] = useState({
        username: '',
        password: '',
    });

    async function submitData() {
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.USER.BASE + API_URL.USER.LOGIN;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            return;
        }

        const data = await response.json();
        if (response.status === HTTP_STATUS.UNAUTHORIZED || response.status === HTTP_STATUS.BAD_REQUEST) {
            setInputStatus({
                username: data?.username,
                password: data?.password,
            });
        } else if (response.status === HTTP_STATUS.OK) {
            localStorage.setItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN, data?.accessToken);
            localStorage.setItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN, data?.refreshToken);
            localStorage.setItem(LOGIN_STATE_CONSTS.ROLE, data?.role);
            localStorage.setItem(LOGIN_STATE_CONSTS.USERNAME, data?.username);
            defaultSuccessToastNotification(MESSAGE_CONSTS.LOGIN_SUCCESS);
            setLoginState(prevState => ({
                ...prevState,
                userRole: data?.role,
                username: data?.username,
                isLogin: true,
            }));
            setTokenState(prevState => ({
                ...prevState,
                accessToken: data?.accessToken,
                refreshToken: data?.refreshToken,
            }));
            navigate(PAGE_URL.HOME);
        }
    }

    return (
        <>
        <Header />
        <div className="login-page">
            <div className="login-page__form-container">
                <div className="login-page__form-container__form">
                    <div className="login-page__form-container__form__title">
                        <h3>Login</h3>
                    </div>
                    <div className="login-page__form-container__form__username">
                        <div className="login-page__form-container__form__username__label">Username</div>
                        <input type="text" placeholder="Username" className={`login-page__form-container__form__username__input ${inputStatus.username ? 'input-error' : ''}`} name="username" onChange={event => handleInputChange(event, setFormData)} />
                        <div className="login-page__form-container__form__username__error-message input-error-message">{inputStatus.username ? inputStatus.username : ''}</div>
                    </div>
                    <div className="login-page__form-container__form__password">
                        <div className="login-page__form-container__form__password__label">Password</div>
                        <input type="password" placeholder="Password" className={`login-page__form-container__form__password__input ${inputStatus.password ? 'input-error' : ''}`} name="password" onChange={event => handleInputChange(event, setFormData)} />
                        <div className="login-page__form-container__form__password__error-message input-error-message">{inputStatus.password ? inputStatus.password : ''}</div>
                    </div>
                    <div className="login-page__form-container__form__text-group">
                        <div className="login-page__form-container__form__text-group__forgot-password">
                            Forgot password?
                        </div>
                        <div className="login-page__form-container__form__text-group__register-account">
                            Create new account
                        </div>
                    </div>
                    <div className="login-page__form-container__form__login-button" onClick={submitData}>
                        Login
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}