//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
import i18n from "../_lib/module/i18n";
import { useTranslation } from "react-i18next";
import Cookies from "react-cookies";
//------------------------------------------------------------------------------- Module
configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    i18n = i18n;

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    changeLanguage(lng) {
        this.i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
        Cookies.save("lang", lng);
        this.changeLangApi({ lang: lng });
    }

    check() {
        if (localStorage.getItem("lang")) {
            return localStorage.getItem("lang");
        } else {
            return this.i18n.language;
        }
    }

    t(key) {
        const { t } = useTranslation();
        return t(key);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
    async changeLangApi(params, callback) {
        await Api.post(`/dks-api/v2/change_lang`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
}
//////////////////////////// makeAutoObservable

export default Store;
