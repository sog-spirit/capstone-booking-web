import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

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

    useEffect(() => {
        loadEmployeeList();
    }, [tokenState.accessToken, addNewModalState]);

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

        const response = await fetch(API_URL.BASE + API_URL.EMPLOYEE_MANAGEMENT.BASE, {
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

    async function loadEmployeeList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.EMPLOYEE_MANAGEMENT.BASE + API_URL.EMPLOYEE_MANAGEMENT.LIST, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setEmployeeList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="employee-management-page">
            <div className="employee-management-page__container">
                <div className="employee-management-page__container__header">
                    <div className="employee-management-page__container__header__search-input">
                        Search
                    </div>
                    <div className="employee-management-page__container__header__button-group">
                        <div className="employee-management-page__container__header__button-group__refresh-button" onClick={() => loadEmployeeList()}>
                            Refresh
                        </div>
                        <div className="employee-management-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="employee-management-page__container__list">
                    <div className="employee-management-page__container__list__title">
                        <h5>Employee list</h5>
                    </div>
                    <div className="employee-management-page__container__list__view">
                        <div className="employee-management-page__container__list__view__header">
                            <div className="employee-management-page__container__list__view__header__username">
                                Username
                            </div>
                            <div className="employee-management-page__container__list__view__header__first-name">
                                First name
                            </div>
                            <div className="employee-management-page__container__list__view__header__last-name">
                                Last name
                            </div>
                            <div className="employee-management-page__container__list__view__header__phone">
                                Phone
                            </div>
                            <div className="employee-management-page__container__list__view__header__email">
                                Email
                            </div>
                        </div>
                        <div className="employee-management-page__container__list__view__content">
                            {employeeList.map(item => (
                                <div className="employee-management-page__container__list__view__content__item" key={item.id}>
                                    <div className="employee-management-page__container__list__view__content__item__username">
                                        {item.employeeUsername}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__first-name">
                                        {item.employeeFirstName}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__last-name">
                                        {item.employeeLastName}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__phone">
                                        {item.employeePhone}
                                    </div>
                                    <div className="employee-management-page__container__list__view__content__item__email">
                                        {item.employeeEmail}
                                    </div>
                                </div>
                            ))}
                        </div>
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