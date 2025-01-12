import { useContext, useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";
import { TokenContext } from "../../../App";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import Header from "../../../components/Header";
import { CENTER_REVIEW_CONSTS } from "../../../utils/consts/CenterReviewConsts";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { formatTimestamp } from "../../../utils/formats/TimeFormats";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";

export default function AdminContentManagement() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    const [centerReviewList, setCenterReviewList] = useState([]);

    useEffect(() => {
        loadCenterReviewList();
    }, []);

    async function loadCenterReviewList() {
        const accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.ADMIN + API_URL.CENTER_REVIEW.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterReviewList(data.centerReviewList);
            setTotalPage(data.totalPage);
        }
    }

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    async function approveCenterReview(id) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.ADMIN + API_URL.CENTER_REVIEW.APPROVE;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCenterReviewList();
        }
    }

    async function deniedCenterReview(id) {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        const formData = {
            id: id,
        };

        let url = API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.ADMIN + API_URL.CENTER_REVIEW.DENIED;

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.PUT,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            defaultSuccessToastNotification(MESSAGE_CONSTS.EDIT_SUCCESS);
            loadCenterReviewList();
        }
    }

    return (
        <>
        <Header />
        <div className="admin-content-management">
            <div className="admin-content-management__container">
                <div className="admin-content-management__container__header">
                    <div className="admin-content-management__container__header__button-group">
                        <div className="admin-content-management__container__header__button-group__left">

                        </div>
                        <div className="admin-content-management__container__header__button-group__right">
                            <div className="admin-content-management__container__header__button-group__right__refresh-button">
                                Refresh
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin-content-management__container__list">
                    <div className="admin-content-management__container__list__header">
                        <div className="admin-content-management__container__list__header__id">
                            Id
                        </div>
                        <div className="admin-content-management__container__list__header__user">
                            User
                        </div>
                        <div className="admin-content-management__container__list__header__center">
                            Center
                        </div>
                        <div className="admin-content-management__container__list__header__content">
                            Content
                        </div>
                        <div className="admin-content-management__container__list__header__rating">
                            Rating
                        </div>
                        <div className="admin-content-management__container__list__header__create-timestamp">
                            Create timestamp
                        </div>
                        <div className="admin-content-management__container__list__header__update-timestamp">
                            Update timestamp
                        </div>
                        <div className="admin-content-management__container__list__header__status">
                            Status
                        </div>
                        <div className="admin-content-management__container__list__header__action">
                            Action
                        </div>
                    </div>
                    <div className="admin-content-management__container__list__content">
                        {centerReviewList.map(item => (
                            <div className="admin-content-management__container__list__content__item">
                                <div className="admin-content-management__container__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="admin-content-management__container__list__content__item__user">
                                    {item.user.username}
                                </div>
                                <div className="admin-content-management__container__list__content__item__center">
                                    {item.center.name}
                                </div>
                                <div className="admin-content-management__container__list__content__item__content">
                                    {item.content}
                                </div>
                                <div className="admin-content-management__container__list__content__item__rating">
                                    {item.rating}
                                </div>
                                <div className="admin-content-management__container__list__content__item__create-timestamp">
                                    {formatTimestamp(item.createTimestamp)}
                                </div>
                                <div className="admin-content-management__container__list__content__item__update-timestamp">
                                    {formatTimestamp(item.updateTimestamp)}
                                </div>
                                <div className="admin-content-management__container__list__content__item__status">
                                    {CENTER_REVIEW_CONSTS.INDEX[item.status]}
                                </div>
                                <div className="admin-content-management__container__list__content__item__action">
                                    <div className="admin-content-management__container__list__content__item__action__approve" onClick={() => approveCenterReview(item.id)}>
                                        Approve
                                    </div>
                                    <div className="admin-content-management__container__list__content__item__action__denied" onClick={() => deniedCenterReview(item.id)}>
                                        Denied
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="admin-content-management__container__pagination">
                    <div className="admin-content-management__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="admin-content-management__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`admin-content-management__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="admin-content-management__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="admin-content-management__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}