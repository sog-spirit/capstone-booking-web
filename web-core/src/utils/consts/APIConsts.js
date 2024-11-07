export const API_URL = {
    BASE: 'http://localhost:8080',
    USER: {
        BASE: '/user',
        REGISTER: '/register',
        LOGIN: '/login',
    },
    JWT: {
        BASE: '/jwt',
        REFRESH: '/refresh',
        LOG_OUT: '/logout',
        BLACKLIST_VERIFY: '/blacklist-verify',
        VERIFY: '/verify',
    },
    ROLE: {
        BASE: '/role',
        REGISTER_ROLE_LIST: '/register-list',
    },
    USER_ROLE: {
        BASE: '/user-role',
    },
    CENTER: {
        BASE: '/center',
        LIST: '/list',
    },
    COURT: {
        BASE: '/court',
        LIST: '/list',
    },
    PRODUCT: {
        BASE: '/product',
        LIST: '/list',
    },
    PRODUCT_INVENTORY: {
        BASE: '/product-inventory',
        LIST: '/list',
    },
    IMAGE: {
        BASE: '/image',
        PRODUCT: '/product',
    },
    EMPLOYEE_MANAGEMENT: {
        BASE: '/employee-management',
        LIST: '/list',
    },
    COURT_BOOKING: {
        BASE: '/court-booking',
        LIST: '/list',
        USER_ORDER: '/user-order',
        CENTER_OWNER: '/center-owner',
        CENTER_LIST: '/center-list',
    },
    CENTER_REVIEW: {
        BASE: '/center-review',
        LIST: '/list',
        USER: '/user',
        CENTER_OWNER: '/center-owner',
    },
};