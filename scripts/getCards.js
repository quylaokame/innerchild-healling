import { serviceRest } from "./utils/serviceRest.js";
const btnTryOut = document.getElementById("BtnTryOut");
const inputData = document.getElementById("InputEmail");
btnTryOut.onclick = ()=>{
    getCards();
    // onClick();
}

async function getCards() {
    // const userEmail = "tiennguyen.momo@gmail.com";
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/getCards", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.error(xhr.responseText);
                if (xhr.responseText) {
                    // window.location.replace("http://localhost:3000/check-mail");
                }
            } 
        };
        const requestBody = JSON.stringify({ userEmail: "tiennguyen.momo@gmail.com" });
        xhr.send(requestBody);
    } catch (err) {
        console.log(err.message)
    }
}

async function onClick(){
    try {
        const res = await fetch('/api/getCards', {
            method: 'POST',
            body: JSON.stringify({ userEmail: "tiennguyen.momo@gmail.com" }),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        if (res.status === 400 || res.status === 401) {
            console.error("NO RESPONSE");
        }
        console.error(data);
    } catch (err) {
        console.log(err.message)
    }
}

