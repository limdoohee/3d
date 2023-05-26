//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module
import CommonStore from "./common";
import DropStore from "./drop";

configure({
    enforceActions: "never",
});

//////////////////////////// Store
class Store {
    //////////////////////////////// Store Call
    common = new CommonStore(this);
    drop = new DropStore(this);
    //////////////////////////////// Store Call

    constructor() {
        makeAutoObservable(this);
    }
}
//////////////////////////// Store

export default Store;
