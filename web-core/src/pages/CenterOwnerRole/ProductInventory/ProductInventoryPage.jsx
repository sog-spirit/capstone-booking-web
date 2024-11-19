import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { TokenContext } from "../../../App";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { handleInputChange } from "../../../utils/input/InputUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_PAGE_SIZE, nextPage, paginate, previousPage } from "../../../utils/pagination/PaginationUtils";

export default function ProductInventoryCenterOwnerPage() {
    const SORT_DIRECTION = {
        ASC: 'asc',
        DESC: 'desc',
    };

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [productDropdownState, setProductDropdownState] = useState(false);
    const [productDropdownList, setProductDropdownList] = useState([]);
    const [productDropdownSearchInput, setProductDropdownSearchInput] = useState('');
    const [productDropdownTextValue, setProductDropdownTextValue] = useState('');
    const productDropdownRef = useRef(null);

    const [centerDropdownState, setCenterDropdownState] = useState(false);
    const [centerDropdownList, setCenterDropdownList] = useState([]);
    const [centerDropdownSearchInput, setCenterDropdownSearchInput] = useState('');
    const [centerDropdownTextValue, setCenterDropdownTextValue] = useState('');
    const centerDropdownRef = useRef(null);

    const [addNewModalState, setAddNewModalState] = useState(false);
    const [addNewFormData, setAddNewFormData] = useState({
        productId: 0,
        centerId: 0,
        quantity: 0,
    });
    const [addNewInputStatus, setAddNewInputStatus] = useState({
        product: '',
        center: '',
        quantity: '',
    });

    const [productInvetoryList, setProductInventoryList] = useState([]);

    const [filterDropdownState, setFilterDropdownState] = useState(false);
    const filterDropdownRef = useRef(null);
    const [filterCheckboxState, setFilterCheckboxState] = useState({
        centerCheckbox: false,
        productCheckbox: false,
    });

    const [centerFilterDropdownState, setCenterFilterDropdownState] = useState(false);
    const [centerFilterItemList, setCenterFilterItemList] = useState([]);
    const centerFilterDropdownListRef = useRef(null);
    const [centerFilterSearchQuery, setCenterFilterSearchQuery] = useState("");
    const [centerCurrentFilterItem, setCenterCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [productFilterDropdownState, setProductFilterDropdownState] = useState(false);
    const [productFilterItemList, setProductFilterItemList] = useState([]);
    const productFilterDropdownListRef = useRef(null);
    const [productFilterSearchQuery, setProductFilterSearchQuery] = useState("");
    const [productCurrentFilterItem, setProductCurrentFilterItem] = useState({
        id: null,
        name: '',
    });

    const [productInventorySortOrder, setProductInventorySortOrder] = useState({
        id: null,
        product: null,
        center: null,
        quantity: null,
    });

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [pageNumberButtonList, setPageNumberButtonList] = useState([]);

    useEffect(() => {
        function handler(event) {
            if (!productDropdownRef.current.contains(event.target)) {
                setProductDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        function handler(event) {
            if (!centerDropdownRef.current.contains(event.target)) {
                setCenterDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        loadProductDropdownList();
    }, [addNewModalState, productDropdownSearchInput, tokenState.accessToken]);

    useEffect(() => {
        loadCenterDropdownList();
    }, [addNewModalState, centerDropdownSearchInput, tokenState.accessToken]);

    useEffect(() => {
        loadProductInventoryList();
    }, [tokenState.accessToken,
        productCurrentFilterItem.id,
        centerCurrentFilterItem.id,
        productInventorySortOrder.id,
        productInventorySortOrder.center,
        productInventorySortOrder.product,
        productInventorySortOrder.quantity,
        currentPageNumber,
        totalPage,
        pageNumberButtonList.length,
    ]);

    useEffect(() => {
        function handler(event) {
            if (!filterDropdownRef.current.contains(event.target)) {
                setFilterDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        function handler(event) {
            if (!centerFilterDropdownListRef.current.contains(event.target)) {
                setCenterFilterDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        function handler(event) {
            if (!productFilterDropdownListRef.current.contains(event.target)) {
                setProductFilterDropdownState(false);
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    useEffect(() => {
        loadCenterFilterDropdownList();
    }, [centerFilterSearchQuery]);

    useEffect(() => {
        loadProductFilterDropdownList();
    }, [productFilterSearchQuery]);

    useEffect(() => {
        setPageNumberButtonList(paginate(currentPageNumber, totalPage));
    }, [currentPageNumber, totalPage, pageNumberButtonList.length]);

    async function loadProductDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.PRODUCT.BASE + API_URL.PRODUCT.LIST + `?query=${productDropdownSearchInput}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let productList = await response.json();
            setProductDropdownList(productList);
        }
    }

    function selectProductDropdownItem(productId) {
        let product = productDropdownList.find(item => item.id === productId);
        setProductDropdownTextValue(product.name);
        setAddNewFormData(prevState => ({
            ...prevState,
            productId: productId,
        }));
        setProductDropdownState(false);
    }

    async function loadCenterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.LIST + `?query=${centerDropdownSearchInput}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterDropdownList(data);
        }
    }

    function selectCenterDropdownItem(centerId) {
        let center = centerDropdownList.find(item => item.id === centerId);
        setCenterDropdownTextValue(center.name);
        setAddNewFormData(prevState => ({
            ...prevState,
            centerId: centerId,
        }));
        setCenterDropdownState(false);
    }

    async function submitAddNewData() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.PRODUCT_INVENTORY.BASE, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(addNewFormData),
        });

        if (response.status === HTTP_STATUS.OK) {
            setProductDropdownTextValue('');
            setCenterDropdownTextValue('');
            setAddNewFormData(prevState => ({
                ...prevState,
                productId: 0,
                centerId: 0,
                quantity: 0,
            }));
            setAddNewInputStatus(prevstate => ({
                ...prevstate,
                product: '',
                center: '',
                quantity: '',
            }));
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            setAddNewModalState(false);
        }
    }

    async function loadProductInventoryList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        let url = API_URL.BASE + API_URL.PRODUCT_INVENTORY.BASE + API_URL.PRODUCT_INVENTORY.LIST;
        let searchParams = new URLSearchParams();
        if (centerCurrentFilterItem.id) {
            searchParams.append('centerIdFilter', centerCurrentFilterItem.id);
        }
        if (productCurrentFilterItem.id) {
            searchParams.append('productIdFilter', productCurrentFilterItem.id);
        }
        if (productInventorySortOrder.id) {
            searchParams.append('idSortOrder', productInventorySortOrder.id);
        }
        if (productInventorySortOrder.product) {
            searchParams.append('productSortOrder', productInventorySortOrder.product);
        }
        if (productInventorySortOrder.center) {
            searchParams.append('centerSortOrder', productInventorySortOrder.center);
        }
        if (productInventorySortOrder.quantity) {
            searchParams.append('quantitySortOrder', productInventorySortOrder.quantity);
        }
        searchParams.append('pageNo', currentPageNumber - 1);
        searchParams.append('pageSize', DEFAULT_PAGE_SIZE);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductInventoryList(data.productInventoryList);
            setTotalPage(data.totalPage)
        }
    }

    function onProductFilterCheckboxChange(event) {
        if (event.target.value) {
            setCenterCurrentFilterItem({
                id: null,
                name: '',
            });
            setProductFilterSearchQuery('');
        }
        setFilterCheckboxState(prevState => ({...prevState, productCheckbox: !prevState.productCheckbox}));
    }

    function onCenterFilterCheckboxChange(event) {
        if (event.target.value) {
            setCenterCurrentFilterItem({
                id: null,
                name: '',
            });
            setCenterFilterSearchQuery('');
        }
        setFilterCheckboxState(prevState => ({...prevState, centerCheckbox: !prevState.centerCheckbox}));
    }

    async function loadCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.LIST + `?query=${centerFilterSearchQuery}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterFilterItemList(data);
        }
    }

    async function loadProductFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);

        const response = await fetch(API_URL.BASE + API_URL.PRODUCT.BASE + API_URL.PRODUCT.LIST + `?query=${productFilterSearchQuery}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductFilterItemList(data);
        }
    }

    function onSetProductFilter(productId) {
        let productItem = productFilterItemList.find(item => item.id === productId);
        setProductCurrentFilterItem({
            id: productItem.id,
            name: productItem.name,
        });
        setProductFilterDropdownState(false);
    }

    function onSetCenterFilter(centerId) {
        let centerItem = centerFilterItemList.find(item => item.id === centerId);
        setCenterCurrentFilterItem({
            id: centerItem.id,
            name: centerItem.name,
        });
        setCenterFilterDropdownState(false);
    }

    function onChangeIdSortOrder() {
        setProductInventorySortOrder(prevState => {
            if (prevState.id == null) {
                return {
                    ...prevState,
                    id: SORT_DIRECTION.ASC,
                };
            } else if (prevState.id === SORT_DIRECTION.ASC) {
                return {
                    ...prevState,
                    id: SORT_DIRECTION.DESC,
                };
            } else {
                return {
                    ...prevState,
                    id: null,
                };
            }
        });
    }

    function onChangeProductSortOrder() {
        setProductInventorySortOrder(prevState => {
            if (prevState.product == null) {
                return {
                    ...prevState,
                    product: SORT_DIRECTION.ASC,
                };
            } else if (prevState.product === SORT_DIRECTION.ASC) {
                return {
                    ...prevState,
                    product: SORT_DIRECTION.DESC,
                };
            } else {
                return {
                    ...prevState,
                    product: null,
                };
            }
        });
    }

    function onChangeCenterSortOrder() {
        setProductInventorySortOrder(prevState => {
            if (prevState.center == null) {
                return {
                    ...prevState,
                    center: SORT_DIRECTION.ASC,
                };
            } else if (prevState.center === SORT_DIRECTION.ASC) {
                return {
                    ...prevState,
                    center: SORT_DIRECTION.DESC,
                };
            } else {
                return {
                    ...prevState,
                    center: null,
                };
            }
        });
    }

    function onChangeQuantitySortOrder() {
        setProductInventorySortOrder(prevState => {
            if (prevState.quantity == null) {
                return {
                    ...prevState,
                    quantity: SORT_DIRECTION.ASC,
                };
            } else if (prevState.quantity === SORT_DIRECTION.ASC) {
                return {
                    ...prevState,
                    quantity: SORT_DIRECTION.DESC,
                };
            } else {
                return {
                    ...prevState,
                    quantity: null,
                };
            }
        });
    }

    return (
        <>
        <Header />
        <div className="product-inventory-page">
            <div className="product-inventory-page__container">
                <div className="product-inventory-page__container__header">
                    <div className="product-inventory-page__container__header__title">
                        <div className="product-inventory-page__container__header__title__label">
                            <h4>Product inventory</h4>
                        </div>
                        <div className="product-inventory-page__container__header__title__search-input">
                            <input type="text" placeholder="Product inventory name" />
                        </div>
                    </div>
                    <div className="product-inventory-page__container__header__button-group">
                        <div className="product-inventory-page__container__header__button-group__left">
                            <div className="product-inventory-page__container__header__button-group__left__add-filters">
                                <div className="product-inventory-page__container__header__button-group__left__add-filters__label" onClick={() => setFilterDropdownState(true)}>Add filters</div>
                                <div className="product-inventory-page__container__header__button-group__left__add-filters__menu" style={filterDropdownState ? {} : {display: 'none'}} ref={filterDropdownRef}>
                                    <label className="product-inventory-page__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" value={filterCheckboxState.centerCheckbox} onChange={event => onCenterFilterCheckboxChange(event)} /> Center
                                    </label>
                                    <label className="product-inventory-page__container__header__button-group__left__add-filters__menu__item">
                                        <input type="checkbox" value={filterCheckboxState.productCheckbox} onChange={event => onProductFilterCheckboxChange(event)} /> Product
                                    </label>
                                </div>
                            </div>
                            <div className="product-inventory-page__container__header__button-group__left__center-filter" style={filterCheckboxState.centerCheckbox ? {} : {display: 'none'}}>
                                <div className="product-inventory-page__container__header__button-group__left__center-filter__button" onClick={() => setCenterFilterDropdownState(true)}>
                                    Center filter{centerCurrentFilterItem.name ? `: ${centerCurrentFilterItem.name}` : ''}
                                </div>
                                <div className="product-inventory-page__container__header__button-group__left__center-filter__filter-option" style={centerFilterDropdownState ? {} : {display: 'none'}} ref={centerFilterDropdownListRef}>
                                    <input type="text" placeholder="Center filter" value={centerFilterSearchQuery} onChange={event => setCenterFilterSearchQuery(event.target.value)} />
                                    {centerFilterItemList.map(item => (
                                    <div className="product-inventory-page__container__header__button-group__left__center-filter__filter-option__item" key={item.id} onClick={() => onSetCenterFilter(item.id)}>
                                        {item.name}
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-inventory-page__container__header__button-group__left__product-filter" style={filterCheckboxState.productCheckbox ? {} : {display: 'none'}}>
                                <div className="product-inventory-page__container__header__button-group__left__product-filter__button" onClick={() => setProductFilterDropdownState(true)}>
                                    Product filter{productCurrentFilterItem.name ? `: ${productCurrentFilterItem.name}` : ''}
                                </div>
                                <div className="product-inventory-page__container__header__button-group__left__product-filter__filter-option" style={productFilterDropdownState ? {} : {display: 'none'}} ref={productFilterDropdownListRef}>
                                    <input type="text" placeholder="Product filter" value={productFilterSearchQuery} onChange={event => setProductFilterSearchQuery(event.target.value)} />
                                    {productFilterItemList.map(item => (
                                    <div className="product-inventory-page__container__header__button-group__left__product-filter__filter-option__item" key={item.id} onClick={() => onSetProductFilter(item.id)}>
                                        {item.name}
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="product-inventory-page__container__header__button-group__right">
                            <div className="product-inventory-page__container__header__button-group__right__refresh-button">
                                Refresh
                            </div>
                            <div className="product-inventory-page__container__header__button-group__right__add-new-button" onClick={() => setAddNewModalState(true)}>
                                Add new
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-inventory-page__container__list">
                    <div className="product-inventory-page__container__list__header">
                        <div className="product-inventory-page__container__list__header__inventory-id" onClick={() => onChangeIdSortOrder()}>
                            Inventory ID {productInventorySortOrder.id ? (productInventorySortOrder.id === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-inventory-page__container__list__header__product" onClick={() => onChangeProductSortOrder()}>
                            Product {productInventorySortOrder.product ? (productInventorySortOrder.product === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-inventory-page__container__list__header__center" onClick={() => onChangeCenterSortOrder()}>
                            Center {productInventorySortOrder.center ? (productInventorySortOrder.center === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                        <div className="product-inventory-page__container__list__header__quantity" onClick={() => onChangeQuantitySortOrder()}>
                            Quantity {productInventorySortOrder.quantity ? (productInventorySortOrder.quantity === SORT_DIRECTION.ASC ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                        </div>
                    </div>
                    <div className="product-inventory-page__container__list__content">
                        {productInvetoryList.map(item => (
                        <div className="product-inventory-page__container__list__content__item" key={item.id}>
                            <div className="product-inventory-page__container__list__content__item__inventory-id">
                                {item.id}
                            </div>
                            <div className="product-inventory-page__container__list__content__item__product">
                                {item.product.name}
                            </div>
                            <div className="product-inventory-page__container__list__content__item__center">
                                {item.center.name}
                            </div>
                            <div className="product-inventory-page__container__list__content__item__quantity">
                                {item.quantity}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="product-inventory-page__container__pagination">
                    <div className="product-inventory-page__container__pagination__previous" onClick={() => previousPage(currentPageNumber, setCurrentPageNumber)}>
                        Previous
                    </div>
                    <div className="product-inventory-page__container__pagination__page-number-button-list">
                        {pageNumberButtonList.map(item => Number.isInteger(item) ?
                            (<div className={`product-inventory-page__container__pagination__page-number-button-list__item${item === currentPageNumber ? '--active' : ''}`} key={item} onClick={() => setCurrentPageNumber(item)}>
                                {item}
                            </div>)
                        : (<div className="product-inventory-page__container__pagination__page-number-button-list__item" key={item}>
                                {item}
                        </div>)
                        )}
                    </div>
                    <div className="product-inventory-page__container__pagination__next" onClick={() => nextPage(currentPageNumber, setCurrentPageNumber, totalPage)}>
                        Next
                    </div>
                </div>
            </div>
            <div className="product-inventory-page__add-new-modal" style={addNewModalState ? {} : {display: 'none'}}>
                <div className="product-inventory-page__add-new-modal__form">
                    <div className="product-inventory-page__add-new-modal__form__header">
                        <div className="product-inventory-page__add-new-modal__form__header__title">
                            <h5>Add new product</h5>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__header__close-button" onClick={() => setAddNewModalState(false)}>
                            Close
                        </div>
                    </div>
                    <div className="product-inventory-page__add-new-modal__form__content">
                        <div className="product-inventory-page__add-new-modal__form__content__product">
                            <div className="product-inventory-page__add-new-modal__form__content__product__label">Product</div>
                            <div className="product-inventory-page__add-new-modal__form__content__product__select">
                                <div className="product-inventory-page__add-new-modal__form__content__product__select__select-button" onClick={() => setProductDropdownState(true)}>
                                    {productDropdownTextValue ? productDropdownTextValue : 'Select a product'}
                                </div>
                                <div className={`product-inventory-page__add-new-modal__form__content__product__select__select-option ${addNewInputStatus.product ? 'input-error' : ''}`} style={productDropdownState ? {} : {display: 'none'}} ref={productDropdownRef}>
                                    <input type="text" placeholder="Product" onChange={event => setProductDropdownSearchInput(event.target.value)} />
                                    {productDropdownList.map(item => (
                                    <div className="product-inventory-page__add-new-modal__form__content__product__select__select-option__item" key={item.id} onClick={() => selectProductDropdownItem(item.id)}>{item.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-inventory-page__add-new-modal__form__content__product__error-message input-error-message">{addNewInputStatus.product ? addNewInputStatus.product : ''}</div>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__content__center">
                            <div className="product-inventory-page__add-new-modal__form__content__center__label">Center</div>
                            <div className="product-inventory-page__add-new-modal__form__content__center__select">
                                <div className="product-inventory-page__add-new-modal__form__content__center__select__select-button" onClick={() => setCenterDropdownState(true)}>
                                    {centerDropdownTextValue ? centerDropdownTextValue : 'Select a center'}
                                </div>
                                <div className={`product-inventory-page__add-new-modal__form__content__center__select__select-option ${addNewInputStatus.center ? 'input-error' : ''}`} style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                    <div className="product-inventory-page__add-new-modal__form__content__center__select__select-option__item" key={item.id} onClick={() => selectCenterDropdownItem(item.id)}>{item.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="product-inventory-page__add-new-modal__form__content__center__error-message input-error-message">{addNewInputStatus.center ? addNewInputStatus.center : ''}</div>
                        </div>
                        <div className="product-inventory-page__add-new-modal__form__content__quantity">
                            <div className="product-inventory-page__add-new-modal__form__content__quantity__label">Quantity</div>
                            <input type="text" placeholder="Quantity" name="quantity" onChange={event => handleInputChange(event, setAddNewFormData)} className={`product-inventory-page__add-new-modal__form__content__quantity_input ${addNewInputStatus.quantity ? 'input-error': ''}`} />
                            <div className="product-inventory-page__add-new-modal__form__content__quantity__error-message input-error-message">{addNewInputStatus.quantity ? addNewInputStatus.quantity : ''}</div>
                        </div>
                    </div>
                    <div className="product-inventory-page__add-new-modal__form__footer">
                        <div className="product-inventory-page__add-new-modal__form__footer__add-button" onClick={() => submitAddNewData()}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}