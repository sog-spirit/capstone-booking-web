import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PAGE_URL } from './utils/consts/PageURLConsts';
import HomePage from './pages/Home/HomePage';
import { createContext, useEffect, useState } from 'react';
import ErrorPage from './pages/Error/ErrorPage';
import { LOGIN_STATE_CONSTS } from './utils/consts/HttpRequestConsts';
import ProductInventoryCenterOwnerPage from './pages/CenterOwnerRole/ProductInventory/ProductInventoryPage';
import CourtCenterOwnerPage from './pages/CenterOwnerRole/Court/CourtPage';
import CenterCenterOnwerPage from './pages/CenterOwnerRole/Center/CenterPage';
import ProductCenterOwnerPage from './pages/CenterOwnerRole/ProductPage/ProductPage';
import EmployeeManagementPage from './pages/CenterOwnerRole/EmployeeManagement/EmployeeManagementPage';
import UserCenterPage from './pages/UserRole/Center/UserCenterPage';
import UserCourtPage from './pages/UserRole/Court/UserCourtPage';
import UserBookingOrderList from './pages/UserRole/BookingOrder/BookingOrderList';
import BookingOrderManagement from './pages/CenterOwnerRole/BookingOrderManagement/BookingOrderManagement';
import UserCenterReview from './pages/UserRole/CenterReview/UserCenterReview';
import CenterReview from './pages/CenterOwnerRole/CenterReview/CenterReview';
import UserProductOrder from './pages/UserRole/ProductOrder/UserProductOrder';
import ProductOrder from './pages/CenterOwnerRole/ProductOrder/ProductOrder';
import CenterOwnerStatistics from './pages/CenterOwnerRole/Statistics/CenterOwnerStatistics';
import AdminAccountManagement from './pages/AdminRole/AccountManagement/AccountManagement';
import AdminContentManagement from './pages/AdminRole/ContentManagement/ContentManagement';
import AdminReportManagement from './pages/AdminRole/ReportManagement/ReportManagement';

export const LoginContext = createContext(null);
export const TokenContext = createContext(null);

export default function App() {
    const [loginState, setLoginState] = useState(() => {
        if (localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN) !== null && localStorage.getItem(LOGIN_STATE_CONSTS.ROLE) !== null) {
            return {
                isLogin: true,
                userRole: localStorage.getItem(LOGIN_STATE_CONSTS.ROLE),
                username: localStorage.getItem(LOGIN_STATE_CONSTS.USERNAME),
            };
        } else {
            return {
                isLogin: false,
                userRole: '',
                username: '',
            };
        }
    });

    const [tokenState, setTokenState] = useState(() => {
        if (localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN) !== null && localStorage.getItem(LOGIN_STATE_CONSTS.ROLE) !== null) {
            return {
                accessToken: localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN),
                refreshToken: localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN),
            };
        } else {
            return {
                accessToken: '',
                refreshToken: '',
            };
        }
    });

    useEffect(() => {
        if (localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN) !== null && localStorage.getItem(LOGIN_STATE_CONSTS.ROLE) !== null) {
            setLoginState({
                isLogin: true,
                userRole: localStorage.getItem(LOGIN_STATE_CONSTS.ROLE),
                username: localStorage.getItem(LOGIN_STATE_CONSTS.USERNAME),
            });
        } else {
            setLoginState({
                isLogin: false,
                userRole: '',
                username: '',
            });
        }
    }, [loginState.isLogin, loginState.userRole]);

    useEffect(() => {
        if (localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN) !== null && localStorage.getItem(LOGIN_STATE_CONSTS.ROLE) !== null) {
            setTokenState({
                accessToken: localStorage.getItem(LOGIN_STATE_CONSTS.ACCESS_TOKEN),
                refreshToken: localStorage.getItem(LOGIN_STATE_CONSTS.REFRESH_TOKEN),
            });
        } else {
            setTokenState({
                accessToken: '',
                refreshToken: '',
            });
        }
    }, [tokenState.accessToken, tokenState.refreshToken]);

    return (
        <LoginContext.Provider value={{loginState, setLoginState}}>
        <TokenContext.Provider value={{tokenState, setTokenState}}>
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<ErrorPage />} />
                <Route path={PAGE_URL.HOME} element={<HomePage />} />
                <Route path={PAGE_URL.REGISTER} element={<RegisterPage />} />
                <Route path={PAGE_URL.LOGIN} element={<LoginPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE} element={<CenterCenterOnwerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE + '/:centerId' + PAGE_URL.CENTER_OWNER.COURT_PAGE} element={<CourtCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_PAGE} element={<ProductCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_INVENTORY_PAGE} element={<ProductInventoryCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.EMPLOYEE_MANAGEMENT_PAGE} element={<EmployeeManagementPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.BOOKING_ORDER_MANAGEMENT} element={<BookingOrderManagement />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_REVIEW} element={<CenterReview />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_ORDER} element={<ProductOrder />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.STATISTICS} element={<CenterOwnerStatistics />} />

                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE} element={<UserCenterPage />} />
                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE + '/:centerId' + PAGE_URL.USER.COURT_PAGE} element={<UserCourtPage />} />
                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.BOOKING_ORDER_LIST} element={<UserBookingOrderList />} />
                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_REVIEW} element={<UserCenterReview />} />
                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.COURT_BOOKING + '/:courtBookingId' + PAGE_URL.USER.PRODUCT_ORDER} element={<UserProductOrder />} />

                <Route path={PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.ACCOUNT_MANAGEMENT} element={<AdminAccountManagement />} />
                <Route path={PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.CONTENT_MANAGEMENT} element={<AdminContentManagement />} />
                <Route path={PAGE_URL.ADMIN.BASE + PAGE_URL.ADMIN.REPORT_MANAGEMENT} element={<AdminReportManagement />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </TokenContext.Provider>
        </LoginContext.Provider>
    );
}