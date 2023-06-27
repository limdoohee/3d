import _config from "next/config";
const publicRuntimeConfig = _config().publicRuntimeConfig;
const apiUrl = process.env.API_URL;
const session = publicRuntimeConfig.session;
import cookie from "cookie";

const api = {
    get(path, params, token) {
        let url = apiUrl + path;
        if (params) {
            url += "?" + new URLSearchParams(params);
            if (localStorage.getItem("lang") !== null || localStorage.getItem("lang") !== undefined) {
                url += `&lang=${localStorage.getItem("lang")}`;
            }
        } else {
            if (localStorage.getItem("lang") !== null || localStorage.getItem("lang") !== undefined) {
                url += `?lang=${localStorage.getItem("lang")}`;
            }
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
    post(path, params, token, ssr) {
        let url = apiUrl + path;
        if (!ssr) {
            if (localStorage.getItem("lang") !== null || localStorage.getItem("lang") !== undefined) {
                url += `?lang=${localStorage.getItem("lang")}`;
            }
        }
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
