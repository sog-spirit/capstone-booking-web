import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function CenterReview() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        loadReviewList();
    }, [tokenState.accessToken]);

    async function loadReviewList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.CENTER_REVIEW.BASE + API_URL.CENTER_REVIEW.LIST + API_URL.CENTER_REVIEW.CENTER_OWNER, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let list = await response.json();
            setReviewList(list);
        }
    }

    return (
        <>
        <Header />
        <div className="center-review">
            <div className="center-review__container">
                <div className="center-review__container__header">
                    <div className="center-review__container__header__title">
                        <div className="center-review__container__header__title__label">
                            <h4>Center reviews</h4>
                        </div>
                    </div>
                    <div className="center-review__container__header__button-group">
                        <div className="center-review__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                    </div>
                </div>
                <div className="center-review__container__review-list">
                    <div className="center-review__container__review-list__list">
                        <div className="center-review__container__review-list__list__header">
                            <div className="center-review__container__review-list__list__header__id">
                                Id
                            </div>
                            <div className="center-review__container__review-list__list__header__user">
                                User
                            </div>
                            <div className="center-review__container__review-list__list__header__center">
                                Center
                            </div>
                            <div className="center-review__container__review-list__list__header__content">
                                Content
                            </div>
                        </div>
                        <div className="center-review__container__review-list__list__content">
                            {reviewList.map(item => (
                            <div className="center-review__container__review-list__list__content__item">
                                <div className="center-review__container__review-list__list__content__item__id">
                                    {item.id}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__user">
                                    {item.userUsername}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__center">
                                    {item.centerName}
                                </div>
                                <div className="center-review__container__review-list__list__content__item__content">
                                    {item.content}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}