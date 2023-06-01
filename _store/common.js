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
    ui = {
        gnbOpen: false,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
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
}
//////////////////////////// makeAutoObservable

export default Store;
