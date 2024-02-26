import { serviceRest } from "./utils/serviceRest.js";
const btnTryOut = document.getElementById("BtnTryOut");
const inputData = document.getElementById("InputEmail");
btnTryOut.onclick = ()=>{
    onClickTryOut();
}

function onClickTryOut() {
    const userEmail = inputData.value;

    serviceRest.post("/api/user/getCards", { userEmail }, () => {
        console.error(xhr.responseText);
    });

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.error(xhr.responseText);
            if(xhr.responseText){
                window.location.replace("http://localhost:3000/check-mail");
            }
        }
    };

    xhr.open("GET", "getCard", true, email);

    xhr.send(null);
}

