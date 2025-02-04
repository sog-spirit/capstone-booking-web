import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/Header";
import { faArrowUpRightDots, faArrowUpRightFromSquare, faChartSimple, faComment, faFutbol, faList, faPen, faTicket, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { LoginContext } from "../../App";
import { USER_ROLE } from "../../utils/consts/UserRoleConsts";
import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "../../utils/consts/PageURLConsts";

export default function HomePage() {
    const {loginState, setLoginState} = useContext(LoginContext);

    const navigate = useNavigate();

    return (
        <>
        <Header />
        <div className="home-page">
            <div className="home-page__container">
                {!loginState.isLogin && (
                <div className="home-page__container__welcome">
                    <div className="home-page__container__welcome__introduction">
                        <div className="home-page__container__welcome__introduction__content">
                            <div className="home-page__container__welcome__introduction__content__title">
                                Where passion meets performance and players thrive
                            </div>
                            <div className="home-page__container__welcome__introduction__content__paragraph">
                                Explore our flexible rental options, check availability, and book online in minutes. With our platform, you're just one click away from elevating your sports experience.
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__welcome__button-group">
                        <div className="home-page__container__welcome__button-group__register" onClick={() => navigate(PAGE_URL.REGISTER)}>
                            Let's join us
                        </div>
                        <div className="home-page__container__welcome__button-group__login" onClick={() => navigate(PAGE_URL.LOGIN)}>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </div>
                    </div>
                </div>
                )}
                {loginState.userRole === USER_ROLE.USER && (
                <div className="home-page__container__button-group">
                    <div className="home-page__container__button-group__center"  onClick={() => navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE)}>
                        <div className="home-page__container__button-group__center__label">
                            <div className="home-page__container__button-group__center__label__icon">
                                <FontAwesomeIcon icon={faTicket} />
                            </div>
                            <div className="home-page__container__button-group__center__label__title">
                                Center
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center-review" onClick={() => navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_REVIEW)}>
                        <div className="home-page__container__button-group__center-review__label">
                            <div className="home-page__container__button-group__center-review__label__icon">
                                <FontAwesomeIcon icon={faPen} />
                            </div>
                            <div className="home-page__container__button-group__center-review__label__title">
                                Center review
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__booking-order-list" onClick={() => navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.BOOKING_ORDER_LIST)}>
                        <div className="home-page__container__button-group__booking-order-list__label">
                            <div className="home-page__container__button-group__booking-order-list__label__icon">
                                <FontAwesomeIcon icon={faList} />
                            </div>
                            <div className="home-page__container__button-group__booking-order-list__label__title">
                                Booking order list
                            </div>
                        </div>
                    </div>
                </div>
                )}
                {loginState.userRole === USER_ROLE.CENTER_OWNER && (
                <div className="home-page__container__button-group">
                    <div className="home-page__container__button-group__booking-order" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.BOOKING_ORDER_MANAGEMENT)}>
                        <div className="home-page__container__button-group__booking-order__label">
                            <div className="home-page__container__button-group__booking-order__label__icon">
                                <FontAwesomeIcon icon={faList} />
                            </div>
                            <div className="home-page__container__button-group__booking-order__label__title">
                                Booking order
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE)}>
                        <div className="home-page__container__button-group__center__label">
                            <div className="home-page__container__button-group__center__label__icon">
                                <FontAwesomeIcon icon={faFutbol} />
                            </div>
                            <div className="home-page__container__button-group__center__label__title">
                                Center
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center-review" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_REVIEW)}>
                        <div className="home-page__container__button-group__center-review__label">
                            <div className="home-page__container__button-group__center-review__label__icon">
                                <FontAwesomeIcon icon={faComment} />
                            </div>
                            <div className="home-page__container__button-group__center-review__label__title">
                                Center review
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product-inventory" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_INVENTORY_PAGE)}>
                        <div className="home-page__container__button-group__product-inventory__label">
                            <div className="home-page__container__button-group__product-inventory__label__icon">
                                <FontAwesomeIcon icon={faWarehouse} />
                            </div>
                            <div className="home-page__container__button-group__product-inventory__label__title">
                                Product inventory
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product-order" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_ORDER)}>
                        <div className="home-page__container__button-group__product-order__label">
                            <div className="home-page__container__button-group__product-order__label__icon">
                                <FontAwesomeIcon icon={faWarehouse} />
                            </div>
                            <div className="home-page__container__button-group__product-order__label__title">
                                Product order
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_PAGE)}>
                        <div className="home-page__container__button-group__product__label">
                            <div className="home-page__container__button-group__product__label__icon">
                                <FontAwesomeIcon icon={faWarehouse} />
                            </div>
                            <div className="home-page__container__button-group__product__label__title">
                                Product
                            </div>
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product" onClick={() => navigate(PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.STATISTICS)}>
                        <div className="home-page__container__button-group__product__label">
                            <div className="home-page__container__button-group__product__label__icon">
                                <FontAwesomeIcon icon={faChartSimple} />
                            </div>
                            <div className="home-page__container__button-group__product__label__title">
                                Statistics
                            </div>
                        </div>
                    </div>
                </div>
                )}
                {loginState.userRole === USER_ROLE.ADMIN && (
                <div className="home-page__container__button-group">
                    <div className="home-page__container__button-group__product" onClick={() => navigate(PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.STATISTICS)}>
                        <div className="home-page__container__button-group__product__label">
                            <div className="home-page__container__button-group__product__label__icon">
                                <FontAwesomeIcon icon={faChartSimple} />
                            </div>
                            <div className="home-page__container__button-group__product__label__title">
                                Statistics
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
        </>
    );
}