// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import { useEffect } from "react";

// export default function Notification() {
//     useEffect(() => {
//         socketConnection();
//     }, []);

//     function socketConnection() {
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = Stomp.over(socket);

//         stompClient.connect({}, () => {
//             console.log("Connected");

//             // Subscribe to the private queue
//             stompClient.subscribe('/user/queue/notification', (message) => {
//                 console.log("Received message: ", JSON.parse(message.body));
//             });

//             // Send a message to the server
//             stompClient.send('/app/send', {}, JSON.stringify({ text: "Hello Server" }));
//         });
//     }

//     return (
//         <>
//         </>
//     );
// }