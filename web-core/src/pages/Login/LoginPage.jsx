import { useContext, useState } from "react";
import { BASE_API_URL, USER_URL } from "../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../utils/consts/PageURLConsts";
import { LoginContext } from "../../App";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER, HTTP_REQUEST_METHOD, REFRESH_TOKEN, ROLE_NAME } from "../../utils/consts/HttpRequestConsts";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [inputStatus, setInputStatus] = useState({
        username: '',
        password: '',
    });

    function handleInputChange(event) {
        let { name, value } = event.target;
        setFormData( prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const navigate = useNavigate();

    const loginContext = useContext(LoginContext);

    async function submitData() {
        const response = await fetch(BASE_API_URL + USER_URL.BASE + USER_URL.LOGIN, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
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
            loginContext.setLoginState({
                accessToken: data?.accessToken,
            });
            localStorage.setItem(REFRESH_TOKEN, data?.refreshToken);
            localStorage.setItem(ROLE_NAME, data?.role);
            defaultSuccessToastNotification(MESSAGE_CONSTS.LOGIN_SUCCESS);
            navigate(PAGE_URL.HOME);
        }
    }

    return (
        <div className="login-page">
            <div className="login-page__form-container">
                <div className="login-page__form-container__form">
                    <div className="login-page__form-container__form__title">
                        <h3>Login</h3>
                    </div>
                    <div className="login-page__form-container__form__username">
                        <div className="login-page__form-container__form__username__label">Username</div>
                        <input type="text" placeholder="Username" className={`login-page__form-container__form__username__input ${inputStatus.username ? 'input-error' : ''}`} name="username" onChange={event => handleInputChange(event)} />
                        <div className="login-page__form-container__form__username__error-message input-error-message">{inputStatus.username ? inputStatus.username : ''}</div>
                    </div>
                    <div className="login-page__form-container__form__password">
                        <div className="login-page__form-container__form__password__label">Password</div>
                        <input type="password" placeholder="Password" className={`login-page__form-container__form__password__input ${inputStatus.password ? 'input-error' : ''}`} name="password" onChange={event => handleInputChange(event)} />
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
    );
}