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
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { SORT_DIRECTION } from "../../../utils/consts/SortDirection";

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
    });
    const [addNewInputState, setAddNewInputStatus] = useState({
        content: '',
        centerId: '',
    });

    const [userReviewList, setUserReviewList] = useState([]);

    const [userCenterReviewSortOrder, setUserCenterReviewSortOrder] = useState({
        id: null,
        center: null,
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
        let center = centerDropdownList.find(item => item.centerId === centerId);
        setCenterDropdownTextValue(center.centerName);
        setAddNewFormData(prevState => ({
            ...prevState,
            centerId: center.centerId,
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
                        <div className="user-center-review__add-new-modal__form__content__center">
                            <div className="user-center-review__add-new-modal__form__content__center__label">Center</div>
                            <div className="user-center-review__add-new-modal__form__content__center__select">
                                <div className="user-center-review__add-new-modal__form__content__center__select__select-button" onClick={() => setCenterDropdownState(true)}>
                                    {centerDropdownTextValue ? centerDropdownTextValue : 'Select a center'}
                                </div>
                                <div className={`user-center-review__add-new-modal__form__content__center__select__select-option ${addNewInputState.centerId ? 'input-error' : ''}`} style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                    <div className="user-center-review__add-new-modal__form__content__center__select__select-option__item" key={item.centerId} onClick={() => selectCenterDropdownItem(item.centerId)}>
                                        {item.centerName}
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
        </div>
        </>
    );
}