import { serviceRest } from "./utils/serviceRest.js";
const btnTryOut = document.getElementById("BtnTryOut");

let isSentMail = false;
btnTryOut.onclick = () => {
    getCards();
}

function getCards() {
    if (isSentMail) return;
    isSentMail = true;
    serviceRest.post({
        url: "/api/getCards",
        data: { userEmail: "tiennguyen.momo@gmail.com" },
        callback: () => {
            isSentMail = false;
            location.assign("/check-mail");
        },
        callbackErr: () => {
            isSentMail = false;
        }
    })
}


