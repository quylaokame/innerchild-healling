class ServiceRest {
    encodeQueryData(data) {
        return Object.keys(data).map(function(key) {
            return [key, data[key]].map(encodeURIComponent).join("=");
        }).join("&");
    };

    get({url = '', params = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const querystring = '?' + this.encodeQueryData(params);
        const fullURL = apiUrl + url + querystring;
        const request = new XMLHttpRequest();
        request.open("GET", fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //get status text
                if (callback) {
                    if (request.responseText) {
                        callback(JSON.parse(request.responseText));
                    } else {
                        callbackErr();
                    }
                }
            } else if (request.readyState === 0) {
                callbackErr();
            }
            if (request.status !== 200) {
                callbackErr();
            }
        };
        request.ontimeout = function (e) {
            callbackErr();
        };
        request.onerror = (e) => {
            callbackErr();
        };
        request.send();
    };
    
    getWithHeader({url = '', params = {}, headers = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const querystring = '?' + this.encodeQueryData(params);
        const fullURL = apiUrl + url + querystring;
        const request = new XMLHttpRequest();
        request.open("GET", fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        
        Object.keys(headers).forEach( (key) => {
            request.setRequestHeader(key, headers[key]);
        });

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //get status text
                if (callback) {
                    if (request.responseText) {
                        callback(JSON.parse(request.responseText));
                    } else {
                        callbackErr();
                    }
                }
            } else if (request.readyState === 0) {
                callbackErr();
            }
            if (request.status !== 200) {
                callbackErr();
            }
        };
        request.ontimeout = function () {
            callbackErr();
        };
        request.onerror = () => {
            callbackErr();
        };
        request.send();
    };

    post({url = '', data = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const dataPost = this.encodeQueryData(data);
        const fullURL = apiUrl + url;
        const request = new XMLHttpRequest();
        request.open('POST', fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                if (request.responseText) {
                    callback({
                        status: request.status,
                        data: JSON.parse(request.responseText)
                    });
                } else {
                    callbackErr();
                }
            } else if (request.readyState === 0) {
                callbackErr();
            }
            if (request.status !== 200) {
                callbackErr();
            }
        };
        request.ontimeout = function (e) {
            callbackErr();
        };
        request.onerror = (e) => {
            callbackErr();
        };
        request.send(dataPost);
    };

    postWithHeader ({url = '',params = {}, headers = {}, data = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const dataPost = JSON.stringify(data);
        const querystring = '?' + this.encodeQueryData(params);
        const fullURL = apiUrl + url + querystring;
        const request = new XMLHttpRequest();
        request.open('POST', fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader('Content-type', 'application/json');

        Object.keys(headers).forEach( (key) => {
            request.setRequestHeader(key, headers[key]);
        });

        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                if (request.responseText) {
                    callback({
                        status: request.status,
                        data: JSON.parse(request.responseText)
                    });
                } else {
                    callbackErr();
                }
            } else if (request.readyState === 0) {
                callbackErr();
            }
            if (request.status !== 200) {
                callbackErr();
            }
        };
        request.ontimeout = function (e) {
            callbackErr();
        };
        request.onerror = (e) => {
            callbackErr();
        };
        request.send(dataPost);
    };

    postRaw({url = '', data = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const dataPost = data;
        const fullURL = apiUrl + url;
        const request = new XMLHttpRequest();
        request.open('POST', fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function() {
            if(request.status == 200) {
                callback({
                    status: request.status,
                    data: request.responseText
                });
            } else {
                callbackErr();
            }
        };
        request.ontimeout = function (e) {
            callbackErr();
        };
        request.onerror = (e) => {
            callbackErr();
        };
        request.send(dataPost);
    };

    put({url = '', data = {}, callback = (data) => {}, apiUrl = '', callbackErr = () => {}}) {
        const dataPost = this.encodeQueryData(data);
        const fullURL = apiUrl + url;
        const request = new XMLHttpRequest();
        request.open('PUT', fullURL, true);
        request.timeout = 15000;
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                if (request.responseText) {
                    callback({
                        status: request.status,
                        data: JSON.parse(request.responseText)
                    });
                } else {
                    callbackErr();
                }
            } else if (request.readyState === 0) {
                callbackErr();
            }
            if (request.status !== 200) {
                callbackErr();
            }
        };
        request.ontimeout = function (e) {
            callbackErr();
        };
        request.onerror = (e) => {
            callbackErr();
        };
        request.send(dataPost);
    };
};

export const serviceRest = new ServiceRest();
