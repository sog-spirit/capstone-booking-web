import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";

export default function UserCenterPage() {
    const navigate = useNavigate();

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerList, setCenterList] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [numericIndicatorList, setNumericIndicatorList] = useState([]);

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

        const response = await fetch(API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.LIST + `?pageNo=${currentPageNumber - 1}&pageSize=${DEFAULT_PAGE_SIZE}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTotalPage(data.totalPage);
            setCenterList(data.centerList);
        }
    }

    function navigateToOrderPage(centerId) {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE + `/${centerId}` + PAGE_URL.USER.PRODUCT_ORDER);
    }

    function navigateToDetailPage(centerId) {
        navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE + `/${centerId}` + PAGE_URL.USER.COURT_PAGE);
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
                                    <img src={'/no-image.jpg'} />
                                </div>
                                <div className="center-management-page__container__center-list__list__item__info__detail">
                                    <div className="center-management-page__container__center-list__list__item__info__detail__name">
                                        {item.name}
                                    </div>
                                    <div className="center-management-page__container__center-list__list__item__info__detail__address">
                                        {item.address}
                                    </div>
                                </div>
                            </div>
                            <div className="user-center-page__container__center-list__list__item__button-group">
                                <div className="user-center-page__container__center-list__list__item__button-group__order-button" onClick={() => navigateToOrderPage(item.id)}>
                                    Order
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
        </div>
        </>
    );
}