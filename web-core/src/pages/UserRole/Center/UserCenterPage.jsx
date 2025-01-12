import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faChevronLeft, faChevronRight, faClock, faLocationDot, faMoneyBill, faThumbsDown, faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { trimTime } from "../../../utils/formats/TimeFormats";
import CenterThumbnail from "./CenterThumbnail";
import { handleClickOutsideElement, handleInputCheckboxChange } from "../../../utils/input/InputUtils";
import { CENTER_REVIEW_RATING_CONSTS } from "../../../utils/consts/CenterReviewRatingConsts";
import { formatPercentage } from "../../../utils/formats/DigitFormats";

export default function UserCenterPage() {
    const navigate = useNavigate();

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerList, setCenterList] = useState([]);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [numericIndicatorList, setNumericIndicatorList] = useState([]);

    const [carouselIndex, setCarouselIndex] = useState(0);

    const [centerDetailModalState, setCenterDetailModalState] = useState(false);

    const [carouselImagesInfo, setCarouselImagesInfo] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterDropdownCheckboxState, setFilterDropdownCheckboxState] = useState({
        name: false,
        address: false,
        price: false,
    });

    const [nameFilterDropdownState, setNameFilterDropdownState] = useState(false);
    const nameFilterDropdownListRef = useRef(null);
    const [nameFilterSearchQuery, setNameFilterSearchQuery] = useState('');

    const [addressFilterDropdownState, setAddressFilterDropdownState] = useState(false);
    const addressFilterDropdownListRef = useRef(null);
    const [addressFilterSearchQuery, setAddressFilterSearchQuery] = useState('');

    const [priceFilterDropdownState, setPriceFilterDropdownState] = useState(false);
    const priceFilterDropdownListRef = useRef(null);
    const [priceFilterSearchQuery, setPriceFilterSearchQuery] = useState({
        from: '',
        to: '',
    });

    const [centerReviews, setCenterReviews] = useState([]);

    useEffect(() => {
        loadCenterList();
    }, [tokenState.accessToken, currentPageNumber]);

    useEffect(() => {
        setNumericIndicatorList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, numericIndicatorList.length]);

    async function loadCenterList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.USER + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        if (filterDropdownCheckboxState.name && nameFilterSearchQuery) {
            searchParams.append('name', nameFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.address && addressFilterSearchQuery) {
            searchParams.append('address', addressFilterSearchQuery);
        }
        if (filterDropdownCheckboxState.price && priceFilterSearchQuery.from) {
            searchParams.append('priceFrom', priceFilterSearchQuery.from);
        }
        if (filterDropdownCheckboxState.price && priceFilterSearchQuery.to) {
            searchParams.append('priceTo', priceFilterSearchQuery.to);
        }

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTotalPage(data.totalPage);
            setCenterList(data.centerList);
            console.log(data.centerList);
            
        }
    }

    function navigateToDetailPage(centerId) {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE + `/${centerId}` + PAGE_URL.USER.COURT_PAGE);
    }

    function openCenterDetailModal(centerId) {
        loadCarouselImages(centerId);
        loadCenterReviews(centerId);
        setCenterDetailModalState(true);
    }

    async function loadCarouselImages(centerId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + API_URL.IMAGE.SHOWCASE_INFO;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCarouselImagesInfo(data);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(filterDropdownRef, setFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(nameFilterDropdownListRef, setNameFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(addressFilterDropdownListRef, setAddressFilterDropdownState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(priceFilterDropdownListRef, setPriceFilterDropdownState);
    }, []);

    async function loadCenterReviews(centerId) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.USER + API_URL.CENTER_REVIEW.CENTER + API_URL.CENTER_REVIEW.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerId);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterReviews(data);
        }
    }

    return (
        <>
        <Header />
        <div className="user-center-page">
            <div className="user-center-page__container">
                <div className="user-center-page__container__header">
                    <div className="user-center-page__container__header__title">
                        <div className="user-center-page__container__header__title__label">
                            <h4>Center</h4>
                        </div>
                    </div>
                    <div className="user-center-page__container__header__button-group">
                        <div className="user-center-page__container__header__button-group__left">
                            <div className="user-center-page__container__header__button-group__left__filter-button">
                                <div className="user-center-page__container__header__button-group__left__filter-button__label" onClick={() => setFilterDropdownState(true)}>
                                    Filters
                                </div>
                                <div className="user-center-page__container__header__button-group__left__filter-button__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="user-center-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="name" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Name
                                    </label>
                                    <label className="user-center-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="address" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Address
                                    </label>
                                    <label className="user-center-page__container__header__button-group__left__filter-button__menu__item">
                                        <input type="checkbox" name="price" onChange={event => handleInputCheckboxChange(event, setFilterDropdownCheckboxState)} /> Price
                                    </label>
                                </div>
                            </div>
                            <div className="user-center-page__container__header__button-group__left__name-filter" style={filterDropdownCheckboxState.name ? {} : {display: 'none'}}>
                                <div className="user-center-page__container__header__button-group__left__name-filter__button" onClick={() => setNameFilterDropdownState(true)}>
                                    Name
                                </div>
                                <div className="user-center-page__container__header__button-group__left__name-filter__filter-option" style={nameFilterDropdownState ? {} : {display: 'none'}} ref={nameFilterDropdownListRef}>
                                    <input type="text" placeholder="Name" onChange={event => setNameFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="user-center-page__container__header__button-group__left__address-filter" style={filterDropdownCheckboxState.address ? {} : {display: 'none'}}>
                                <div className="user-center-page__container__header__button-group__left__address-filter__button" onClick={() => setAddressFilterDropdownState(true)}>
                                    Address
                                </div>
                                <div className="user-center-page__container__header__button-group__left__address-filter__filter-option" style={addressFilterDropdownState ? {} : {display: 'none'}} ref={addressFilterDropdownListRef}>
                                    <input type="text" placeholder="Address" onChange={event => setAddressFilterSearchQuery(event.target.value)} />
                                </div>
                            </div>
                            <div className="user-center-page__container__header__button-group__left__price-filter" style={filterDropdownCheckboxState.price ? {} : {display: 'none'}}>
                                <div className="user-center-page__container__header__button-group__left__price-filter__button" onClick={() => setPriceFilterDropdownState(true)}>
                                    Price
                                </div>
                                <div className="user-center-page__container__header__button-group__left__price-filter__filter-option" style={priceFilterDropdownState ? {} : {display: 'none'}} ref={priceFilterDropdownListRef}>
                                    <div className="user-center-page__container__header__button-group__left__price-filter__filter-option__from">
                                        From:
                                        <input type="text" placeholder="From" onChange={event => setPriceFilterSearchQuery(prevState => ({...prevState, from: event.target.value}))} />
                                    </div>
                                    <div className="user-center-page__container__header__button-group__left__price-filter__filter-option__to">
                                        To:
                                        <input type="text" placeholder="To" onChange={event => setPriceFilterSearchQuery(prevState => ({...prevState, to: event.target.value}))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-center-page__container__header__button-group__right">
                            <div className="user-center-page__container__header__button-group__right__refresh-button" onClick={() => loadCenterList()}>
                                <FontAwesomeIcon icon={faArrowsRotate} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-center-page__container__center-list">
                    <div className="user-center-page__container__center-list__title">
                        <h5>Center list</h5>
                    </div>
                    <div className="user-center-page__container__center-list__list">
                        {centerList.map(item => (
                        <div className="user-center-page__container__center-list__list__item">
                            <div className="center-management-page__container__center-list__list__item__info">
                                <div className="center-management-page__container__center-list__list__item__info__img" key={item.id}>
                                    <CenterThumbnail centerId={item?.id} />
                                </div>
                                <div className="center-management-page__container__center-list__list__item__info__detail">
                                    <div className="center-management-page__container__center-list__list__item__info__detail__name">
                                        <h5>{item.name}</h5>
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__address">
                                        <FontAwesomeIcon icon={faLocationDot} /> {item.address}
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__price">
                                        <FontAwesomeIcon icon={faMoneyBill} /> {item?.courtFee}₫
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__working-time">
                                        <FontAwesomeIcon icon={faClock} /> {trimTime(item?.openingTime)}-{trimTime(item?.closingTime)}
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__reviews">
                                        Reviews: {formatPercentage(item.recommendCount, item.reviewCount)} {`(${item.reviewCount})`}
                                    </div>
                                </div>
                            </div>
                            <div className="user-center-page__container__center-list__list__item__button-group">
                                <div className="user-center-page__container__center-list__list__item__button-group__info-button" onClick={() => openCenterDetailModal(item.id)}>
                                    Info
                                </div>
                                <div className="user-center-page__container__center-list__list__item__button-group__detail-button" onClick={() => navigateToDetailPage(item.id)}>
                                    Detail
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="user-center-page__container__center-list__pagination">
                        <div className="user-center-page__container__center-list__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                            Previous
                        </div>
                        <div className="user-center-page__container__center-list__pagination__numeric-indicator">
                            {numericIndicatorList.map(item => Number.isInteger(item) ?
                                (<div className={`center-management-page__container__center-list__pagination__numeric-indicator__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                    {item}
                                </div>)
                            : (<div className={`center-management-page__container__center-list__pagination__numeric-indicator__item`} key={item}>
                                    {item}
                                </div>)
                            )}
                        </div>
                        <div className="user-center-page__container__center-list__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                            Next
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-center-page__info-modal" style={centerDetailModalState ? {} : {display: 'none'}}>
                <div className="user-center-page__info-modal__form">
                    <div className="user-center-page__info-modal__form__header">
                        <div className="user-center-page__info-modal__form__header__title">
                            <h5>Center info</h5>
                        </div>
                        <div className="user-center-page__info-modal__form__header__close-button" onClick={() => setCenterDetailModalState(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    <div className="user-center-page__info-modal__form__content">
                        <div className="user-center-page__info-modal__form__content__image-carousel__title">
                            <h5>Image</h5>
                        </div>
                        <div className="user-center-page__info-modal__form__content__image-carousel">
                            <div className="user-center-page__info-modal__form__content__image-carousel__image-list">
                                {carouselImagesInfo.map((item, index) => (
                                    <div className={`user-center-page__info-modal__form__content__image-carousel__image-list__item ${carouselIndex === index ? `` : `hidden`}`}>
                                        <img src={API_URL.BASE + API_URL.IMAGE.BASE + API_URL.IMAGE.CENTER + `?id=${item.id}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="user-center-page__info-modal__form__content__image-carousel__navigation">
                                {carouselImagesInfo.length !== 0 && carouselIndex > 0 && (
                                    <div className="user-center-page__info-modal__form__content__image-carousel__navigation__previous" onClick={() => setCarouselIndex(prevState => prevState - 1)}>
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </div>
                                )}
                                {carouselImagesInfo.length !== 0 && carouselIndex < carouselImagesInfo.length - 1 && (
                                    <div className="user-center-page__info-modal__form__content__image-carousel__navigation__next" onClick={() => setCarouselIndex(prevState => prevState + 1)}>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                )}
                            </div>
                            <div className="user-center-page__info-modal__form__content__image-carousel__indicators">
                                <div className="user-center-page__info-modal__form__content__image-carousel__indicators__container">
                                    {carouselImagesInfo.map((item, index) => (
                                        <div className={`user-center-page__info-modal__form__content__image-carousel__indicators__container__item ${carouselIndex === index ? `active` : ``}`} onClick={() => setCarouselIndex(index)}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="user-center-page__info-modal__form__content__reviews">
                            <div className="user-center-page__info-modal__form__content__reviews__title">
                                <h5>Reviews</h5>
                            </div>
                            <div className="user-center-page__info-modal__form__content__reviews__list">
                                {centerReviews.map(item => (
                                    <div className="user-center-page__info-modal__form__content__reviews__list__item">
                                        <div className="user-center-page__info-modal__form__content__reviews__list__item__status">
                                            <div className="user-center-page__info-modal__form__content__reviews__list__item__status__icon">
                                                {CENTER_REVIEW_RATING_CONSTS.RECOMMEND === item.rating && <FontAwesomeIcon icon={faThumbsUp} />}
                                                {CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND === item.rating && <FontAwesomeIcon icon={faThumbsDown} />}
                                            </div>
                                            <div className="user-center-page__info-modal__form__content__reviews__list__item__status__label">
                                            {CENTER_REVIEW_RATING_CONSTS.RECOMMEND === item.rating && `Recommended`}
                                            {CENTER_REVIEW_RATING_CONSTS.NOT_RECOMMEND === item.rating && `Not recommend`}
                                            </div>
                                        </div>
                                        <div className="user-center-page__info-modal__form__content__reviews__list__item__username">
                                            {item.userUsername}
                                        </div>
                                        <div className="user-center-page__info-modal__form__content__reviews__list__item__content">
                                            {item.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}