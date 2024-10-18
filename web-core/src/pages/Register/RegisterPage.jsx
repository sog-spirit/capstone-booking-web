import { useEffect, useState } from "react";
import { BASE_API_URL, ROLE_URL, USER_URL } from "../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../utils/consts/PageURLConsts";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { HTTP_REQUEST_HEADER, HTTP_REQUEST_METHOD } from "../../utils/consts/HttpRequestConsts";
import Header from "../../components/Header";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    const [inputStatus, setInputStatus] = useState({
        firstName: '',
        lastName: '',
        role: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    const [registerRoleList, setRegisterRoleList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadRegisterListRole();
    }, []);

    function handleInputChange(event) {
        console.log(event);
        let { name, value } = event.target;
        setFormData( prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function submitData() {
        console.log(formData);
        const response = await fetch(BASE_API_URL + USER_URL.BASE + USER_URL.REGISTER, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            return;
        }

        if (response.status === HTTP_STATUS.BAD_REQUEST || response.status === HTTP_STATUS.CONFLICT) {
            const data = await response.json();
            console.log(data);
            setInputStatus({
                firstName: data?.firstName,
                lastName: data?.lastName,
                username: data?.username,
                role: data?.role,
                email: data?.email,
                phone: data?.phone,
                password: data?.password,
            });
        } else if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.REGISTER_SUCCESS);
            navigate(PAGE_URL.HOME);
        }
    }

    async function loadRegisterListRole() {
        const response = await fetch(BASE_API_URL + ROLE_URL.BASE + ROLE_URL.REGISTER_ROLE_LIST, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
        });

        const data = await response.json();
        if (response.status === HTTP_STATUS.OK) {
            setRegisterRoleList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="register-page">
            <div className="register-page__form-container">
                <div className="register-page__form-container__form">
                    <div className="register-page__form-container__form__title">
                        <h3>Register</h3>
                    </div>
                    <div className="register-page__form-container__form__name">
                        <div className="register-page__form-container__form__name__first">
                            <div className="register-page__form-container__form__name__first__label">First name</div>
                            <input type="text" placeholder="First name" className={`register-page__form-container__form__name__first__input ${inputStatus.firstName ? 'input-error' : ''}`} name="firstName" onChange={event => handleInputChange(event)} />
                            <div className="register-page__form-container__form__name__first__error-message input-error-message">{inputStatus.firstName ? inputStatus.firstName : ''}</div>
                        </div>
                        <div className="register-page__form-container__form__name__last">
                            <div className="register-page__form-container__form__name__last__label">Last name</div>
                            <input type="text" placeholder="Last name" className={`register-page__form-container__form__name__last__input ${inputStatus.lastName ? 'input-error' : ''}`} name="lastName" onChange={event => handleInputChange(event)} />
                            <div className="register-page__form-container__form__name__last__error-message input-error-message">{inputStatus.lastName ? inputStatus.lastName : ''}</div>
                        </div>
                    </div>
                    <div className="register-page__form-container__form__role">
                        <div className="register-page__form-container__form__role__label">Role</div>
                        <select className={`register-page__form-container__form__role__select ${inputStatus.role ? 'input-error' : ''}`} name="role" onChange={event => handleInputChange(event)} value={formData.role}>
                            <option className={inputStatus.role ? 'input-error' : ''} key={0} value={0}>Please select role</option>
                            {registerRoleList.map(item => (<option className={inputStatus.role ? 'input-error' : ''} key={item.id} value={item.id}>{item.name}</option>))}
                        </select>
                        <div className="register-page__form-container__form__role__error-message input-error-message">{inputStatus.role ? inputStatus.role : ''}</div>
                    </div>
                    <div className="register-page__form-container__form__username">
                        <div className="register-page__form-container__form__username__label">Username</div>
                        <input type="text" placeholder="Username" className={`register-page__form-container__form__username__input ${inputStatus.username ? 'input-error' : ''}`} name="username" onChange={event => handleInputChange(event)} />
                        <div className="register-page__form-container__form__username__error-message input-error-message">{inputStatus.username ? inputStatus.username : ''}</div>
                    </div>
                    <div className="register-page__form-container__form__email">
                        <div className="register-page__form-container__form__email__label">Email</div>
                        <input type="text" placeholder="Email" className={`register-page__form-container__form__email__input ${inputStatus.email ? 'input-error' : ''}`} name="email" onChange={event => handleInputChange(event)} />
                        <div className="register-page__form-container__form__email__error-message input-error-message">{inputStatus.email ? inputStatus.email : ''}</div>
                    </div>
                    <div className="register-page__form-container__form__phone">
                        <div className="register-page__form-container__form__phone__label">Phone</div>
                        <input type="text" placeholder="Phone" className={`register-page__form-container__form__phone__input ${inputStatus.phone ? 'input-error' : ''}`} name="phone" onChange={event => handleInputChange(event)} />
                        <div className="register-page__form-container__form__email__error-message input-error-message">{inputStatus.phone ? inputStatus.phone : ''}</div>
                    </div>
                    <div className="register-page__form-container__form__password">
                        <div className="register-page__form-container__form__password__label">Password</div>
                        <input type="password" placeholder="Password" className={`register-page__form-container__form__password__input ${inputStatus.password ? 'input-error' : ''}`} name="password" onChange={event => handleInputChange(event)} />
                        <div className="register-page__form-container__form__password__error-message input-error-message">{inputStatus.password ? inputStatus.password : ''}</div>
                    </div>
                    <div className="register-page__form-container__form__login-alt">
                        Already have an account? Sign in
                    </div>
                    <div className="register-page__form-container__form__register-button" onClick={submitData}>
                        Register
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}