//------------------------------------------------------------------------------- Module
import Router, { useRouter } from "next/router";
import { makeAutoObservable, toJS, configure } from "mobx";
import copy from "copy-to-clipboard";
import { BrowserView, MobileView, isBrowser, isMobile, isAndroid } from "react-device-detect";
import Cookies from "react-cookies";
// import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import ReactGA from "react-ga4";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
import i18n from "../_lib/module/i18n";
import { useTranslation } from "react-i18next";
//------------------------------------------------------------------------------- Module
configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    buildId = null;
    i18n = i18n;

    ui = {
        gnbOpen: false,
        chatOpen: false,
        pointOpen: false,
        alarmOpen: false,
        magazineOpen: false,
        dropListOpen: false,
    };

    pageInit = false;

    messageApi = null;

    firebaseConfig = {
        apiKey: "AIzaSyCwZtLeU5e0_Fs-Rv435wGJVYNUSJsaKvg",
        authDomain: "dropkitchen-bedde.firebaseapp.com",
        databaseURL: "https://dropkitchen-bedde-default-rtdb.firebaseio.com",
        projectId: "dropkitchen-bedde",
        storageBucket: "dropkitchen-bedde.appspot.com",
        messagingSenderId: "998669151634",
        appId: "1:998669151634:web:0d49a1e3107633eeb9a54b",
        measurementId: "G-6065J3XYB0",
    };

    policyContent = null;

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    changeLanguage(lng) {
        i18n.changeLanguage(lng);
    }
    t(key) {
        const { t } = useTranslation();
        return t(key);
    }

    debug(data) {
        if (process.env.STAGE == "LOCAL" || process.env.STAGE == "DEVELOPMENT" || process.env.STAGE == "STAGING" || process.env.STAGE == "prodtest") {
            console.log(`[Debug:${process.env.STAGE}]`, toJS(data));
        }
    }

    uiChange(key, value) {
        this.ui[key] = value;
    }

    numberFormat(val) {
        return val ? val.toLocaleString() : 0;
    }

    getBuildId() {
        this.buildId = JSON.parse(document.querySelector("#__NEXT_DATA__").textContent).buildId;
    }

    onShare(props) {
        const { title, description, url, text, callback } = props;
        // var broswerInfo = navigator.userAgent;
        // var webViewCheck = broswerInfo.indexOf(";;;aos;") !== -1 ? true : false;
        // if (isMobile) {
        //     if (isAndroid && webViewCheck) {
        //         window.AndroidShareHandler.share("", "", url);
        //     } else {
        //         if (navigator.share) {
        //             navigator.share({
        //                 title: title ? title : "", // 공유될 제목
        //                 text: text ? text : "", // 공유될 설명
        //                 url: url, // 공유될 URL
        //             });
        //         } else {
        //             copy(`${url}`);
        //             // this.snackbarOpen(
        //             //     true,
        //             //     <div className="snackbar-contents info-green">
        //             //         <h4>{description ? description : "링크가 복사되었습니다.1"}</h4>
        //             //     </div>,
        //             // );
        //         }
        //     }
        // } else {
        //     copy(`${url}`);
        //     // this.snackbarOpen(
        //     //     true,
        //     //     <div className="snackbar-contents info-green">
        //     //         <h4>{description ? description : "링크가 복사되었습니다.2"}</h4>
        //     //     </div>,
        //     // );
        // }

        window.location.href = "native://share?contents=" + encodeURI(url);
        callback && callback();
    }

    init() {
        var action = () => {
            // localStorage 기본 언어 설정
            let defaultLanguage = "en";
            if (localStorage.getItem("lang")) {
                defaultLanguage = localStorage.getItem("lang");
            }
            localStorage.setItem("lang", defaultLanguage);
            this.store.lang.changeLanguage(defaultLanguage);
            Cookies.save("lang", defaultLanguage);
            this.pageInit = true;
            this.debug("페이지 Init 완료");
            this.debug(this.pageInit);

            this.analysisSubmit({
                component: "",
                componentId: "",
                action: "enter",
            });
        };

        // 브라우저 환경 필터링
        var broswerInfo = navigator.userAgent;
        var webViewCheck = broswerInfo.indexOf(";;;aos;") !== -1 ? true : false;

        var userAgent = window.navigator.userAgent.toLowerCase();
        var isIOSWebView = /iphone|ipod|ipad/.test(userAgent) && !/safari/.test(userAgent);

        if (webViewCheck || isIOSWebView) {
            this.debug("Check : 웹뷰인 경우");
            action();
        } else {
            if (localStorage.getItem("browserDebug") !== "Y") {
                if (isMobile) {
                    this.debug("Check : 웹뷰가 아니면서 모바일");
                    location.href = "https://dropkitchen.xyz/";
                } else {
                    this.debug("Check : 웹뷰가 아니면서 모바일이 아닌 경우");
                    location.href = "https://dropkitchen.xyz/";
                }
            } else {
                this.debug("Check : 웹뷰가 아닌데 디버깅이 가능한 경우");
                action();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 데이터 수집
    async analysisSubmit(params, callback) {
        await this.getBuildId();
        params.memberSeq = this.store.auth.loginResult.seq;
        params.screenUrl = Router.asPath;
        params.fromType = Router.query.fromType ? Router.query.fromType : null;
        params.buildId = this.buildId;
        this.debug(params);
        await await Api.post(`/dks-api/v2/analysis/submit`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.debug(data.data ? data.data : data);
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 데이터 수집

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
    async policy(params, callback) {
        await Api.get(`/dks-api/v2/policy`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                if (data.result == "ok") {
                    this.policyContent = data.data.content;
                }
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경

    messageApiLoad(el) {
        this.messageApi = el;
    }

    // ReactGA
    gtm = null;
    fbq = null;
    twq = null;
    gaId = "G-TKT2T3MCKT";
    gtmId = "GTM-P5FWLBF";
    facebookId = "688390069534103";
    twitterId = "od7q0";

    gaCheck(pathname, search, dataLayer) {
        /////////////////////////////////////////////////////////////////////////////////// ReactGA
        const code = this.gaId;
        // ReactGA.initialize(code);
        // ReactGA.pageview(pathname + search);
        // var dataLayer = window.dataLayer || [];
        // function gtag() {
        //     dataLayer.push(arguments);
        // }
        // gtag("js", new Date());
        // gtag("config", code);

        ReactGA.initialize(code);
        /////////////////////////////////////////////////////////////////////////////////// ReactGA
        /////////////////////////////////////////////////////////////////////////////////// ReactGTM
        const tagManagerArgs = {
            gtmId: this.gtmId,
        };
        TagManager.initialize(tagManagerArgs);

        this.gtm = TagManager;

        // const tagManagerArgs = {
        //     dataLayer: {
        //         userId: "001",
        //         userProject: "project",
        //         page: "home",
        //     },
        //     dataLayerName: "PageDataLayer",
        // };
        // this.gtm.dataLayer(tagManagerArgs)

        // dataLayer = dataLayer || [];
        // function gtag() {
        //     dataLayer.push(arguments);
        // }
        // gtag("js", new Date());

        // gtag("config", "G-TKT2T3MCKT");

        // (function (w, d, s, l, i) {
        //     w[l] = w[l] || [];
        //     w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        //     var f = d.getElementsByTagName(s)[0],
        //         j = d.createElement(s),
        //         dl = l != "dataLayer" ? "&l=" + l : "";
        //     j.async = true;
        //     j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        //     f.parentNode.insertBefore(j, f);
        // })(window, document, "script", "dataLayer", "GTM-P5FWLBF");

        /////////////////////////////////////////////////////////////////////////////////// ReactGTM
        /////////////////////////////////////////////////////////////////////////////////// Facebook Pixel
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        fbq("init", this.facebookId);
        fbq("track", "PageView");
        this.fbq = fbq;
        this.debug(fbq);
        /////////////////////////////////////////////////////////////////////////////////// Facebook Pixel
        /////////////////////////////////////////////////////////////////////////////////// Twitter
        !(function (e, t, n, s, u, a) {
            e.twq ||
                ((s = e.twq =
                    function () {
                        s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                    }),
                (s.version = "1.1"),
                (s.queue = []),
                (u = t.createElement(n)),
                (u.async = !0),
                (u.src = "//static.ads-twitter.com/uwt.js"),
                (a = t.getElementsByTagName(n)[0]),
                a.parentNode.insertBefore(u, a));
        })(window, document, "script");
        twq("init", this.twitterId);
        twq("track", "PageView");
        this.twq = twq;
        /////////////////////////////////////////////////////////////////////////////////// Twitter
        /////////////////////////////////////////////////////////////////////////////////// Clarity
        (function (c, l, a, r, i, t, y) {
            c[a] =
                c[a] ||
                function () {
                    (c[a].q = c[a].q || []).push(arguments);
                };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "fm4ync5fwa");
        /////////////////////////////////////////////////////////////////////////////////// Clarity
    }
}
//////////////////////////// makeAutoObservable

export default Store;
