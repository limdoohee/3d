//------------------------------------------------------------------------------- Module
import Router, { useRouter } from "next/router";
import { makeAutoObservable, toJS, configure } from "mobx";
import copy from "copy-to-clipboard";
import { BrowserView, MobileView, isBrowser, isMobile, isAndroid } from "react-device-detect";
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
        console.log(key, value);
    }

    numberFormat(val) {
        return val ? val.toLocaleString() : 0;
    }

    getBuildId() {
        this.buildId = JSON.parse(document.querySelector("#__NEXT_DATA__").textContent).buildId;
    }

    onShare(props) {
        const { title, description, url, text } = props;
        var broswerInfo = navigator.userAgent;
        var webViewCheck = broswerInfo.indexOf(";;;aos;") !== -1 ? true : false;
        if (isMobile) {
            if (isAndroid && webViewCheck) {
                window.AndroidShareHandler.share("", "", url);
            } else {
                if (navigator.share) {
                    navigator.share({
                        title: title ? title : "", // 공유될 제목
                        text: text ? text : "", // 공유될 설명
                        url: url, // 공유될 URL
                    });
                } else {
                    copy(`${url}`);
                    // this.snackbarOpen(
                    //     true,
                    //     <div className="snackbar-contents info-green">
                    //         <h4>{description ? description : "링크가 복사되었습니다.1"}</h4>
                    //     </div>,
                    // );
                }
            }
        } else {
            copy(`${url}`);
            // this.snackbarOpen(
            //     true,
            //     <div className="snackbar-contents info-green">
            //         <h4>{description ? description : "링크가 복사되었습니다.2"}</h4>
            //     </div>,
            // );
        }
    }

    init() {
        // localStorage 기본 언어 설정
        localStorage.getItem("lang") && this.store.lang.changeLanguage(localStorage.getItem("lang"));
        this.pageInit = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
}
//////////////////////////// makeAutoObservable

export default Store;
