import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { API_URL } from "../../../utils/consts/APIConsts";
import { handleClickOutsideElement, handleInputChange, handleInputCheckboxChange, onChangeSortOrder } from "../../../utils/input/InputUtils";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";
import { formatTimestamp } from "../../../utils/formats/TimeFormats";
import { CENTER_REVIEW_CONSTS } from "../../../utils/consts/CenterReviewConsts";
import { CENTER_REVIEW_RATING_CONSTS } from "../../../utils/consts/CenterReviewRatingConsts";

export default function UserCenterReview() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerDropdownState, setCenterDropdownState] = useState(false);
    const [centerDropdownList, setCenterDropdownList] = useState([]);
    const [centerDropdownSearchInput, setCenterDropdownSearchInput] = useState('');
    const [centerDropdownTextValue, setCenterDropdownTextValue] = useState('');
    const centerDropdownRef = useRef(null);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        content: '',
        centerId: 0,
        rating: 0,
    });
    const [addNewInputState, setAddNewInputStatus] = useState({
        content: '',
        centerId: '',
    });

    const [userReviewList, setUserReviewList] = useState([]);

    const [userCenterReviewSortOrder, setUserCenterReviewSortOrder] = useState({
        id: null,
        center: null,
        createTimestamp: null,
        updateTimestamp: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        id: false,
        center: false,
    });

    const [idFilterDropdownState, setIdFilterDropdownState] = useState(false);
    const idFilterDropdownListRef = useRef(null);
    const [idFilterSearchQuery, setIdFilterSearchQuery] = useState('');

    const [centerFilterDropdownState, setCenterFilterDropdownState] = useState(false);
    const [centerFilterItemList, setCenterFilterItemList] = useState([]);
    const centerFilterDropdownListRef = useRef(null);
    const [centerFilterSearchQuery, setCenterFilterSearchQuery] = useState('');
    const [centerCurrentFilterItem, setCenterCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [editReviewModalState, setEditReviewModalState] = useState(false);
    const [editReviewFormData, setEditReviewFormData] = useState({
        id: 0,
        rating: 0,
        content: '',
    });

    useEffect(() => {
        handleClickOutsideElement(centerDropdownRef, setCenterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFromUserOrderAsDropdownList();
    }, [addNewModalState, centerDropdownSearchInput, tokenState.accessToken]);

    async function loadCenterFromUserOrderAsDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.USER + API_URL.COURT_BOOKING.LIST + API_URL.COURT_BOOKING.CENTER_LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', centerDropdownSearchInput);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let centerList = await response.json();
            setCenterDropdownList(centerList);
        }
    }

    function selectCenterDropdownItem(centerId) {
        let center = centerDropdownList.find(item => item.id === centerId);
        setCenterDropdownTextValue(center.name);
        setAddNewFormData(prevState => ({
            ...prevState,
            centerId: center.id,
        }));
        setCenterDropdownState(false);
    }

    function closeAddNewModal() {
        setAddNewModalState(false);
        setAddNewFormData(prevState => ({
            ...prevState,
            content: '',
            centerId: 0,
        }));
        setAddNewInputStatus(prevState => ({
            ...prevState,
            content: '',
            centerId: '',
        }));
    }

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            closeAddNewModal();
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
        }
    }

    useEffect(() => {
        loadUserReviewList();
    }, [tokenState.accessToken,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
        userCenterReviewSortOrder.id,
        userCenterReviewSortOrder.center,
        userCenterReviewSortOrder.createTimestamp,
        userCenterReviewSortOrder.updateTimestamp,
        addNewModalState,
        editReviewModalState,
    ]);

    async function loadUserReviewList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.USER + API_URL.CENTER_REVIEW.LIST;
        let searchParams = new URLSearchParams();
        if (userCenterReviewSortOrder.id) {
            searchParams.append('idSortOrder', userCenterReviewSortOrder.id);
        }
        if (userCenterReviewSortOrder.center) {
            searchParams.append('centerSortOrder', userCenterReviewSortOrder.center);
        }
        if (userCenterReviewSortOrder.createTimestamp) {
            searchParams.append('createTimestampSortOrder', userCenterReviewSortOrder.createTimestamp);
        }
        if (userCenterReviewSortOrder.updateTimestamp) {
            searchParams.append('updateTimestampSortOrder', userCenterReviewSortOrder.updateTimestamp);
        }

        if (filterDropdownCheckboxState.id && idFilterSearchQuery) {
            searchParams.append('id', idFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.center && centerCurrentFilterItem.id) {
            searchParams.append('centerId', centerCurrentFilterItem.id)
        }

        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setUserReviewList(data.centerReviewList);
            setTotalPage(data.totalPage);
        }
    }

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(idFilterDropdownListRef, setIdFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(centerFilterDropdownListRef, setCenterFilterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFilterItemList();
    }, [centerFilterSearchQuery]);

    async function loadCenterFilterItemList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.USER + API_URL.CENTER_REVIEW.CENTER + API_URL.CENTER_REVIEW.FILTER + API_URL.CENTER_REVIEW.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', centerFilterSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterFilterItemList(data);
        }
    }

    function onCenterFilterItemSelect(id) {
        let item = centerFilterItemList.find(item => item.center.id === id);
        setCenterCurrentFilterItem({
            id: item.center.id,
            name: item.center.name,
        });
    }

    function openEditModal(id) {
        setEditReviewModalState(true);
        let item = userReviewList.find(item => item.id === id);
        setEditReviewFormData({
            id: id,
            rating: item.rating,
            content: item.content,
        });
    }

    function closeEditModal() {
        setEditReviewModalState(false);
        setEditReviewFormData({
            id: 0,
            rating: 0,
            content: '',
        });
    }

    function onClickRecommend(setFormData) {
        const rating = editReviewFormData.rating === CENTER_REVIEW_RATING_CONSTS.RECOMMEND ? 0 : CENTER_REVIEW_RATING_CONSTS.RECOMMEND;
        setFormData(prevState => ({...prevState, rating: rating}));
    }

    function onClickNotRecommend(setFormData) {
        const rating = editReviewFormData.rating === CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND ? 0 : CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND;
        setFormData(prevState => ({...prevState, rating: rating}));
    }

    async function saveEditReview() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(editReviewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            closeEditModal();
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
        }
    }

    async function deleteEditReview() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.DELETE,
            headers: headers,
            body: JSON.stringify(editReviewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            closeEditModal();
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
        }
    }

    return (
        <>
        <Header />
        <div className="user-center-review">
            <div className="user-center-review__container">
                <div className="user-center-review__container__header">
                    <div className="user-center-review__container__header__title">
                        <div className="user-center-review__container__header__title__label">
                            <h4>Reviews</h4>
                        </div>
                        <div className="user-center-review__container__header__button-group">
                            <div className="user-center-review__container__header__button-group__left">
                                <div className="user-center-review__container__header__button-group__left__filter-button">
                                    <div className="user-center-review__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>
                                        Filters
                                    </div>
                                    <div className="user-center-review__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                        <label className="user-center-review__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="id" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Id
                                        </label>
                                        <label className="user-center-review__container__header__button-group__left__filter-button__menu__item">
                                            <input type="checkbox" name="center" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Center
                                        </label>
                                    </div>
                                </div>
                                <div className="user-center-review__container__header__button-group__left__id-filter" style={filterDropdownCheckboxState.id ? {} : {display: 'none'}}>
                                    <div className="user-center-review__container__header__button-group__left__id-filter__button" onClick={() => setIdFilterDropdownState(true)}>
                                        Id filter
                                    </div>
                                    <div className="user-center-review__container__header__button-group__left__id-filter__filter-option" style={idFilterDropdownState ? {} : {display: 'none'}} ref={idFilterDropdownListRef}>
                                        <input type="text" placeholder="Id" />
                                    </div>
                                </div>
                                <div className="user-center-review__container__header__button-group__left__center-filter" style={filterDropdownCheckboxState.center ? {} : {display: 'none'}}>
                                    <div className="user-center-review__container__header__button-group__left__center-filter__button" onClick={() => setCenterFilterDropdownState(true)}>
                                        Center filter{centerCurrentFilterItem.name ? `: ${centerCurrentFilterItem.name}` : ``}
                                    </div>
                                    <div className="user-center-review__container__header__button-group__left__center-filter__filter-option" style={centerFilterDropdownState ? {} : {display: 'none'}} ref={centerFilterDropdownListRef}>
                                        <input type="text" placeholder="Center" />
                                        {centerFilterItemList.map(item => (
                                            <div className="user-center-review__container__header__button-group__left__center-filter__filter-option__item" key={item.center.id} onClick={() => onCenterFilterItemSelect(item.center.id)}>
                                                {item.center.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="user-center-review__container__header__button-group__right">
                                <div className="user-center-review__container__header__button-group__right__refresh-button" onClick={() => loadUserReviewList()}>
                                    Refresh
                                </div>
                                <div className="user-center-review__container__header__button-group__right__add-new-button" onClick={() => setAddNewModalState(true)}>
                                    Add new
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-center-review__container__review-list">
                    <div className="user-center-review__container__review-list__list">
                        <div className="user-center-review__container__review-list__list__header">
                            <div className="user-center-review__container__review-list__list__header__id" onClick={() => onChangeSortOrder('id', setUserCenterReviewSortOrder)}>
                                Id {userCenterReviewSortOrder.id ? (userCenterReviewSortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-center-review__container__review-list__list__header__center" onClick={() => onChangeSortOrder('center', setUserCenterReviewSortOrder)}>
                                Center {userCenterReviewSortOrder.center ? (userCenterReviewSortOrder.center === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-center-review__container__review-list__list__header__content">
                                Content
                            </div>
                            <div className="user-center-review__container__review-list__list__header__rating">
                                Rating
                            </div>
                            <div className="user-center-review__container__review-list__list__header__create-timestamp" onClick={() => onChangeSortOrder('createTimestamp', setUserCenterReviewSortOrder)}>
                                Create timestamp {userCenterReviewSortOrder.createTimestamp ? (userCenterReviewSortOrder.createTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-center-review__container__review-list__list__header__update-timestamp" onClick={() => onChangeSortOrder('updateTimestamp', setUserCenterReviewSortOrder)}>
                                Update timestamp {userCenterReviewSortOrder.updateTimestamp ? (userCenterReviewSortOrder.updateTimestamp === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                            </div>
                            <div className="user-center-review__container__review-list__list__header__status">
                                Status
                            </div>
                            <div className="user-center-review__container__review-list__list__header__action">
                                Action
                            </div>
                        </div>
                        <div className="user-center-review__container__review-list__list__content">
                            {userReviewList.map(item => (
                            <div className="user-center-review__container__review-list__list__content__item" key={item.id}>
                                <div className="user-center-review__container__review-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__center">
                                    {item.center.name}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__content">
                                    {item.content}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__rating">
                                    {CENTER_REVIEW_RATING_CONSTS.INDEX[item.rating]}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__create-timestamp">
                                    {formatTimestamp(item.createTimestamp)}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__update-timestamp">
                                    {formatTimestamp(item.updateTimestamp)}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__status">
                                    {CENTER_REVIEW_CONSTS.INDEX[item.status]}
                                </div>
                                <div className="user-center-review__container__review-list__list__content__item__action">
                                    {item.status !== CENTER_REVIEW_CONSTS.CANCELLED  && (
                                        <div className="user-center-review__container__review-list__list__content__item__action__edit" onClick={() => openEditModal(item.id)}>
                                            Edit
                                        </div>
                                    )}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="user-center-review__container__pagination">
                    <div className="user-center-review__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="user-center-review__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`user-center-review__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="user-center-review__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="user-center-review__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
            <div className="user-center-review__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="user-center-review__add-new-modal__form">
                    <div className="user-center-review__add-new-modal__form__header">
                        <div className="user-center-review__add-new-modal__form__header__title">
                            <h5>Add new review</h5>
                        </div>
                        <div className="user-center-review__add-new-modal__form__header__close-button" onClick={() => closeAddNewModal()}>
                            Close
                        </div>
                    </div>
                    <div className="user-center-review__add-new-modal__form__content">
                        <div className="user-center-review__add-new-modal__form__content__rating">
                            <div className="user-center-review__add-new-modal__form__content__rating__label">
                                Rating
                            </div>
                            <div className="user-center-review__edit-modal__form__content__rating__button">
                                <div className={`user-center-review__edit-modal__form__content__rating__button__recommend ${addNewFormData.rating === CENTER_REVIEW_RATING_CONSTS.RECOMMEND ? 'clicked' : ''}`} onClick={() => onClickRecommend(setAddNewFormData)}>
                                    <FontAwesomeIcon icon={faThumbsUp} /> Recommended
                                </div>
                                <div className={`user-center-review__edit-modal__form__content__rating__button__not-recommend ${addNewFormData.rating === CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND ? 'clicked' : ''}`} onClick={() => onClickNotRecommend(setAddNewFormData)}>
                                    <FontAwesomeIcon icon={faThumbsDown} /> Not recommended
                                </div>
                            </div>
                        </div>
                        <div className="user-center-review__add-new-modal__form__content__center">
                            <div className="user-center-review__add-new-modal__form__content__center__label">
                                Center
                            </div>
                            <div className="user-center-review__add-new-modal__form__content__center__select">
                                <div className="user-center-review__add-new-modal__form__content__center__select__select-button" onClick={() => setCenterDropdownState(true)}>
                                    {centerDropdownTextValue ? centerDropdownTextValue : 'Select a center'}
                                </div>
                                <div className={`user-center-review__add-new-modal__form__content__center__select__select-option ${addNewInputState.centerId ? 'input-error' : ''}`} style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                    <div className="user-center-review__add-new-modal__form__content__center__select__select-option__item" key={item.id} onClick={() => selectCenterDropdownItem(item.id)}>
                                        {item.name}
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className="user-center-review__add-new-modal__form__content__center__error-message input-error-message">{addNewInputState.centerId ? addNewInputState.centerId : ''}</div>
                        </div>
                        <div className="user-center-review__add-new-modal__form__content__content">
                            <div className="user-center-review__add-new-modal__form__content__content__label">Content</div>
                            <textarea name="content" onChange={event => handleInputChange(event, setAddNewFormData)} className={`user-center-review__add-new-modal__form__content__content__textarea ${addNewInputState.content ? 'input-error' : ''}`}></textarea>
                            <div className="user-center-review__add-new-modal__form__content__content__error-message input-error-message">{addNewInputState.content ? addNewInputState.content : ''}</div>
                        </div>
                    </div>
                    <div className="user-center-review__add-new-modal__form__footer">
                        <div className="user-center-review__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-center-review__edit-modal" style={editReviewModalState ? {} : {display: 'none'}}>
                <div className="user-center-review__edit-modal__form">
                    <div className="user-center-review__edit-modal__form__header">
                        <div className="user-center-review__edit-modal__form__header__title">
                            <h5>Reviews id {editReviewFormData.id} edit</h5>
                        </div>
                        <div className="user-center-review__edit-modal__form__header__close-button" onClick={() => closeEditModal()}>
                            Close
                        </div>
                    </div>
                    <div className="user-center-review__edit-modal__form__content">
                        <div className="user-center-review__edit-modal__form__content__rating">
                            <div className="user-center-review__edit-modal__form__content__rating__label">
                                Rating
                            </div>
                            <div className="user-center-review__edit-modal__form__content__rating__button">
                                <div className={`user-center-review__edit-modal__form__content__rating__button__recommend ${editReviewFormData.rating === CENTER_REVIEW_RATING_CONSTS.RECOMMEND ? 'clicked' : ''}`} onClick={() => onClickRecommend(setEditReviewFormData)}>
                                    <FontAwesomeIcon icon={faThumbsUp} /> Recommended
                                </div>
                                <div className={`user-center-review__edit-modal__form__content__rating__button__not-recommend ${editReviewFormData.rating === CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND ? 'clicked' : ''}`} onClick={() => onClickNotRecommend(setEditReviewFormData)}>
                                    <FontAwesomeIcon icon={faThumbsDown} /> Not recommended
                                </div>
                            </div>
                        </div>
                        <div className="user-center-review__edit-modal__form__content__content">
                            <div className="user-center-review__edit-modal__form__content__content__label">
                                Content
                            </div>
                            <textarea className="user-center-review__edit-modal__form__content__content__textarea" value={editReviewFormData.content} name="content" onChange={event => handleInputChange(event, setEditReviewFormData)}>
                                
                            </textarea>
                        </div>
                    </div>
                    <div className="user-center-review__edit-modal__form__footer">
                        <div className="user-center-review__edit-modal__form__footer__delete-button" onClick={() => deleteEditReview()}>
                            Delete
                        </div>
                        <div className="user-center-review__edit-modal__form__footer__save-button" onClick={() => saveEditReview()}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}