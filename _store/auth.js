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
    loginResult = {
        result: null,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    setCheckLogin(value) {
        this.loginResult = value;
    }
}
//////////////////////////// makeAutoObservable

export default Store;
