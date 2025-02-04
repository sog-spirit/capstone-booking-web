import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HTTP_REQUEST_HEADER_NAME, HTTP_REQUEST_HEADER_VALUE, HTTP_REQUEST_METHOD } from "../../../utils/consts/HttpRequestConsts";
import { API_URL } from "../../../utils/consts/APIConsts";
import { HTTP_STATUS } from "../../../utils/consts/HttpStatusCode";
import { MESSAGE_CONSTS } from "../../../utils/consts/MessageConsts";
import { defaultSuccessToastNotification } from "../../../utils/toast/ToastUtils";
import { TokenContext } from "../../../App";
import { useContext, useEffect } from "react";
import { refreshAccessToken } from "../../../utils/jwt/JwtUtils";
import { PAGE_URL } from "../../../utils/consts/PageURLConsts";

export default function CourtBookingPayment() {
    const {tokenState, setTokenState} = useContext(TokenContext);
    const {courtBookingId} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        savePayment();
    }, []);

    async function savePayment() {
        let accessToken = await refreshAccessToken(setTokenState);
        
        const headers = new Headers();
        headers.append(HTTP_REQUEST_HEADER_NAME.CONTENT_TYPE, HTTP_REQUEST_HEADER_VALUE.APPLICATION_JSON);

        let url = API_URL.BASE + '/court-booking-payment/save-payment';
        let formData = {
            vnpAmount: searchParams.get('vnp_Amount'),
            // vnpBankCode: searchParams.get('vnp_BankCode'),
            // vnpBankTranNo: searchParams.get('vnp_BankTranNo'),
            // vnpCardType: searchParams.get('vnp_CardType'),
            // vnpOrderInfo: searchParams.get('vnp_OrderInfo'),
            vnpPayDate: searchParams.get('vnp_PayDate'),
            // vnpResponseCode: searchParams.get('vnp_ResponseCode'),
            // vnpTmnCode: searchParams.get('vnp_TmnCode'),
            vnpTransactionNo: searchParams.get('vnp_TransactionNo'),
            // vnpTransactionStatus: searchParams.get('vnp_TransactionStatus'),
            vnpTxnRef: searchParams.get('vnp_TxnRef'),
            // vnpSecureHash: searchParams.get('vnp_SecureHash'),
            courtBookingId: courtBookingId,
        };

        const response = await fetch(url, {
            method: HTTP_REQUEST_METHOD.POST,
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (response.status === HTTP_STATUS.OK) {
            let data = await response.json();
            defaultSuccessToastNotification(MESSAGE_CONSTS.ADD_SUCCESS);
            navigate(PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE + `/${data.centerId}` + PAGE_URL.USER.COURT_PAGE);
        }
    }

    return (
        <>
        </>
    );
}