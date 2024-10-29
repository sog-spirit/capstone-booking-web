import Header from "../../../components/Header";

export default function EmployeeManagementPage() {
    return (
        <>
        <Header />
        <div className="employee-management-page">
            <div className="employee-management-page__container">
                <div className="employee-management-page__container__header">
                    <div className="employee-management-page__container__header__search-input">
                        Search
                    </div>
                    <div className="employee-management-page__container__header__button-group">
                        <div className="employee-management-page__container__header__button-group__refresh-button">
                            Refresh
                        </div>
                        <div className="employee-management-page__container__header__button-group__add-new-button">
                            Add new
                        </div>
                    </div>
                </div>
                <div className="employee-management-page__container__list">
                    <div className="employee-management-page__container__list__title">
                        <h5>Employee list</h5>
                    </div>
                    <div className="employee-management-page__container__list__view">
                        <div className="employee-management-page__container__list__view__header">
                            <div className="employee-management-page__container__list__view__header__username">
                                Username
                            </div>
                            <div className="employee-management-page__container__list__view__header__first-name">
                                First name
                            </div>
                            <div className="employee-management-page__container__list__view__header__last-name">
                                Last name
                            </div>
                            <div className="employee-management-page__container__list__view__header__phone">
                                Phone
                            </div>
                            <div className="employee-management-page__container__list__view__header__email">
                                Email
                            </div>
                        </div>
                        <div className="employee-management-page__container__list__view__content">
                            <div className="employee-management-page__container__list__view__content__item">
                                <div className="employee-management-page__container__list__view__content__item__username">
                                    Username
                                </div>
                                <div className="employee-management-page__container__list__view__content__item__first-name">
                                    First name
                                </div>
                                <div className="employee-management-page__container__list__view__content__item__last-name">
                                    Last name
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="employee-management-page__add-new-modal">
                <div className="employee-management-page__add-new-modal__form">
                    <div className="employee-management-page__add-new-modal__form__header">
                        <div className="employee-management-page__add-new-modal__form__header__title">
                            <h5>Add new employee</h5>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__header__close-button">
                            Close
                        </div>
                    </div>
                    <div className="employee-management-page__add-new-modal__form__content">
                        <div className="employee-management-page__add-new-modal__form__content__name">
                            <div className="employee-management-page__add-new-modal__form__content__name__first-name">
                                <div className="employee-management-page__add-new-modal__form__content__name__first-name__label">First name</div>
                                <input type="text" placeholder="First name" className={`employee-management-page__add-new-modal__form__content__name__first-name__input`} />
                                <div className="employee-management-page__add-new-modal__form__content__name__first-name__error-message input-error-message"></div>
                            </div>
                            <div className="employee-management-page__add-new-modal__form__content__name__last-name">
                                <div className="employee-management-page__add-new-modal__form__content__name__last-name__label">Last name</div>
                                <input type="text" placeholder="Last name" className={`employee-management-page__add-new-modal__form__content__name__last-name__input`} />
                                <div className="employee-management-page__add-new-modal__form__content__name__last-name__error-message input-error-message"></div>
                            </div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__username">
                            <div className="employee-management-page__add-new-modal__form__content__username__label">Username</div>
                            <input type="text" placeholder="Username" className={`employee-management-page__add-new-modal__form__content__username__input`} />
                            <div className="employee-management-page__add-new-modal__form__content__username__error-message input-error-message"></div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__email">
                            <div className="employee-management-page__add-new-modal__form__content__email__label">Email</div>
                            <input type="text" placeholder="Email" className={`employee-management-page__add-new-modal__form__content__email__input`} />
                            <div className="employee-management-page__add-new-modal__form__content__email__error-message input-error-message"></div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__phone">
                            <div className="employee-management-page__add-new-modal__form__content__phone__label">Phone</div>
                            <input type="text" placeholder="Phone" className={`employee-management-page__add-new-modal__form__content__phone__input`} />
                            <div className="employee-management-page__add-new-modal__form__content__phone__error-message input-error-message"></div>
                        </div>
                        <div className="employee-management-page__add-new-modal__form__content__password">
                            <div className="employee-management-page__add-new-modal__form__content__password__label">Password</div>
                            <input type="password" placeholder="Password" className={`employee-management-page__add-new-modal__form__content__password__input`} />
                            <div className="employee-management-page__add-new-modal__form__content__password__error-message input-error-message"></div>
                        </div>
                    </div>
                    <div className="employee-management-page__add-new-modal__form__footer">
                        <div className="employee-management-page__add-new-modal__form__footer__add-button">
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}