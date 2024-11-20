import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { useParams } from "react-router-dom";

export default function CourtCenterOwnerPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const {centerId} = useParams();

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        name: '',
        centerId: centerId,
    });
    const [addNewInputState, setAddNewInputState] = useState({
        name: '',
    });

    const [courtListState, setCourtListState] = useState([]);

    const [editModalState, setEditModalState] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        id: 0,
    });
    const [editInputState, setEditInputState] = useState({
        name: '',
    });

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setAddNewModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewFormData(prevState => ({
                ...prevState,
                name: '',
            }));
            setAddNewInputState(prevState => ({
                ...prevState,
                name: '',
            }));
            loadCourtList();
        }
    }

    useEffect(() => {
        loadCourtList();
    }, [tokenState.accessToken]);

    async function loadCourtList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT.BASE + `?centerId=${centerId}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtListState(data);
        }
    }

    function openEditModal(courtId) {
        let courtRecord = courtListState.find(item => item.id === courtId);
        setEditFormData(prevState => ({
            ...prevState,
            id: courtRecord?.id,
            name: courtRecord?.name,
        }));
        setEditModalState(true);
    }

    async function submitEditData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT.BASE, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(editFormData), 
        });

        if (response.status === HTTP_STATUS.OK) {
            setEditModalState(false);
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            setEditFormData(prevState => ({
                ...prevState,
                id: 0,
                name: '',
            }));
            setEditInputState(prevState => ({
                ...prevState,
                name: '',
            }));
            loadCourtList();
        }
    }

    return(
        <>
        <Header />
        <div className="center-detail-page">
            <div className="center-detail-page__container">
                <div className="center-detail-page__container__header">
                    <div className="center-detail-page__container__header__title">
                        <div className="center-detail-page__container__header__title__label">
                            <h4>Center detail</h4>
                        </div>
                        <div className="center-detail-page__container__header__title__description">
                            Description
                        </div>
                    </div>
                    <div className="center-detail-page__container__header__button-group">
                        <div className="center-detail-page__container__header__button-group__refresh-button" onClick={() => loadCourtList()}>
                            Refresh
                        </div>
                        <div className="center-detail-page__container__header__button-group__add-new-button" onClick={() => setAddNewModalState(true)}>
                            Add new
                        </div>
                    </div>
                </div>
                <div className="center-detail-page__container__court-list">
                    <div className="center-detail-page__container__court-list__title">
                        <h5>Court list</h5>
                    </div>
                    <div className="center-detail-page__container__court-list__list">
                        {courtListState.map(item => (
                        <div className="center-detail-page__container__court-list__list__item" key={item.id}>
                            <div className="center-detail-page__container__court-list__list__item__header">
                                <div className="center-detail-page__container__court-list__list__item__header__label-group">
                                    <div className="center-detail-page__container__court-list__list__item__header__label-group__name">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="center-detail-page__container__court-list__list__item__header__button-group">
                                    <div className="center-detail-page__container__court-list__list__item__header__button-group__edit-button" onClick={() => openEditModal(item.id)}>
                                        Edit
                                    </div>
                                </div>
                            </div>
                            <div className="center-detail-page__container__court-list__list__item__booking-list">
                                <div className="center-detail-page__container__court-list__list__item__booking-list__item">
                                    8:00-10:00
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="center-detail-page__add-new-modal" style={addNewModalState ? {} : {display: "none"}}>
                <div className="center-detail-page__add-new-modal__form">
                    <div className="center-detail-page__add-new-modal__form__header">
                        <div className="center-detail-page__add-new-modal__form__header__title">
                            <h5>Add new court</h5>
                        </div>
                        <div className="center-detail-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-detail-page__add-new-modal__form__content">
                        <div className="center-detail-page__add-new-modal__form__content__name">
                            <div className="center-detail-page__add-new-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" onChange={event => handleInputChange(event, setAddNewFormData)} className={`center-detail-page__add-new-modal__form__content__name__input ${addNewInputState.name ? 'input-error' : ''}`} />
                            <div className="center-detail-page__add-new-modal__form__content__name__error-message input-error-message">{addNewInputState.name ? addNewInputState.name : ''}</div>
                        </div>
                    </div>
                    <div className="center-detail-page__add-new-modal__form__footer">
                        <div className="center-detail-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
            <div className="center-detail-page__edit-modal" style={editModalState ? {} : {display: "none"}}>
                <div className="center-detail-page__edit-modal__form">
                    <div className="center-detail-page__edit-modal__form__header">
                        <div className="center-detail-page__edit-modal__form__header__title">
                            <h5>Edit center</h5>
                        </div>
                        <div className="center-detail-page__edit-modal__form__header__close-button" onClick={() => setEditModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="center-detail-page__edit-modal__form__content">
                        <div className="center-detail-page__edit-modal__form__content__name">
                            <div className="center-detail-page__edit-modal__form__content__name__label">Name</div>
                            <input type="text" placeholder="Name" name="name" value={editFormData.name} onChange={event => handleInputChange(event, setEditFormData)} className={`center-detail-page__edit-modal__form__content__name__input ${editInputState.name ? 'input-error' : ''}`} />
                            <div className="center-detail-page__edit-modal__form__content__name__error-message input-error-message">{editInputState.name ? editInputState.name : ''}</div>
                        </div>
                    </div>
                    <div className="center-detail-page__edit-modal__form__footer">
                        <div className="center-detail-page__edit-modal__form__footer__save-button" onClick={() => submitEditData()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}