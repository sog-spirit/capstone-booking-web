import { useContext, useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TokenContext } from '../../../App';
import { refreshAccessToken } from '../../../utils/jwt/JwtUtils';
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from '../../../utils/consts/HttpRequestConsts';
import { API_URL } from '../../../utils/consts/APIConsts';
import { HTTP_STATUS } from '../../../utils/consts/HttpStatusCode';
import Header from '../../../components/Header';
import { handleClickOutsideElement } from '../../../utils/input/InputUtils';

export default function CenterOwnerStatistics() {
    const {tokenState, setTokenState} = useContext(TokenContext);

    const [centerStatisticsData, setCenterStatisticsData] = useState([]);

    const [centerDropdownState, setCenterDropdownState] = useState(false);
    const [centerDropdownList, setCenterDropdownList] = useState([]);
    const [centerDropdownSearchInput, setCenterDropdownSearchInput] = useState('');
    const [centerDropdownTextValue, setCenterDropdownTextValue] = useState('');
    const centerDropdownRef = useRef(null);
    const [centerDropdownIdValue, setCenterDropdownIdValue] = useState(0);

    const [frequencyDropdownState, setFrequencyDropdownState] = useState(false);
    const frequencyDropdownList= [
        'Daily',
        'Monthly',
        'Yearly'
    ];
    const [frequencyDropdownTextValue, setFrequencyDropdownTextValue] = useState('');
    const frequencyDropdownRef = useRef(null);

    const [rangeDropdownState, setRangeDropdownState] = useState(false);
    const [rangeDropdownSearchInput, setRangeDropdownSearchInput] = useState('');
    const rangeDropdownRef = useRef(null);

    useEffect(() => {
        loadCenterStatistics();
    }, []);

    async function loadCenterStatistics() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.COURT_BOOKING.BASE + API_URL.COURT_BOOKING.CENTER_OWNER + API_URL.COURT_BOOKING.STATISTICS + API_URL.COURT_BOOKING.CENTER;
        let searchParams = new URLSearchParams();
        searchParams.append('centerId', centerDropdownIdValue);
        searchParams.append('frequency', frequencyDropdownTextValue);
        searchParams.append('range', rangeDropdownSearchInput);

        const response = await fetch(url + `?${searchParams}`, {
            method: HTTP_REQUEST_METHOD.GET,
            headers: headers,
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            setCenterStatisticsData(data);
        }
    }

    useEffect(() => {
        handleClickOutsideElement(centerDropdownRef, setCenterDropdownState);
    }, []);

    useEffect(() => {
        loadCenterFilterDropdownList();
    }, [centerDropdownSearchInput]);

    async function loadCenterFilterDropdownList() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.AUTHORIZATION, accessToken);
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + API_URL.CENTER.BASE + API_URL.CENTER.CENTER_OWNER + API_URL.CENTER.STATISTICS + API_URL.CENTER.BASE + API_URL.CENTER.LIST;
        let searchParams = new URLSearchParams();
        searchParams.append('query', centerDropdownSearchInput);

        const response = await fetch(url + `?${searchParams}`, {
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
        setCenterDropdownIdValue(center.id);
        setCenterDropdownState(false);
    }

    useEffect(() => {
        handleClickOutsideElement(frequencyDropdownRef, setFrequencyDropdownState);
    }, []);

    function selectFrequencyDropdownItem(value) {
        setFrequencyDropdownTextValue(value);
        setFrequencyDropdownState(false);
    }

    useEffect(() => {
        handleClickOutsideElement(rangeDropdownRef, setRangeDropdownState);
    }, []);

    return (
        <>
        <Header />
        <div className="center-owner-statistics">
            <div className="center-owner-statistics__container">
                <div className="center-owner-statistics__container__header">
                    <div className="center-owner-statistics__container__header__title">
                        <h5>Center revenue statistics</h5>
                    </div>
                </div>
                <div className="center-owner-statistics__container__header__button-group">
                    <div className="center-owner-statistics__container__header__button-group__left">
                        <div className="center-owner-statistics__container__header__button-group__left__filter">
                            <div className="center-owner-statistics__container__header__button-group__left__filter__center-filter">
                                <div className="center-owner-statistics__container__header__button-group__left__filter__center-filter__button" onClick={() => setCenterDropdownState(true)}>
                                    Center filter{centerDropdownTextValue ? `: ${centerDropdownTextValue}` : ''}
                                </div>
                                <div className="center-owner-statistics__container__header__button-group__left__filter__center-filter__filter-option" style={centerDropdownState ? {} : {display: 'none'}} ref={centerDropdownRef}>
                                    <input type="text" placeholder="Center filter" onChange={event => setCenterDropdownSearchInput(event.target.value)} />
                                    {centerDropdownList.map(item => (
                                        <div className="center-owner-statistics__container__header__button-group__left__filter__center-filter__filter-option__item" onClick={() => selectCenterDropdownItem(item.id)}>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="center-owner-statistics__container__header__button-group__left__filter__frequency-filter">
                                <div className="center-owner-statistics__container__header__button-group__left__filter__frequency-filter__button" onClick={() => setFrequencyDropdownState(true)}>
                                    Frequency{frequencyDropdownTextValue ? `: ${frequencyDropdownTextValue}` : ''}
                                </div>
                                <div className="center-owner-statistics__container__header__button-group__left__filter__frequency-filter__filter-option" style={frequencyDropdownState ? {} : {display: 'none'}} ref={frequencyDropdownRef}>
                                    {frequencyDropdownList.map(item => (
                                        <div className="center-owner-statistics__container__header__button-group__left__filter__frequency-filter__filter-option__item" onClick={() => selectFrequencyDropdownItem(item)}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="center-owner-statistics__container__header__button-group__left__filter__range-filter">
                                <div className="center-owner-statistics__container__header__button-group__left__filter__range-filter__button" onClick={() => setRangeDropdownState(true)}>
                                    Range{rangeDropdownSearchInput ? `: ${rangeDropdownSearchInput}` : ''}
                                </div>
                                <div className="center-owner-statistics__container__header__button-group__left__filter__range-filter__filter-option" style={rangeDropdownState ? {} : {display: 'none'}} ref={rangeDropdownRef}>
                                    <input type="text" placeholder="Range" onChange={event => setRangeDropdownSearchInput(event.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="center-owner-statistics__container__header__button-group__right">
                        <div className="center-owner-statistics__container__header__button-group__right__refresh-button" onClick={() => loadCenterStatistics()}>
                            Refresh
                        </div>
                    </div>
                </div>
                <div className="center-owner-statistics__container__graph">
                    <ResponsiveContainer width='100%' height={450}>
                        <LineChart
                            width="100%"
                            height="100%"
                            data={centerStatisticsData}
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
        </>
    );
}