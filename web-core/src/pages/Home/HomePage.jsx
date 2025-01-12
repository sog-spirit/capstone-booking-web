import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/Header";
import { faComment, faFutbol, faList, faPen, faTicket, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { LoginContext } from "../../App";
import { USER_ROLE } from "../../utils/consts/UserRoleConsts";

export default function HomePage() {
    const {loginState, setLoginState} = useContext(LoginContext);

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
                                <h4>Title</h4>
                            </div>
                            <div className="home-page__container__welcome__introduction__content__paragraph">
                                Explore our flexible rental options, check availability, and book online in minutes. With our platform, you're just one click away from elevating your sports experience.
                            </div>
                        </div>
                        <div className="home-page__container__welcome__introduction__image">
                            <img src="/sports.avif" />
                        </div>
                    </div>
                    <div className="home-page__container__welcome__button-group">
                        <div className="home-page__container__welcome__button-group__login">
                            <h4>Login</h4>
                        </div>
                        <div className="home-page__container__welcome__button-group__register">
                            <h4>Register</h4>
                        </div>
                    </div>
                </div>
                )}
                {loginState.userRole === USER_ROLE.USER && (
                <div className="home-page__container__button-group">
                    <div className="home-page__container__button-group__center">
                        <div className="home-page__container__button-group__center__icon">
                            <FontAwesomeIcon icon={faTicket} />
                        </div>
                        <div className="home-page__container__button-group__center__title">
                            Center
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center-review">
                        <div className="home-page__container__button-group__center-review__icon">
                            <FontAwesomeIcon icon={faPen} />
                        </div>
                        <div className="home-page__container__button-group__center-review__title">
                            Center review
                        </div>
                    </div>
                    <div className="home-page__container__button-group__booking-order-list">
                        <div className="home-page__container__button-group__booking-order-list__icon">
                            <FontAwesomeIcon icon={faList} />
                        </div>
                        <div className="home-page__container__button-group__booking-order-list__title">
                            Booking order list
                        </div>
                    </div>
                </div>
                )}
                {loginState.userRole === USER_ROLE.CENTER_OWNER && (
                <div className="home-page__container__button-group">
                    <div className="home-page__container__button-group__booking-order">
                        <div className="home-page__container__button-group__booking-order__icon">
                            <FontAwesomeIcon icon={faList} />
                        </div>
                        <div className="home-page__container__button-group__booking-order__title">
                            Booking order
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center">
                        <div className="home-page__container__button-group__center__icon">
                            <FontAwesomeIcon icon={faFutbol} />
                        </div>
                        <div className="home-page__container__button-group__center__title">
                            Center
                        </div>
                    </div>
                    <div className="home-page__container__button-group__center-review">
                        <div className="home-page__container__button-group__center-review__icon">
                            <FontAwesomeIcon icon={faComment} />
                        </div>
                        <div className="home-page__container__button-group__center-review__title">
                            Center review
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product-inventory">
                        <div className="home-page__container__button-group__product-inventory__icon">
                            <FontAwesomeIcon icon={faWarehouse} />
                        </div>
                        <div className="home-page__container__button-group__product-inventory__title">
                            Product inventory
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product-order">
                        <div className="home-page__container__button-group__product-order__icon">
                            <FontAwesomeIcon icon={faWarehouse} />
                        </div>
                        <div className="home-page__container__button-group__product-order__title">
                            Product order
                        </div>
                    </div>
                    <div className="home-page__container__button-group__product">
                        <div className="home-page__container__button-group__product__icon">
                            <FontAwesomeIcon icon={faWarehouse} />
                        </div>
                        <div className="home-page__container__button-group__product__title">
                            Product
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
        </>
    );
}