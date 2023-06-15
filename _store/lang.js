//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
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
    i18n = i18n;

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    changeLanguage(lng) {
        this.i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
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
}
//////////////////////////// makeAutoObservable

export default Store;
