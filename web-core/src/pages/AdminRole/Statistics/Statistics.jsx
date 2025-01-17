import { useContext, useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TokenContext } from '../../../App';
import { refreshAccessToken } from '../../../utils/jwt/JwtUtils';
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from '../../../utils/consts/HttpRequestConsts';
import { API_URL } from '../../../utils/consts/APIConsts';
import { HTTP_STATUS } from '../../../utils/consts/HttpStatusCode';
import Header from '../../../components/Header';
import { handleClickOutsideElement } from '../../../utils/input/InputUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BOOKING_STATUS_CONSTS } from '../../../utils/consts/BookingStatusConsts';

export default function AdminStatistics() {
    let today = new Date();
    let sevenDayPrior = new Date();
    sevenDayPrior.setDate(today.getDate() - 7);
    today = today.toISOString().split('T')[0];
    sevenDayPrior = sevenDayPrior.toISOString().split('T')[0];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const {tokenState, setTokenState} = useContext(TokenContext);

    const [courtBookingStatisticsFilterValue, setCourtBookingStatisticsFilterValue] = useState({
        centerId: null,
        dateFrom: sevenDayPrior,
        dateTo: today,
    });

    function onCourtBookingStatisticsFilterSelect(id) {
        setCourtBookingStatisticsFilterValue(prevState => ({
            ...prevState,
            centerId: id,
        }));
        setCourtBookingStatsCenterFilterModalState(false);
    }

    function clearAllCourtBookingStatisticFilter() {
        setCourtBookingStatisticsFilterValue({
            centerId: null,
            dateFrom: null,
            dateTo: null,
        });
    }

    const [courtBookingStatisticsFilterData, setCourtBookingStatisticsFilterData] = useState([])

    const [courtBookingStatsFilterModalState, setCourtBookingStatsFilterModalState] = useState(false);
    const courtBookingStatsFilterModalStateRef = useRef(null);

    const [courtBookingStatsCenterFilterModalState, setCourtBookingStatsCenterFilterModalState] = useState(false);
    const courtBookingStatsCenterFilterModalStateRef = useRef(null);

    const [courtBookingStatsCenterFilterDropdownSearchQuery, setCourtBookingStatsCenterFilterDropdownSearchQuery] = useState('');
    const [courtBookingStatsCenterFilterDropdownList, setCourtBookingStatsCenterFilterDropdownList] = useState([]);

    const [courtBookingStatsRangeFilterModalState, setCourtBookingStatsRangeFilterModalState] = useState(false);
    const courtBookingStatsRangeFilterModalStateRef = useRef(null);

    const [courtBookingStatsRangeFrequencyOption, setCourtBookingStatsRangeFrequencyOption] = useState('daily');

    const [todayStats, setTodayStats] = useState({
        bookingCount: 0,
        bookingRevenueCount: 0,
        productOrderCount: 0,
        productOrderRevenueCount: 0,
    });

    useEffect(() => {
        loadTodayTotalBooking();
        loadTodayTotalProductOrder()
    }, [tokenState.accessToken]);

    async function loadTodayTotalBooking() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.ADMIN + API_URL.COURT_BOOKING.STATISTICS + API_URL.COURT_BOOKING.TODAY;
        let searchParams = new URLSearchParams();

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTodayStats(prevState => ({
                ...prevState,
                bookingCount: data.bookingCount,
                bookingRevenueCount: data.revenueCount,
            }));
        }
    }

    async function loadTodayTotalProductOrder() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.ADMIN + API_URL.COURT_BOOKING_PRODUCT_ORDER.STATISTICS + API_URL.COURT_BOOKING_PRODUCT_ORDER.TODAY;
        let searchParams = new URLSearchParams();

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setTodayStats(prevState => ({
                ...prevState,
                productOrderCount: data.productOrderCount,
                productOrderRevenueCount: data.revenueCount,
            }));
        }
    }

    useEffect(() => {
        handleClickOutsideElement(courtBookingStatsFilterModalStateRef, setCourtBookingStatsFilterModalState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(courtBookingStatsCenterFilterModalStateRef, setCourtBookingStatsCenterFilterModalState);
    }, []);

    useEffect(() => {
        loadCourtBookingStatsCenterFilterDropdownList();
    }, [courtBookingStatsCenterFilterDropdownSearchQuery]);

    async function loadCourtBookingStatsCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.ADMIN + API_URL.CENTER.STATISTICS + API_URL.CENTER.BASE + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', courtBookingStatsCenterFilterDropdownSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingStatsCenterFilterDropdownList(data);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(courtBookingStatsRangeFilterModalStateRef, setCourtBookingStatsRangeFilterModalState);
    }, []);

    useEffect(() => {
        submitCourtBookingStatisticsFilterValue();
    }, []);

    async function submitCourtBookingStatisticsFilterValue() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.ADMIN + API_URL.COURT_BOOKING_PRODUCT_ORDER.COURT_BOOKING + API_URL.COURT_BOOKING_PRODUCT_ORDER.STATISTICS;
        let searchParams = new URLSearchParams();
        searchParams.append('dateFrom', courtBookingStatisticsFilterValue.dateFrom);
        searchParams.append('dateTo', courtBookingStatisticsFilterValue.dateTo);
        if (courtBookingStatisticsFilterValue.centerId) {
            searchParams.append('centerId', courtBookingStatisticsFilterValue.centerId);
        }

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCourtBookingStatisticsFilterData(data);
        }
    }

    const [productOrderStatisticsFilterValue, setProductOrderStatisticsFilterValue] = useState({
        centerId: null,
        dateFrom: sevenDayPrior,
        dateTo: today,
    });

    function onProductOrderStatisticsFilterSelect(id) {
        setProductOrderStatisticsFilterValue(prevState => ({
            ...prevState,
            centerId: id,
        }));
        setProductOrderStatsCenterFilterModalState(false);
    }

    function clearAllProductOrderStatisticsFilter() {
        setProductOrderStatisticsFilterValue({
            centerId: null,
            dateFrom: null,
            dateTo: null,
        });
    }

    const [productOrderStatisticsFilterData, setProductOrderStatisticsFilterData] = useState([])

    const [productOrderStatsFilterModalState, setProductOrderStatsFilterModalState] = useState(false);
    const productOrderStatsFilterModalStateRef = useRef(null);

    const [productOrderStatsCenterFilterModalState, setProductOrderStatsCenterFilterModalState] = useState(false);
    const productOrderStatsCenterFilterModalStateRef = useRef(null);

    const [productOrderStatsCenterFilterDropdownSearchQuery, setProductOrderStatsCenterFilterDropdownSearchQuery] = useState('');
    const [productOrderStatsCenterFilterDropdownList, setProductOrderStatsCenterFilterDropdownList] = useState([]);

    const [productOrderStatsRangeFilterModalState, setProductOrderStatsRangeFilterModalState] = useState(false);
    const productOrderStatsRangeFilterModalStateRef = useRef(null);

    const [productOrderStatsRangeFrequencyOption, setProductOrderStatsRangeFrequencyOption] = useState('daily');

    useEffect(() => {
        handleClickOutsideElement(productOrderStatsFilterModalStateRef, setProductOrderStatsFilterModalState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(productOrderStatsCenterFilterModalStateRef, setProductOrderStatsCenterFilterModalState);
    }, []);

    useEffect(() => {
        loadProductOrderStatsCenterFilterDropdownList();
    }, [productOrderStatsCenterFilterDropdownSearchQuery]);

    async function loadProductOrderStatsCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.ADMIN + API_URL.CENTER.STATISTICS + API_URL.CENTER.BASE + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', productOrderStatsCenterFilterDropdownSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductOrderStatsCenterFilterDropdownList(data);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(productOrderStatsRangeFilterModalStateRef, setProductOrderStatsRangeFilterModalState);
    }, []);

    useEffect(() => {
        submitProductOrderStatisticsFilterValue();
    }, []);

    async function submitProductOrderStatisticsFilterValue() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.BASE + API_URL.COURT_BOOKING_PRODUCT_ORDER.ADMIN + API_URL.COURT_BOOKING_PRODUCT_ORDER.PRODUCT_ORDER + API_URL.COURT_BOOKING_PRODUCT_ORDER.STATISTICS;
        let searchParams = new URLSearchParams();
        searchParams.append('dateFrom', productOrderStatisticsFilterValue.dateFrom);
        searchParams.append('dateTo', productOrderStatisticsFilterValue.dateTo);
        if (productOrderStatisticsFilterValue.centerId) {
            searchParams.append('centerId', productOrderStatisticsFilterValue.centerId);
        }

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setProductOrderStatisticsFilterData(data);
        }
    }

    const [revenueStatisticsFilterValue, setRevenueStatisticsFilterValue] = useState({
        centerId: null,
        dateFrom: sevenDayPrior,
        dateTo: today,
        monthFrom: null,
        monthTo: null,
        yearFrom: null,
        yearTo: null
    });

    function onRevenueStatisticsFilterSelect(id) {
        setRevenueStatisticsFilterValue(prevState => ({
            ...prevState,
            centerId: id,
        }));
        setRevenueStatsCenterFilterModalState(false);
    }

    function clearAllRevenueStatisticFiliter() {
        setRevenueStatisticsFilterValue({centerId: null,
            dateFrom: null,
            dateTo: null,
            monthFrom: null,
            monthTo: null,
            yearFrom: null,
            yearTo: null
        });
    }

    const [revenueStatisticsFilterData, setRevenueStatisticsFilterData] = useState([])

    const [revenueStatsFilterModalState, setRevenueStatsFilterModalState] = useState(false);
    const revenueStatsFilterModalStateRef = useRef(null);

    const [revenueStatsCenterFilterModalState, setRevenueStatsCenterFilterModalState] = useState(false);
    const revenueStatsCenterFilterModalStateRef = useRef(null);

    const [revenueStatsCenterFilterDropdownSearchQuery, setRevenueStatsCenterFilterDropdownSearchQuery] = useState('');
    const [revenueStatsCenterFilterDropdownList, setRevenueStatsCenterFilterDropdownList] = useState([]);

    const [revenueStatsRangeFilterModalState, setRevenueStatsRangeFilterModalState] = useState(false);
    const revenueStatsRangeFilterModalStateRef = useRef(null);

    const [revenueStatsRangeFrequencyOption, setRevenueStatsRangeFrequencyOption] = useState('daily');

    useEffect(() => {
        handleClickOutsideElement(revenueStatsFilterModalStateRef, setRevenueStatsFilterModalState);
    }, []);

    useEffect(() => {
        handleClickOutsideElement(revenueStatsCenterFilterModalStateRef, setRevenueStatsCenterFilterModalState);
    }, []);

    useEffect(() => {
        loadRevenueStatsCenterFilterDropdownList();
    }, [revenueStatsCenterFilterDropdownSearchQuery]);

    async function loadRevenueStatsCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.ADMIN + API_URL.CENTER.STATISTICS + API_URL.CENTER.BASE + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', productOrderStatsCenterFilterDropdownSearchQuery);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setRevenueStatsCenterFilterDropdownList(data);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(revenueStatsRangeFilterModalStateRef, setRevenueStatsRangeFilterModalState);
    }, []);

    useEffect(() => {
        submitRevenueStatisticsFilterValue();
    }, []);

    async function submitRevenueStatisticsFilterValue() {
        let accessToken = await refreshAccessToken(setTokenState);

        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.ADMIN + API_URL.COURT_BOOKING.STATISTICS + API_URL.COURT_BOOKING.CENTER;
        let searchParams = new URLSearchParams();

        if (revenueStatsRangeFrequencyOption === 'daily') {
            searchParams.append('dateFrom', revenueStatisticsFilterValue.dateFrom);
            searchParams.append('dateTo', revenueStatisticsFilterValue.dateTo);
        }

        if (revenueStatsRangeFrequencyOption === 'monthly') {
            searchParams.append('monthFrom', revenueStatisticsFilterValue.monthFrom);
            searchParams.append('monthTo', revenueStatisticsFilterValue.monthTo);
        }

        if (revenueStatsRangeFrequencyOption === 'yearly') {
            searchParams.append('yearFrom', revenueStatisticsFilterValue.yearFrom);
            searchParams.append('yearTo', revenueStatisticsFilterValue.yearTo);
        }

        if (revenueStatisticsFilterValue.centerId) {
            searchParams.append('centerId', revenueStatisticsFilterValue.centerId);
        }

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setRevenueStatisticsFilterData(data);
        }
    }

    return (
        <>
        <Header />
        <div className="admin-statistics">
            <div className="admin-statistics__container">
                <div className="admin-statistics__container__header">
                    <div className="admin-statistics__container__header__title">
                        <h5>Center revenue statistics</h5>
                    </div>
                    <div className="admin-statistics__container__header__today-stats">
                        <div className="admin-statistics__container__header__today-stats__total-booking">
                            <div className="admin-statistics__container__header__today-stats__total-booking__info">
                                <div className="admin-statistics__container__header__today-stats__total-booking__info__count">
                                    {todayStats.bookingCount ? todayStats.bookingCount : 0}
                                </div>
                                <div className="admin-statistics__container__header__today-stats__total-booking__info__value-container">
                                    <div className="admin-statistics__container__header__today-stats__total-booking__info__value-container__value">
                                        {todayStats.bookingRevenueCount ? todayStats.bookingRevenueCount : 0} ₫
                                    </div>
                                </div>
                            </div>
                            <div className="admin-statistics__container__header__today-stats__total-booking__label">
                                Total booking today
                            </div>
                        </div>
                        <div className="admin-statistics__container__header__today-stats__total-product-order">
                            <div className="admin-statistics__container__header__today-stats__total-product-order__info">
                                <div className="admin-statistics__container__header__today-stats__total-product-order__info__count">
                                    {todayStats.productOrderCount ? todayStats.productOrderCount : 0}
                                </div>
                                <div className="admin-statistics__container__header__today-stats__total-product-order__info__value-container">
                                    <div className="admin-statistics__container__header__today-stats__total-product-order__info__value-container__value">
                                        {todayStats.productOrderRevenueCount ? todayStats.productOrderRevenueCount : 0} ₫
                                    </div>
                                </div>
                            </div>
                            <div className="admin-statistics__container__header__today-stats__total-product-order__label">
                                Total product order today
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin-statistics__container__graphs">
                    <div className="admin-statistics__container__graphs__court-booking">
                        <div className="admin-statistics__container__graphs__court-booking__header">
                            <div className="admin-statistics__container__graphs__court-booking__header__label">
                                Court booking
                            </div>
                            <div className="admin-statistics__container__graphs__court-booking__header__filters">
                                <div className="admin-statistics__container__graphs__court-booking__header__filters__label" onClick={() => setCourtBookingStatsFilterModalState(true)}>
                                    Filters
                                </div>
                                <div className="admin-statistics__container__graphs__court-booking__header__filters__menu" style={courtBookingStatsFilterModalState ? {} : {display: 'none'}} ref={courtBookingStatsFilterModalStateRef}>
                                    <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__clear-all">
                                        <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__clear-all__button" onClick={() => clearAllCourtBookingStatisticFilter()}>
                                            Clear all
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center">
                                        <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center__label">
                                            Center:  {courtBookingStatisticsFilterValue.centerId ? `id: ${courtBookingStatisticsFilterValue.centerId}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center__input">
                                            <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center__input__button" onClick={() => setCourtBookingStatsCenterFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center__input__option" style={courtBookingStatsCenterFilterModalState ? {} : {display: 'none'}} ref={courtBookingStatsCenterFilterModalStateRef}>
                                                <input type="text" placeholder="Center search" onChange={event => setCourtBookingStatsCenterFilterDropdownSearchQuery(event.target.value)} />
                                                {courtBookingStatsCenterFilterDropdownList.map(item => (
                                                    <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__center__input__option__item" onClick={() => onCourtBookingStatisticsFilterSelect(item.id)}>
                                                        {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range">
                                        <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range__label">
                                            Range: {courtBookingStatisticsFilterValue.dateFrom && courtBookingStatisticsFilterValue.dateTo ? `${courtBookingStatisticsFilterValue.dateFrom} to ${courtBookingStatisticsFilterValue.dateTo}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range__input">
                                            <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range__input__button" onClick={() => setCourtBookingStatsRangeFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range__input__option" style={courtBookingStatsRangeFilterModalState ? {} : {display: 'none'}} ref={courtBookingStatsRangeFilterModalStateRef}>
                                                <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__range__input__option__type__daily" style={courtBookingStatsRangeFrequencyOption === 'daily' ? {} : {display: 'none'}}>
                                                    From:
                                                    <input type="date" value={courtBookingStatisticsFilterValue.dateFrom} onChange={event => setCourtBookingStatisticsFilterValue(prevState => ({...prevState, dateFrom: event.target.value}))} />
                                                    To:
                                                    <input type="date" value={courtBookingStatisticsFilterValue.dateTo} onChange={event => setCourtBookingStatisticsFilterValue(prevState => ({...prevState, dateTo: event.target.value}))} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__court-booking__header__filters__menu__button" onClick={() => submitCourtBookingStatisticsFilterValue()}>
                                        Search
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="admin-statistics__container__graphs__court-booking__graph">
                            <ResponsiveContainer width='100%' height={400}>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={courtBookingStatisticsFilterData}
                                        dataKey="totalCourtBookings"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#8884d8"
                                        label
                                    >
                                        {courtBookingStatisticsFilterData.map((entry, index) => (
                                        <Cell name={BOOKING_STATUS_CONSTS.INDEX[entry.status]} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                    </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="admin-statistics__container__graphs__product-order">
                        <div className="admin-statistics__container__graphs__product-order__header">
                            <div className="admin-statistics__container__graphs__product-order__header__label">
                                Product order
                            </div>
                            <div className="admin-statistics__container__graphs__product-order__header__filters">
                                <div className="admin-statistics__container__graphs__product-order__header__filters__label" onClick={() => setProductOrderStatsFilterModalState(true)}>
                                    Filters
                                </div>
                                <div className="admin-statistics__container__graphs__product-order__header__filters__menu" style={productOrderStatsFilterModalState ? {} : {display: 'none'}} ref={productOrderStatsFilterModalStateRef}>
                                    <div className="admin-statistics__container__graphs__product-order__header__filters__menu__clear-all">
                                        <div className="admin-statistics__container__graphs__product-order__header__filters__menu__clear-all__button" onClick={() => clearAllProductOrderStatisticsFilter()}>
                                            Clear all
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center">
                                        <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center__label">
                                            Center: {productOrderStatisticsFilterValue.centerId ? `id: ${productOrderStatisticsFilterValue.centerId}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center__input">
                                            <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center__input__button" onClick={() => setProductOrderStatsCenterFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center__input__option" style={productOrderStatsCenterFilterModalState ? {} : {display: 'none'}} ref={productOrderStatsCenterFilterModalStateRef}>
                                                <input type="text" placeholder="Center search" onChange={event => setProductOrderStatsCenterFilterDropdownSearchQuery(event.target.value)} />
                                                {productOrderStatsCenterFilterDropdownList.map(item => (
                                                    <div className="admin-statistics__container__graphs__product-order__header__filters__menu__center__input__option__item" onClick={() => onProductOrderStatisticsFilterSelect(item.id)}>
                                                        {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range">
                                        <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range__label">
                                            Range: {productOrderStatisticsFilterValue.dateFrom && productOrderStatisticsFilterValue.dateTo ? `${productOrderStatisticsFilterValue.dateFrom} to ${productOrderStatisticsFilterValue.dateTo}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range__input">
                                            <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range__input__button" onClick={() => setProductOrderStatsRangeFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range__input__option" style={productOrderStatsRangeFilterModalState ? {} : {display: 'none'}} ref={productOrderStatsRangeFilterModalStateRef}>
                                                <div className="admin-statistics__container__graphs__product-order__header__filters__menu__range__input__option__type__daily" style={productOrderStatsRangeFrequencyOption === 'daily' ? {} : {display: 'none'}}>
                                                    From:
                                                    <input type="date" value={productOrderStatisticsFilterValue.dateFrom} onChange={event => setProductOrderStatisticsFilterValue(prevState => ({...prevState, dateFrom: event.target.value}))} />
                                                    To:
                                                    <input type="date" value={productOrderStatisticsFilterValue.dateTo} onChange={event => setProductOrderStatisticsFilterValue(prevState => ({...prevState, dateTo: event.target.value}))} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__product-order__header__filters__menu__button" onClick={() => submitProductOrderStatisticsFilterValue()}>
                                        Search
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="admin-statistics__container__graphs__product-order__graph">
                            <ResponsiveContainer width='100%' height={400}>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={productOrderStatisticsFilterData}
                                        dataKey="totalOrders"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#8884d8"
                                        label
                                    >
                                        {productOrderStatisticsFilterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                    </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="admin-statistics__container__graphs__revenue">
                        <div className="admin-statistics__container__graphs__revenue__header">
                            <div className="admin-statistics__container__graphs__revenue__header__label">
                                Revenue
                            </div>
                            <div className="admin-statistics__container__graphs__revenue__header__filters">
                                <div className="admin-statistics__container__graphs__revenue__header__filters__label" onClick={() => setRevenueStatsFilterModalState(true)}>
                                    Filters
                                </div>
                                <div className="admin-statistics__container__graphs__revenue__header__filters__menu" style={revenueStatsFilterModalState ? {} : {display: 'none'}} ref={revenueStatsFilterModalStateRef}>
                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__clear-all">
                                        <div className="admin-statistics__container__graphs__revenue__header__filters__menu__clear-all__button" onClick={() => clearAllRevenueStatisticFiliter()}>
                                            Clear all
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center">
                                        <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center__label">
                                            Center: {revenueStatisticsFilterValue.centerId ? `id: ${revenueStatisticsFilterValue.centerId}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center__input">
                                            <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center__input__button" onClick={() => setRevenueStatsCenterFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center__input__option" style={revenueStatsCenterFilterModalState ? {} : {display: 'none'}} ref={revenueStatsCenterFilterModalStateRef}>
                                                <input type="text" placeholder="Center search" onChange={event => setRevenueStatsCenterFilterDropdownSearchQuery(event.target.value)} />
                                                {revenueStatsCenterFilterDropdownList.map(item => (
                                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__center__input__option__item" onClick={() => onRevenueStatisticsFilterSelect(item.id)}>
                                                        {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range">
                                        <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__label">
                                            Range: {revenueStatisticsFilterValue.dateFrom && revenueStatisticsFilterValue.dateTo ? `${revenueStatisticsFilterValue.dateFrom} to ${revenueStatisticsFilterValue.dateTo}` : ''}
                                            {revenueStatisticsFilterValue.monthFrom && revenueStatisticsFilterValue.monthTo ? `${revenueStatisticsFilterValue.monthFrom} to ${revenueStatisticsFilterValue.monthTo}` : ''}
                                            {revenueStatisticsFilterValue.yearFrom && revenueStatisticsFilterValue.yearTo ? `${revenueStatisticsFilterValue.yearFrom} to ${revenueStatisticsFilterValue.yearTo}` : ''}
                                        </div>
                                        <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input">
                                            <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__button" onClick={() => setRevenueStatsRangeFilterModalState(true)}>
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </div>
                                            <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option" style={revenueStatsRangeFilterModalState ? {} : {display: 'none'}} ref={revenueStatsRangeFilterModalStateRef}>
                                                <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type">
                                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__label">
                                                        Frequency
                                                    </div>
                                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__value">
                                                        <label className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__value__item">
                                                            <input type="radio" value="daily" checked={revenueStatsRangeFrequencyOption === 'daily'} onChange={event => setRevenueStatsRangeFrequencyOption(event.target.value)} /> Daily
                                                        </label>
                                                        <label className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__value__item">
                                                            <input type="radio" value="monthly" checked={revenueStatsRangeFrequencyOption === 'monthly'} onChange={event => setRevenueStatsRangeFrequencyOption(event.target.value)} /> Monthly
                                                        </label>
                                                        <label className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__value__item">
                                                            <input type="radio" value="yearly" checked={revenueStatsRangeFrequencyOption === 'yearly'} onChange={event => setRevenueStatsRangeFrequencyOption(event.target.value)} /> Yearly
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__daily" style={revenueStatsRangeFrequencyOption === 'daily' ? {} : {display: 'none'}}>
                                                    From:
                                                    <input type="date" value={revenueStatisticsFilterValue.dateFrom} onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, dateFrom: event.target.value}))} />
                                                    To:
                                                    <input type="date" value={revenueStatisticsFilterValue.dateTo} onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, dateTo: event.target.value}))} />
                                                </div>
                                                <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__monthly" style={revenueStatsRangeFrequencyOption === 'monthly' ? {} : {display: 'none'}}>
                                                    From:
                                                    <input type="month" onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, monthFrom: event.target.value}))} />
                                                    To:
                                                    <input type="month" onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, monthTo: event.target.value}))} />
                                                </div>
                                                <div className="admin-statistics__container__graphs__revenue__header__filters__menu__range__input__option__type__yearly" style={revenueStatsRangeFrequencyOption === 'yearly' ? {} : {display: 'none'}}>
                                                    From:
                                                    <input type="text" placeholder="yyyy" onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, yearFrom: event.target.value}))} />
                                                    To:
                                                    <input type="text" placeholder="yyyy" onChange={event => setRevenueStatisticsFilterValue(prevState => ({...prevState, yearTo: event.target.value}))} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-statistics__container__graphs__revenue__header__filters__menu__button" onClick={() => submitRevenueStatisticsFilterValue()}>
                                        Search
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="admin-statistics__container__graphs__revenue__graph">
                        <ResponsiveContainer width='100%' height={450}>
                            <LineChart
                                width="100%"
                                height="100%"
                                data={revenueStatisticsFilterData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="courtFee" stroke="#8884d8" />
                                <Line type="monotone" dataKey="centerFee" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}