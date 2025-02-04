export const BOOKING_STATUS_CONSTS = {
    PENDING: 1,
    BOOKED: 2,
    UNAVAILABLE: 3,
    CANCELLED: 5,

    NAME: {
        AVAILABLE: 'Available',
        IS_BOOKING: 'Pending',
        BOOKED: 'Booked',
        UNAVAILABLE: 'Unavailable',
        SELECT: 'Select',
        CANCELLED: 'Cancelled',
    },
    COLOR: {
        AVAILABLE: '#fff',
        IS_BOOKING: '#198754',
        BOOKED: '#dc3545',
        UNAVAILABLE: '#6c757d',
        SELECT: '#79a942',
    },
    INDEX: ['Available', 'Pending', 'Booked', 'Unavailable', 'Select', 'Cancelled'],
};

export function getBookingStatusColor(statusColor) {
    switch (statusColor) {
        case BOOKING_STATUS_CONSTS.NAME.AVAILABLE:
            return BOOKING_STATUS_CONSTS.COLOR.AVAILABLE;
        case BOOKING_STATUS_CONSTS.NAME.IS_BOOKING:
            return BOOKING_STATUS_CONSTS.COLOR.IS_BOOKING;
        case BOOKING_STATUS_CONSTS.NAME.BOOKED:
            return BOOKING_STATUS_CONSTS.COLOR.BOOKED;
        case BOOKING_STATUS_CONSTS.NAME.UNAVAILABLE:
            return BOOKING_STATUS_CONSTS.COLOR.UNAVAILABLE;
        case BOOKING_STATUS_CONSTS.NAME.SELECT:
            return BOOKING_STATUS_CONSTS.COLOR.SELECT;
        default:
            return '';
    }
}