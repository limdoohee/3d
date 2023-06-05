//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
//------------------------------------------------------------------------------- Module

configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    buildId = null;

    ui = {
        gnbOpen: false,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    uiChange(key, value) {
        this.ui[key] = value;
        console.log(key, value);
    }

    getBuildId() {
        this.buildId = JSON.parse(document.querySelector("#__NEXT_DATA__").textContent).buildId;
    }
}
//////////////////////////// makeAutoObservable

export default Store;
