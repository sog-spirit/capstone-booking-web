import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { BASE_API_URL, CENTER_URL } from "../../utils/consts/APIConsts";
import { HTTP_REQUEST_HEADER, HTTP_REQUEST_METHOD } from "../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../utils/consts/MessageConsts";
import { LoginContext } from "../../App";

export default function CenterManagement() {
    useEffect(() => {
        setAddNewFormData(prevData => ({
            ...prevData,
            accessToken: loginContext.loginState.accessToken,
        }));
    }, []);

    const [addNewModalState, setAddNewModalState] = useState(false);

    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        address: '',
        accessToken: '',
    });

    const [addNewInputStatus, setAddNewInputState] = useState({
        name: '',
        address: '',
    });

    const loginContext = useContext(LoginContext);

    function handleInputChange(event) {
        let { name, value } = event.target;
        setAddNewFormData( prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function submitAddNewData() {
        const response = await fetch(BASE_API_URL + CENTER_URL.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: HTTP_REQUEST_HEADER.CONTENT_TYPE_APPLICATION_JSON,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
        }
    }

    return (
        <>
        <Header />
        <div className="center-management-page">
            <div className="center-management-page__container">
                <div className="center-management-page__container__header">
                    <div className="center-management-page__container__header__title">
                        <div className="center-management-page__container__header__title__label">
                            <h4>Center management</h4>
                        </div>
                        <div className="center-management-page__container__header__title__description">
                            Description
                        </div>
                    </div>
                    <div className="center-management-page__container__header__button-group">
                        <div className="center-management-page__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                        <div className="center-management-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="center-management-page__container__center-list">
                    <div className="center-management-page__container__center-list__title">
                        <h5>Center list</h5>
                    </div>
                    <div className="center-management-page__container__center-list__list">
                        <div className="center-management-page__container__center-list__list__item">
                            <div className="center-management-page__container__center-list__list__item__img">
                                <img src={'/no-image.jpg'} />
                            </div>
                            <div className="center-management-page__container__center-list__list__item__detail">
                                <div className="center-management-page__container__center-list__list__item__detail__name">
                                    Name
                                </div>
                                <div className="center-management-page__container__center-list__list__item__detail__address">
                                    Address
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-management-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="center-management-page__add-new-modal__form">
                    <div className="center-management-page__add-new-modal__form__header">
                        <div className="center-management-page__add-new-modal__form__header__title">
                            <h5>Add new center</h5>
                        </div>
                        <div className="center-management-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-management-page__add-new-modal__form__content">
                        <div className="center-management-page__add-new-modal__form__content__name">
                            <div className="center-management-page__add-new-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" onChange={event => handleInputChange(event)} className={`center-management-page__add-new-modal__form__content__name__input ${addNewInputStatus.name ? 'input-error' : ''}`} />
                            <div className="center-management-page__add-new-modal__form__content__name__error-message input-error-message">{addNewInputStatus.name ? addNewInputStatus.name : ''}</div>
                        </div>
                        <div className="center-management-page__add-new-modal__form__content__address">
                        <div className="center-management-page__add-new-modal__form__content__address__label">Address</div>
                            <input type="text" placeholder="Address" name="address" onChange={event => handleInputChange(event)} className={`center-management-page__add-new-modal__form__content__address__input ${addNewInputStatus.address ? 'input-error' : ''}`} />
                            <div className="center-management-page__add-new-modal__form__content__address__error-message input-error-message">{addNewInputStatus.address ? addNewInputStatus.address : ''}</div>
                        </div>
                    </div>
                    <div className="center-management-page__add-new-modal__form__footer">
                        <div className="center-management-page__add-new-modal__form__footer__create-button" onClick={() => submitAddNewData()}>
                            Create
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}