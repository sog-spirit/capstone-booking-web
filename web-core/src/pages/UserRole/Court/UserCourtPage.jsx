import { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { TokenContext } from "../../../App";
import { useParams } from "react-router-dom";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";

export default function UserCourtPage() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    let {centerId} = useParams();

    const [courtList, setCourtList] = useState([]);

    useEffect(() => {
        loadCourtList();
    }, [tokenState.accessToken]);

    async function loadCourtList() {
        await refreshAccessToken(setTokenState);

        const headerss = new Headers();
        headerss.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, tokenState.accessToken);

        const response = await fetch(API_URL.BASE + API_URL.COURT.BASE + `?centerId=${centerId}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headerss,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtList(data);
        }
    }

    return (
        <>
        <Header />
        <div className="user-court-page">
            <div className="user-court-page__container">
                <div className="user-court-page__container__header">
                    <div className="user-court-page__container__header__title">
                        <div className="user-court-page__container__header__title__label">
                            <h4>Center detail</h4>
                        </div>
                    </div>
                </div>
                <div className="user-court-page__container__court-list">
                    <div className="user-court-page__container__court-list__title">
                        <h5>Court list</h5>
                    </div>
                    <div className="user-court-page__container__court-list__list">
                        {courtList.map(item => (
                        <div className="user-court-page__container__court-list__list__item">
                            <div className="user-court-page__container__court-list__list__item__header">
                                <div className="user-court-page__container__court-list__list__item__header__label-group">
                                    <div className="user-court-page__container__court-list__list__item__header__label-group__name">
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                            <div className="user-court-page__container__court-list__list__item__booking-list">
                                <div className="user-court-page__container__court-list__list__item__booking-list__item">
                                    8:00-10:00
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}