import _config from "next/config";
const publicRuntimeConfig = _config().publicRuntimeConfig;
const apiUrl = process.env.API_URL;
const session = publicRuntimeConfig.session;

const api = {
    get(path, params, token) {
        let url = apiUrl + path;
        if (params) {
            url += "?" + new URLSearchParams(params);
        }
        let options = {
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, options);
    },
    post(path, params, token) {
        let url = apiUrl + path;
        let options = {
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
            body: JSON.stringify(params),
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, options);
    },
    restGet(path, params, token) {
        let url = path;
        let options = {
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
            data: params,
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, options);
    },
    restPost(path, params, token) {
        let url = path;
        let options = {
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
            body: JSON.stringify(params),
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, options);
    },
    multipart(path, params, token) {
        let url = apiUrl + path;
        let options = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, params, options);
    },
    restMultipart(path, params, token) {
        let url = path;
        let options = {
            // url: url,
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                withCredentials: true,
            },
            body: params,
        };
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }
        if (session) {
            options.headers["X-NFT-DEV-EMAIL"] = session;
        }
        return fetch(url, options);
    },
};
export default api;
