//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module
import CommonStore from "./common";

configure({
    enforceActions: "never",
});

//////////////////////////// Store
class Store {
    //////////////////////////////// Store Call
    common = new CommonStore(this);
    //////////////////////////////// Store Call

    constructor() {
        makeAutoObservable(this);
    }
}
//////////////////////////// Store

export default Store;
